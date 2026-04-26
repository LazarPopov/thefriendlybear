import { siteConfig, type SiteLocale } from "@/lib/site";
import {
  businessProfile,
  getBusinessProfileData,
  hasOpeningHours,
  type FrontendBusinessProfile
} from "@/lib/business-profile-module";
import { contactFaqItems } from "@/lib/contact-faq";
import type { FrontendSeasonalMenu } from "@/lib/cms/menu-adapter";
import { getSeasonalMenuData, getSeasonalMenuFallback } from "@/lib/menu-module";

type JsonLd = Record<string, unknown>;

const localeMeta: Record<
  SiteLocale,
  { language: string; homePath: string; menuPath: string; contactPath: string; reviewsPath: string }
> = {
  bg: {
    language: "bg-BG",
    homePath: "/bg",
    menuPath: "/bg/menu",
    contactPath: "/bg/contact",
    reviewsPath: "/bg/reviews"
  },
  en: {
    language: "en-GB",
    homePath: "/en",
    menuPath: "/en/menu",
    contactPath: "/en/contact",
    reviewsPath: "/en/reviews"
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

const reviewSchemaItems: Record<
  SiteLocale,
  Array<{ author: string; rating: string; body: string }>
> = {
  bg: [
    {
      author: "Viltė Čepulytė",
      rating: "5",
      body:
        "Перфектно място с невероятно обслужване и страхотна храна. България ни изненада по много начини, но The Friendly Bear го направи по най-добрия възможен начин."
    },
    {
      author: "Alice T",
      rating: "5",
      body:
        "Влязохме без резервация, сервитьорът ни помогна да седнем на чудесна маса и ни даде отличен съвет какво да изберем."
    }
  ],
  en: [
    {
      author: "Viltė Čepulytė",
      rating: "5",
      body:
        "Perfect place with amazing service and great food. Bulgaria surprised us in many ways, but The Friendly Bear did it in the best way possible."
    },
    {
      author: "Alice T",
      rating: "5",
      body:
        "We walked in without a reservation, the waiter helped us sit at a great table. Gave us excellent advice on what to choose."
    }
  ]
};

const bgFaqs = [
  {
    question: "Къде има бавно печено агнешко и свински уши в центъра на София?",
    answer:
      "The Friendly Bear предлага бавно печени меса от български качествени производители, 20 вида ракии, богато меню с напитки с 0% алкохол и сезонни предложения на ул. Славянска 23 в центъра на София."
  },
  {
    question: "Къде има тихо място за вечеря близо до Славянска 23?",
    answer:
      "Градината и уютните вътрешни зали правят The Friendly Bear спокойно място за разговори близо до Народния театър."
  },
  {
    question: "Има ли вегетариански опции и свежи салати?",
    answer:
      "Да. В менюто има ясни вегетариански предложения и свежи салати, така че всеки на масата да избере спокойно."
  }
] as const;

const enFaqs = [
  {
    question: "Where can I find slow-roasted lamb, pork ears, and slow-cooked meats in Sofia Center?",
    answer:
      "The Friendly Bear serves slow-cooked meats from quality Bulgarian producers, 20 kinds of rakia, a rich 0% alcohol drinks menu, and weekly seasonal specials on Slavyanska 23 in central Sofia."
  },
  {
    question: "Where can I find a quiet place for dinner near Slavyanska 23?",
    answer:
      "The garden and cozy dining rooms make The Friendly Bear a calm place for long conversations near the National Theatre."
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
    servesCuisine: ["Bulgarian", "European"],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "1361",
      bestRating: "5",
      worstRating: "1"
    },
    description:
      locale === "bg"
        ? "Уютен ресторант в центъра на София с градина, отопляема зона за пушачи, бавно готвени меса, сезонно меню и приветливо обслужване."
        : "A cozy central Sofia restaurant with a garden, heated smoking area, slow-cooked meats, weekly menu, and warm hospitality.",
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
    availableLanguage: ["bg-BG", "en-GB"],
    acceptsReservations: true,
    inLanguage: localeMeta[locale].language
  };
}

function getWebsiteNode(): JsonLd {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: siteConfig.siteUrl,
    name: siteConfig.name,
    inLanguage: ["bg-BG", "en-GB"],
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
          ? "Уютен ресторант и градина в центъра на София | The Friendly Bear"
          : "Cozy Restaurant & Garden in Sofia Center | The Friendly Bear",
      description:
        locale === "bg"
          ? "The Friendly Bear Sofia е уютен ресторант в центъра на София, на ул. „Славянска“ 23 - с градина, отопляема зона за пушачи, сезонно меню, бавно готвени меса и вегетариански опции."
          : "The Friendly Bear Sofia is a cozy restaurant in central Sofia on Slavyanska 23, with a garden, heated smoking area, weekly menu, slow-cooked meats, and vegetarian options.",
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
            url: absoluteUrl("/el/estiatorio-sofia-kentro")
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

export function getReviewsPageSchema(locale: SiteLocale, profile: FrontendBusinessProfile = businessProfile): JsonLd {
  const reviewsUrl = absoluteUrl(localeMeta[locale].reviewsPath);
  const breadcrumbId = `${reviewsUrl}#breadcrumb`;
  const restaurantWithReviews = {
    ...getRestaurantNode(locale, profile),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "1361",
      bestRating: "5",
      worstRating: "1"
    },
    review: reviewSchemaItems[locale].map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: "5",
        worstRating: "1"
      },
      reviewBody: review.body
    }))
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      restaurantWithReviews,
      getBreadcrumbNode(
        [
          {
            name: locale === "bg" ? "Начало" : "Home",
            path: localeMeta[locale].homePath
          },
          {
            name: locale === "bg" ? "Отзиви" : "Reviews",
            path: localeMeta[locale].reviewsPath
          }
        ],
        breadcrumbId
      ),
      {
        "@type": "WebPage",
        "@id": `${reviewsUrl}#webpage`,
        url: reviewsUrl,
        name:
          locale === "bg"
            ? "Отзиви на гости и впечатления | The Friendly Bear София"
            : "Guest Reviews & Ratings | The Friendly Bear Sofia",
        description:
          locale === "bg"
            ? "Вижте защо гостите обичат The Friendly Bear. Високи оценки за нашето агнешко, крафт бира и атмосферата от 1923 г."
            : "See why guests love The Friendly Bear. High ratings for slow-roasted lamb, craft beer, and a cozy 1923 atmosphere.",
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

export function getContactPageSchema(locale: SiteLocale, profile: FrontendBusinessProfile = businessProfile): JsonLd {
  const contactUrl = absoluteUrl(localeMeta[locale].contactPath);
  const breadcrumbId = `${contactUrl}#breadcrumb`;
  const contactPageDescription =
    locale === "bg"
      ? "Намерете ни на ул. Славянска 23. Работно време, плащане с карти, правила за домашни любимци и тайната на вратите със ски."
      : "Find us at Slavyanska 23. Opening hours, card payment info, pet-friendly rules, and the secret of the sliding ski doors.";

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
            ? "Контакт, упътвания и FAQ | The Friendly Bear София"
            : "Contact, Directions & FAQ | The Friendly Bear Sofia",
        description: contactPageDescription,
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
      },
      {
        "@type": "FAQPage",
        "@id": `${contactUrl}#faq`,
        inLanguage: localeMeta[locale].language,
        mainEntity: contactFaqItems[locale].map((item) => ({
          "@type": "Question",
          name: item.schemaQuestion ?? item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.schemaAnswer ?? item.answer
          }
        }))
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

export async function getReviewsPageSchemaData(locale: SiteLocale) {
  const profile = await getBusinessProfileData();
  return getReviewsPageSchema(locale, profile);
}

export async function getContactPageSchemaData(locale: SiteLocale) {
  const profile = await getBusinessProfileData();
  return getContactPageSchema(locale, profile);
}
