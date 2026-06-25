import type { Metadata } from "next";
import { EnglishHomePageCms } from "@/components/en-home-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getHomePageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "home",
  title: "Bulgarian Restaurant in Sofia Center | The Friendly Bear",
  description:
    "Discover The Friendly Bear, a cozy Bulgarian restaurant in central Sofia with a secret garden, slow-cooked meats, seasonal specials, and Slavyanska 23 address."
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
