import type { Metadata } from "next";
import { SeasonalMenu } from "@/components/seasonal-menu";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getSeasonalMenuData } from "@/lib/menu-module";
import { getMenuPageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "menu",
  title: "Bulgarian Cuisine & Seasonal Menu | The Friendly Bear Sofia",
  description:
    "Explore our menu featuring slow-roasted lamb, traditional Bulgarian dishes, and seasonal specials. Authentic Sofia dining experience with vegetarian-friendly options."
});

export default async function Page() {
  const [menu, schema] = await Promise.all([getSeasonalMenuData("en"), getMenuPageSchemaData("en")]);

  return (
    <>
      <StructuredData data={schema} />
      <SeasonalMenu locale="en" menu={menu} />
    </>
  );
}
