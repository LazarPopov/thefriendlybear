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
  const touristPage = await getTouristLandingPageDataBySlug("bg", slug);

  if (!touristPage) {
    return {};
  }

  const canonical = `/bg/tourists/${touristPage.localizedSlugs.bg}`;
  const enPath = `/en/tourists/${touristPage.localizedSlugs.en}`;
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
        bg: canonical,
        en: enPath,
        "bg-BG": canonical,
        "en-GB": enPath,
        ...marketLanguageAlternates,
        "x-default": enPath
      }
    },
    openGraph: {
      title: touristPage.page.title,
      description: touristPage.page.intro,
      url: canonical,
      siteName: siteConfig.name,
      locale: "bg_BG",
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
  const touristPage = await getTouristLandingPageDataBySlug("bg", slug);

  if (!touristPage) {
    notFound();
  }

  return (
    <TouristLandingPageCms
      locale="bg"
      audience={touristPage.audience}
      touristPage={touristPage.page}
    />
  );
}
