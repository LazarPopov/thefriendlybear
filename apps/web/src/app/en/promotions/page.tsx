import type { Metadata } from "next";
import { EnglishPromotionsPageCms } from "@/components/en-promotions-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getPromotionsPageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "promotions",
  title: "Seasonal Offers | The Friendly Bear Sofia",
  description: "Follow seasonal dishes, special evenings, and reasons to come back to The Friendly Bear on Slavyanska 23."
});

export default async function Page() {
  const schema = await getPromotionsPageSchemaData("en");

  return (
    <>
      <StructuredData data={schema} />
      <EnglishPromotionsPageCms />
    </>
  );
}
