import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const googleVerificationToken = "oaKxoCIDyxVXAT-hIztihQsFJmloKIhrsrqFsFQFCXs";

test("root metadata includes the Google Search Console verification token", () => {
  const layout = readFileSync(join(root, "apps/web/src/app/layout.tsx"), "utf8");

  assert.match(
    layout,
    new RegExp(`verification:\\s*\\{[\\s\\S]*google:\\s*"${googleVerificationToken}"`)
  );
});
