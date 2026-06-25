# Photos Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add bilingual answer-ready photos pages that map "the friendly bear photos" intent to owned, crawlable pages.

**Architecture:** Reuse the existing localized route metadata and sitemap model. Add a focused server-rendered photo page component backed by the existing local gallery image data, with page-level `Restaurant` and `ImageGallery` JSON-LD.

**Tech Stack:** Next.js App Router, React server components, local static images, Node static tests, JSON-LD.

---

### Task 1: Static Regression Tests

**Files:**
- Create: `tests/photos-page-static.test.mjs`
- Read: `apps/web/src/lib/metadata.ts`
- Read: `apps/web/src/app/sitemap.ts`
- Read: `apps/web/src/lib/schema.ts`
- Read: `apps/web/src/components/site-chrome.tsx`

- [ ] **Step 1: Write the failing test**

```js
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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/photos-page-static.test.mjs`

Expected: FAIL because `photos` is not in `routeMap`.

### Task 2: Photos Routes and Component

**Files:**
- Create: `apps/web/src/components/photos-page.tsx`
- Create: `apps/web/src/app/bg/photos/page.tsx`
- Create: `apps/web/src/app/en/photos/page.tsx`
- Modify: `apps/web/src/lib/metadata.ts`
- Modify: `apps/web/src/app/sitemap.ts`

- [ ] **Step 1: Implement minimal route metadata**

Add `photos: { bg: "/bg/photos", en: "/en/photos" }` to `routeMap`, add `"photos"` to `indexableRouteKeys`, and create both page files with `buildPageMetadata`.

- [ ] **Step 2: Implement page content**

Create `PhotosPage` that renders an answer-first hero, three image groups using `getFoodGalleryImages`, `getGardenGalleryImages`, and `getInteriorGalleryImages`, and CTA links to menu, reservations, and directions.

- [ ] **Step 3: Run static test**

Run: `node --test tests/photos-page-static.test.mjs`

Expected: route test passes; later schema/internal-link assertions fail until Task 3 and Task 4 are complete.

### Task 3: ImageGallery Structured Data

**Files:**
- Modify: `apps/web/src/lib/schema.ts`
- Modify: `apps/web/src/app/bg/photos/page.tsx`
- Modify: `apps/web/src/app/en/photos/page.tsx`
- Modify: `tests/photos-page-static.test.mjs`

- [ ] **Step 1: Extend the failing test**

Assert that `schema.ts` exports `getPhotosPageSchema`, includes `ImageGallery`, includes `getRestaurantNode(locale`, and the pages render `<StructuredData data={getPhotosPageSchema("bg")}` / `"en"`.

- [ ] **Step 2: Verify test fails**

Run: `node --test tests/photos-page-static.test.mjs`

Expected: FAIL because schema helper and page wiring do not exist.

- [ ] **Step 3: Implement minimal schema**

Add `getPhotosPageSchema(locale)` with graph nodes for `Restaurant`, breadcrumb, `WebPage`, and `ImageGallery` using all local food, garden, and interior images.

- [ ] **Step 4: Run test**

Run: `node --test tests/photos-page-static.test.mjs`

Expected: PASS for route and schema assertions.

### Task 4: Internal Links and Verification

**Files:**
- Modify: `apps/web/src/components/site-chrome.tsx`
- Modify: `tests/photos-page-static.test.mjs`

- [ ] **Step 1: Extend the failing test**

Assert that `site-chrome.tsx` defines a localized `photosPath` and renders a footer link to it.

- [ ] **Step 2: Verify test fails**

Run: `node --test tests/photos-page-static.test.mjs`

Expected: FAIL because there is no footer photos link.

- [ ] **Step 3: Implement internal link**

Add localized footer copy for "Photos" and a footer link to `/${locale}/photos`.

- [ ] **Step 4: Run full verification**

Run:

```powershell
node --test tests/*.test.mjs
npm run build:web
```

Expected: all tests pass and the web build succeeds.

- [ ] **Step 5: Rerun crawl and benchmark**

Start production server on port 3007 with fallback CMS disabled, crawl sitemap URLs and same-site links, then rerun search samples for `"The Friendly Bear" photos Sofia` and `"the friendly bear photos"`.

Expected: `/bg/photos` and `/en/photos` are in sitemap, render 200, contain valid JSON-LD, and no new internal-link or crawlability issue appears.
