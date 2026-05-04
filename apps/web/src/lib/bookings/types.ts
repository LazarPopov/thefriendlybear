export type BookingRole = "owner" | "admin" | "manager" | "staff" | "viewer";

export type NextReservationWarningMode = "from_start_time" | "from_end_time";

export type SyncState = "pending" | "syncing" | "synced" | "failed" | "conflict";

export type MutationOperation = "create" | "update" | "delete" | "connect_tables" | "disconnect_tables";

export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  is_active?: boolean;
};

export type StaffProfile = {
  id: string;
  auth_user_id: string;
  display_name: string;
  role: BookingRole;
  is_active: boolean;
};

export type RestaurantMembership = {
  id: string;
  restaurant_id: string;
  staff_profile_id: string;
  role: BookingRole;
  is_active: boolean;
};

export type RestaurantTable = {
  id: string;
  restaurant_id: string;
  table_number: string;
  display_label: string | null;
  area: string | null;
  capacity_min: number | null;
  capacity_max: number | null;
  sort_order: number;
  is_active: boolean;
  notes: string | null;
};

export type BookingSettings = {
  id: string;
  restaurant_id: string;
  opening_start_time: string;
  last_bookable_start_time: string;
  visible_end_time: string;
  default_duration_minutes: number;
  slot_step_minutes: number;
  next_reservation_warning_mode: NextReservationWarningMode;
  prepare_popup_minutes_before: number;
  auto_group_connected_tables: boolean;
  allow_connected_table_reservations: boolean;
};

export type Reservation = {
  id: string;
  restaurant_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  party_size: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  customer_language?: string | null;
  note: string | null;
  source: string;
  external_source_id?: string | null;
  external_reservation_id?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  version: number;
  last_mutation_id?: string | null;
  sync_origin_device_id?: string | null;
  deleted_at?: string | null;
  deleted_by?: string | null;
  created_at?: string;
  updated_at?: string;
  tableIds: string[];
  sync_state?: "synced" | "pending_create" | "pending_update" | "pending_delete" | "sync_conflict" | "sync_failed";
};

export type ReservationAdminAudit = {
  reservation_id: string;
  restaurant_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  party_size: number;
  customer_name: string;
  customer_phone: string;
  note: string | null;
  table_labels: string[];
  created_by_staff_profile_id: string | null;
  created_by_display_name: string | null;
  created_by_role: BookingRole | null;
  created_by_auth_email: string | null;
  created_at: string | null;
  updated_by_staff_profile_id: string | null;
  updated_by_display_name: string | null;
  updated_by_role: BookingRole | null;
  updated_by_auth_email: string | null;
  updated_at: string | null;
  last_mutation_id: string | null;
  sync_origin_device_id: string | null;
};

export type PendingMutation = {
  mutation_id: string;
  restaurant_id: string;
  device_id: string;
  staff_profile_id: string | null;
  operation: MutationOperation;
  entity_type: "reservation";
  entity_id: string;
  base_version: number | null;
  payload: Record<string, unknown>;
  created_at: string;
  sync_attempts: number;
  last_sync_attempt_at: string | null;
  sync_state: SyncState;
};

export type SyncConflict = {
  id: string;
  restaurant_id: string;
  reservation_id: string | null;
  mutation_id: string | null;
  local_payload: Record<string, unknown>;
  server_payload: Record<string, unknown> | null;
  base_version: number | null;
  server_version: number | null;
  created_by: string | null;
  device_id: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  resolution: "keep_server" | "keep_local" | "manual_merge" | "discard_local" | null;
  created_at: string;
  updated_at: string;
};

export type BookingSession = {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user: {
    id: string;
    email?: string;
  };
};

export type BookingContext = {
  restaurant: Restaurant;
  staffProfile: StaffProfile;
  membership: RestaurantMembership;
};
