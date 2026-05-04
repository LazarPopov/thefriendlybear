import { NextResponse } from "next/server";
import type { BookingRole } from "@/lib/bookings/types";
import {
  defaultContentPermission,
  normalizeSeasonalMenuPayload,
  type ContentAdminContext,
  type SeasonalMenuPayload,
  type SeasonalMenuRecord,
  type SiteReviewRecord,
  type StaffAccessRecord,
  type StaffContentPermission
} from "@/lib/content-types";
import { springMenuContent } from "@/lib/spring-menu-content";

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

type SupabaseUser = {
  id: string;
  email?: string;
};

type StaffProfileRow = {
  id: string;
  auth_user_id: string;
  display_name: string;
  role: BookingRole;
  is_active: boolean;
};

type MembershipRow = {
  id: string;
  restaurant_id: string;
  staff_profile_id: string;
  role: BookingRole;
  is_active: boolean;
  restaurants: {
    id: string;
    name: string;
    slug: string;
    timezone?: string;
    is_active?: boolean;
  } | null;
};

type StaffMembershipRow = {
  id: string;
  role: BookingRole;
  is_active: boolean;
  staff_profiles: StaffProfileRow | null;
};

export class AdminContentError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function isConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function serviceHeaders(extra?: HeadersInit) {
  const headers = new Headers(extra);
  headers.set("apikey", SUPABASE_SERVICE_ROLE_KEY);
  headers.set("Authorization", `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
}

async function parseResponse<T>(response: Response) {
  if (response.status === 204) {
    return null as T;
  }

  const text = await response.text();

  if (!response.ok) {
    throw new AdminContentError(response.status, text || `Supabase request failed with ${response.status}`);
  }

  return (text ? JSON.parse(text) : null) as T;
}

export async function serviceFetch<T>(path: string, options: RequestInit = {}) {
  if (!isConfigured()) {
    throw new AdminContentError(503, "Supabase service role is not configured for content admin.");
  }

  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: serviceHeaders(options.headers)
  });

  return parseResponse<T>(response);
}

async function fetchSupabaseUser(token: string) {
  if (!isConfigured()) {
    throw new AdminContentError(503, "Supabase service role is not configured for content admin.");
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  return parseResponse<SupabaseUser>(response);
}

function getBearerToken(request: Request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

async function fetchPermission(staffProfileId: string) {
  const rows = await serviceFetch<StaffContentPermission[]>(
    `/rest/v1/staff_content_permissions?staff_profile_id=eq.${encodeURIComponent(staffProfileId)}&is_active=eq.true&select=*&limit=1`
  );

  return rows[0] ?? defaultContentPermission(staffProfileId);
}

function resolvePermissions(profileRole: BookingRole, membershipRole: BookingRole, permission: StaffContentPermission) {
  const isOwner = profileRole === "owner" || membershipRole === "owner";

  return {
    isOwner,
    canEditMenu: isOwner || permission.can_edit_menu,
    canEditReviews: isOwner || permission.can_edit_reviews,
    canManageContentPermissions: isOwner || permission.can_manage_content_permissions
  };
}

export async function getContentAdminContext(request: Request): Promise<ContentAdminContext> {
  const token = getBearerToken(request);

  if (!token || token === "demo-local-session") {
    throw new AdminContentError(401, "Sign in with a Supabase staff account to continue.");
  }

  const user = await fetchSupabaseUser(token);
  const profiles = await serviceFetch<StaffProfileRow[]>(
    `/rest/v1/staff_profiles?auth_user_id=eq.${encodeURIComponent(user.id)}&is_active=eq.true&select=*&limit=1`
  );
  const staffProfile = profiles[0];

  if (!staffProfile) {
    throw new AdminContentError(403, "No active staff profile was found for this account.");
  }

  const memberships = await serviceFetch<MembershipRow[]>(
    `/rest/v1/restaurant_memberships?staff_profile_id=eq.${encodeURIComponent(
      staffProfile.id
    )}&is_active=eq.true&select=*,restaurants(id,name,slug,timezone,is_active)`
  );
  const membership = memberships.find((item) => item.restaurants?.is_active !== false);

  if (!membership?.restaurants) {
    throw new AdminContentError(403, "No active restaurant membership was found for this account.");
  }

  const permission = await fetchPermission(staffProfile.id);

  return {
    user,
    staffProfile: {
      id: staffProfile.id,
      display_name: staffProfile.display_name,
      role: staffProfile.role
    },
    membership: {
      id: membership.id,
      restaurant_id: membership.restaurant_id,
      role: membership.role
    },
    restaurant: {
      id: membership.restaurants.id,
      name: membership.restaurants.name,
      slug: membership.restaurants.slug
    },
    permissions: resolvePermissions(staffProfile.role, membership.role, permission)
  };
}

export function requireMenuEditor(context: ContentAdminContext) {
  if (!context.permissions.canEditMenu) {
    throw new AdminContentError(403, "This account does not have menu editing access.");
  }
}

export function requireReviewEditor(context: ContentAdminContext) {
  if (!context.permissions.canEditReviews) {
    throw new AdminContentError(403, "This account does not have review editing access.");
  }
}

export function requireContentAccessManager(context: ContentAdminContext) {
  if (!context.permissions.canManageContentPermissions) {
    throw new AdminContentError(403, "This account cannot manage content access.");
  }
}

export function adminErrorResponse(error: unknown) {
  if (error instanceof AdminContentError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected admin error." }, { status: 500 });
}

export async function fetchLatestSeasonalMenu(status: "draft" | "published") {
  const rows = await serviceFetch<SeasonalMenuRecord[]>(
    `/rest/v1/seasonal_menus?status=eq.${status}&select=id,status,payload,valid_from,valid_to,published_at,created_at,updated_at&order=${
      status === "published" ? "published_at" : "updated_at"
    }.desc.nullslast&limit=1`
  );

  return rows[0] ?? null;
}

export async function saveSeasonalMenuDraft(context: ContentAdminContext, payload: SeasonalMenuPayload) {
  const normalizedPayload = normalizeSeasonalMenuPayload(payload, springMenuContent);
  const existing = await fetchLatestSeasonalMenu("draft");
  const body = JSON.stringify({
    payload: normalizedPayload,
    updated_by: context.staffProfile.id
  });

  if (existing) {
    const rows = await serviceFetch<SeasonalMenuRecord[]>(
      `/rest/v1/seasonal_menus?id=eq.${encodeURIComponent(existing.id)}&select=id,status,payload,valid_from,valid_to,published_at,created_at,updated_at`,
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body
      }
    );

    return rows[0];
  }

  const rows = await serviceFetch<SeasonalMenuRecord[]>(
    "/rest/v1/seasonal_menus?select=id,status,payload,valid_from,valid_to,published_at,created_at,updated_at",
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        status: "draft",
        payload: normalizedPayload,
        created_by: context.staffProfile.id,
        updated_by: context.staffProfile.id
      })
    }
  );

  return rows[0];
}

export async function publishSeasonalMenu(context: ContentAdminContext, payload: SeasonalMenuPayload) {
  const normalizedPayload = normalizeSeasonalMenuPayload(payload, springMenuContent);

  await serviceFetch<null>("/rest/v1/seasonal_menus?status=eq.published", {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      status: "archived",
      updated_by: context.staffProfile.id
    })
  });

  await serviceFetch<null>("/rest/v1/seasonal_menus?status=eq.draft", {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      status: "archived",
      updated_by: context.staffProfile.id
    })
  });

  const rows = await serviceFetch<SeasonalMenuRecord[]>(
    "/rest/v1/seasonal_menus?select=id,status,payload,valid_from,valid_to,published_at,created_at,updated_at",
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        status: "published",
        payload: normalizedPayload,
        published_at: new Date().toISOString(),
        created_by: context.staffProfile.id,
        updated_by: context.staffProfile.id,
        published_by: context.staffProfile.id
      })
    }
  );

  return rows[0];
}

export async function listReviewRows(includeInactive = false) {
  const activeFilter = includeInactive ? "" : "&is_active=eq.true";
  return serviceFetch<SiteReviewRecord[]>(
    `/rest/v1/site_reviews?select=*&order=language.asc,sort_order.asc,created_at.desc${activeFilter}`
  );
}

export async function listStaffAccessRows(context: ContentAdminContext): Promise<StaffAccessRecord[]> {
  const memberships = await serviceFetch<StaffMembershipRow[]>(
    `/rest/v1/restaurant_memberships?restaurant_id=eq.${encodeURIComponent(
      context.restaurant.id
    )}&is_active=eq.true&select=id,role,is_active,staff_profiles(id,auth_user_id,display_name,role,is_active)&order=created_at.asc`
  );
  const profiles = memberships.flatMap((membership) => (membership.staff_profiles ? [membership.staff_profiles] : []));
  const ids = profiles.map((profile) => profile.id);
  const permissionRows = ids.length
    ? await serviceFetch<StaffContentPermission[]>(
        `/rest/v1/staff_content_permissions?staff_profile_id=in.(${ids.map(encodeURIComponent).join(",")})&select=*`
      )
    : [];
  const permissionsByProfileId = new Map(permissionRows.map((permission) => [permission.staff_profile_id, permission]));

  return memberships.flatMap((membership) => {
    const profile = membership.staff_profiles;

    if (!profile) {
      return [];
    }

    const permissions = permissionsByProfileId.get(profile.id) ?? defaultContentPermission(profile.id);

    return [
      {
        staffProfileId: profile.id,
        displayName: profile.display_name,
        profileRole: profile.role,
        membershipRole: membership.role,
        isActive: profile.is_active && membership.is_active,
        permissions,
        effective: resolvePermissions(profile.role, membership.role, permissions)
      }
    ];
  });
}

export async function upsertStaffContentPermission(
  context: ContentAdminContext,
  staffProfileId: string,
  patch: Partial<Pick<StaffContentPermission, "can_edit_menu" | "can_edit_reviews" | "can_manage_content_permissions" | "is_active">>
) {
  const rows = await serviceFetch<StaffContentPermission[]>(
    "/rest/v1/staff_content_permissions?on_conflict=staff_profile_id&select=*",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify([
        {
          staff_profile_id: staffProfileId,
          can_edit_menu: patch.can_edit_menu ?? false,
          can_edit_reviews: patch.can_edit_reviews ?? false,
          can_manage_content_permissions: patch.can_manage_content_permissions ?? false,
          is_active: patch.is_active ?? true,
          updated_by: context.staffProfile.id,
          created_by: context.staffProfile.id
        }
      ])
    }
  );

  return rows[0];
}
