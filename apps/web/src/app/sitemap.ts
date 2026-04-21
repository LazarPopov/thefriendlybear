import type { MetadataRoute } from "next";
import { getLanguageAlternates, routeMap, type SiteRouteKey } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { getTouristMarketSlug } from "@/lib/tourist-market";
import { getTouristLandingPagePathPairs } from "@/lib/tourist-landing-page-module";

const indexableRouteKeys: SiteRouteKey[] = ["home", "menu", "about", "contact", "reviews", "tourists"];

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

  if (routeKey === "contact" || routeKey === "reviews") {
    return 0.8;
  }

  return 0.75;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const touristRoutes = await getTouristLandingPagePathPairs();
  const [itSlug, esSlug, elSlug] = await Promise.all([
    getTouristMarketSlug("it"),
    getTouristMarketSlug("es"),
    getTouristMarketSlug("el")
  ]);

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
          "x-default": absoluteUrl(entry.paths.en)
        }
      }
    }))
  );

  const touristMarketRoutes: MetadataRoute.Sitemap = [
    {
      path: `/it/${itSlug}`,
      languages: {
        it: absoluteUrl(`/it/${itSlug}`),
        en: absoluteUrl("/en/tourists/italian"),
        "x-default": absoluteUrl("/en/tourists/italian")
      }
    },
    {
      path: `/es/${esSlug}`,
      languages: {
        es: absoluteUrl(`/es/${esSlug}`),
        en: absoluteUrl("/en/tourists/spanish"),
        "x-default": absoluteUrl("/en/tourists/spanish")
      }
    },
    {
      path: `/el/${elSlug}`,
      languages: {
        el: absoluteUrl(`/el/${elSlug}`),
        en: absoluteUrl("/en/tourists/greek"),
        "x-default": absoluteUrl("/en/tourists/greek")
      }
    }
  ].map(({ path, languages }) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
      alternates: {
        languages
      }
  }));

  return [
    ...localizedRoutes,
    ...touristDetailRoutes,
    ...touristMarketRoutes
  ];
}
