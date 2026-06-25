import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function readIgnorePatterns() {
  return readFileSync(join(root, ".vercelignore"), "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

test("Vercel deployment excludes non-web and private local artifacts", () => {
  const patterns = readIgnorePatterns();

  for (const pattern of [
    "apps/cms",
    "apps/cms/**",
    "docs",
    "docs/**",
    "infra",
    "infra/**",
    "scripts",
    "scripts/**",
    "tests",
    "tests/**",
    "data",
    "data/**",
    "dev-web*.log",
    ".claude",
    ".claude/**",
    ".xdg",
    ".xdg/**",
    "**/*.tsbuildinfo"
  ]) {
    assert.ok(patterns.includes(pattern), `missing .vercelignore pattern: ${pattern}`);
  }
});
