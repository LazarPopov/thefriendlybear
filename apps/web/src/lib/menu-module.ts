import { fetchStrapiCollection } from "@/lib/cms/strapi";
import {
  normalizeMenuSections,
  type CmsMenuCategoryEntry,
  type CmsMenuItemEntry,
  type FrontendSeasonalMenu
} from "@/lib/cms/menu-adapter";
import { springMenuContent } from "@/lib/spring-menu-content";
import type { SiteLocale } from "@/lib/site";

export function getSeasonalMenuFallback(locale: SiteLocale): FrontendSeasonalMenu {
  return springMenuContent[locale];
}

export async function getSeasonalMenuData(locale: SiteLocale): Promise<FrontendSeasonalMenu> {
  const fallback = getSeasonalMenuFallback(locale);

  const [categories, items] = await Promise.all([
    fetchStrapiCollection<CmsMenuCategoryEntry>(
      "/api/menu-categories?filters[isActive][$eq]=true&sort[0]=sortOrder:asc"
    ),
    fetchStrapiCollection<CmsMenuItemEntry>("/api/menu-items?sort[0]=sortOrder:asc")
  ]);

  const sections = normalizeMenuSections(locale, categories, items);

  if (sections.length === 0) {
    return fallback;
  }

  return {
    ...fallback,
    sections
  };
}
