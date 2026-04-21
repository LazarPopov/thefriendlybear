import { fetchStrapiCollection } from "@/lib/cms/strapi";
import {
  normalizePromotionEntry,
  type CmsPromotionEntry,
  type FrontendPromotion
} from "@/lib/cms/promotion-adapter";
import type { SiteLocale } from "@/lib/site";

const promotionFallbackEntries: CmsPromotionEntry[] = [
  {
    id: "spring-special-menu",
    slug: {
      bg: "proletno-specialno-menyu",
      en: "special-spring-menu"
    },
    title: {
      bg: "Пролетно специално меню",
      en: "Special Spring Menu"
    },
    summary: {
      bg: "Сезонни предложения с бавно печено агнешко, свежи салати и вегетариански опции.",
      en: "Seasonal offers with slow roasted lamb, fresh salads, and vegetarian options."
    },
    body: {
      bg: "<p>Пролетното меню поставя отпред агнешките предложения, свежите предястия и вегетарианската дроб сарма, така че човек да види бързо какво отличава сезона.</p>",
      en: "<p>The spring menu brings forward the lamb dishes, fresh starters, and vegetarian drob sarma so visitors can understand the seasonal angle quickly.</p>"
    },
    ctaLabel: {
      bg: "Виж менюто",
      en: "See the menu"
    },
    ctaUrl: {
      bg: "/bg/menu",
      en: "/en/menu"
    },
    isEnabled: true
  }
];

function isPromotionActive(promotion: FrontendPromotion, now = new Date()) {
  if (!promotion.isEnabled) {
    return false;
  }

  if (promotion.startsAt && new Date(promotion.startsAt) > now) {
    return false;
  }

  if (promotion.endsAt && new Date(promotion.endsAt) < now) {
    return false;
  }

  return true;
}

export function getPromotionsFallback(locale: SiteLocale) {
  return promotionFallbackEntries
    .map((entry) => normalizePromotionEntry(entry, locale))
    .filter((promotion) => isPromotionActive(promotion));
}

export async function getPromotionsData(locale: SiteLocale): Promise<FrontendPromotion[]> {
  const entries = await fetchStrapiCollection<CmsPromotionEntry>(
    "/api/promotions?filters[isEnabled][$eq]=true&sort[0]=startsAt:desc&populate=*"
  );

  const source = entries.length > 0 ? entries : promotionFallbackEntries;

  return source
    .map((entry) => normalizePromotionEntry(entry, locale))
    .filter((promotion) => isPromotionActive(promotion));
}
