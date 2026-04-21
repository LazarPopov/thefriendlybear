import type { Metadata } from "next";
import { SeasonalMenu } from "@/components/seasonal-menu";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getSeasonalMenuData } from "@/lib/menu-module";
import { getMenuPageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "menu",
  title: "Сезонно меню | Бавно печено агнешко и крафт бира | The Friendly Bear",
  description:
    "Разгледайте нашето сезонно меню: бавно печено агнешко, свежи пролетни салати и авторски коктейли. Вегетариански опции и уютна градина в центъра на София."
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
