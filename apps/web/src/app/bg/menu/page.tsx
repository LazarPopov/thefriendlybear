import type { Metadata } from "next";
import { SeasonalMenu } from "@/components/seasonal-menu";
import { StructuredData } from "@/components/structured-data";
import { ActionLink } from "@/components/action-link";
import { buildPageMetadata } from "@/lib/metadata";
import { getSeasonalMenuData } from "@/lib/menu-module";
import { getMenuPageSchemaData } from "@/lib/schema";
import { buildActionTracking } from "@/lib/tracking";

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
      <div className="page-shell">
        <section className="page-hero">
          <p className="eyebrow">Кулинарна бърлога</p>
          <h1>Нашето меню</h1>
          <p className="page-lead">
            Вдъхновени от българските традиции и споделеното в{" "}
            <a 
              href="https://www.mish-mash.recipes/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-link"
            >
              Mish-Mash Recipes
            </a>
            , ви предлагаме подбрани сезонни вкусове.
          </p>
          <div className="actions">
            <ActionLink
              href="https://www.mish-mash.recipes/"
              label="Вижте още рецепти в Mish-Mash"
              external
              tracking={buildActionTracking({
                kind: "external",
                locale: "bg",
                location: "menu_hero",
                label: "Mish-Mash Recipes Link",
                target: "https://www.mish-mash.recipes/",
                external: true
              })}
            />
          </div>
        </section>
      </div>
      <SeasonalMenu locale="bg" menu={menu} />
    </>
  );
}
