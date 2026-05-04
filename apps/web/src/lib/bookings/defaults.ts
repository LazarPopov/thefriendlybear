import type { BookingSettings, Restaurant, RestaurantTable } from "./types";

export const DEFAULT_RESTAURANT_ID = "local-friendly-bear-sofia";

export const DEFAULT_RESTAURANT: Restaurant = {
  id: DEFAULT_RESTAURANT_ID,
  name: "The Friendly Bear Sofia",
  slug: "the-friendly-bear-sofia",
  timezone: "Europe/Sofia",
  is_active: true
};

export const DEFAULT_TABLE_NUMBERS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "31",
  "32",
  "33",
  "34",
  "40",
  "41",
  "50",
  "51",
  "52",
  "54"
];

export const DEFAULT_BOOKING_SETTINGS: BookingSettings = {
  id: "local-booking-settings",
  restaurant_id: DEFAULT_RESTAURANT_ID,
  opening_start_time: "12:00",
  last_bookable_start_time: "22:00",
  visible_end_time: "00:00",
  default_duration_minutes: 210,
  slot_step_minutes: 15,
  next_reservation_warning_mode: "from_start_time",
  prepare_popup_minutes_before: 15,
  auto_group_connected_tables: true,
  allow_connected_table_reservations: true
};

export function makeDefaultTables(restaurantId = DEFAULT_RESTAURANT_ID): RestaurantTable[] {
  return DEFAULT_TABLE_NUMBERS.map((tableNumber, index) => ({
    id: `local-table-${tableNumber}`,
    restaurant_id: restaurantId,
    table_number: tableNumber,
    display_label: tableNumber,
    area: null,
    capacity_min: null,
    capacity_max: null,
    sort_order: index + 1,
    is_active: true,
    notes: null
  }));
}

export function createId(prefix = "booking") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getDeviceId() {
  if (typeof localStorage === "undefined") {
    return "server-device";
  }

  const key = "friendlybear_booking_device_id";
  const existing = localStorage.getItem(key);

  if (existing) {
    return existing;
  }

  const next = createId("device");
  localStorage.setItem(key, next);
  return next;
}

export function toMinutes(time: string) {
  const [hours = "0", minutes = "0"] = time.slice(0, 5).split(":");
  return Number(hours) * 60 + Number(minutes);
}

export function minutesToTime(totalMinutes: number) {
  const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function addMinutes(time: string, minutes: number) {
  return minutesToTime(toMinutes(time) + minutes);
}

export function roundMinutesToStep(minutes: number, step: number) {
  return Math.round(minutes / step) * step;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function todayDateString() {
  const date = new Date();
  return toDateInputValue(date);
}

export function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(dateValue: string) {
  const [year, month, day] = dateValue.split("-");
  return `${day}/${month}/${year}`;
}

export function addDays(dateValue: string, days: number) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return toDateInputValue(date);
}

export function getInitialSelectedDate() {
  if (typeof localStorage === "undefined") {
    return todayDateString();
  }

  const stored = localStorage.getItem("friendlybear_booking_last_selected_date");
  const today = todayDateString();

  if (!stored) {
    return today;
  }

  const daysOld = Math.floor((Date.parse(today) - Date.parse(stored)) / 86400000);
  return daysOld > 2 ? today : stored;
}

export function rememberSelectedDate(dateValue: string) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("friendlybear_booking_last_selected_date", dateValue);
  }
}

export function formatReservationText(reservation: {
  start_time: string;
  party_size: number;
  customer_name: string;
  customer_phone: string;
  note?: string | null;
}) {
  const base = `${reservation.start_time.slice(0, 5)} | ${reservation.party_size} души | ${reservation.customer_name} | ${reservation.customer_phone}`;
  return reservation.note ? `${base} | ${reservation.note}` : base;
}
