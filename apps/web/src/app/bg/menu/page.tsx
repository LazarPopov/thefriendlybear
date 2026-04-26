import type { Metadata } from "next";
import { SeasonalMenu } from "@/components/seasonal-menu";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getSeasonalMenuData } from "@/lib/menu-module";
import { getMenuPageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "menu",
  title: "Специално седмично меню | Вкусът на сезона | The Friendly Bear",
  description:
    "Подбрано от Жана (Mish-Mash Recipes) и екипът на Friendly Bear, седмичното ни меню съчетава бавно печени меса, вегетариански предложения, свежи салати и класически десерти."
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
