import { siteConfig, type SiteLocale } from "@/lib/site";
import {
  businessProfile,
  getBusinessProfileData,
  hasOpeningHours,
  type FrontendBusinessProfile
} from "@/lib/business-profile-module";
import type { FrontendSeasonalMenu } from "@/lib/cms/menu-adapter";
import { getSeasonalMenuData, getSeasonalMenuFallback } from "@/lib/menu-module";

type JsonLd = Record<string, unknown>;

const localeMeta: Record<
  SiteLocale,
  { language: string; homePath: string; menuPath: string; contactPath: string }
> = {
  bg: {
    language: "bg-BG",
    homePath: "/bg",
    menuPath: "/bg/menu",
    contactPath: "/bg/contact"
  },
  en: {
    language: "en",
    homePath: "/en",
    menuPath: "/en/menu",
    contactPath: "/en/contact"
  }
};

const restaurantId = `${siteConfig.siteUrl}/#restaurant`;
const websiteId = `${siteConfig.siteUrl}/#website`;
const restaurantSameAs = [
  "https://www.instagram.com/friendlybear.bg/",
  "https://www.facebook.com/friendlybear.bg/"
];
const restaurantFounder = [
  {
    "@type": "Person",
    "@id": `${siteConfig.siteUrl}/#founder_jana`,
    name: "Jana (Zhana) Ivanova",
    jobTitle: "Founder & Culinary Expert",
    sameAs: ["https://www.mish-mash.recipes/p/blog-page_34.html"]
  },
  {
    "@type": "Person",
    "@id": `${siteConfig.siteUrl}/#founder_georgi`,
    name: "Georgi",
    jobTitle: "Founder & Interior Designer",
    sameAs: ["https://ainterior.net/"]
  }
];
const restaurantAmenityFeatures = [
  "Garden",
  "Fireplace",
  "English Speaking Staff",
  "Pet Friendly"
];

const bgFaqs = [
  {
    question: "Къде има бавно печено агнешко и BBQ в центъра на София?",
    answer:
      "The Friendly Bear предлага бавно печено агнешко, BBQ ястия, крафт бира и сезонно меню на ул. Славянска 23 в центъра на София."
  },
  {
    question: "Къде има тихо място за вечеря близо до Славянска 23?",
    answer:
      "Тайната градина и уютният интериор с камина правят The Friendly Bear спокойно място за разговори близо до Народния театър."
  },
  {
    question: "Има ли вегетариански опции и свежи салати?",
    answer:
      "Да. В менюто има ясни вегетариански предложения и свежи салати, така че всеки на масата да избере спокойно."
  }
] as const;

const enFaqs = [
  {
    question: "Where can I find slow-roasted lamb and BBQ in Sofia Center?",
    answer:
      "The Friendly Bear serves slow-roasted lamb, BBQ plates, craft beer, and a seasonal menu on Slavyanska 23 in central Sofia."
  },
  {
    question: "Where can I find a quiet place for dinner near Slavyanska 23?",
    answer:
      "The secret garden and fireplace interior make The Friendly Bear a calm place for long conversations near the National Theatre."
  },
  {
    question: "Are there vegetarian options and fresh salads?",
    answer:
      "Yes. Vegetarian-friendly dishes and fresh salads are easy to find on the menu, so everyone at the table can choose with confidence."
  }
] as const;

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.siteUrl).toString();
}

function extractPrice(value?: string) {
  if (!value) {
    return undefined;
  }

  const numeric = value.replace(/[^\d,.-]/g, "").replace(",", ".");
  return numeric || undefined;
}

function normalizePhoneNumber(input?: string | null) {
  return input?.replace(/[^\d+]/g, "");
}

function getRestaurantNode(locale: SiteLocale, profile: FrontendBusinessProfile = businessProfile): JsonLd {
  return {
    "@type": "Restaurant",
    "@id": restaurantId,
    name: siteConfig.name,
    url: absoluteUrl(localeMeta[locale].homePath),
    image: absoluteUrl("/icons/friendly_bear_logo.jpg"),
    logo: absoluteUrl("/icons/friendly_bear_logo.jpg"),
    sameAs: restaurantSameAs,
    founder: restaurantFounder,
    priceRange: "$$",
    servesCuisine: ["Bulgarian", "BBQ", "European"],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: 1361
    },
    description:
      locale === "bg"
        ? "Уютен ресторант в центъра на София с HTML меню, сезонни предложения и бърз достъп до контакти и резервации."
        : "A cozy central Sofia restaurant with HTML menu content, seasonal specials, and fast access to contact and reservation routes.",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.streetAddress,
      addressLocality: siteConfig.city,
      postalCode: "1000",
      addressCountry: siteConfig.countryCode
    },
    areaServed: {
      "@type": "City",
      name: siteConfig.city
    },
    amenityFeature: restaurantAmenityFeatures.map((feature) => ({
      "@type": "LocationFeatureSpecification",
      name: feature,
      value: true
    })),
    hasMap: profile.mapUrl,
    hasMenu: absoluteUrl(localeMeta[locale].menuPath),
    telephone: normalizePhoneNumber(profile.phoneNumber),
    openingHoursSpecification: hasOpeningHours(profile)
      ? profile.openingHours.map((entry) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: `https://schema.org/${entry.dayOfWeek}`,
          opens: entry.closed ? undefined : entry.opens,
          closes: entry.closed ? undefined : entry.closes
        }))
      : undefined,
    availableLanguage: ["bg", "en"],
    inLanguage: localeMeta[locale].language
  };
}

function getWebsiteNode(): JsonLd {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: siteConfig.siteUrl,
    name: siteConfig.name,
    inLanguage: ["bg-BG", "en"],
    publisher: {
      "@id": restaurantId
    }
  };
}

function getBreadcrumbNode(items: Array<{ name: string; path: string }>, id: string): JsonLd {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function getHomePageSchema(locale: SiteLocale, profile: FrontendBusinessProfile = businessProfile): JsonLd {
  const homeUrl = absoluteUrl(localeMeta[locale].homePath);
  const breadcrumbId = `${homeUrl}#breadcrumb`;

  const graph: JsonLd[] = [
    getWebsiteNode(),
    getRestaurantNode(locale, profile),
    getBreadcrumbNode(
      [
        {
          name: locale === "bg" ? "Начало" : "Home",
          path: localeMeta[locale].homePath
        }
      ],
      breadcrumbId
    ),
    {
      "@type": "WebPage",
      "@id": `${homeUrl}#webpage`,
      url: homeUrl,
      name:
        locale === "bg"
          ? "Уютен ресторант на Славянска 23 в София | The Friendly Bear Sofia"
          : "Cozy restaurant on Slavyanska 23 in Sofia | The Friendly Bear Sofia",
      description:
        locale === "bg"
          ? "Начална страница за The Friendly Bear Sofia с пролетно меню, адрес на Slavyanska 23 и бърз път към меню, резервации и упътвания."
          : "Homepage for The Friendly Bear Sofia with seasonal menu, Slavyanska 23 address, and fast paths to menu, reservations, and directions.",
      inLanguage: localeMeta[locale].language,
      isPartOf: {
        "@id": websiteId
      },
      about: {
        "@id": restaurantId
      },
      breadcrumb: {
        "@id": breadcrumbId
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".home-lead", ".home-card-label"]
      }
    }
  ];

  const faqs = locale === "bg" ? bgFaqs : enFaqs;

  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${homeUrl}#faq`,
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

export function getAboutPageSchema(locale: SiteLocale): JsonLd {
  const aboutUrl = absoluteUrl(locale === "bg" ? "/bg/about" : "/en/about");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${aboutUrl}#webpage`,
        name: locale === "bg" ? "За The Friendly Bear" : "About The Friendly Bear",
        inLanguage: localeMeta[locale].language,
        mainEntity: {
          "@id": restaurantId
        }
      },
      ...restaurantFounder,
      {
        "@type": "Restaurant",
        "@id": restaurantId,
        name: siteConfig.name,
        founder: [
          {
            "@id": `${siteConfig.siteUrl}/#founder_jana`
          },
          {
            "@id": `${siteConfig.siteUrl}/#founder_georgi`
          }
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.streetAddress,
          addressLocality: siteConfig.city,
          addressCountry: siteConfig.countryCode
        }
      }
    ]
  };
}

export function getTouristsHubSchema(locale: SiteLocale): JsonLd {
  const touristsUrl = absoluteUrl(locale === "bg" ? "/bg/tourists" : "/en/tourists");
  const breadcrumbId = `${touristsUrl}#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${touristsUrl}#webpage`,
        name: locale === "bg" ? "Наръчник за туристи в София" : "Sofia Visitor Guide",
        description:
          locale === "bg"
            ? "Практична информация за международни гости, които посещават The Friendly Bear в София."
            : "Essential information for tourists visiting The Friendly Bear in Sofia.",
        inLanguage: localeMeta[locale].language,
        breadcrumb: {
          "@id": breadcrumbId
        },
        about: {
          "@id": restaurantId
        }
      },
      getBreadcrumbNode(
        [
          {
            name: locale === "bg" ? "Начало" : "Home",
            path: localeMeta[locale].homePath
          },
          {
            name: locale === "bg" ? "Туристи" : "Tourists",
            path: locale === "bg" ? "/bg/tourists" : "/en/tourists"
          }
        ],
        breadcrumbId
      ),
      {
        "@type": "ItemList",
        name: "International Dining Guides",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Guida per visitatori italiani",
            url: absoluteUrl("/it/ristorante-sofia-centro")
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guía para visitantes españoles",
            url: absoluteUrl("/es/restaurante-centro-sofia")
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Οδηγός για Έλληνες επισκέπτες",
            url: absoluteUrl("/el/greek")
          }
        ]
      }
    ]
  };
}

export function getMenuPageSchema(
  locale: SiteLocale,
  profile: FrontendBusinessProfile = businessProfile,
  menu: FrontendSeasonalMenu = getSeasonalMenuFallback(locale)
): JsonLd {
  const menuUrl = absoluteUrl(localeMeta[locale].menuPath);
  const breadcrumbId = `${menuUrl}#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      getRestaurantNode(locale, profile),
      getBreadcrumbNode(
        [
          {
            name: locale === "bg" ? "Начало" : "Home",
            path: localeMeta[locale].homePath
          },
          {
            name: locale === "bg" ? "Меню" : "Menu",
            path: localeMeta[locale].menuPath
          }
        ],
        breadcrumbId
      ),
      {
        "@type": "Menu",
        "@id": `${menuUrl}#menu`,
        name: menu.title,
        description: menu.intro,
        inLanguage: localeMeta[locale].language,
        url: menuUrl,
        author: {
          "@id": `${siteConfig.siteUrl}/#founder_jana`
        },
        hasMenuSection: menu.sections.map((section) => ({
          "@type": "MenuSection",
          name: section.title,
          hasMenuItem: section.items.map((item) => {
            const bgnPrice = extractPrice(item.priceBgn);

            return {
              "@type": "MenuItem",
              name: item.name,
              description: item.description?.join(" "),
              suitableForDiet: item.isVegetarian ? "https://schema.org/VegetarianDiet" : undefined,
              offers: {
                "@type": "Offer",
                price: bgnPrice,
                priceCurrency: "BGN"
              }
            };
          })
        })),
        mainEntityOfPage: {
          "@id": `${menuUrl}#webpage`
        }
      },
      {
        "@type": "WebPage",
        "@id": `${menuUrl}#webpage`,
        url: menuUrl,
        name: menu.title,
        description: menu.intro,
        inLanguage: localeMeta[locale].language,
        breadcrumb: {
          "@id": breadcrumbId
        },
        isPartOf: {
          "@id": websiteId
        },
        about: {
          "@id": restaurantId
        }
      }
    ]
  };
}

export function getContactPageSchema(locale: SiteLocale, profile: FrontendBusinessProfile = businessProfile): JsonLd {
  const contactUrl = absoluteUrl(localeMeta[locale].contactPath);
  const breadcrumbId = `${contactUrl}#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      getRestaurantNode(locale, profile),
      getBreadcrumbNode(
        [
          {
            name: locale === "bg" ? "Начало" : "Home",
            path: localeMeta[locale].homePath
          },
          {
            name: locale === "bg" ? "Контакти" : "Contact",
            path: localeMeta[locale].contactPath
          }
        ],
        breadcrumbId
      ),
      {
        "@type": "ContactPage",
        "@id": `${contactUrl}#webpage`,
        url: contactUrl,
        name:
          locale === "bg"
            ? "Контакти и упътвания | The Friendly Bear Sofia"
            : "Contact and directions | The Friendly Bear Sofia",
        description:
          locale === "bg"
            ? "Контактна страница за The Friendly Bear Sofia с адрес на ул. Славянска 23, упътвания, меню и резервационен статус."
            : "Contact page for The Friendly Bear Sofia with Slavyanska 23 address, directions, menu, and reservation status.",
        inLanguage: localeMeta[locale].language,
        breadcrumb: {
          "@id": breadcrumbId
        },
        isPartOf: {
          "@id": websiteId
        },
        about: {
          "@id": restaurantId
        },
        mainEntity: {
          "@id": restaurantId
        }
      }
    ]
  };
}

export async function getHomePageSchemaData(locale: SiteLocale) {
  const profile = await getBusinessProfileData();
  return getHomePageSchema(locale, profile);
}

export async function getMenuPageSchemaData(locale: SiteLocale) {
  const [profile, menu] = await Promise.all([getBusinessProfileData(), getSeasonalMenuData(locale)]);
  return getMenuPageSchema(locale, profile, menu);
}

export async function getContactPageSchemaData(locale: SiteLocale) {
  const profile = await getBusinessProfileData();
  return getContactPageSchema(locale, profile);
}
