import type { Metadata } from "next";
import { SeasonalMenu } from "@/components/seasonal-menu";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getSeasonalMenuData } from "@/lib/menu-module";
import { getMenuPageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "menu",
  title: "Seasonal Menu | Slow-Roasted Lamb & Craft Beer | The Friendly Bear",
  description:
    "Explore our seasonal menu featuring signature slow-roasted lamb, fresh spring salads, and craft beers. Vegetarian-friendly options clearly marked. Dine in our Sofia garden."
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
