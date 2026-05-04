import crypto from "node:crypto";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const restaurantSlug = process.env.BOOKING_RESTAURANT_SLUG || "the-friendly-bear-sofia";

const accounts = [
  { label: "owner", role: "owner" },
  { label: "admin", role: "admin" },
  { label: "staff_1", role: "staff" },
  { label: "staff_2", role: "staff" },
  { label: "staff_3", role: "staff" }
];

function envName(label, suffix) {
  return `BOOKING_${label.toUpperCase()}_${suffix}`;
}

function generatedPassword() {
  return crypto
    .randomBytes(24)
    .toString("base64url")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 24);
}

function defaultEmail(label) {
  return `${label.replace("_", ".")}.bookings@friendlybear.local`;
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

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${options.method || "GET"} ${path} failed: ${response.status} ${body}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function findUserByEmail(email) {
  const data = await request("/auth/v1/admin/users?per_page=1000");
  return data.users?.find((user) => user.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

async function createOrFindUser(account, password) {
  const existing = await findUserByEmail(account.email);

  if (existing) {
    return { user: existing, created: false };
  }

  const user = await request("/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({
      email: account.email,
      password,
      email_confirm: true,
      user_metadata: {
        display_name: account.displayName,
        booking_account_label: account.label
      }
    })
  });

  return { user, created: true };
}

async function getRestaurant() {
  const restaurants = await request(`/rest/v1/restaurants?slug=eq.${encodeURIComponent(restaurantSlug)}&select=id,name,slug`);
  const restaurant = restaurants[0];

  if (!restaurant) {
    throw new Error(`Restaurant with slug "${restaurantSlug}" was not found. Run the reservation book migration first.`);
  }

  return restaurant;
}

async function upsertProfile(account, userId) {
  const profiles = await request("/rest/v1/staff_profiles?on_conflict=auth_user_id&select=id,display_name,role", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify([
      {
        auth_user_id: userId,
        display_name: account.displayName,
        role: account.role,
        is_active: true
      }
    ])
  });

  return profiles[0];
}

async function upsertMembership(restaurantId, profileId, role) {
  await request("/rest/v1/restaurant_memberships?on_conflict=restaurant_id,staff_profile_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify([
      {
        restaurant_id: restaurantId,
        staff_profile_id: profileId,
        role,
        is_active: true
      }
    ])
  });
}

async function main() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY before running this script.");
  }

  const restaurant = await getRestaurant();
  const credentials = [];

  for (const account of accounts) {
    const email = process.env[envName(account.label, "EMAIL")] || defaultEmail(account.label);
    const password = process.env[envName(account.label, "PASSWORD")] || generatedPassword();
    const displayName = process.env[envName(account.label, "DISPLAY_NAME")] || account.label.replace("_", " ");
    const resolved = { ...account, email, displayName };
    const { user, created } = await createOrFindUser(resolved, password);
    const profile = await upsertProfile(resolved, user.id);
    await upsertMembership(restaurant.id, profile.id, account.role);

    credentials.push({
      label: account.label,
      role: account.role,
      email,
      password: created ? password : "(existing user - unchanged)",
      created
    });
  }

  console.log(`Seeded booking staff for ${restaurant.name} (${restaurant.slug}).`);
  console.table(credentials);
  console.log("Store newly generated passwords privately. They are not written to the frontend or repository.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
