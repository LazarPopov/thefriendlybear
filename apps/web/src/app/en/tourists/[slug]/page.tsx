import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TouristLandingPageCms } from "@/components/tourist-landing-page-cms";
import { getTouristLandingPageDataBySlug } from "@/lib/tourist-landing-page-module";
import { siteConfig } from "@/lib/site";
import { getTouristMarketLanguageAlternates } from "@/lib/tourist-market-route";
import type { TouristAudience, TouristMarketLocale } from "@/lib/cms/tourist-landing-page-adapter";

type TouristRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

const marketLocaleByAudience: Record<TouristAudience, TouristMarketLocale> = {
  italian: "it",
  spanish: "es",
  greek: "el",
  german: "de",
  romanian: "ro",
  uk: "en-gb"
};

export async function generateMetadata({ params }: TouristRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const touristPage = await getTouristLandingPageDataBySlug("en", slug);

  if (!touristPage) {
    return {};
  }

  const canonical = `/en/tourists/${touristPage.localizedSlugs.en}`;
  const bgPath = `/bg/tourists/${touristPage.localizedSlugs.bg}`;
  const marketLocale = marketLocaleByAudience[touristPage.audience];
  const {
    en: _marketEn,
    "en-GB": _marketEnGb,
    "x-default": _marketDefault,
    ...marketLanguageAlternates
  } = getTouristMarketLanguageAlternates(marketLocale);

  return {
    title: touristPage.page.title,
    description: touristPage.page.intro,
    alternates: {
      canonical,
      languages: {
        bg: bgPath,
        en: canonical,
        "bg-BG": bgPath,
        "en-GB": canonical,
        ...marketLanguageAlternates,
        "x-default": canonical
      }
    },
    openGraph: {
      title: touristPage.page.title,
      description: touristPage.page.intro,
      url: canonical,
      siteName: siteConfig.name,
      locale: "en_GB",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: touristPage.page.title,
      description: touristPage.page.intro
    }
  };
}

export default async function Page({ params }: TouristRouteProps) {
  const { slug } = await params;
  const touristPage = await getTouristLandingPageDataBySlug("en", slug);

  if (!touristPage) {
    notFound();
  }

  return (
    <TouristLandingPageCms
      locale="en"
      audience={touristPage.audience}
      touristPage={touristPage.page}
    />
  );
}
