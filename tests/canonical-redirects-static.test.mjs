import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

test("root locale redirect is permanent to the Bulgarian canonical page", () => {
  const rootPage = read("apps/web/src/app/page.tsx");

  assert.match(rootPage, /import\s*\{\s*permanentRedirect\s*\}\s*from\s*"next\/navigation"/);
  assert.doesNotMatch(rootPage, /import\s*\{\s*redirect\s*\}\s*from\s*"next\/navigation"/);
  assert.match(rootPage, /permanentRedirect\("\/bg"\)/);
  assert.doesNotMatch(rootPage, /redirect\("\/bg"\)/);
});

test("apex host redirects permanently to the canonical www host", () => {
  const nextConfig = read("apps/web/next.config.mjs");

  assert.match(nextConfig, /async\s+redirects\(\)/);
  assert.match(nextConfig, /source:\s*"\/:path\*"/);
  assert.match(nextConfig, /type:\s*"host"/);
  assert.match(nextConfig, /value:\s*"friendlybear\.bg"/);
  assert.match(nextConfig, /destination:\s*"https:\/\/www\.friendlybear\.bg\/:path\*"/);
  assert.match(nextConfig, /permanent:\s*true/);
});
