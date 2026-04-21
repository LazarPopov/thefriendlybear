import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { StructuredData } from "@/components/structured-data";
import { TouristMarketPage } from "@/components/tourist-market-page";
import { getTouristMarketConfig, getTouristMarketPageData } from "@/lib/tourist-market";

type MarketRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

const italianSlug = "ristorante-sofia-centro";
const italianTitle = "Ristorante con Giardino nel Centro di Sofia | The Friendly Bear";
const italianDescription =
  "Cerchi un ristorante in centro a Sofia? The Friendly Bear offre cucina tipica bulgara, un giardino segreto e opzioni vegetariane. Personale parla inglese. Prenota ora!";
const productionSiteUrl = "https://friendlybear.bg";

function absoluteUrl(path: string) {
  return new URL(path, productionSiteUrl).toString();
}

function getItalianRestaurantSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${productionSiteUrl}/#restaurant`,
    name: "The Friendly Bear Sofia",
    description: "Un angolo accogliente nel cuore di Sofia con giardino segreto e cucina tradizionale.",
    image: absoluteUrl("/icons/friendly_bear_logo.jpg"),
    logo: absoluteUrl("/icons/friendly_bear_logo.jpg"),
    telephone: "+359876122114",
    priceRange: "$$",
    servesCuisine: ["Bulgara", "BBQ", "Europea"],
    knowsLanguage: ["en", "bg", "it"],
    url: absoluteUrl(`/it/${italianSlug}`),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Slavyanska 23",
      addressLocality: "Sofia",
      postalCode: "1000",
      addressCountry: "BG"
    }
  };
}

function getItalianPageSchema() {
  const pageUrl = absoluteUrl(`/it/${italianSlug}`);
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
            name: "Italian visitor guide",
            item: pageUrl
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: italianTitle,
        description: italianDescription,
        inLanguage: "it-IT",
        breadcrumb: {
          "@id": breadcrumbId
        },
        about: {
          "@id": `${productionSiteUrl}/#restaurant`
        },
        mainEntity: {
          "@id": `${productionSiteUrl}/#restaurant`
        }
      }
    ]
  };
}

export async function generateMetadata({ params }: MarketRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const config = getTouristMarketConfig("it");
  const page = await getTouristMarketPageData("it");

  if (!page) {
    return {};
  }

  const canonical = `/it/${italianSlug}`;
  const canonicalUrl = absoluteUrl(canonical);
  const englishAudienceUrl = absoluteUrl(`/en/tourists/${config.audience}`);

  if (slug !== italianSlug) {
    return {
      alternates: {
        canonical: canonicalUrl
      }
    };
  }

  return {
    title: italianTitle,
    description: italianDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        it: canonicalUrl,
        "it-IT": canonicalUrl,
        en: englishAudienceUrl,
        "en-GB": englishAudienceUrl,
        "x-default": englishAudienceUrl
      }
    },
    openGraph: {
      title: italianTitle,
      description: italianDescription,
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
      title: italianTitle,
      description: italianDescription,
      images: [absoluteUrl("/icons/friendly_bear_logo.jpg")]
    }
  };
}

export default async function Page({ params }: MarketRouteProps) {
  const { slug } = await params;
  const page = await getTouristMarketPageData("it");

  if (!page) {
    notFound();
  }

  if (slug !== italianSlug) {
    permanentRedirect(`/it/${italianSlug}`);
  }

  return (
    <>
      <StructuredData data={getItalianRestaurantSchema()} />
      <StructuredData data={getItalianPageSchema()} />
      <TouristMarketPage marketLocale="it" />
    </>
  );
}
