import type { Metadata } from "next";
import { SeasonalMenu } from "@/components/seasonal-menu";
import { StructuredData } from "@/components/structured-data";
import { ActionLink } from "@/components/action-link";
import { buildPageMetadata } from "@/lib/metadata";
import { getSeasonalMenuData } from "@/lib/menu-module";
import { getMenuPageSchemaData } from "@/lib/schema";
import { buildActionTracking } from "@/lib/tracking";

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
      <div className="page-shell">
        <section className="page-hero">
          <p className="eyebrow">Culinary Den</p>
          <h1>Our Menu</h1>
          <p className="page-lead">
            Inspired by Bulgarian traditions and the culinary world of{" "}
            <a 
              href="https://www.mish-mash.recipes/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-link"
            >
              Mish-Mash Recipes
            </a>
            , we offer you a selection of authentic seasonal flavors.
          </p>
          <div className="actions">
            <ActionLink
              href="https://www.mish-mash.recipes/"
              label="Explore more recipes on Mish-Mash"
              external
              tracking={buildActionTracking({
                kind: "external",
                locale: "en",
                location: "menu_hero",
                label: "Mish-Mash Recipes Link",
                target: "https://www.mish-mash.recipes/",
                external: true
              })}
            />
          </div>
        </section>
      </div>
      <SeasonalMenu locale="en" menu={menu} />
    </>
  );
}
