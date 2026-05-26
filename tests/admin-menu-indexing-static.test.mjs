import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";
import test from "node:test";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function assertContains(text, expected, label) {
  assert.ok(text.includes(expected), `${label} should contain ${expected}`);
}

test("admin menu publish requests Google indexing for both localized menu pages", () => {
  const helperPath = "apps/web/src/lib/admin/google-indexing.ts";
  assert.ok(existsSync(join(root, helperPath)), "expected Google indexing helper");

  const helper = read(helperPath);
  assertContains(helper, "GOOGLE_INDEXING_CLIENT_EMAIL", "Google indexing helper");
  assertContains(helper, "GOOGLE_INDEXING_PRIVATE_KEY", "Google indexing helper");
  assertContains(helper, "https://oauth2.googleapis.com/token", "Google indexing helper");
  assertContains(helper, "https://indexing.googleapis.com/v3/urlNotifications:publish", "Google indexing helper");
  assertContains(helper, "URL_UPDATED", "Google indexing helper");
  assertContains(helper, "requestGoogleIndexingForMenuUrls", "Google indexing helper");

  const route = read("apps/web/src/app/api/admin/menu/route.ts");
  assertContains(route, "requestGoogleIndexingForMenuUrls", "admin menu route");
  const publishBranch = route.match(/if \(body\.action === "publish"\) \{([\s\S]*?)\n    \}/)?.[1] ?? "";
  assertContains(publishBranch, "requestGoogleIndexingForMenuUrls", "admin menu route publish branch");

  const draftBranch = route.slice(route.indexOf("const draft = await saveSeasonalMenuDraft"));
  assert.ok(draftBranch, "expected admin menu route to contain a draft branch");
  assert.ok(!draftBranch.includes("requestGoogleIndexingForMenuUrls"), "admin menu route should not request indexing in the draft branch");
});

test("special and regular menu copy uses the requested labels", () => {
  const specialMenu = read("apps/web/src/lib/spring-menu-content.ts");
  assertContains(specialMenu, 'eyebrow: "Специално меню"', "Bulgarian special menu fallback");
  assertContains(specialMenu, 'eyebrow: "Special Menu"', "English special menu fallback");
  assert.ok(!specialMenu.includes("Специално седмично меню"), "Bulgarian special menu fallback should not say weekly");
  assert.ok(!specialMenu.includes("Special Weekly Menu"), "English special menu fallback should not say weekly");

  const promotions = read("apps/web/src/lib/promotion-module.ts");
  assertContains(promotions, 'bg: "Специално меню"', "Bulgarian promotion fallback");
  assertContains(promotions, 'en: "Special Menu"', "English promotion fallback");
  assert.ok(!promotions.includes("Special Weekly Menu"), "promotion fallback should not say weekly");

  const downloadForm = read("apps/web/src/components/menu-download-form.tsx");
  assertContains(downloadForm, 'eyebrow: "Основно меню"', "Bulgarian regular menu download form");
  assertContains(downloadForm, 'title: "Изтеглете основното меню"', "Bulgarian regular menu download form");
  assertContains(downloadForm, "основното меню", "Bulgarian regular menu download form");
  assert.ok(!downloadForm.includes("Редовно меню"), "Bulgarian regular menu label should not say regular menu");
  assert.ok(!downloadForm.includes("редовното меню"), "Bulgarian regular menu sentence should not say regular menu");
});

test("saved special menu payloads are normalized away from weekly wording", () => {
  const contentTypes = read("apps/web/src/lib/content-types.ts");

  assertContains(contentTypes, "normalizeLegacySpecialMenuText", "seasonal menu payload normalizer");
  assertContains(contentTypes, '"Специално седмично меню"', "seasonal menu payload normalizer");
  assertContains(contentTypes, '"Специално меню"', "seasonal menu payload normalizer");
  assertContains(contentTypes, '"Special Weekly Menu"', "seasonal menu payload normalizer");
  assertContains(contentTypes, '"Special Menu"', "seasonal menu payload normalizer");
  assertContains(contentTypes, "нашето специално меню", "seasonal menu payload normalizer");
  assertContains(contentTypes, "our special menu", "seasonal menu payload normalizer");
  assertContains(contentTypes, "normalizeLegacySpecialMenuText(cleanText(localeValue.eyebrow)", "seasonal menu payload normalizer");
  assertContains(contentTypes, "normalizeLegacySpecialMenuText(cleanText(localeValue.intro)", "seasonal menu payload normalizer");
});
