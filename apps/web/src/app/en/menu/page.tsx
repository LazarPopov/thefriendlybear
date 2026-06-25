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
    "Explore slow-roasted lamb, Bulgarian dishes, seasonal specials, and vegetarian options at The Friendly Bear Sofia."
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
