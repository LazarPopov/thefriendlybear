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

const greekSlug = "estiatorio-sofia-kentro";
const greekTitle = "Εστιατόριο με Κήπο στο Κέντρο της Σόφιας | The Friendly Bear";
const greekDescription =
  "Ψάχνετε εστιατόριο στο κέντρο της Σόφιας; Το The Friendly Bear προσφέρει αυθεντική κουζίνα, κήπο, πιάτα αργού μαγειρέματος και χορτοφαγικές επιλογές.";

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.siteUrl).toString();
}

function getGreekRestaurantSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${siteConfig.siteUrl}/#restaurant`,
    name: "The Friendly Bear Sofia",
    image: absoluteUrl("/icons/friendly_bear_logo.jpg"),
    logo: absoluteUrl("/icons/friendly_bear_logo.jpg"),
    telephone: "+359876122114",
    priceRange: "$$",
    description: "Ένα ζεστό εστιατόριο στην καρδιά της Σόφιας με κήπο, πιάτα αργού μαγειρέματος και παραδοσιακή κουζίνα.",
    servesCuisine: ["Bulgarian", "European"],
    knowsLanguage: ["en", "bg", "el"],
    url: absoluteUrl(`/el/${greekSlug}`),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Slavyanska 23",
      addressLocality: "Sofia",
      postalCode: "1000",
      addressCountry: "BG"
    }
  };
}

function getGreekPageSchema() {
  const pageUrl = absoluteUrl(`/el/${greekSlug}`);
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
            name: "Greek visitor guide",
            item: pageUrl
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: greekTitle,
        description: greekDescription,
        inLanguage: "el-GR",
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
  const config = getTouristMarketConfig("el");
  const page = await getTouristMarketPageData("el");

  if (!page) {
    return {};
  }

  const canonical = `/el/${greekSlug}`;
  const canonicalUrl = absoluteUrl(canonical);
  const englishAudienceUrl = absoluteUrl(`/en/tourists/${config.audience}`);

  if (slug !== greekSlug) {
    return {
      alternates: {
        canonical: canonicalUrl
      }
    };
  }

  return {
    title: greekTitle,
    description: greekDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        el: canonicalUrl,
        "el-GR": canonicalUrl,
        en: englishAudienceUrl,
        "en-GB": englishAudienceUrl,
        "x-default": englishAudienceUrl
      }
    },
    openGraph: {
      title: greekTitle,
      description: greekDescription,
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
      title: greekTitle,
      description: greekDescription,
      images: [absoluteUrl("/icons/friendly_bear_logo.jpg")]
    }
  };
}

export default async function Page({ params }: MarketRouteProps) {
  const { slug } = await params;
  const page = await getTouristMarketPageData("el");

  if (!page) {
    notFound();
  }

  if (slug !== greekSlug) {
    permanentRedirect(`/el/${greekSlug}`);
  }

  return (
    <>
      <StructuredData data={getGreekRestaurantSchema()} />
      <StructuredData data={getGreekPageSchema()} />
      <TouristMarketPage marketLocale="el" />
    </>
  );
}
