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

const touristAudienceOrder: TouristAudience[] = ["italian", "spanish", "greek", "german", "romanian", "uk"];

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
      it: "Dove mangiare bene a Sofia prima della serata"
    },
    intro: {
      bg: "Уютно място в центъра на София за италиански гости, със скрита градина, бавно готвени меса, вегетариански предложения и меню на английски.",
      en: "A cozy place in central Sofia for Italian visitors, with a hidden garden, slow-cooked meats, vegetarian dishes, and an English menu."
    },
    marketIntro: {
      it: "Nascosto dietro l'hotel Radisson, nel cuore di Sofia, The Friendly Bear e una casa urbana del 1923 con giardino, sale retro leggermente sotterranee e un'atmosfera perfetta per cena, drink, sport in TV e nightlife."
    },
    vegetarianMessage: {
      bg: "Вегетарианските опции вече се виждат ясно в менюто, така че човек не трябва да се чуди дали ще има подходящ избор.",
      en: "Vegetarian-friendly choices are already visible in the menu so visitors do not have to wonder whether there is a suitable option."
    },
    marketVegetarianMessage: {
      it: "Oltre alle insalate fresche, il menu mette in evidenza piatti memorabili come il panino con lingua di vitello e cipolle caramellate e l'agnello cotto lentamente con funghi."
    },
    serviceMessage: {
      bg: "Екипът говори английски и ще ви помогне с менюто, упътванията или резервацията.",
      en: "Our team speaks English and can help with the menu, directions, or your reservation."
    },
    marketServiceMessage: {
      it: "Altamente consigliato da viaggiatori italiani a Sofia: staff che parla inglese, menu facile da consultare e un'atmosfera calda prima di uscire nel centro."
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
      es: "Dónde comer en Sofía: un refugio con encanto"
    },
    intro: {
      bg: "Уютен ресторант в къща от 1923 г. на ул. Славянска 23, с градина, топъл интериор, бавно готвени меса и спокойна атмосфера за вечеря след разходка в центъра.",
      en: "A warm restaurant in a 1923 house on Slavyanska 23, with a garden, cozy interior, slow-cooked meats, and an easy place to relax after exploring central Sofia."
    },
    marketIntro: {
      es: "Ubicado en una casa urbana de 1923 en la calle Slavyanska 23, The Friendly Bear es un refugio acogedor, ligeramente subterráneo y retro para socializar después de un día largo por Sofía."
    },
    vegetarianMessage: {
      bg: "В менюто има свежи салати и топли вегетариански ястия, ясно описани за гостите, които търсят по-леки опции.",
      en: "The menu includes fresh salads and warm vegetarian dishes, clearly described for guests looking for lighter options."
    },
    marketVegetarianMessage: {
      es: "No todo es carne. Hay ensaladas frescas, platos vegetarianos calientes y especialidades como el cordero cocinado lentamente con setas."
    },
    serviceMessage: {
      bg: "Екипът говори английски, а менюто е лесно за преглед от телефон, за да се чувствате спокойни още преди да дойдете.",
      en: "The team speaks English, and the menu is easy to check from your phone, so you can feel comfortable before you arrive."
    },
    marketServiceMessage: {
      es: "Abierto hasta las 23:00, con equipo que habla inglés y el Baileys Crème Brûlée como final perfecto para una cena tarde en el centro."
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
      el: "Καλύτερα εστιατόρια Σόφια για ένα χαλαρό Σαββατοκύριακο"
    },
    intro: {
      bg: "Уютно място в къща от 1923 г. на Славянска 23, с градина, топли вътрешни зали, автентична храна и спокоен път към менюто и резервацията.",
      en: "A cozy place in a 1923 house on Slavyanska 23, with a garden, warm dining rooms, authentic food, and an easy path to the menu and reservation."
    },
    marketIntro: {
      el: "Κρυμμένο πίσω από το Radisson στο κέντρο της Σόφιας, το The Friendly Bear είναι ιδανικό για μεγάλο, χαλαρό γεύμα ή δείπνο στον κήπο σε ένα weekend getaway."
    },
    vegetarianMessage: {
      bg: "Вегетарианските предложения вече са част от менюто и могат да се видят без излишно търсене от мобилен телефон.",
      en: "Vegetarian-friendly choices are already part of the menu content and can be checked quickly from a phone."
    },
    marketVegetarianMessage: {
      el: "Στο μενού θα βρείτε ψαρόσουπα, αργοψημένο αρνί με μανιτάρια, φρέσκες σαλάτες και ζεστά χορτοφαγικά πιάτα."
    },
    serviceMessage: {
      bg: "Нашият екип говори английски и ще ви посрещне спокойно, независимо дали идвате за обяд, вечеря или бира в градината.",
      en: "Our team speaks English and will welcome you warmly, whether you come for lunch, dinner, or a beer in the garden."
    },
    marketServiceMessage: {
      el: "Θέλουμε να νιώθετε άνετα: αγγλόφωνο προσωπικό, εύκολο ψηφιακό μενού και ζεστή φιλοξενία για παρέες από τη Θεσσαλονίκη, τη Βόρεια Ελλάδα και όλη την Ελλάδα."
    },
    primaryCtaLabel: { bg: "Към менюто", en: "Go to the menu" },
    marketPrimaryCtaLabel: { el: "Δείτε το Μενού (English)" },
    marketPrimaryCtaUrl: { el: "/en/menu" },
    primaryCtaUrl: { bg: "/bg/menu", en: "/en/menu" }
  },
  {
    audience: "german",
    slug: { bg: "german", en: "german" },
    marketSlug: { de: "restaurant-sofia-zentrum" },
    title: {
      bg: "Автентичен ресторант в София за германски посетители",
      en: "An authentic Sofia restaurant for German visitors"
    },
    marketTitle: {
      de: "Gute Restaurants Sofia: Authentisch essen im Zentrum"
    },
    intro: {
      bg: "Централно място за гости от Германия, които търсят качество, спокойна атмосфера и автентична кухня без усещане за туристически капан.",
      en: "A central Sofia restaurant for German visitors looking for quality food, calm atmosphere, and an authentic experience without a tourist-trap feel."
    },
    marketIntro: {
      de: "The Friendly Bear liegt in einer Stadtvilla von 1923 an der Slavyanska 23. Das leicht unterirdische Retro-Interieur, die Teppichwand und der ruhige Hof wirken echt, lokal und ungekünstelt."
    },
    vegetarianMessage: {
      bg: "Свежите салати и зеленчуковите ястия дават по-лека опция към бавно готвените специалитети.",
      en: "Fresh salads and vegetable-led plates provide lighter options alongside the slow-cooked specialties."
    },
    marketVegetarianMessage: {
      de: "Frische Salate, sorgfältig zubereitete Beilagen und saisonale Zutaten ergänzen das langsam gegarte Lamm mit Pilzen."
    },
    serviceMessage: {
      bg: "Екипът говори английски и може да помогне с менюто, упътванията и резервацията.",
      en: "The team speaks English and can help with the menu, directions, or reservation."
    },
    marketServiceMessage: {
      de: "Unser Team spricht Englisch, das Menü ist leicht vom Smartphone aus zu öffnen, und der Hof bleibt ein ruhiger Ort zum Ankommen und Entspannen."
    },
    primaryCtaLabel: { bg: "Виж менюто", en: "See the menu" },
    marketPrimaryCtaLabel: { de: "Speisekarte öffnen (English)" },
    marketPrimaryCtaUrl: { de: "/en/menu" },
    primaryCtaUrl: { bg: "/bg/menu", en: "/en/menu" }
  },
  {
    audience: "romanian",
    slug: { bg: "romanian", en: "romanian" },
    marketSlug: { ro: "restaurante-centru-sofia" },
    title: {
      bg: "Сърдечен ресторант в София за румънски посетители",
      en: "A hearty Sofia restaurant for Romanian visitors"
    },
    marketTitle: {
      ro: "Unde mâncăm în Sofia: comfort food în centru"
    },
    intro: {
      bg: "Удобна спирка в центъра на София за уикенд пътуване или транзит, с щедри порции, бавно готвени меса и топло обслужване.",
      en: "A convenient central Sofia stop for weekend breaks or transit, with generous comfort food, slow-cooked meats, and warm service."
    },
    marketIntro: {
      ro: "The Friendly Bear este o oprire sățioasă chiar în centrul Sofiei, pe Slavyanska 23, cu grădină ascunsă, interior retro și mâncare consistentă după drum."
    },
    vegetarianMessage: {
      bg: "Има свежи салати и по-леки избори, но страницата извежда напред богатите и засищащи специалитети.",
      en: "Fresh salads and lighter choices are available, while the page foregrounds generous, filling house specialties."
    },
    marketVegetarianMessage: {
      ro: "Caută sandvișul cu limbă de vițel și ceapă caramelizată, mielul copt lent cu ciuperci, supele calde și salatele proaspete."
    },
    serviceMessage: {
      bg: "Английското обслужване и ясните упътвания правят посещението лесно за кратък престой.",
      en: "English-speaking service and clear directions make the visit easy during a short stay."
    },
    marketServiceMessage: {
      ro: "Echipa vorbește engleză, meniul se deschide ușor pe telefon, iar atmosfera este primitoare pentru prânz, cină sau o oprire de tranzit."
    },
    primaryCtaLabel: { bg: "Отвори менюто", en: "Open the menu" },
    marketPrimaryCtaLabel: { ro: "Deschide meniul (English)" },
    marketPrimaryCtaUrl: { ro: "/en/menu" },
    primaryCtaUrl: { bg: "/bg/menu", en: "/en/menu" }
  },
  {
    audience: "uk",
    slug: { bg: "uk", en: "uk" },
    marketSlug: { "en-gb": "traditional-restaurant-sofia" },
    title: {
      bg: "Традиционен ресторант в София за гости от Великобритания",
      en: "A traditional Sofia restaurant for UK visitors"
    },
    marketTitle: {
      "en-gb": "Traditional Bulgarian food in Sofia with a proper welcome"
    },
    intro: {
      bg: "Приветлив ресторант в центъра на София за уикенд пътувания, ски преходи и групови вечери, с ясна комуникация на английски.",
      en: "A welcoming central Sofia restaurant for weekend breaks, ski stopovers, and group dinners, with clear English-speaking service."
    },
    marketIntro: {
      "en-gb": "The Friendly Bear is a cosy central Sofia restaurant for proper comfort food, good drinks and a friendly attitude before a night out, a ski transfer or a relaxed group dinner."
    },
    vegetarianMessage: {
      bg: "Менюто включва свежи салати и вегетариански варианти, но за британски гости водещи са богатите comfort food предложения.",
      en: "The menu includes fresh salads and vegetarian options, while the UK page leads with hearty comfort food."
    },
    marketVegetarianMessage: {
      "en-gb": "Go for slow-roasted lamb with mushrooms, the veal tongue sandwich with caramelised onions, fish soup, and Baileys Crème Brûlée when you want something memorable."
    },
    serviceMessage: {
      bg: "Екипът говори английски, което намалява напрежението за групи и кратки градски престои.",
      en: "English-speaking staff reduce friction for groups, weekend visitors, and travellers passing through Sofia."
    },
    marketServiceMessage: {
      "en-gb": "Our team speaks English and keeps the atmosphere friendly, relaxed and danger-free for couples, groups and solo travellers."
    },
    primaryCtaLabel: { bg: "Виж менюто", en: "See the menu" },
    marketPrimaryCtaLabel: { "en-gb": "See the Menu" },
    marketPrimaryCtaUrl: { "en-gb": "/en/menu" },
    primaryCtaUrl: { bg: "/bg/menu", en: "/en/menu" }
  }
];

function sortTouristEntries(entries: CmsTouristLandingPageEntry[]) {
  return [...entries].sort(
    (left, right) => {
      const leftIndex = touristAudienceOrder.indexOf(left.audience);
      const rightIndex = touristAudienceOrder.indexOf(right.audience);

      return (
        (leftIndex === -1 ? touristAudienceOrder.length : leftIndex) -
        (rightIndex === -1 ? touristAudienceOrder.length : rightIndex)
      );
    }
  );
}

function normalizeSlugSegment(value: string) {
  return value.trim().toLowerCase();
}

function mergeWithFallbackEntries(entries: CmsTouristLandingPageEntry[]) {
  const entriesByAudience = new Map<TouristAudience, CmsTouristLandingPageEntry>();

  touristLandingPageFallbackEntries.forEach((entry) => {
    entriesByAudience.set(entry.audience, entry);
  });

  entries.forEach((entry) => {
    entriesByAudience.set(entry.audience, entry);
  });

  return Array.from(entriesByAudience.values());
}

const getTouristEntries = cache(async () => {
  const entries = await fetchStrapiCollection<CmsTouristLandingPageEntry>(
    "/api/tourist-landing-pages?pagination[pageSize]=20&populate=*"
  );

  return sortTouristEntries(mergeWithFallbackEntries(entries));
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
    greek: { bg: "Гръцки посетители", en: "Greek visitors" },
    german: { bg: "Германски посетители", en: "German visitors" },
    romanian: { bg: "Румънски посетители", en: "Romanian visitors" },
    uk: { bg: "Гости от Великобритания", en: "UK visitors" }
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
