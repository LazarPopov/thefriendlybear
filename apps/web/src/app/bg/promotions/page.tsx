import type { Metadata } from "next";
import { BulgarianPromotionsPageCms } from "@/components/bg-promotions-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getPromotionsPageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "promotions",
  title: "Сезонни предложения | The Friendly Bear Sofia",
  description: "Следете сезонните предложения, специалните ястия и поводи за спокойна вечер на ул. Славянска 23."
});

export default async function Page() {
  const schema = await getPromotionsPageSchemaData("bg");

  return (
    <>
      <StructuredData data={schema} />
      <BulgarianPromotionsPageCms />
    </>
  );
}
