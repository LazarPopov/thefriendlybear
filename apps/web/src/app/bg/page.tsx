import type { Metadata } from "next";
import { BulgarianHomePageCms } from "@/components/bg-home-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getHomePageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "home",
  title: "Уютен ресторант и градина в центъра на София | The Friendly Bear",
  description:
    "The Friendly Bear Sofia е уютен ресторант в центъра на София, на ул. „Славянска“ 23 - с градина, отопляема зона за пушачи, сезонно меню, бавно готвени меса и вегетариански опции."
});

export default async function Page() {
  const schema = await getHomePageSchemaData("bg");

  return (
    <>
      <StructuredData data={schema} />
      <BulgarianHomePageCms />
    </>
  );
}
