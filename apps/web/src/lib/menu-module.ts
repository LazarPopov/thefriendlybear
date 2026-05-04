import type { FrontendSeasonalMenu } from "@/lib/cms/menu-adapter";
import { fetchPublishedSeasonalMenuPayload } from "@/lib/content-supabase";
import { springMenuContent } from "@/lib/spring-menu-content";
import type { SiteLocale } from "@/lib/site";

export function getSeasonalMenuFallback(locale: SiteLocale): FrontendSeasonalMenu {
  return springMenuContent[locale];
}

export async function getSeasonalMenuData(locale: SiteLocale): Promise<FrontendSeasonalMenu> {
  const fallback = getSeasonalMenuFallback(locale);
  const publishedMenu = await fetchPublishedSeasonalMenuPayload();
  return publishedMenu?.[locale] ?? fallback;
}
