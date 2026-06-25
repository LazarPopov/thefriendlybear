import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const indexNowKey = "98110a51da68360747e7081bafd51231";

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

test("IndexNow verification key is hosted from the web root", () => {
  const keyPath = `apps/web/public/${indexNowKey}.txt`;

  assert.ok(existsSync(join(root, keyPath)));
  assert.equal(read(keyPath).trim(), indexNowKey);
});
