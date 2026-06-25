import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function functionBody(source, functionName) {
  const start = source.indexOf(`export function ${functionName}`);

  assert.notEqual(start, -1, `${functionName} should exist`);

  const nextExport = source.indexOf("\nexport ", start + 1);
  return source.slice(start, nextExport === -1 ? source.length : nextExport);
}

test("reservation and promotion schemas include the Restaurant entity", () => {
  const schema = read("apps/web/src/lib/schema.ts");

  assert.match(functionBody(schema, "getReservationsPageSchema"), /getRestaurantNode\(locale/);
  assert.match(functionBody(schema, "getPromotionsPageSchema"), /getRestaurantNode\(locale/);
});

test("reservation and promotion pages render structured data", () => {
  const pagePaths = [
    "apps/web/src/app/bg/reservations/page.tsx",
    "apps/web/src/app/en/reservations/page.tsx",
    "apps/web/src/app/bg/promotions/page.tsx",
    "apps/web/src/app/en/promotions/page.tsx"
  ];

  for (const pagePath of pagePaths) {
    const page = read(pagePath);

    assert.match(page, /import \{ StructuredData \} from "@\/components\/structured-data"/, pagePath);
    assert.match(page, /<StructuredData data=\{schema\} \/>/, pagePath);
  }
});
