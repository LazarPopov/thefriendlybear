import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { StructuredData } from "@/components/structured-data";
import { TouristMarketPage } from "@/components/tourist-market-page";
import { getTouristMarketPageData } from "@/lib/tourist-market";
import {
  buildTouristMarketMetadata,
  getTouristMarketPageSchema,
  getTouristMarketRestaurantSchema,
  getTouristMarketRouteDefinition,
  getTouristMarketRoutePath
} from "@/lib/tourist-market-route";

type MarketRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

const marketLocale = "ro";

export async function generateMetadata({ params }: MarketRouteProps): Promise<Metadata> {
  const { slug } = await params;

  return buildTouristMarketMetadata(marketLocale, slug);
}

export default async function Page({ params }: MarketRouteProps) {
  const { slug } = await params;
  const page = await getTouristMarketPageData(marketLocale);
  const definition = getTouristMarketRouteDefinition(marketLocale);

  if (!page) {
    notFound();
  }

  if (slug !== definition.slug) {
    permanentRedirect(getTouristMarketRoutePath(marketLocale));
  }

  return (
    <>
      <StructuredData data={getTouristMarketRestaurantSchema(marketLocale)} />
      <StructuredData data={getTouristMarketPageSchema(marketLocale)} />
      <TouristMarketPage marketLocale={marketLocale} />
    </>
  );
}
