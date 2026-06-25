import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

test("menu page visibly answers cheese board and charcuterie board intent", () => {
  const menu = read("apps/web/src/components/seasonal-menu.tsx");

  assert.match(menu, /Cheese board and charcuterie board/);
  assert.match(menu, /The current special menu does not list a fixed cheese board or charcuterie board/);
  assert.match(menu, /For sharing, start with seasonal starters, cheese mousse, crispy onion rings/);

  assert.match(menu, /Плато със сирена и колбаси/);
  assert.match(menu, /В текущото специално меню няма фиксирано плато със сирена или колбаси/);
  assert.match(menu, /За споделяне започнете със сезонни стартери, мус от сирена, хрупкави лучени кръгчета/);
});

test("menu schema includes FAQ answers for cheese board and charcuterie board queries", () => {
  const schema = read("apps/web/src/lib/schema.ts");

  assert.match(schema, /const menuFaqs: Record<SiteLocale/);
  assert.match(schema, /Does The Friendly Bear have a cheese board or charcuterie board/);
  assert.match(schema, /The current special menu does not list a fixed cheese board or charcuterie board/);
  assert.match(schema, /Плато със сирена или колбаси има ли в The Friendly Bear/);
  assert.match(schema, /"@type": "FAQPage"/);
  assert.match(schema, /mainEntity: menuFaqs\[locale\]\.map/);
});
