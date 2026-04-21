import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { TouristMarketPage } from "@/components/tourist-market-page";
import { getTouristMarketConfig, getTouristMarketPageData } from "@/lib/tourist-market";
import { siteConfig } from "@/lib/site";

type MarketRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: MarketRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const config = getTouristMarketConfig("el");
  const page = await getTouristMarketPageData("el");

  if (!page) {
    return {};
  }

  const canonical = `/el/${page.slug}`;

  if (slug !== page.slug) {
    return {
      alternates: {
        canonical
      }
    };
  }

  return {
    title: page.title,
    description: page.intro,
    alternates: {
      canonical,
      languages: {
        en: `/en/tourists/${config.audience}`,
        "x-default": canonical
      }
    },
    openGraph: {
      title: page.title,
      description: page.intro,
      url: canonical,
      siteName: siteConfig.name,
      locale: config.ogLocale,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.intro
    }
  };
}

export default async function Page({ params }: MarketRouteProps) {
  const { slug } = await params;
  const page = await getTouristMarketPageData("el");

  if (!page) {
    notFound();
  }

  if (slug !== page.slug) {
    permanentRedirect(`/el/${page.slug}`);
  }

  return <TouristMarketPage marketLocale="el" />;
}
