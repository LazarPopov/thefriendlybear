import type { MetadataRoute } from "next";
import { routeMap } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { getTouristMarketSlug } from "@/lib/tourist-market";
import { getTouristLandingPagePathPairs } from "@/lib/tourist-landing-page-module";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const touristRoutes = await getTouristLandingPagePathPairs();
  const [itSlug, esSlug, elSlug] = await Promise.all([
    getTouristMarketSlug("it"),
    getTouristMarketSlug("es"),
    getTouristMarketSlug("el")
  ]);

  const localizedRoutes: MetadataRoute.Sitemap = Object.values(routeMap).flatMap((entry) =>
    Object.values(entry).map((path) => ({
      url: new URL(path, siteConfig.siteUrl).toString(),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path.includes("/menu") ? 0.9 : 0.8
    }))
  );

  const touristDetailRoutes: MetadataRoute.Sitemap = touristRoutes.flatMap((entry) =>
    Object.values(entry.paths).map((path) => ({
      url: new URL(path, siteConfig.siteUrl).toString(),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  );

  const touristMarketRoutes: MetadataRoute.Sitemap = [
    `/it/${itSlug}`,
    `/es/${esSlug}`,
    `/el/${elSlug}`
  ].map((path) => ({
    url: new URL(path, siteConfig.siteUrl).toString(),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75
  }));

  return [
    {
      url: new URL("/", siteConfig.siteUrl).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6
    },
    ...localizedRoutes,
    ...touristDetailRoutes,
    ...touristMarketRoutes
  ];
}
