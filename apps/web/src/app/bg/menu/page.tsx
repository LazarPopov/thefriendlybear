import type { Metadata } from "next";
import { SeasonalMenu } from "@/components/seasonal-menu";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getSeasonalMenuData } from "@/lib/menu-module";
import { getMenuPageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "menu",
  title: "Традиционна българска кухня и сезонно меню | The Friendly Bear София",
  description:
    "Вижте нашето меню: бавно печено агнешко, свински уши, пресни салати и вегетариански ястия. Традиционен вкус и сезонни специалитети в центъра на София."
});

export default async function Page() {
  const [menu, schema] = await Promise.all([getSeasonalMenuData("bg"), getMenuPageSchemaData("bg")]);

  return (
    <>
      <StructuredData data={schema} />
      <SeasonalMenu locale="bg" menu={menu} />
    </>
  );
}
