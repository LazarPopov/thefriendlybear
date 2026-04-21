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

const spanishSlug = "restaurante-centro-sofia";
const spanishTitle = "Restaurante con Jardín en el Centro de Sofía | The Friendly Bear";
const spanishDescription =
  "¿Buscas dónde comer en el centro de Sofía? The Friendly Bear ofrece comida búlgara artesanal, un jardín secreto y opciones vegetarianas. Personal habla inglés. ¡Reserva hoy!";
const productionSiteUrl = "https://friendlybear.bg";

function absoluteUrl(path: string) {
  return new URL(path, productionSiteUrl).toString();
}

function getSpanishRestaurantSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${productionSiteUrl}/#restaurant`,
    name: "The Friendly Bear Sofia",
    description: "Un restaurante acogedor en el centro de Sofía con jardín secreto y cocina tradicional búlgara.",
    servesCuisine: ["Búlgara", "Barbacoa", "Europea"],
    knowsLanguage: ["en", "bg", "es"],
    url: absoluteUrl(`/es/${spanishSlug}`),
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
  const config = getTouristMarketConfig("es");
  const page = await getTouristMarketPageData("es");

  if (!page) {
    return {};
  }

  const canonical = `/es/${spanishSlug}`;
  const canonicalUrl = absoluteUrl(canonical);

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
        en: absoluteUrl(`/en/tourists/${config.audience}`),
        "x-default": canonicalUrl
      }
    },
    openGraph: {
      title: spanishTitle,
      description: spanishDescription,
      url: canonicalUrl,
      siteName: "The Friendly Bear Sofia",
      locale: config.ogLocale,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: spanishTitle,
      description: spanishDescription
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
      <TouristMarketPage marketLocale="es" />
    </>
  );
}
