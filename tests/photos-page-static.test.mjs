import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

test("photos route is localized and included in the sitemap route set", () => {
  const metadata = read("apps/web/src/lib/metadata.ts");
  const sitemap = read("apps/web/src/app/sitemap.ts");

  assert.match(metadata, /photos:\s*{\s*bg:\s*"\/bg\/photos",\s*en:\s*"\/en\/photos"\s*}/s);
  assert.match(sitemap, /"photos"/);
  assert.ok(existsSync(join(root, "apps/web/src/app/bg/photos/page.tsx")));
  assert.ok(existsSync(join(root, "apps/web/src/app/en/photos/page.tsx")));
});

test("photos pages render Restaurant and ImageGallery structured data", () => {
  const schema = read("apps/web/src/lib/schema.ts");
  const bgPage = read("apps/web/src/app/bg/photos/page.tsx");
  const enPage = read("apps/web/src/app/en/photos/page.tsx");

  assert.match(schema, /export function getPhotosPageSchema/);
  assert.match(schema, /getRestaurantNode\(locale/);
  assert.match(schema, /"@type": "ImageGallery"/);
  assert.match(schema, /getFoodGalleryImages\(locale\)/);
  assert.match(schema, /getGardenGalleryImages\(locale\)/);
  assert.match(schema, /getInteriorGalleryImages\(locale\)/);

  assert.match(bgPage, /<StructuredData data={getPhotosPageSchema\("bg"\)} \/>/);
  assert.match(enPage, /<StructuredData data={getPhotosPageSchema\("en"\)} \/>/);
});

test("site chrome links to localized photos pages", () => {
  const siteChrome = read("apps/web/src/components/site-chrome.tsx");

  assert.match(siteChrome, /const photosPath = `\/\$\{locale\}\/photos`;/);
  assert.match(siteChrome, /photos:\s*"Photos"/);
  assert.match(siteChrome, /photos:\s*"Снимки"/);
  assert.match(siteChrome, /<Link href={photosPath}>{copy\.photos}<\/Link>/);
});
