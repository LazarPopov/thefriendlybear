import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), "apps", "web", ".env.local"));

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const restaurantSlug = process.env.BOOKING_RESTAURANT_SLUG || "the-friendly-bear-sofia";
const baseDate = process.env.BOOKING_DUMMY_BASE_DATE || localDateString(new Date());
const deviceId = "dummy-reservation-seed";

const dummyReservations = [
  { dayOffset: -2, tableNumbers: ["32"], startTime: "12:45", partySize: 3, name: "Test Maria Stoyanova", phone: "0888000001", note: null },
  { dayOffset: -2, tableNumbers: ["33", "34"], startTime: "18:15", partySize: 11, name: "Test Petar Georgiev", phone: "0888000002", note: "Family birthday" },
  { dayOffset: -2, tableNumbers: ["52"], startTime: "20:30", partySize: 2, name: "Test Elena Dimitrova", phone: "0888000003", note: "Anniversary" },
  { dayOffset: -1, tableNumbers: ["1"], startTime: "12:30", partySize: 2, name: "Test Anna Petrova", phone: "0888000004", note: "Anniversary lunch" },
  { dayOffset: -1, tableNumbers: ["5"], startTime: "15:00", partySize: 4, name: "Test Ivan Ivanov", phone: "0888000005", note: null },
  { dayOffset: -1, tableNumbers: ["6", "7"], startTime: "18:00", partySize: 10, name: "Test Nikolay Marinov", phone: "0888000006", note: "Birthday, cake expected" },
  { dayOffset: -1, tableNumbers: ["31"], startTime: "20:15", partySize: 2, name: "Test Simona Koleva", phone: "0888000007", note: "Quiet corner if possible" },
  { dayOffset: 0, tableNumbers: ["2"], startTime: "12:15", partySize: 2, name: "Test Georgi Angelov", phone: "0888000008", note: null },
  { dayOffset: 0, tableNumbers: ["8"], startTime: "13:30", partySize: 6, name: "Test Kalina Borisova", phone: "0888000009", note: "Birthday" },
  { dayOffset: 0, tableNumbers: ["5", "6"], startTime: "17:30", partySize: 9, name: "Test Victor Hristov", phone: "0888000010", note: "Anniversary, bring dessert menu" },
  { dayOffset: 0, tableNumbers: ["14"], startTime: "19:00", partySize: 2, name: "Test Diana Popova", phone: "0888000011", note: null },
  { dayOffset: 0, tableNumbers: ["40"], startTime: "21:15", partySize: 4, name: "Test Stefan Iliev", phone: "0888000012", note: "Late dinner" },
  { dayOffset: 1, tableNumbers: ["3"], startTime: "12:00", partySize: 2, name: "Test Raya Todorova", phone: "0888000013", note: "Anniversary" },
  { dayOffset: 1, tableNumbers: ["9"], startTime: "14:45", partySize: 8, name: "Test Daniel Minev", phone: "0888000014", note: "Birthday, balloons" },
  { dayOffset: 1, tableNumbers: ["10", "11"], startTime: "18:30", partySize: 12, name: "Test Hristo Pavlov", phone: "0888000015", note: "Big birthday" },
  { dayOffset: 1, tableNumbers: ["50"], startTime: "20:00", partySize: 2, name: "Test Mira Kaneva", phone: "0888000016", note: null },
  { dayOffset: 2, tableNumbers: ["4"], startTime: "13:15", partySize: 5, name: "Test Boris Nikolov", phone: "0888000017", note: null },
  { dayOffset: 2, tableNumbers: ["12", "13"], startTime: "17:45", partySize: 10, name: "Test Yana Vasileva", phone: "0888000018", note: "Anniversary group" },
  { dayOffset: 2, tableNumbers: ["41"], startTime: "19:30", partySize: 2, name: "Test Mila Grigorova", phone: "0888000019", note: "Window if available" },
  { dayOffset: 2, tableNumbers: ["54"], startTime: "21:00", partySize: 7, name: "Test Pavel Antonov", phone: "0888000020", note: "Birthday" },
  { dayOffset: -3, tableNumbers: ["7"], startTime: "13:00", partySize: 2, name: "Test Kristina Petrova", phone: "0888000021", note: null },
  { dayOffset: -3, tableNumbers: ["8", "9"], startTime: "18:45", partySize: 14, name: "Test Martin Kolev", phone: "0888000022", note: "Birthday dinner, long comment to test wrapping in the reservation list overlay" },
  { dayOffset: -3, tableNumbers: ["51"], startTime: "21:30", partySize: 2, name: "Test Gergana Vutova", phone: "0888000023", note: "Anniversary" },
  { dayOffset: -1, tableNumbers: ["3"], startTime: "17:45", partySize: 2, name: "Test Borislava Yaneva", phone: "0888000024", note: "Birthday, flowers on table" },
  { dayOffset: -1, tableNumbers: ["10"], startTime: "19:30", partySize: 5, name: "Test Dimitar Petkov", phone: "0888000025", note: null },
  { dayOffset: 0, tableNumbers: ["1"], startTime: "16:15", partySize: 2, name: "Test Alexandra Nikolova", phone: "0888000026", note: "Anniversary, prefers quiet table" },
  { dayOffset: 0, tableNumbers: ["12"], startTime: "18:00", partySize: 2, name: "Test Miroslav Dimitrov", phone: "0888000027", note: null },
  { dayOffset: 0, tableNumbers: ["31", "32"], startTime: "20:45", partySize: 13, name: "Test Lilia Georgieva", phone: "0888000028", note: "Birthday group, ask about cake storage" },
  { dayOffset: 1, tableNumbers: ["4"], startTime: "16:00", partySize: 2, name: "Test Nadezhda Borisova", phone: "0888000029", note: "Anniversary" },
  { dayOffset: 1, tableNumbers: ["14"], startTime: "21:30", partySize: 4, name: "Test Valentin Stoyanov", phone: "0888000030", note: "No comment from guest" },
  { dayOffset: 2, tableNumbers: ["1", "2"], startTime: "18:15", partySize: 16, name: "Test Plamen Radev", phone: "0888000031", note: "Large birthday, two high chairs" },
  { dayOffset: 2, tableNumbers: ["34"], startTime: "20:45", partySize: 2, name: "Test Teodora Hristova", phone: "0888000032", note: null },
  { dayOffset: 3, tableNumbers: ["6"], startTime: "12:30", partySize: 2, name: "Test Ivo Markov", phone: "0888000033", note: "Anniversary lunch" },
  { dayOffset: 3, tableNumbers: ["40", "41"], startTime: "19:15", partySize: 10, name: "Test Sofia Angelova", phone: "0888000034", note: "Birthday, wants candles" },
  { dayOffset: 3, tableNumbers: ["50"], startTime: "21:45", partySize: 6, name: "Test Anton Ivanov", phone: "0888000035", note: null }
];

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const envText = fs.readFileSync(filePath, "utf8");

  for (const line of envText.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmed.indexOf("=");

    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    const rawValue = trimmed.slice(equalsIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function headers(extra = {}) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
    ...extra
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: headers(options.headers)
  });
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} failed: ${response.status} ${body}`);
  }

  if (response.status === 204 || !body) {
    return null;
  }

  return JSON.parse(body);
}

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + days);
  return localDateString(date);
}

function addMinutes(timeString, minutes) {
  const [hours, mins] = timeString.split(":").map(Number);
  const total = (hours * 60 + mins + minutes) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}:00`;
}

function asDbTime(timeString) {
  return `${timeString}:00`;
}

async function getRestaurant() {
  const restaurants = await request(`/rest/v1/restaurants?slug=eq.${encodeURIComponent(restaurantSlug)}&select=id,name,slug`);
  const restaurant = restaurants[0];

  if (!restaurant) {
    throw new Error(`Restaurant with slug "${restaurantSlug}" was not found. Run the reservation book migration first.`);
  }

  return restaurant;
}

async function getTables(restaurantId) {
  const tables = await request(
    `/rest/v1/restaurant_tables?restaurant_id=eq.${restaurantId}&is_active=eq.true&select=id,table_number,display_label,sort_order`
  );
  return new Map(tables.map((table) => [table.table_number, table]));
}

async function getSeedStaffProfileId(restaurantId) {
  const memberships = await request(
    `/rest/v1/restaurant_memberships?restaurant_id=eq.${restaurantId}&is_active=eq.true&select=role,staff_profile_id,staff_profiles(display_name)&order=role.asc&limit=1`
  );
  return memberships[0]?.staff_profile_id ?? null;
}

async function deleteExistingReservationData(restaurantId) {
  const deleteHeaders = { Prefer: "return=minimal" };
  await request(`/rest/v1/reservation_tables?restaurant_id=eq.${restaurantId}`, { method: "DELETE", headers: deleteHeaders });
  await request(`/rest/v1/reservation_activity_log?restaurant_id=eq.${restaurantId}`, { method: "DELETE", headers: deleteHeaders });
  await request(`/rest/v1/sync_conflicts?restaurant_id=eq.${restaurantId}`, { method: "DELETE", headers: deleteHeaders });
  await request(`/rest/v1/reservations?restaurant_id=eq.${restaurantId}`, { method: "DELETE", headers: deleteHeaders });
}

async function insertDummyReservations(restaurant, tableByNumber, staffProfileId) {
  const reservationRows = dummyReservations.map((reservation) => ({
    restaurant_id: restaurant.id,
    reservation_date: addDays(baseDate, reservation.dayOffset),
    start_time: asDbTime(reservation.startTime),
    end_time: addMinutes(reservation.startTime, 210),
    duration_minutes: 210,
    party_size: reservation.partySize,
    customer_name: reservation.name,
    customer_phone: reservation.phone,
    note: reservation.note,
    source: "manual",
    created_by: staffProfileId,
    updated_by: staffProfileId,
    version: 1,
    last_mutation_id: crypto.randomUUID(),
    sync_origin_device_id: deviceId
  }));

  const insertedReservations = await request("/rest/v1/reservations?select=id,customer_name", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(reservationRows)
  });

  const reservationTableRows = insertedReservations.flatMap((inserted, index) => {
    const dummy = dummyReservations[index];

    return dummy.tableNumbers.map((tableNumber) => {
      const table = tableByNumber.get(tableNumber);

      if (!table) {
        throw new Error(`Table "${tableNumber}" was not found for ${restaurant.name}.`);
      }

      return {
        restaurant_id: restaurant.id,
        reservation_id: inserted.id,
        table_id: table.id
      };
    });
  });

  await request("/rest/v1/reservation_tables", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(reservationTableRows)
  });

  return insertedReservations.length;
}

async function main() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY before running this script.");
  }

  if (process.env.CONFIRM_RESET_BOOKING_RESERVATIONS !== "YES") {
    throw new Error("This deletes booking reservations. Re-run with CONFIRM_RESET_BOOKING_RESERVATIONS=YES to confirm.");
  }

  const restaurant = await getRestaurant();
  const tableByNumber = await getTables(restaurant.id);
  const staffProfileId = await getSeedStaffProfileId(restaurant.id);

  await deleteExistingReservationData(restaurant.id);
  const insertedCount = await insertDummyReservations(restaurant, tableByNumber, staffProfileId);

  console.log(`Deleted existing booking reservations for ${restaurant.name} (${restaurant.slug}).`);
  console.log(`Inserted ${insertedCount} dummy reservations from ${addDays(baseDate, -2)} to ${addDays(baseDate, 2)}.`);
  console.log("Groups over 8 people were assigned to two tables.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
