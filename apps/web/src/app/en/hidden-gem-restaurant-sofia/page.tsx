import type { Metadata } from "next";
import { HiddenGemRestaurantPage } from "@/components/hidden-gem-restaurant-page";
import { StructuredData } from "@/components/structured-data";
import { siteConfig } from "@/lib/site";

const hiddenGemPath = "/en/hidden-gem-restaurant-sofia";
const hiddenGemTitle = "Hidden Gem Restaurant Sofia | The Friendly Bear";
const hiddenGemDescription =
  "A unique hidden gem restaurant in Sofia Center: 1923 house, slightly underground retro interior, hidden courtyard, veal tongue sandwich, slow-roasted lamb and Baileys Crème Brûlée.";

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.siteUrl).toString();
}

function getHiddenGemSchema() {
  const pageUrl = absoluteUrl(hiddenGemPath);
  const breadcrumbId = `${pageUrl}#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Restaurant",
        "@id": `${siteConfig.siteUrl}/#restaurant`,
        name: "The Friendly Bear Sofia",
        description:
          "A unique central Sofia restaurant in a 1923 house with a hidden courtyard, retro interior and authentic food.",
        image: absoluteUrl("/icons/friendly_bear_logo.jpg"),
        logo: absoluteUrl("/icons/friendly_bear_logo.jpg"),
        telephone: "+359876122114",
        priceRange: "$$",
        servesCuisine: ["Bulgarian", "European"],
        knowsLanguage: ["en", "bg"],
        url: pageUrl,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Slavyanska 23",
          addressLocality: "Sofia",
          postalCode: "1000",
          addressCountry: "BG"
        }
      },
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
            name: "Hidden gem restaurant Sofia",
            item: pageUrl
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: hiddenGemTitle,
        description: hiddenGemDescription,
        inLanguage: "en-GB",
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

export const metadata: Metadata = {
  title: hiddenGemTitle,
  description: hiddenGemDescription,
  alternates: {
    canonical: absoluteUrl(hiddenGemPath),
    languages: {
      en: absoluteUrl(hiddenGemPath),
      "en-GB": absoluteUrl(hiddenGemPath),
      "x-default": absoluteUrl(hiddenGemPath)
    }
  },
  openGraph: {
    title: hiddenGemTitle,
    description: hiddenGemDescription,
    url: absoluteUrl(hiddenGemPath),
    siteName: "The Friendly Bear Sofia",
    locale: "en_GB",
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
    title: hiddenGemTitle,
    description: hiddenGemDescription,
    images: [absoluteUrl("/icons/friendly_bear_logo.jpg")]
  }
};

export default function Page() {
  return (
    <>
      <StructuredData data={getHiddenGemSchema()} />
      <HiddenGemRestaurantPage />
    </>
  );
}
