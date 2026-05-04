import type { BookingSettings, PendingMutation, Reservation, Restaurant, RestaurantTable, StaffProfile } from "./types";

const DB_NAME = "friendlybear_bookings";
const DB_VERSION = 1;

const STORE_NAMES = [
  "restaurants",
  "staff_profile",
  "restaurant_tables",
  "booking_settings",
  "reservations_by_date",
  "reservation_tables_by_date",
  "pending_mutations",
  "dismissed_prepare_popups",
  "local_ui_state"
] as const;

type StoreName = (typeof STORE_NAMES)[number];

type LocalUiState = {
  key: string;
  value: unknown;
};

let dbPromise: Promise<IDBDatabase> | null = null;

function ensureIndexedDb() {
  if (typeof indexedDB === "undefined") {
    throw new Error("IndexedDB is not available in this browser.");
  }
}

function createStore(db: IDBDatabase, name: StoreName, keyPath: string) {
  if (!db.objectStoreNames.contains(name)) {
    return db.createObjectStore(name, { keyPath });
  }

  return null;
}

export function openBookingDb() {
  if (dbPromise) {
    return dbPromise;
  }

  ensureIndexedDb();

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      createStore(db, "restaurants", "id");
      createStore(db, "staff_profile", "id");
      const tables = createStore(db, "restaurant_tables", "id");
      const settings = createStore(db, "booking_settings", "id");
      const reservations = createStore(db, "reservations_by_date", "id");
      createStore(db, "reservation_tables_by_date", "id");
      const mutations = createStore(db, "pending_mutations", "mutation_id");
      createStore(db, "dismissed_prepare_popups", "id");
      createStore(db, "local_ui_state", "key");

      if (tables && !tables.indexNames.contains("restaurant_id")) {
        tables.createIndex("restaurant_id", "restaurant_id");
      }

      if (settings && !settings.indexNames.contains("restaurant_id")) {
        settings.createIndex("restaurant_id", "restaurant_id", { unique: true });
      }

      if (reservations && !reservations.indexNames.contains("restaurantDate")) {
        reservations.createIndex("restaurantDate", ["restaurant_id", "reservation_date"]);
      }

      if (mutations && !mutations.indexNames.contains("sync_state")) {
        mutations.createIndex("sync_state", "sync_state");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

async function withStore<T>(storeName: StoreName, mode: IDBTransactionMode, callback: (store: IDBObjectStore) => IDBRequest<T> | T) {
  const db = await openBookingDb();

  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const result = callback(store);

    if (result instanceof IDBRequest) {
      result.onsuccess = () => resolve(result.result);
      result.onerror = () => reject(result.error);
    } else {
      transaction.oncomplete = () => resolve(result);
    }

    transaction.onerror = () => reject(transaction.error);
  });
}

async function getAll<T>(storeName: StoreName) {
  return withStore<T[]>(storeName, "readonly", (store) => store.getAll());
}

async function put<T>(storeName: StoreName, value: T) {
  await withStore<IDBValidKey>(storeName, "readwrite", (store) => store.put(value));
}

async function putMany<T>(storeName: StoreName, values: T[]) {
  const db = await openBookingDb();

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

    values.forEach((value) => store.put(value));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function saveRestaurant(restaurant: Restaurant) {
  await put("restaurants", restaurant);
}

export async function loadRestaurants() {
  return getAll<Restaurant>("restaurants");
}

export async function saveStaffProfile(profile: StaffProfile) {
  await put("staff_profile", profile);
}

export async function loadStaffProfiles() {
  return getAll<StaffProfile>("staff_profile");
}

export async function saveTables(tables: RestaurantTable[]) {
  await putMany("restaurant_tables", tables);
}

export async function loadTables(restaurantId: string) {
  const tables = await getAll<RestaurantTable>("restaurant_tables");
  return tables.filter((table) => table.restaurant_id === restaurantId).sort((a, b) => a.sort_order - b.sort_order);
}

export async function saveSettings(settings: BookingSettings) {
  await put("booking_settings", settings);
}

export async function loadSettings(restaurantId: string) {
  const allSettings = await getAll<BookingSettings>("booking_settings");
  return allSettings.find((settings) => settings.restaurant_id === restaurantId) ?? null;
}

export async function saveReservations(reservations: Reservation[]) {
  await putMany("reservations_by_date", reservations);
}

export async function saveReservation(reservation: Reservation) {
  await put("reservations_by_date", reservation);
}

export async function loadReservationsForDate(restaurantId: string, reservationDate: string) {
  const reservations = await getAll<Reservation>("reservations_by_date");
  return reservations
    .filter((reservation) => reservation.restaurant_id === restaurantId && reservation.reservation_date === reservationDate)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));
}

export async function savePendingMutation(mutation: PendingMutation) {
  await put("pending_mutations", mutation);
}

export async function savePendingMutations(mutations: PendingMutation[]) {
  await putMany("pending_mutations", mutations);
}

export async function loadPendingMutations() {
  const mutations = await getAll<PendingMutation>("pending_mutations");
  return mutations.sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export async function loadActivePendingMutations() {
  const mutations = await loadPendingMutations();
  return mutations.filter((mutation) => mutation.sync_state === "pending" || mutation.sync_state === "failed");
}

export async function rememberDismissedPopup(id: string) {
  await put("dismissed_prepare_popups", { id, dismissed_at: new Date().toISOString() });
}

export async function isPopupDismissed(id: string) {
  const dismissed = await getAll<{ id: string }>("dismissed_prepare_popups");
  return dismissed.some((item) => item.id === id);
}

export async function saveLocalUiState(key: string, value: unknown) {
  await put("local_ui_state", { key, value });
}

export async function loadLocalUiState<T>(key: string) {
  const items = await getAll<LocalUiState>("local_ui_state");
  return (items.find((item) => item.key === key)?.value ?? null) as T | null;
}
