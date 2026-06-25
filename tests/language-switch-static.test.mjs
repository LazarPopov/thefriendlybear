import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

test("hidden gem singleton language switch resolves to an existing Bulgarian route", () => {
  const siteChrome = read("apps/web/src/components/site-chrome.tsx");

  assert.match(siteChrome, /"\/en\/hidden-gem-restaurant-sofia"\s*:\s*"\/bg\/tourists"/);
});
