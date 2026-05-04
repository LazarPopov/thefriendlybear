import type { BookingRole } from "@/lib/bookings/types";
import type { FrontendSeasonalMenu } from "@/lib/cms/menu-adapter";
import type { SiteLocale } from "@/lib/site";

export type SeasonalMenuStatus = "draft" | "published" | "archived";

export type SeasonalMenuPayload = Record<SiteLocale, FrontendSeasonalMenu>;

export type SeasonalMenuRecord = {
  id: string;
  status: SeasonalMenuStatus;
  payload: SeasonalMenuPayload;
  valid_from: string | null;
  valid_to: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type StaffContentPermission = {
  id?: string;
  staff_profile_id: string;
  can_edit_menu: boolean;
  can_edit_reviews: boolean;
  can_manage_content_permissions: boolean;
  is_active: boolean;
};

export type ContentAdminPermissions = {
  canEditMenu: boolean;
  canEditReviews: boolean;
  canManageContentPermissions: boolean;
  isOwner: boolean;
};

export type ContentAdminContext = {
  user: {
    id: string;
    email?: string;
  };
  staffProfile: {
    id: string;
    display_name: string;
    role: BookingRole;
  };
  membership: {
    id: string;
    restaurant_id: string;
    role: BookingRole;
  };
  restaurant: {
    id: string;
    name: string;
    slug: string;
  };
  permissions: ContentAdminPermissions;
};

export type SiteReviewRecord = {
  id: string;
  author_name: string;
  rating: number;
  language: SiteLocale;
  review_text: string;
  source: string;
  review_date: string | null;
  relative_date_label: string | null;
  source_url: string | null;
  keyword_tags: string[];
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type StaffAccessRecord = {
  staffProfileId: string;
  displayName: string;
  profileRole: BookingRole;
  membershipRole: BookingRole;
  isActive: boolean;
  permissions: StaffContentPermission;
  effective: ContentAdminPermissions;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOptionalText(value: unknown) {
  const text = cleanText(value);
  return text || undefined;
}

function cleanDescription(value: unknown) {
  if (Array.isArray(value)) {
    const lines = value.map(cleanText).filter(Boolean);
    return lines.length ? lines : undefined;
  }

  const text = cleanText(value);
  if (!text) {
    return undefined;
  }

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length ? lines : undefined;
}

function normalizeMenu(localeValue: unknown, fallback: FrontendSeasonalMenu): FrontendSeasonalMenu {
  if (!isRecord(localeValue)) {
    return fallback;
  }

  const sections = Array.isArray(localeValue.sections)
    ? localeValue.sections.flatMap((sectionValue) => {
        if (!isRecord(sectionValue)) {
          return [];
        }

        const title = cleanText(sectionValue.title);
        const items = Array.isArray(sectionValue.items)
          ? sectionValue.items.flatMap((itemValue) => {
              if (!isRecord(itemValue)) {
                return [];
              }

              const name = cleanText(itemValue.name);

              if (!name) {
                return [];
              }

              return [
                {
                  name,
                  description: cleanDescription(itemValue.description),
                  allergens: cleanOptionalText(itemValue.allergens),
                  serving: cleanOptionalText(itemValue.serving),
                  priceEuro: cleanOptionalText(itemValue.priceEuro),
                  priceBgn: cleanOptionalText(itemValue.priceBgn),
                  isVegetarian: itemValue.isVegetarian === true
                }
              ];
            })
          : [];

        if (!title || items.length === 0) {
          return [];
        }

        return [{ title, items }];
      })
    : [];

  return {
    eyebrow: cleanText(localeValue.eyebrow) || fallback.eyebrow,
    title: cleanText(localeValue.title) || fallback.title,
    intro: cleanText(localeValue.intro) || fallback.intro,
    sections: sections.length ? sections : fallback.sections
  };
}

export function normalizeSeasonalMenuPayload(value: unknown, fallback: SeasonalMenuPayload): SeasonalMenuPayload {
  const source = isRecord(value) ? value : {};

  return {
    bg: normalizeMenu(source.bg, fallback.bg),
    en: normalizeMenu(source.en, fallback.en)
  };
}

export function defaultContentPermission(staffProfileId: string): StaffContentPermission {
  return {
    staff_profile_id: staffProfileId,
    can_edit_menu: false,
    can_edit_reviews: false,
    can_manage_content_permissions: false,
    is_active: true
  };
}
