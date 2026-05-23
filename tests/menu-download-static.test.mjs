import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function assertContains(text, expected, label) {
  assert.ok(text.includes(expected), `${label} should contain ${expected}`);
}

const migrationDir = join(root, "infra", "supabase", "migrations");
const migrationFile = readdirSync(migrationDir).find((file) => {
  if (!file.endsWith(".sql")) {
    return false;
  }

  return readFileSync(join(migrationDir, file), "utf8").includes("menu_download_leads");
});

assert.ok(migrationFile, "expected a Supabase migration for menu_download_leads");
const migration = readFileSync(join(migrationDir, migrationFile), "utf8");

assertContains(migration, "create table if not exists menu_download_leads", "menu lead migration");
assertContains(migration, "email text not null", "menu lead migration");
assertContains(migration, "name text not null", "menu lead migration");
assertContains(migration, "menu_requested boolean not null default true", "menu lead migration");
assertContains(migration, "extras_requested boolean not null default false", "menu lead migration");
assertContains(migration, "alter table menu_download_leads enable row level security", "menu lead migration");
assertContains(migration, "grant insert, select on table menu_download_leads to service_role", "menu lead migration");

const formPath = "apps/web/src/components/menu-download-form.tsx";
assert.ok(existsSync(join(root, formPath)), "expected MenuDownloadForm component");
const form = read(formPath);

assertContains(form, "/api/menu-download-leads", "MenuDownloadForm");
assertContains(form, "/api/menu-download?", "MenuDownloadForm");
assertContains(form, "window.location.href", "MenuDownloadForm");
assertContains(form, "name=\"name\"", "MenuDownloadForm");
assertContains(form, "name=\"email\"", "MenuDownloadForm");
assertContains(form, "name=\"menuRequested\"", "MenuDownloadForm");
assertContains(form, "name=\"extrasRequested\"", "MenuDownloadForm");
assertContains(form, "menu-download-options", "MenuDownloadForm");
assert.ok(!form.includes("Напишете име и имейл"), "MenuDownloadForm should not show the old Bulgarian intro sentence");
assert.ok(!form.includes("Write your name and email"), "MenuDownloadForm should not show the old English intro sentence");

const leadRoutePath = "apps/web/src/app/api/menu-download-leads/route.ts";
assert.ok(existsSync(join(root, leadRoutePath)), "expected lead capture route");
const leadRoute = read(leadRoutePath);

assertContains(leadRoute, "menu_download_leads", "lead capture route");
assertContains(leadRoute, "SUPABASE_SERVICE_ROLE_KEY", "lead capture route");
assertContains(leadRoute, "POST", "lead capture route");
assertContains(leadRoute, "validateMenuDownloadLead", "lead capture route");
assertContains(leadRoute, "menu_requested", "lead capture route");
assertContains(leadRoute, "extras_requested", "lead capture route");

const downloadRoutePath = "apps/web/src/app/api/menu-download/route.ts";
assert.ok(existsSync(join(root, downloadRoutePath)), "expected menu download route");
const downloadRoute = read(downloadRoutePath);

assertContains(downloadRoute, "Response.redirect", "menu download route");
assertContains(downloadRoute, "/files/", "menu download route");
assertContains(downloadRoute, "the-friendly-bear-menu", "menu download route");

const nextConfig = read("apps/web/next.config.mjs");
assertContains(nextConfig, "Content-Disposition", "Next static PDF headers");
assertContains(nextConfig, "application/pdf", "Next static PDF headers");
assertContains(nextConfig, "the-friendly-bear-menu-bg.pdf", "Next static PDF headers");
assertContains(nextConfig, "the-friendly-bear-menu-en.pdf", "Next static PDF headers");

assert.ok(
  existsSync(join(root, "apps", "web", "public", "files", "the-friendly-bear-menu-bg.pdf")),
  "expected Bulgarian regular menu PDF in public files"
);
assert.ok(
  existsSync(join(root, "apps", "web", "public", "files", "the-friendly-bear-menu-en.pdf")),
  "expected English regular menu PDF in public files"
);

const seasonalMenu = read("apps/web/src/components/seasonal-menu.tsx");
assertContains(seasonalMenu, "MenuDownloadForm", "SeasonalMenu");

const touristMarketPage = read("apps/web/src/components/tourist-market-page.tsx");
assertContains(touristMarketPage, "MenuDownloadForm", "TouristMarketPage");

const touristLandingPage = read("apps/web/src/components/tourist-landing-page-cms.tsx");
assertContains(touristLandingPage, "MenuDownloadForm", "TouristLandingPageCms");

const touristsPage = read("apps/web/src/components/tourists-page-cms.tsx");
assertContains(touristsPage, "MenuDownloadForm", "TouristsPageCms");

const css = read("apps/web/src/app/globals.css");
assertContains(css, "background-color: #6b232a !important", "menu download button CSS");
assertContains(css, "color: #fffdf8 !important", "menu download button CSS");
assertContains(css, ".menu-download-check", "menu download checkbox CSS");
