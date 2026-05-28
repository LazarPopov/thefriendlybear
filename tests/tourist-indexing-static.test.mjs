import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

test("public site metadata is indexable by default", () => {
  const layout = read("apps/web/src/app/layout.tsx");

  assert.match(layout, /robots:\s*\{[\s\S]*?index:\s*true/);
  assert.match(layout, /robots:\s*\{[\s\S]*?follow:\s*true/);
  assert.doesNotMatch(layout, /robots:\s*\{[\s\S]*?index:\s*false/);
  assert.doesNotMatch(layout, /robots:\s*\{[\s\S]*?follow:\s*false/);
});

test("canonical site url matches the live www host", () => {
  const siteConfig = read("apps/web/src/lib/site.ts");

  assert.match(siteConfig, /https:\/\/www\.friendlybear\.bg/);
  assert.doesNotMatch(siteConfig, /\?\?\s*"https:\/\/friendlybear\.bg"/);
});

test("tourist detail slugs are served by the dynamic routes instead of self-redirecting static pages", () => {
  const selfRedirectingRoutes = [
    "apps/web/src/app/bg/tourists/greek/page.tsx",
    "apps/web/src/app/bg/tourists/italian/page.tsx",
    "apps/web/src/app/bg/tourists/spanish/page.tsx",
    "apps/web/src/app/en/tourists/greek/page.tsx",
    "apps/web/src/app/en/tourists/italian/page.tsx",
    "apps/web/src/app/en/tourists/spanish/page.tsx"
  ];

  for (const route of selfRedirectingRoutes) {
    assert.equal(existsSync(join(root, route)), false, `${route} should not shadow the dynamic tourist route`);
  }
});
