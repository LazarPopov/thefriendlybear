import type { Metadata } from "next";
import { EnglishHomePageCms } from "@/components/en-home-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getHomePageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "home",
  title: "Authentic Bulgarian Restaurant & Garden in Sofia Center | The Friendly Bear",
  description:
    "Discover The Friendly Bear, an authentic Bulgarian restaurant in central Sofia. Cozy atmosphere, secret garden, slow-cooked meats, and seasonal specials on Slavyanska 23."
});

export default async function Page() {
  const schema = await getHomePageSchemaData("en");

  return (
    <>
      <StructuredData data={schema} />
      <EnglishHomePageCms />
    </>
  );
}
