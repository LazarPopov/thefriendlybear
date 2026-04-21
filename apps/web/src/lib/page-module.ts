import { fetchStrapiCollection } from "@/lib/cms/strapi";
import { normalizePageEntry, type CmsPageEntry } from "@/lib/cms/page-adapter";
import { pageContentFallback } from "@/lib/page-content-fallback";
import type { SiteLocale } from "@/lib/site";

function getFallbackPageEntry(key: string) {
  return pageContentFallback.find((entry) => entry.key === key) ?? null;
}

export function getPageContentFallback(key: string, locale: SiteLocale) {
  const fallback = getFallbackPageEntry(key);

  if (!fallback) {
    return null;
  }

  return normalizePageEntry(fallback, locale);
}

export async function getPageContentData(key: string, locale: SiteLocale) {
  const entries = await fetchStrapiCollection<CmsPageEntry>(
    `/api/pages?filters[key][$eq]=${encodeURIComponent(key)}&pagination[pageSize]=1&populate=*`
  );

  const entry = entries[0] ?? getFallbackPageEntry(key);

  if (!entry) {
    return null;
  }

  return normalizePageEntry(entry, locale);
}
