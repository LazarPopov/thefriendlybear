import type { MetadataRoute } from "next";
import { getLanguageAlternates, routeMap, type SiteRouteKey } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { getTouristMarketConfig } from "@/lib/tourist-market";
import { getTouristLandingPagePathPairs } from "@/lib/tourist-landing-page-module";
import {
  getTouristMarketLanguageAlternates,
  getTouristMarketRoutePath,
  touristMarketRouteDefinitions
} from "@/lib/tourist-market-route";
import type { TouristMarketLocale } from "@/lib/cms/tourist-landing-page-adapter";

const indexableRouteKeys: SiteRouteKey[] = [
  "home",
  "menu",
  "about",
  "contact",
  "reservations",
  "promotions",
  "reviews",
  "tourists"
];

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.siteUrl).toString();
}

function getRoutePriority(routeKey: SiteRouteKey) {
  if (routeKey === "home") {
    return 1;
  }

  if (routeKey === "menu") {
    return 0.9;
  }

  if (routeKey === "contact" || routeKey === "reservations" || routeKey === "reviews") {
    return 0.8;
  }

  return 0.75;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const touristRoutes = await getTouristLandingPagePathPairs();
  const marketLocales = Object.keys(touristMarketRouteDefinitions) as TouristMarketLocale[];
  const marketAlternatesByAudience = Object.fromEntries(
    marketLocales.map((marketLocale) => {
      const {
        en: _marketEn,
        "en-GB": _marketEnGb,
        "x-default": _marketDefault,
        ...regionalAlternates
      } = getTouristMarketLanguageAlternates(marketLocale);

      return [getTouristMarketConfig(marketLocale).audience, regionalAlternates];
    })
  );

  const localizedRoutes: MetadataRoute.Sitemap = indexableRouteKeys.flatMap((routeKey) =>
    Object.values(routeMap[routeKey]).map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: getRoutePriority(routeKey),
      alternates: {
        languages: getLanguageAlternates(routeKey)
      }
    }))
  );

  const touristDetailRoutes: MetadataRoute.Sitemap = touristRoutes.flatMap((entry) =>
    Object.values(entry.paths).map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: {
        languages: {
          bg: absoluteUrl(entry.paths.bg),
          en: absoluteUrl(entry.paths.en),
          "bg-BG": absoluteUrl(entry.paths.bg),
          "en-GB": absoluteUrl(entry.paths.en),
          ...(marketAlternatesByAudience[entry.audience] ?? {}),
          "x-default": absoluteUrl(entry.paths.en)
        }
      }
    }))
  );

  const touristMarketRoutes: MetadataRoute.Sitemap = marketLocales.map((marketLocale) => {
    const path = getTouristMarketRoutePath(marketLocale);

    return {
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
      alternates: {
        languages: getTouristMarketLanguageAlternates(marketLocale)
      }
    };
  });

  const hiddenGemRoute: MetadataRoute.Sitemap[number] = {
    url: absoluteUrl("/en/hidden-gem-restaurant-sofia"),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
    alternates: {
      languages: {
        en: absoluteUrl("/en/hidden-gem-restaurant-sofia"),
        "en-GB": absoluteUrl("/en/hidden-gem-restaurant-sofia"),
        "x-default": absoluteUrl("/en/hidden-gem-restaurant-sofia")
      }
    }
  };

  return [
    ...localizedRoutes,
    ...touristDetailRoutes,
    ...touristMarketRoutes,
    hiddenGemRoute
  ];
}
