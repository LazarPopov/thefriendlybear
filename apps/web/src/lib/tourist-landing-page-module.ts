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
      bg: "Уютно място в центъра на София за италиански гости, с тайна градина, крафт бира и меню на английски.",
      en: "A cozy place in central Sofia for Italian visitors, with a secret garden, craft beer, and an English menu."
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
      bg: "Екипът говори английски и ще ви помогне с менюто, упътванията или резервацията.",
      en: "Our team speaks English and can help with the menu, directions, or your reservation."
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
      bg: "Историческо място в София за испански посетители",
      en: "A historic Sofia refuge for Spanish visitors"
    },
    marketTitle: {
      es: "Un refugio con historia en el corazón de Sofía"
    },
    intro: {
      bg: "Уютен ресторант в къща от 1923 г. на ул. Славянска 23, с градина, топъл интериор и спокойна атмосфера за вечеря след разходка в центъра.",
      en: "A warm restaurant in a 1923 house on Slavyanska 23, with a secret garden, cozy interior, and an easy place to relax after exploring central Sofia."
    },
    marketIntro: {
      es: "Ubicado en una cabaña urbana de 1923 en la calle Slavyanska 23, The Friendly Bear es el lugar ideal para relajarse. Disfruta de nuestro jardín secreto o de la calidez de nuestra chimenea mientras pruebas lo mejor de la cocina local."
    },
    vegetarianMessage: {
      bg: "В менюто има свежи салати и топли вегетариански ястия, ясно описани за гостите, които търсят по-леки опции.",
      en: "The menu includes fresh salads and warm vegetarian dishes, clearly described for guests looking for lighter options."
    },
    marketVegetarianMessage: {
      es: "No todo es carne. Tenemos una variada selección de ensaladas frescas y platos vegetarianos calientes claramente indicados en nuestra carta."
    },
    serviceMessage: {
      bg: "Екипът говори английски, а менюто е лесно за преглед от телефон, за да се чувствате спокойни още преди да дойдете.",
      en: "The team speaks English, and the menu is easy to check from your phone, so you can feel comfortable before you arrive."
    },
    marketServiceMessage: {
      es: "Queremos que te sientas como en casa. Nuestro equipo habla inglés con fluidez y nuestro menú digital está disponible en inglés para tu comodidad."
    },
    primaryCtaLabel: { bg: "Отвори менюто", en: "Open the menu" },
    marketPrimaryCtaLabel: { es: "Ver el Menú (English)" },
    marketPrimaryCtaUrl: { es: "/en/menu" },
    primaryCtaUrl: { bg: "/bg/menu", en: "/en/menu" }
  },
  {
    audience: "greek",
    slug: { bg: "greek", en: "greek" },
    marketSlug: { el: "estiatorio-sofia-kentro" },
    title: {
      bg: "Топъл ресторант в София за гръцки посетители",
      en: "A warm Sofia restaurant for Greek visitors"
    },
    marketTitle: {
      el: "Μια ζεστή γωνιά με ιστορία στην καρδιά της Σόφιας"
    },
    intro: {
      bg: "Уютно място в къща от 1923 г. на Славянска 23, с градина, камина, автентична храна и спокоен път към менюто и резервацията.",
      en: "A cozy place in a 1923 house on Slavyanska 23, with a garden, fireplace, authentic food, and an easy path to the menu and reservation."
    },
    marketIntro: {
      el: "Κρυμμένο πίσω από το ξενοδοχείο InterContinental στο κέντρο της Σόφιας (Slavyanska 23), το The Friendly Bear στεγάζεται σε μια παραδοσιακή οικία του 1923. Απολαύστε τον κρυφό μας κήπο ή τη ζεστασιά του τζακιού μας με αυθεντικό φαγητό και εξαιρετικές μπύρες."
    },
    vegetarianMessage: {
      bg: "Вегетарианските предложения вече са част от менюто и могат да се видят без излишно търсене от мобилен телефон.",
      en: "Vegetarian-friendly choices are already part of the menu content and can be checked quickly from a phone."
    },
    marketVegetarianMessage: {
      el: "Διαθέτουμε μεγάλη ποικιλία από φρέσκες σαλάτες και ζεστά χορτοφαγικά πιάτα, όλα ξεκάθαρα σημειωμένα στο μενού μας."
    },
    serviceMessage: {
      bg: "Нашият екип говори английски и ще ви посрещне спокойно, независимо дали идвате за обяд, вечеря или бира в градината.",
      en: "Our team speaks English and will welcome you warmly, whether you come for lunch, dinner, or a beer in the garden."
    },
    marketServiceMessage: {
      el: "Θέλουμε να νιώθετε άνετα. Το προσωπικό μας μιλάει άπταιστα αγγλικά και το ψηφιακό μας μενού είναι διαθέσιμο στα αγγλικά για τη διευκόλυνσή σας."
    },
    primaryCtaLabel: { bg: "Към менюто", en: "Go to the menu" },
    marketPrimaryCtaLabel: { el: "Δείτε το Μενού (English)" },
    marketPrimaryCtaUrl: { el: "/en/menu" },
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
