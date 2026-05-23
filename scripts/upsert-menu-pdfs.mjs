import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const envPath = join(root, "apps", "web", ".env.local");

const defaultMenus = [
  {
    locale: "bg",
    filename: "the-friendly-bear-menu-bg.pdf",
    path: "C:\\Users\\lazar\\Desktop\\fb bg menu.pdf"
  },
  {
    locale: "en",
    filename: "the-friendly-bear-menu-en.pdf",
    path: "C:\\Users\\lazar\\Desktop\\fb eng menu.pdf"
  }
];

function loadEnvFile(path) {
  if (!existsSync(path)) {
    return;
  }

  const lines = readFileSync(path, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);

    if (!match || process.env[match[1]]) {
      continue;
    }

    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function buildMenuRow(menu) {
  const pdf = readFileSync(menu.path);

  return {
    locale: menu.locale,
    filename: menu.filename,
    content_type: "application/pdf",
    content_base64: pdf.toString("base64"),
    byte_size: pdf.byteLength,
    sha256: createHash("sha256").update(pdf).digest("hex"),
    is_active: true,
    updated_at: new Date().toISOString()
  };
}

async function upsertMenus() {
  loadEnvFile(envPath);

  const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL is required.");
  }

  const rows = defaultMenus.map(buildMenuRow);
  const response = await fetch(`${supabaseUrl}/rest/v1/regular_menu_files?on_conflict=locale&select=locale,filename,byte_size,sha256`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation"
    },
    body: JSON.stringify(rows)
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || `Supabase upsert failed with ${response.status}.`);
  }

  const result = text ? JSON.parse(text) : [];
  console.log(JSON.stringify(result, null, 2));
}

upsertMenus().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
