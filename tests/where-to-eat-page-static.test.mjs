import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

test("where-to-eat route is localized and included in the sitemap route set", () => {
  const metadata = read("apps/web/src/lib/metadata.ts");
  const sitemap = read("apps/web/src/app/sitemap.ts");

  assert.match(
    metadata,
    /whereToEat:\s*{\s*bg:\s*"\/bg\/where-to-eat-sofia-center",\s*en:\s*"\/en\/where-to-eat-sofia-center"\s*}/s
  );
  assert.match(sitemap, /"whereToEat"/);
  assert.ok(existsSync(join(root, "apps/web/src/app/bg/where-to-eat-sofia-center/page.tsx")));
  assert.ok(existsSync(join(root, "apps/web/src/app/en/where-to-eat-sofia-center/page.tsx")));
});

test("where-to-eat pages render Restaurant and FAQPage structured data", () => {
  const schema = read("apps/web/src/lib/schema.ts");
  const bgPage = read("apps/web/src/app/bg/where-to-eat-sofia-center/page.tsx");
  const enPage = read("apps/web/src/app/en/where-to-eat-sofia-center/page.tsx");

  assert.match(schema, /export function getWhereToEatPageSchema/);
  assert.match(schema, /getRestaurantNode\(locale/);
  assert.match(schema, /"@type": "FAQPage"/);
  assert.match(schema, /whereToEatPath/);

  assert.match(bgPage, /<StructuredData data={getWhereToEatPageSchema\("bg"\)} \/>/);
  assert.match(enPage, /<StructuredData data={getWhereToEatPageSchema\("en"\)} \/>/);
});

test("where-to-eat page answers meal intent accurately", () => {
  const component = read("apps/web/src/components/where-to-eat-page.tsx");

  assert.match(component, /Where to eat dinner or lunch in Sofia Center/);
  assert.match(component, /Weekday dinner/);
  assert.match(component, /Weekend lunch/);
  assert.match(component, /Tuesday to Friday from 17:00/);
  assert.match(component, /Saturday and Sunday from 12:00/);
  assert.match(component, /Source links/);
  assert.match(component, /\/en\/photos/);
  assert.match(component, /\/en\/reviews/);
});

test("site chrome links to localized where-to-eat pages", () => {
  const siteChrome = read("apps/web/src/components/site-chrome.tsx");

  assert.match(siteChrome, /const whereToEatPath = `\/\$\{locale\}\/where-to-eat-sofia-center`;/);
  assert.match(siteChrome, /whereToEat:\s*"Where to eat"/);
  assert.match(siteChrome, /<Link href={whereToEatPath}>{copy\.whereToEat}<\/Link>/);
});
