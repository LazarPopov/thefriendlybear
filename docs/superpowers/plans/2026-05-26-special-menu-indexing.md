# Special Menu Indexing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename menu copy and request Google Indexing for both localized menu pages when staff publish the special menu.

**Architecture:** Add one server-only helper under `apps/web/src/lib/admin/` for Google Indexing and call it from the existing admin menu route after `publishSeasonalMenu` succeeds. Keep indexing non-blocking for publish success and surface a concise status in the admin client.

**Tech Stack:** Next.js App Router route handlers, TypeScript, Node `crypto`, Node static tests.

---

### Task 1: Static Regression Test

**Files:**
- Create: `tests/admin-menu-indexing-static.test.mjs`

- [ ] **Step 1: Write the failing test**

Create a Node static test that reads the admin route, Google helper, special menu fallback copy, promotion fallback copy, and menu download form copy. Assert that publish calls the indexing helper, draft saves do not, the helper uses the Google service account env vars, sends `URL_UPDATED` notifications to `https://indexing.googleapis.com/v3/urlNotifications:publish`, and the new labels appear.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/admin-menu-indexing-static.test.mjs`

Expected: FAIL because `apps/web/src/lib/admin/google-indexing.ts` does not exist and the labels still use weekly/regular wording.

### Task 2: Implement Labels And Indexing

**Files:**
- Create: `apps/web/src/lib/admin/google-indexing.ts`
- Modify: `apps/web/src/app/api/admin/menu/route.ts`
- Modify: `apps/web/src/components/admin/admin-menu-client.tsx`
- Modify: `apps/web/src/lib/spring-menu-content.ts`
- Modify: `apps/web/src/lib/promotion-module.ts`
- Modify: `apps/web/src/components/menu-download-form.tsx`

- [ ] **Step 1: Add the Google Indexing helper**

Implement `requestGoogleIndexingForMenuUrls()` with lazy env reads, service account JWT signing, OAuth token exchange, and per-URL `URL_UPDATED` notification requests.

- [ ] **Step 2: Call helper only after publish**

In `POST /api/admin/menu`, call the helper after `publishSeasonalMenu` succeeds and include `indexing` in the JSON response. Do not call the helper in the draft branch.

- [ ] **Step 3: Surface indexing status**

Update the admin menu client response type and publish message so staff can see whether Google indexing was requested or partially failed.

- [ ] **Step 4: Update copy**

Change the special menu labels to "Special Menu" and "Специално меню". Change Bulgarian regular menu download wording to use "Основно меню".

- [ ] **Step 5: Run focused test**

Run: `node --test tests/admin-menu-indexing-static.test.mjs`

Expected: PASS.

### Task 3: Verification

**Files:**
- All files from Task 2

- [ ] **Step 1: Run web build**

Run: `npm run build:web`

Expected: exit 0.

- [ ] **Step 2: Review diff**

Run: `git diff -- apps/web/src/app/api/admin/menu/route.ts apps/web/src/lib/admin/google-indexing.ts apps/web/src/components/admin/admin-menu-client.tsx apps/web/src/lib/spring-menu-content.ts apps/web/src/lib/promotion-module.ts apps/web/src/components/menu-download-form.tsx tests/admin-menu-indexing-static.test.mjs`

Expected: only the requested copy and indexing changes are present.
