import type { Metadata } from "next";
import { SeasonalMenu } from "@/components/seasonal-menu";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getSeasonalMenuData } from "@/lib/menu-module";
import { getMenuPageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "menu",
  title: "Special Weekly Menu | A Taste of the Season | The Friendly Bear",
  description:
    "Curated by Jana (Mish-Mash Recipes) and the Friendly Bear team, our weekly menu brings slow-cooked meats, vegetarian dishes, fresh salads, and classic desserts."
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
