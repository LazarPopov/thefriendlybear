import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TouristLandingPageCms } from "@/components/tourist-landing-page-cms";
import { getTouristLandingPageDataBySlug } from "@/lib/tourist-landing-page-module";
import { getTouristMarketSlug } from "@/lib/tourist-market";
import { siteConfig } from "@/lib/site";

type TouristRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

const marketLocaleByAudience = {
  italian: "it",
  spanish: "es",
  greek: "el"
} as const;

const marketRegionalCode = {
  it: "it-IT",
  es: "es-ES",
  el: "el-GR"
} as const;

export async function generateMetadata({ params }: TouristRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const touristPage = await getTouristLandingPageDataBySlug("bg", slug);

  if (!touristPage) {
    return {};
  }

  const canonical = `/bg/tourists/${touristPage.localizedSlugs.bg}`;
  const enPath = `/en/tourists/${touristPage.localizedSlugs.en}`;
  const marketLocale = marketLocaleByAudience[touristPage.audience];
  const marketPath = `/${marketLocale}/${await getTouristMarketSlug(marketLocale)}`;

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
        [marketLocale]: marketPath,
        [marketRegionalCode[marketLocale]]: marketPath,
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
