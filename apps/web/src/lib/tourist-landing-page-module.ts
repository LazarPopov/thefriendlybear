import { cache } from "react";
import { fetchStrapiCollection } from "@/lib/cms/strapi";
import {
  getTouristLocalizedSlug,
  normalizeTouristLandingPageEntry,
  type CmsTouristLandingPageEntry,
  type FrontendTouristLandingPage,
  type TouristAudience
} from "@/lib/cms/tourist-landing-page-adapter";
import type { SiteLocale } from "@/lib/site";
import type { BusinessActionKind } from "@/lib/tracking";

export type { FrontendTouristLandingPage, TouristAudience } from "@/lib/cms/tourist-landing-page-adapter";

export type TouristLandingPageMatch = {
  audience: TouristAudience;
  localizedSlugs: Record<SiteLocale, string>;
  page: FrontendTouristLandingPage;
};

const touristAudienceOrder: TouristAudience[] = ["italian", "spanish", "greek"];

const touristLandingPageFallbackEntries: CmsTouristLandingPageEntry[] = [
  {
    audience: "italian",
    slug: { bg: "italian", en: "italian" },
    marketSlug: { it: "ristorante-sofia-centro" },
    title: {
      bg: "Приветливо място в София за италиански посетители",
      en: "A friendly Sofia restaurant for Italian visitors"
    },
    marketTitle: {
      it: "Un'atmosfera magica a Sofia: Giardino e Tradizione"
    },
    intro: {
      bg: "Тази страница е подредена за international travel intent: централна локация, приветливо усещане, ясен достъп до менюто и бързо уверение за вегетариански опции и обслужване.",
      en: "This page is shaped for Italian-speaking travel intent: central location, welcoming atmosphere, clear menu access, and quick reassurance around vegetarian options and service."
    },
    marketIntro: {
      it: "Nascosto dietro l'hotel InterContinental (ex Radisson) nel cuore di Sofia, The Friendly Bear e una baita urbana del 1923 restaurata a mano. Un rifugio perfetto per chi cerca cibo autentico, birra artigianale e calore umano."
    },
    vegetarianMessage: {
      bg: "Вегетарианските опции вече се виждат ясно в менюто, така че човек не трябва да се чуди дали ще има подходящ избор.",
      en: "Vegetarian-friendly choices are already visible in the menu so visitors do not have to wonder whether there is a suitable option."
    },
    marketVegetarianMessage: {
      it: "La cucina bulgara offre splendide alternative vegetariane. Nel nostro menu troverai insalate fresche e piatti caldi chiaramente segnalati."
    },
    serviceMessage: {
      bg: "Тонът и структурата на страницата подчертават приветливо обслужване и лесен mobile path към менюто, контактите и посоките.",
      en: "The structure and tone of the page reinforce welcoming service and an easy mobile path toward menu, contact, and directions."
    },
    marketServiceMessage: {
      it: "Non preoccuparti per la lingua. Il nostro staff parla inglese e il nostro menu disponibile in inglese e facile da consultare sul tuo smartphone."
    },
    primaryCtaLabel: { bg: "Виж менюто", en: "See the menu" },
    marketPrimaryCtaLabel: { it: "Vedi il Menu (English)" },
    marketPrimaryCtaUrl: { it: "/en/menu" },
    primaryCtaUrl: { bg: "/bg/menu", en: "/en/menu" }
  },
  {
    audience: "spanish",
    slug: { bg: "spanish", en: "spanish" },
    marketSlug: { es: "restaurante-centro-sofia" },
    title: {
      bg: "Приветлив ресторант в София за испански посетители",
      en: "A welcoming Sofia restaurant for Spanish visitors"
    },
    intro: {
      bg: "Тази страница е насочена към бързо restaurant discovery около центъра, с ясен път към меню, резервации и упътвания, плюс увереност за любезно обслужване и по-леки опции.",
      en: "This page targets fast restaurant discovery near the center, with a simple path to menu, reservations, and directions plus reassurance around friendly service and lighter food options."
    },
    vegetarianMessage: {
      bg: "Вегетарианските опции не са скрити дълбоко в сайта и могат да се открият бързо още при първия преглед на менюто.",
      en: "Vegetarian options are not buried deep in the site structure and can be found quickly from the first menu scan."
    },
    serviceMessage: {
      bg: "Страницата е написана така, че friendly service да се усеща още преди човек да отвори контактите или резервациите.",
      en: "The page is written so friendly service comes through before the visitor even opens contact or reservations."
    },
    primaryCtaLabel: { bg: "Отвори менюто", en: "Open the menu" },
    primaryCtaUrl: { bg: "/bg/menu", en: "/en/menu" }
  },
  {
    audience: "greek",
    slug: { bg: "greek", en: "greek" },
    title: {
      bg: "Централен ресторант в София за гръцки посетители",
      en: "A central Sofia restaurant for Greek visitors"
    },
    intro: {
      bg: "Тази страница поддържа Greek visitor intent с по-спокоен и welcoming flow, фокусиран върху централна локация, ясни действия, вегетарианско уверение и лесен достъп до менюто.",
      en: "This page supports Greek visitor intent with a calm, welcoming flow focused on central location, straightforward actions, vegetarian reassurance, and easy menu access."
    },
    vegetarianMessage: {
      bg: "Вегетарианските предложения вече са част от менюто и могат да се видят без излишно търсене от мобилен телефон.",
      en: "Vegetarian-friendly choices are already part of the menu content and can be checked quickly from a phone."
    },
    serviceMessage: {
      bg: "Страницата е умишлено проста и приветлива, така че посетителят да стигне бързо до меню, упътвания или резервационен път.",
      en: "The page is intentionally simple and welcoming so the visitor can move quickly toward menu, directions, or the reservation path."
    },
    primaryCtaLabel: { bg: "Към менюто", en: "Go to the menu" },
    primaryCtaUrl: { bg: "/bg/menu", en: "/en/menu" }
  }
];

function sortTouristEntries(entries: CmsTouristLandingPageEntry[]) {
  return [...entries].sort(
    (left, right) => touristAudienceOrder.indexOf(left.audience) - touristAudienceOrder.indexOf(right.audience)
  );
}

function normalizeSlugSegment(value: string) {
  return value.trim().toLowerCase();
}

const getTouristEntries = cache(async () => {
  const entries = await fetchStrapiCollection<CmsTouristLandingPageEntry>(
    "/api/tourist-landing-pages?pagination[pageSize]=20&populate=*"
  );

  return sortTouristEntries(entries.length > 0 ? entries : touristLandingPageFallbackEntries);
});

function createTouristMatch(entry: CmsTouristLandingPageEntry, locale: SiteLocale): TouristLandingPageMatch {
  return {
    audience: entry.audience,
    localizedSlugs: {
      bg: getTouristLocalizedSlug(entry, "bg"),
      en: getTouristLocalizedSlug(entry, "en")
    },
    page: normalizeTouristLandingPageEntry(entry, locale)
  };
}

export async function getTouristLandingPageEntry(audience: TouristAudience) {
  const entries = await getTouristEntries();
  return entries.find((item) => item.audience === audience) ?? null;
}

export function getTouristAudienceLabel(locale: SiteLocale, audience: TouristAudience) {
  const labels = {
    italian: { bg: "Италиански посетители", en: "Italian visitors" },
    spanish: { bg: "Испански посетители", en: "Spanish visitors" },
    greek: { bg: "Гръцки посетители", en: "Greek visitors" }
  } as const;

  return labels[audience][locale];
}

export function getTouristActionKind(href: string, external: boolean): BusinessActionKind {
  if (href.includes("/menu")) {
    return "menu";
  }

  if (href.includes("/reservations")) {
    return "reservations";
  }

  if (href.includes("/contact")) {
    return "contact";
  }

  if (href.includes("google.com/maps") || href.includes("maps.app.goo.gl")) {
    return "directions";
  }

  return external ? "external_booking" : "contact";
}

export async function getTouristLandingPagesData(locale: SiteLocale): Promise<FrontendTouristLandingPage[]> {
  const entries = await getTouristEntries();
  return entries.map((entry) => normalizeTouristLandingPageEntry(entry, locale));
}

export async function getTouristLandingPageData(
  audience: TouristAudience,
  locale: SiteLocale
): Promise<FrontendTouristLandingPage | null> {
  const entry = await getTouristLandingPageEntry(audience);
  return entry ? normalizeTouristLandingPageEntry(entry, locale) : null;
}

export async function getTouristLandingPageDataBySlug(
  locale: SiteLocale,
  slug: string
): Promise<TouristLandingPageMatch | null> {
  const entries = await getTouristEntries();
  const normalizedSlug = normalizeSlugSegment(slug);
  const entry = entries.find(
    (item) => normalizeSlugSegment(getTouristLocalizedSlug(item, locale)) === normalizedSlug
  );

  return entry ? createTouristMatch(entry, locale) : null;
}

export async function getTouristLandingPagePathForAudience(locale: SiteLocale, audience: TouristAudience) {
  const entry = await getTouristLandingPageEntry(audience);
  const slug = entry ? getTouristLocalizedSlug(entry, locale) : audience;

  return `/${locale}/tourists/${slug}`;
}

export async function getTouristLandingPagePathPairs() {
  const entries = await getTouristEntries();

  return entries.map((entry) => ({
    audience: entry.audience,
    paths: {
      bg: `/bg/tourists/${getTouristLocalizedSlug(entry, "bg")}`,
      en: `/en/tourists/${getTouristLocalizedSlug(entry, "en")}`
    }
  }));
}
