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

test("tourist hub schema includes the Restaurant entity", () => {
  const schema = read("apps/web/src/lib/schema.ts");
  const body = functionBody(schema, "getTouristsHubSchema");

  assert.match(body, /getRestaurantNode\(locale\)/);
});

test("tourist detail schema includes the Restaurant entity", () => {
  const schema = read("apps/web/src/lib/schema.ts");
  const body = functionBody(schema, "getTouristLandingPageSchema");

  assert.match(body, /getRestaurantNode\(locale\)/);
});
