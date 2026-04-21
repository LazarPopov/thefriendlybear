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
    servesCuisine: ["Bulgara", "BBQ", "Europea"],
    knowsLanguage: ["en", "bg", "it"],
    url: absoluteUrl(`/it/${italianSlug}`),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Slavyanska 23",
      addressLocality: "Sofia",
      addressCountry: "BG"
    }
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
        en: absoluteUrl(`/en/tourists/${config.audience}`),
        "x-default": canonicalUrl
      }
    },
    openGraph: {
      title: italianTitle,
      description: italianDescription,
      url: canonicalUrl,
      siteName: "The Friendly Bear Sofia",
      locale: config.ogLocale,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: italianTitle,
      description: italianDescription
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
      <TouristMarketPage marketLocale="it" />
    </>
  );
}
