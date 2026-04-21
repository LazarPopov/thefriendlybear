import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TouristLandingPageCms } from "@/components/tourist-landing-page-cms";
import { getTouristLandingPageDataBySlug } from "@/lib/tourist-landing-page-module";
import { siteConfig } from "@/lib/site";

type TouristRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: TouristRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const touristPage = await getTouristLandingPageDataBySlug("en", slug);

  if (!touristPage) {
    return {};
  }

  const canonical = `/en/tourists/${touristPage.localizedSlugs.en}`;
  const bgPath = `/bg/tourists/${touristPage.localizedSlugs.bg}`;

  return {
    title: touristPage.page.title,
    description: touristPage.page.intro,
    alternates: {
      canonical,
      languages: {
        bg: bgPath,
        en: canonical,
        "bg-BG": bgPath,
        "en-BG": canonical,
        "x-default": `/bg/tourists/${touristPage.localizedSlugs.bg}`
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
