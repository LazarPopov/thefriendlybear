import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { getTouristMarketConfig, getTouristMarketPageData, type TouristMarketLocale } from "@/lib/tourist-market";

type TouristMarketRouteDefinition = {
  pathPrefix: string;
  slug: string;
  title: string;
  description: string;
  inLanguage: string;
  regionalCode: string;
  breadcrumbName: string;
  restaurantDescription: string;
  knowsLanguage: string[];
};

export const touristMarketRouteDefinitions: Record<TouristMarketLocale, TouristMarketRouteDefinition> = {
  it: {
    pathPrefix: "it",
    slug: "ristorante-sofia-centro",
    title: "Dove Mangiare Bene a Sofia Centro | The Friendly Bear",
    description:
      "Ristorante tipico nel centro di Sofia per italiani: giardino nascosto, atmosfera retro, slow-roasted lamb, panino con lingua di vitello e drink prima della nightlife.",
    inLanguage: "it-IT",
    regionalCode: "it-IT",
    breadcrumbName: "Guida per visitatori italiani",
    restaurantDescription:
      "Un ristorante accogliente nel centro di Sofia con giardino, interni retro, piatti lenti e atmosfera ideale prima della serata.",
    knowsLanguage: ["en", "bg", "it"]
  },
  es: {
    pathPrefix: "es",
    slug: "restaurante-centro-sofia",
    title: "Dónde Comer en Sofía Centro | The Friendly Bear",
    description:
      "Restaurante con encanto en el centro de Sofía: casa de 1923, refugio retro, jardín escondido, cena hasta las 23:00 y Baileys Crème Brûlée.",
    inLanguage: "es-ES",
    regionalCode: "es-ES",
    breadcrumbName: "Guía para visitantes españoles",
    restaurantDescription:
      "Un restaurante acogedor en el centro de Sofía para cenar comida búlgara, con jardín, interior retro y postres memorables.",
    knowsLanguage: ["en", "bg", "es"]
  },
  el: {
    pathPrefix: "el",
    slug: "estiatorio-sofia-kentro",
    title: "Καλύτερα Εστιατόρια Σόφια Κέντρο | The Friendly Bear",
    description:
      "Φαγητό στη Σόφια για weekend dining: κρυφός κήπος, ψαρόσουπα, αργοψημένο αρνί με μανιτάρια και ζεστή φιλοξενία στο κέντρο.",
    inLanguage: "el-GR",
    regionalCode: "el-GR",
    breadcrumbName: "Οδηγός για Έλληνες επισκέπτες",
    restaurantDescription:
      "Ένα ζεστό εστιατόριο στο κέντρο της Σόφιας με κήπο, ψαρόσουπα, αργοψημένο αρνί και παραδοσιακή κουζίνα.",
    knowsLanguage: ["en", "bg", "el"]
  },
  de: {
    pathPrefix: "de",
    slug: "restaurant-sofia-zentrum",
    title: "Gute Restaurants Sofia Zentrum | The Friendly Bear",
    description:
      "Authentisches Restaurant in Sofia Zentrum ohne Tourist-Trap-Gefühl: Retro-Interieur, ruhiger Hof, langsam gegartes Lamm mit Pilzen und frische Salate.",
    inLanguage: "de-DE",
    regionalCode: "de-DE",
    breadcrumbName: "Guide für deutsche Gäste",
    restaurantDescription:
      "Ein authentisches Restaurant im Zentrum Sofias mit ruhigem Hof, Retro-Interieur, langsam gegartem Lamm und frischen Salaten.",
    knowsLanguage: ["en", "bg", "de"]
  },
  ro: {
    pathPrefix: "ro",
    slug: "restaurante-centru-sofia",
    title: "Unde Mâncăm în Sofia Centru | The Friendly Bear",
    description:
      "Restaurant bun în centrul Sofiei pentru city break sau tranzit: porții consistente, sandviș cu limbă de vițel, miel copt lent și grădină ascunsă.",
    inLanguage: "ro-RO",
    regionalCode: "ro-RO",
    breadcrumbName: "Ghid pentru vizitatori români",
    restaurantDescription:
      "Un restaurant primitor în centrul Sofiei, cu mâncare consistentă, grădină ascunsă, interior retro și servicii în engleză.",
    knowsLanguage: ["en", "bg", "ro"]
  },
  "en-gb": {
    pathPrefix: "en-gb",
    slug: "traditional-restaurant-sofia",
    title: "Traditional Bulgarian Food Sofia Centre | The Friendly Bear",
    description:
      "Traditional Bulgarian food in Sofia for UK visitors: English-speaking staff, proper comfort food, slow-roasted lamb, veal tongue sandwich and friendly service.",
    inLanguage: "en-GB",
    regionalCode: "en-GB",
    breadcrumbName: "UK visitor guide",
    restaurantDescription:
      "A welcoming central Sofia restaurant for UK visitors, with English-speaking staff, hearty comfort food and a cosy retro atmosphere.",
    knowsLanguage: ["en", "bg"]
  }
};

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.siteUrl).toString();
}

export function getTouristMarketRouteDefinition(marketLocale: TouristMarketLocale) {
  return touristMarketRouteDefinitions[marketLocale];
}

export function getTouristMarketRoutePath(marketLocale: TouristMarketLocale) {
  const definition = getTouristMarketRouteDefinition(marketLocale);

  return `/${definition.pathPrefix}/${definition.slug}`;
}

export function getTouristMarketLanguageAlternates(marketLocale: TouristMarketLocale) {
  const definition = getTouristMarketRouteDefinition(marketLocale);
  const config = getTouristMarketConfig(marketLocale);
  const marketPath = getTouristMarketRoutePath(marketLocale);
  const englishAudiencePath = `/en/tourists/${config.audience}`;

  return {
    [definition.pathPrefix]: absoluteUrl(marketPath),
    [definition.regionalCode]: absoluteUrl(marketPath),
    en: absoluteUrl(englishAudiencePath),
    "en-GB": marketLocale === "en-gb" ? absoluteUrl(marketPath) : absoluteUrl(englishAudiencePath),
    "x-default": absoluteUrl(englishAudiencePath)
  };
}

export async function buildTouristMarketMetadata(
  marketLocale: TouristMarketLocale,
  requestedSlug: string
): Promise<Metadata> {
  const page = await getTouristMarketPageData(marketLocale);

  if (!page) {
    return {};
  }

  const definition = getTouristMarketRouteDefinition(marketLocale);
  const canonicalPath = getTouristMarketRoutePath(marketLocale);
  const canonicalUrl = absoluteUrl(canonicalPath);

  if (requestedSlug !== definition.slug) {
    return {
      alternates: {
        canonical: canonicalUrl
      }
    };
  }

  const socialImage = absoluteUrl("/icons/friendly_bear_logo.jpg");

  return {
    title: definition.title,
    description: definition.description,
    alternates: {
      canonical: canonicalUrl,
      languages: getTouristMarketLanguageAlternates(marketLocale)
    },
    openGraph: {
      title: definition.title,
      description: definition.description,
      url: canonicalUrl,
      siteName: "The Friendly Bear Sofia",
      locale: getTouristMarketConfig(marketLocale).ogLocale,
      type: "website",
      images: [
        {
          url: socialImage,
          width: 320,
          height: 320,
          alt: "The Friendly Bear Sofia logo"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: definition.title,
      description: definition.description,
      images: [socialImage]
    }
  };
}

export function getTouristMarketRestaurantSchema(marketLocale: TouristMarketLocale) {
  const definition = getTouristMarketRouteDefinition(marketLocale);
  const pageUrl = absoluteUrl(getTouristMarketRoutePath(marketLocale));

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${siteConfig.siteUrl}/#restaurant`,
    name: "The Friendly Bear Sofia",
    description: definition.restaurantDescription,
    image: absoluteUrl("/icons/friendly_bear_logo.jpg"),
    logo: absoluteUrl("/icons/friendly_bear_logo.jpg"),
    telephone: "+359876122114",
    priceRange: "$$",
    servesCuisine: ["Bulgarian", "European"],
    knowsLanguage: definition.knowsLanguage,
    url: pageUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Slavyanska 23",
      addressLocality: "Sofia",
      postalCode: "1000",
      addressCountry: "BG"
    }
  };
}

export function getTouristMarketPageSchema(marketLocale: TouristMarketLocale) {
  const definition = getTouristMarketRouteDefinition(marketLocale);
  const pageUrl = absoluteUrl(getTouristMarketRoutePath(marketLocale));
  const breadcrumbId = `${pageUrl}#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/en")
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Sofia visitor guide",
            item: absoluteUrl("/en/tourists")
          },
          {
            "@type": "ListItem",
            position: 3,
            name: definition.breadcrumbName,
            item: pageUrl
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: definition.title,
        description: definition.description,
        inLanguage: definition.inLanguage,
        breadcrumb: {
          "@id": breadcrumbId
        },
        about: {
          "@id": `${siteConfig.siteUrl}/#restaurant`
        },
        mainEntity: {
          "@id": `${siteConfig.siteUrl}/#restaurant`
        }
      }
    ]
  };
}
