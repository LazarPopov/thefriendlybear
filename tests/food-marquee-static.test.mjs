import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("food marquee has click and keyboard fallback for manual next", () => {
  const component = read("apps/web/src/components/food-marquee.tsx");

  assert.match(component, /role="button"/);
  assert.match(component, /onClick=\{advance\}/);
  assert.match(component, /onKeyDown=\{handleKeyDown\}/);
  assert.match(component, /brand-marquee-manual/);
  assert.match(component, /--food-manual-offset/);
});

test("food marquee CSS supports manual movement and larger mobile cards", () => {
  const css = read("apps/web/src/app/globals.css");

  assert.match(css, /\.brand-marquee-manual\s+\.brand-marquee-track/);
  assert.match(css, /transform:\s*translateX\(calc\(var\(--food-manual-offset,\s*0px\)\s*\*\s*-1\)\)/);
  assert.match(css, /--food-card-width:\s*min\(70vw,\s*360px\)/);
  assert.match(css, /--food-marquee-gap:\s*12px/);
});
