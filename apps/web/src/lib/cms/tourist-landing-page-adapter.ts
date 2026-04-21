import type { SiteLocale } from "@/lib/site";

export type TouristAudience = "italian" | "spanish" | "greek";
export type TouristMarketLocale = "it" | "es" | "el";

type SiteLocalizedText = Partial<Record<SiteLocale, string>>;
type MarketLocalizedText = Partial<Record<TouristMarketLocale, string>>;

export type CmsTouristLandingPageEntry = {
  audience: TouristAudience;
  slug: SiteLocalizedText;
  marketSlug?: MarketLocalizedText;
  title: SiteLocalizedText;
  marketTitle?: MarketLocalizedText;
  intro: SiteLocalizedText;
  marketIntro?: MarketLocalizedText;
  vegetarianMessage?: SiteLocalizedText;
  marketVegetarianMessage?: MarketLocalizedText;
  serviceMessage?: SiteLocalizedText;
  marketServiceMessage?: MarketLocalizedText;
  primaryCtaLabel?: SiteLocalizedText;
  marketPrimaryCtaLabel?: MarketLocalizedText;
  primaryCtaUrl?: SiteLocalizedText;
  marketPrimaryCtaUrl?: MarketLocalizedText;
};

export type FrontendTouristLandingPage = {
  audience: TouristAudience;
  slug: string;
  title: string;
  intro: string;
  vegetarianMessage: string;
  serviceMessage: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
};

function getLocalizedValue<T extends string>(
  value: Partial<Record<T, string>> | undefined,
  locale: T,
  fallback: string
) {
  const localizedValue = value?.[locale];
  return typeof localizedValue === "string" && localizedValue.trim() ? localizedValue.trim() : fallback;
}

export function getTouristLocalizedSlug(entry: CmsTouristLandingPageEntry, locale: SiteLocale) {
  return getLocalizedValue(entry.slug, locale, entry.audience);
}

export function getTouristMarketLocalizedSlug(
  entry: CmsTouristLandingPageEntry,
  marketLocale: TouristMarketLocale
) {
  return getLocalizedValue(entry.marketSlug, marketLocale, getTouristLocalizedSlug(entry, "en"));
}

export function normalizeTouristLandingPageEntry(
  entry: CmsTouristLandingPageEntry,
  locale: SiteLocale
): FrontendTouristLandingPage {
  return {
    audience: entry.audience,
    slug: getTouristLocalizedSlug(entry, locale),
    title: getLocalizedValue(entry.title, locale, "Visitor page"),
    intro: getLocalizedValue(entry.intro, locale, ""),
    vegetarianMessage: getLocalizedValue(entry.vegetarianMessage, locale, ""),
    serviceMessage: getLocalizedValue(entry.serviceMessage, locale, ""),
    primaryCtaLabel: getLocalizedValue(entry.primaryCtaLabel, locale, "See the menu"),
    primaryCtaUrl: getLocalizedValue(entry.primaryCtaUrl, locale, locale === "bg" ? "/bg/menu" : "/en/menu")
  };
}

export function normalizeTouristMarketLandingPageEntry(
  entry: CmsTouristLandingPageEntry,
  marketLocale: TouristMarketLocale
): FrontendTouristLandingPage {
  const englishFallback = normalizeTouristLandingPageEntry(entry, "en");

  return {
    audience: entry.audience,
    slug: getTouristMarketLocalizedSlug(entry, marketLocale),
    title: getLocalizedValue(entry.marketTitle, marketLocale, englishFallback.title),
    intro: getLocalizedValue(entry.marketIntro, marketLocale, englishFallback.intro),
    vegetarianMessage: getLocalizedValue(
      entry.marketVegetarianMessage,
      marketLocale,
      englishFallback.vegetarianMessage
    ),
    serviceMessage: getLocalizedValue(entry.marketServiceMessage, marketLocale, englishFallback.serviceMessage),
    primaryCtaLabel: getLocalizedValue(
      entry.marketPrimaryCtaLabel,
      marketLocale,
      englishFallback.primaryCtaLabel
    ),
    primaryCtaUrl: getLocalizedValue(entry.marketPrimaryCtaUrl, marketLocale, englishFallback.primaryCtaUrl)
  };
}
