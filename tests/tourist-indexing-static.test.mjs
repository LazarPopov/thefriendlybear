import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

test("public site metadata is indexable by default", () => {
  const layout = read("apps/web/src/app/layout.tsx");

  assert.match(layout, /robots:\s*\{[\s\S]*?index:\s*true/);
  assert.match(layout, /robots:\s*\{[\s\S]*?follow:\s*true/);
  assert.doesNotMatch(layout, /robots:\s*\{[\s\S]*?index:\s*false/);
  assert.doesNotMatch(layout, /robots:\s*\{[\s\S]*?follow:\s*false/);
});

test("canonical site url matches the live www host", () => {
  const siteConfig = read("apps/web/src/lib/site.ts");

  assert.match(siteConfig, /https:\/\/www\.friendlybear\.bg/);
  assert.doesNotMatch(siteConfig, /\?\?\s*"https:\/\/friendlybear\.bg"/);
});

test("tourist detail slugs are served by the dynamic routes instead of self-redirecting static pages", () => {
  const selfRedirectingRoutes = [
    "apps/web/src/app/bg/tourists/greek/page.tsx",
    "apps/web/src/app/bg/tourists/italian/page.tsx",
    "apps/web/src/app/bg/tourists/spanish/page.tsx",
    "apps/web/src/app/en/tourists/greek/page.tsx",
    "apps/web/src/app/en/tourists/italian/page.tsx",
    "apps/web/src/app/en/tourists/spanish/page.tsx"
  ];

  for (const route of selfRedirectingRoutes) {
    assert.equal(existsSync(join(root, route)), false, `${route} should not shadow the dynamic tourist route`);
  }
});

test("Dutch tourist market page is configured for indexing and tracking", () => {
  const adapter = read("apps/web/src/lib/cms/tourist-landing-page-adapter.ts");
  const module = read("apps/web/src/lib/tourist-landing-page-module.ts");
  const market = read("apps/web/src/lib/tourist-market.ts");
  const route = read("apps/web/src/lib/tourist-market-route.ts");
  const copy = read("apps/web/src/lib/tourist-market-copy.ts");
  const hub = read("apps/web/src/components/tourists-page-cms.tsx");
  const analytics = read("apps/web/src/components/analytics-events.tsx");
  const schema = read("apps/web/src/lib/schema.ts");
  const proxy = read("apps/web/src/proxy.ts");
  const layout = read("apps/web/src/app/layout.tsx");
  const cmsSchema = read("apps/cms/src/api/tourist-landing-page/content-types/tourist-landing-page/schema.json");
  const marketString = read("apps/cms/src/components/shared/market-string.json");
  const marketText = read("apps/cms/src/components/shared/market-text.json");

  assert.equal(existsSync(join(root, "apps/web/src/app/nl/[slug]/page.tsx")), true);
  assert.match(adapter, /TouristAudience = .*"dutch"/);
  assert.match(adapter, /TouristMarketLocale = .*"nl"/);
  assert.match(module, /touristAudienceOrder[\s\S]*"dutch"/);
  assert.match(module, /audience:\s*"dutch"/);
  assert.match(market, /nl:\s*\{[\s\S]*audience:\s*"dutch"/);
  assert.match(route, /nl:\s*\{[\s\S]*slug:\s*"restaurant-sofia-centrum"/);
  assert.match(route, /inLanguage:\s*"nl-NL"/);
  assert.match(route, /knowsLanguage:\s*\[[^\]]*"nl"/);
  assert.match(copy, /nl:\s*\{[\s\S]*gezellige avond/);
  assert.match(copy, /Bekijk het menu/);
  assert.match(hub, /href:\s*"\/nl\/restaurant-sofia-centrum"/);
  assert.match(analytics, /nl:\s*"dutch"/);
  assert.match(schema, /url:\s*absoluteUrl\("\/nl\/restaurant-sofia-centrum"\)/);
  assert.match(proxy, /nl:\s*"nl"/);
  assert.match(layout, /"nl"/);
  assert.match(cmsSchema, /"dutch"/);
  assert.match(marketString, /"nl"/);
  assert.match(marketText, /"nl"/);
});

test("tourist pages show the food showcase and localized visit panel", () => {
  const touristHub = read("apps/web/src/components/tourists-page-cms.tsx");
  const touristDetail = read("apps/web/src/components/tourist-landing-page-cms.tsx");
  const marketPage = read("apps/web/src/components/tourist-market-page.tsx");
  const visitPanel = read("apps/web/src/components/tourist-visit-panel.tsx");

  for (const component of [touristHub, touristDetail, marketPage]) {
    assert.match(component, /BrandShowcasePanel/);
    assert.match(component, /TouristVisitPanel/);
  }

  assert.match(visitPanel, /home-section home-visit-panel/);
  assert.match(visitPanel, /home-visit-copy/);
  assert.match(visitPanel, /home-visit-actions/);
  assert.match(visitPanel, /home-visit-map-card/);
  assert.match(visitPanel, /CopyAddressButton/);
  assert.match(visitPanel, /DeferredMapEmbed/);
  assert.match(visitPanel, /mapPinLabel/);
  assert.match(visitPanel, /tourists_visit_panel/);
  assert.match(visitPanel, /tourist_page_visit_panel/);
  assert.match(visitPanel, /market_visit_panel/);

  for (const locale of ["en", "bg", "nl", "de", "it", "es", "el", "ro", "en-gb"]) {
    assert.match(visitPanel, new RegExp(`["']?${locale}["']?:\\s*\\{`));
  }

  assert.match(visitPanel, /Visit us/);
  assert.match(visitPanel, /Посетете ни/);
  assert.match(visitPanel, /Bezoek ons/);
  assert.match(visitPanel, /Besuchen Sie uns/);
  assert.match(visitPanel, /Vieni a trovarci/);
  assert.match(visitPanel, /Visítanos/);
  assert.match(visitPanel, /Επισκεφθείτε μας/);
  assert.match(visitPanel, /Vizitează-ne/);
});
