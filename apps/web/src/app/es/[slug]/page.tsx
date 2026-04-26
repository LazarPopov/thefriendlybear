import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { StructuredData } from "@/components/structured-data";
import { TouristMarketPage } from "@/components/tourist-market-page";
import { siteConfig } from "@/lib/site";
import { getTouristMarketConfig, getTouristMarketPageData } from "@/lib/tourist-market";

type MarketRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

const spanishSlug = "restaurante-centro-sofia";
const spanishTitle = "Restaurante con Jardín en el Centro de Sofía | The Friendly Bear";
const spanishDescription =
  "¿Buscas dónde comer o cenar en el centro de Sofía? The Friendly Bear ofrece comida búlgara artesanal, carnes cocinadas lentamente, jardín y opciones vegetarianas.";

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.siteUrl).toString();
}

function getSpanishRestaurantSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${siteConfig.siteUrl}/#restaurant`,
    name: "The Friendly Bear Sofia",
    image: absoluteUrl("/icons/friendly_bear_logo.jpg"),
    logo: absoluteUrl("/icons/friendly_bear_logo.jpg"),
    telephone: "+359876122114",
    priceRange: "$$",
    description: "Un restaurante acogedor en el centro de Sofía para comer o cenar comida tradicional búlgara, con jardín, carnes cocinadas lentamente y opciones vegetarianas.",
    servesCuisine: ["Búlgara", "Europea"],
    knowsLanguage: ["en", "bg", "es"],
    url: absoluteUrl(`/es/${spanishSlug}`),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Slavyanska 23",
      addressLocality: "Sofia",
      postalCode: "1000",
      addressCountry: "BG"
    }
  };
}

function getSpanishPageSchema() {
  const pageUrl = absoluteUrl(`/es/${spanishSlug}`);
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
            name: "Guía para visitantes en Sofía",
            item: absoluteUrl("/en/tourists")
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Guía para visitantes españoles",
            item: pageUrl
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: spanishTitle,
        description: spanishDescription,
        inLanguage: "es-ES",
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

export async function generateMetadata({ params }: MarketRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const config = getTouristMarketConfig("es");
  const page = await getTouristMarketPageData("es");

  if (!page) {
    return {};
  }

  const canonical = `/es/${spanishSlug}`;
  const canonicalUrl = absoluteUrl(canonical);
  const englishAudienceUrl = absoluteUrl(`/en/tourists/${config.audience}`);

  if (slug !== spanishSlug) {
    return {
      alternates: {
        canonical: canonicalUrl
      }
    };
  }

  return {
    title: spanishTitle,
    description: spanishDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        es: canonicalUrl,
        "es-ES": canonicalUrl,
        en: englishAudienceUrl,
        "en-GB": englishAudienceUrl,
        "x-default": englishAudienceUrl
      }
    },
    openGraph: {
      title: spanishTitle,
      description: spanishDescription,
      url: canonicalUrl,
      siteName: "The Friendly Bear Sofia",
      locale: config.ogLocale,
      type: "website",
      images: [
        {
          url: absoluteUrl("/icons/friendly_bear_logo.jpg"),
          width: 320,
          height: 320,
          alt: "The Friendly Bear Sofia logo"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: spanishTitle,
      description: spanishDescription,
      images: [absoluteUrl("/icons/friendly_bear_logo.jpg")]
    }
  };
}

export default async function Page({ params }: MarketRouteProps) {
  const { slug } = await params;
  const page = await getTouristMarketPageData("es");

  if (!page) {
    notFound();
  }

  if (slug !== spanishSlug) {
    permanentRedirect(`/es/${spanishSlug}`);
  }

  return (
    <>
      <StructuredData data={getSpanishRestaurantSchema()} />
      <StructuredData data={getSpanishPageSchema()} />
      <TouristMarketPage marketLocale="es" />
    </>
  );
}
