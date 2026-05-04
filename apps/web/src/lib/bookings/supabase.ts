import { DEFAULT_RESTAURANT } from "./defaults";
import type {
  BookingContext,
  BookingSession,
  BookingSettings,
  PendingMutation,
  Reservation,
  ReservationAdminAudit,
  Restaurant,
  RestaurantMembership,
  RestaurantTable,
  StaffProfile,
  SyncConflict
} from "./types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
const SUPABASE_BROWSER_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_API_KEY = SUPABASE_BROWSER_KEY.startsWith("sb_secret_") ? "" : SUPABASE_BROWSER_KEY;
const SESSION_KEY = "friendlybear_booking_supabase_session";

type SupabaseTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user: {
    id: string;
    email?: string;
  };
};

type ReservationRow = Omit<Reservation, "tableIds"> & {
  reservation_tables?: Array<{ table_id: string }>;
};

type MembershipRow = RestaurantMembership & {
  restaurants: Restaurant | null;
};

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_API_KEY);
}

export function isDemoSession(session: BookingSession | null) {
  return session?.access_token === "demo-local-session";
}

function persistSession(token: SupabaseTokenResponse) {
  const session: BookingSession = {
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    expires_at: token.expires_in ? Date.now() + token.expires_in * 1000 : undefined,
    user: {
      id: token.user.id,
      email: token.user.email
    }
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function createDemoSession(email: string) {
  const session: BookingSession = {
    access_token: "demo-local-session",
    user: {
      id: "local-demo-user",
      email
    }
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getStoredSession() {
  if (typeof localStorage === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as BookingSession;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function clearStoredSession() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

function endpoint(path: string) {
  return `${SUPABASE_URL}${path}`;
}

async function parseResponse<T>(response: Response) {
  if (response.status === 204) {
    return null as T;
  }

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || `Supabase request failed with ${response.status}`);
  }

  return (text ? JSON.parse(text) : null) as T;
}

async function refreshSession(session: BookingSession) {
  if (!session.refresh_token || !isSupabaseConfigured() || isDemoSession(session)) {
    return session;
  }

  const response = await fetch(endpoint("/auth/v1/token?grant_type=refresh_token"), {
    method: "POST",
    headers: {
      apikey: SUPABASE_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ refresh_token: session.refresh_token })
  });
  const token = await parseResponse<SupabaseTokenResponse>(response);
  return persistSession(token);
}

export async function getActiveSession() {
  const session = getStoredSession();

  if (!session) {
    return null;
  }

  if (session.expires_at && session.expires_at - Date.now() < 60000) {
    return refreshSession(session);
  }

  return session;
}

export async function signInWithPassword(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    return createDemoSession(email);
  }

  const response = await fetch(endpoint("/auth/v1/token?grant_type=password"), {
    method: "POST",
    headers: {
      apikey: SUPABASE_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });
  const token = await parseResponse<SupabaseTokenResponse>(response);
  return persistSession(token);
}

async function supabaseFetch<T>(path: string, session: BookingSession, options: RequestInit = {}) {
  if (!isSupabaseConfigured() || isDemoSession(session)) {
    throw new Error("Supabase is not configured for remote requests.");
  }

  const headers = new Headers(options.headers);
  headers.set("apikey", SUPABASE_API_KEY);
  headers.set("Authorization", `Bearer ${session.access_token}`);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(endpoint(path), {
    ...options,
    headers
  });

  return parseResponse<T>(response);
}

function mapReservation(row: ReservationRow): Reservation {
  const { reservation_tables: reservationTables, ...reservation } = row;

  return {
    ...reservation,
    start_time: reservation.start_time.slice(0, 5),
    end_time: reservation.end_time.slice(0, 5),
    tableIds: reservationTables?.map((table) => table.table_id) ?? []
  };
}

function normalizeSettings(settings: BookingSettings): BookingSettings {
  return {
    ...settings,
    opening_start_time: settings.opening_start_time.slice(0, 5),
    last_bookable_start_time: settings.last_bookable_start_time.slice(0, 5),
    visible_end_time: settings.visible_end_time.slice(0, 5)
  };
}

export async function fetchBookingContext(session: BookingSession): Promise<BookingContext | null> {
  if (isDemoSession(session) || !isSupabaseConfigured()) {
    return null;
  }

  const userId = encodeURIComponent(session.user.id);
  const profiles = await supabaseFetch<StaffProfile[]>(
    `/rest/v1/staff_profiles?auth_user_id=eq.${userId}&is_active=eq.true&select=*`,
    session
  );
  const staffProfile = profiles[0];

  if (!staffProfile) {
    throw new Error("No active staff profile was found for this user.");
  }

  const memberships = await supabaseFetch<MembershipRow[]>(
    `/rest/v1/restaurant_memberships?staff_profile_id=eq.${encodeURIComponent(
      staffProfile.id
    )}&is_active=eq.true&select=*,restaurants(id,name,slug,timezone,is_active)`,
    session
  );
  const membership = memberships.find((item) => item.restaurants?.is_active !== false);

  if (!membership || !membership.restaurants) {
    throw new Error("No active restaurant membership was found for this user.");
  }

  const { restaurants, ...membershipRecord } = membership;

  return {
    restaurant: restaurants,
    staffProfile,
    membership: membershipRecord
  };
}

export async function fetchTables(session: BookingSession, restaurantId: string) {
  const tables = await supabaseFetch<RestaurantTable[]>(
    `/rest/v1/restaurant_tables?restaurant_id=eq.${encodeURIComponent(restaurantId)}&select=*&order=sort_order.asc`,
    session
  );
  return tables;
}

export async function fetchBookingSettings(session: BookingSession, restaurantId: string) {
  const settings = await supabaseFetch<BookingSettings[]>(
    `/rest/v1/booking_settings?restaurant_id=eq.${encodeURIComponent(restaurantId)}&select=*&limit=1`,
    session
  );
  return settings[0] ? normalizeSettings(settings[0]) : null;
}

export async function fetchReservations(session: BookingSession, restaurantId: string, reservationDate: string) {
  const reservations = await supabaseFetch<ReservationRow[]>(
    `/rest/v1/reservations?restaurant_id=eq.${encodeURIComponent(
      restaurantId
    )}&reservation_date=eq.${reservationDate}&deleted_at=is.null&select=*,reservation_tables(table_id)&order=start_time.asc`,
    session
  );

  return reservations.map(mapReservation);
}

export async function fetchReservationAdminAudit(session: BookingSession, restaurantId: string, reservationDate: string) {
  const rows = await rpc<ReservationAdminAudit[]>(session, "get_reservation_admin_audit", {
    p_restaurant_id: restaurantId,
    p_reservation_date: reservationDate
  });

  return rows.map((row) => ({
    ...row,
    start_time: row.start_time.slice(0, 5),
    end_time: row.end_time.slice(0, 5),
    table_labels: row.table_labels ?? []
  }));
}

export async function fetchPhoneSuggestion(session: BookingSession, restaurantId: string) {
  const calls = await supabaseFetch<Array<{ phone_number: string; status: string }>>(
    `/rest/v1/phone_call_events?restaurant_id=eq.${encodeURIComponent(
      restaurantId
    )}&select=phone_number,status&order=status.asc,call_started_at.desc&limit=1`,
    session
  );
  return calls[0]?.phone_number ?? null;
}

async function rpc<T>(session: BookingSession, name: string, body: Record<string, unknown>) {
  return supabaseFetch<T>(`/rest/v1/rpc/${name}`, session, {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export async function createRemoteReservation(session: BookingSession, reservation: Reservation, mutationId: string, deviceId: string) {
  return rpc<{ status: "synced" | "conflict"; reservation?: ReservationRow }>(session, "create_reservation", {
    p_restaurant_id: reservation.restaurant_id,
    p_reservation_date: reservation.reservation_date,
    p_table_ids: reservation.tableIds,
    p_start_time: reservation.start_time,
    p_duration_minutes: reservation.duration_minutes,
    p_party_size: reservation.party_size,
    p_customer_name: reservation.customer_name,
    p_customer_phone: reservation.customer_phone,
    p_note: reservation.note,
    p_mutation_id: mutationId,
    p_device_id: deviceId,
    p_source: reservation.source
  });
}

export async function updateRemoteReservation(
  session: BookingSession,
  reservationId: string,
  baseVersion: number,
  payload: Record<string, unknown>,
  mutationId: string,
  deviceId: string
) {
  return rpc<{ status: "synced" | "conflict"; reservation?: ReservationRow; conflict_id?: string }>(session, "update_reservation", {
    p_reservation_id: reservationId,
    p_base_version: baseVersion,
    p_payload: payload,
    p_mutation_id: mutationId,
    p_device_id: deviceId
  });
}

export async function deleteRemoteReservation(
  session: BookingSession,
  reservationId: string,
  baseVersion: number,
  mutationId: string,
  deviceId: string
) {
  return rpc<{ status: "synced" | "conflict"; reservation?: ReservationRow; conflict_id?: string }>(session, "soft_delete_reservation", {
    p_reservation_id: reservationId,
    p_base_version: baseVersion,
    p_mutation_id: mutationId,
    p_device_id: deviceId
  });
}

export async function applyRemoteMutation(session: BookingSession, mutation: PendingMutation) {
  return rpc<{ status: "synced" | "conflict"; reservation?: ReservationRow; conflict_id?: string }>(
    session,
    "apply_reservation_mutation",
    {
      p_mutation: mutation
    }
  );
}

export function mapRemoteReservation(row: ReservationRow) {
  return mapReservation(row);
}

export async function updateRemoteSettings(session: BookingSession, settings: BookingSettings) {
  const body = {
    opening_start_time: settings.opening_start_time,
    last_bookable_start_time: settings.last_bookable_start_time,
    visible_end_time: settings.visible_end_time,
    default_duration_minutes: settings.default_duration_minutes,
    slot_step_minutes: settings.slot_step_minutes,
    next_reservation_warning_mode: settings.next_reservation_warning_mode,
    prepare_popup_minutes_before: settings.prepare_popup_minutes_before,
    auto_group_connected_tables: settings.auto_group_connected_tables,
    allow_connected_table_reservations: settings.allow_connected_table_reservations
  };

  const updated = await supabaseFetch<BookingSettings[]>(
    `/rest/v1/booking_settings?id=eq.${encodeURIComponent(settings.id)}&select=*`,
    session,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(body)
    }
  );

  return updated[0] ? normalizeSettings(updated[0]) : settings;
}

export async function upsertRemoteTables(session: BookingSession, tables: RestaurantTable[]) {
  return supabaseFetch<RestaurantTable[]>("/rest/v1/restaurant_tables?on_conflict=id&select=*", session, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(tables)
  });
}

export async function fetchSyncConflicts(session: BookingSession, restaurantId: string) {
  return supabaseFetch<SyncConflict[]>(
    `/rest/v1/sync_conflicts?restaurant_id=eq.${encodeURIComponent(
      restaurantId
    )}&resolved_at=is.null&select=*&order=created_at.desc`,
    session
  );
}

export async function resolveRemoteConflict(
  session: BookingSession,
  conflictId: string,
  resolution: "keep_server" | "keep_local" | "manual_merge" | "discard_local",
  manualPayload: Record<string, unknown> | null = null
) {
  return rpc<{ status: "resolved" }>(session, "resolve_sync_conflict", {
    p_conflict_id: conflictId,
    p_resolution: resolution,
    p_manual_payload: manualPayload
  });
}

export async function fetchExternalSources(session: BookingSession, restaurantId: string) {
  return supabaseFetch<Array<{ id: string; provider_name: string; provider_type: string; is_enabled: boolean; last_sync_at: string | null }>>(
    `/rest/v1/external_reservation_sources?restaurant_id=eq.${encodeURIComponent(
      restaurantId
    )}&select=id,provider_name,provider_type,is_enabled,last_sync_at&order=provider_name.asc`,
    session
  );
}

export function subscribeToBookingChanges(session: BookingSession, restaurantId: string, onChange: () => void) {
  if (!isSupabaseConfigured() || isDemoSession(session) || typeof WebSocket === "undefined") {
    return () => undefined;
  }

  const socketUrl = `${SUPABASE_URL.replace(/^http/, "ws")}/realtime/v1/websocket?apikey=${encodeURIComponent(
    SUPABASE_API_KEY
  )}&vsn=1.0.0`;
  const socket = new WebSocket(socketUrl);
  const tables = ["reservations", "reservation_tables", "restaurant_tables", "booking_settings", "sync_conflicts"];
  let ref = 1;

  function send(topic: string, event: string, payload: Record<string, unknown>) {
    socket.send(
      JSON.stringify({
        topic,
        event,
        payload,
        ref: String(ref++)
      })
    );
  }

  socket.onopen = () => {
    for (const table of tables) {
      send(`realtime:public:${table}`, "phx_join", {
        config: {
          postgres_changes: [
            {
              event: "*",
              schema: "public",
              table,
              filter: `restaurant_id=eq.${restaurantId}`
            }
          ]
        },
        access_token: session.access_token
      });
    }
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data) as { event?: string };

      if (message.event === "postgres_changes") {
        onChange();
      }
    } catch {
      onChange();
    }
  };

  const heartbeat = window.setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      send("phoenix", "heartbeat", {});
    }
  }, 30000);

  return () => {
    window.clearInterval(heartbeat);
    socket.close();
  };
}

export function fallbackContext(): BookingContext {
  return {
    restaurant: DEFAULT_RESTAURANT,
    staffProfile: {
      id: "local-staff-profile",
      auth_user_id: "local-demo-user",
      display_name: "Demo staff",
      role: "owner",
      is_active: true
    },
    membership: {
      id: "local-membership",
      restaurant_id: DEFAULT_RESTAURANT.id,
      staff_profile_id: "local-staff-profile",
      role: "owner",
      is_active: true
    }
  };
}
