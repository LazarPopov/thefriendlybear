import type { Metadata } from "next";
import { EnglishHomePageCms } from "@/components/en-home-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getHomePageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "home",
  title: "Cozy Restaurant & Garden in Sofia Center | The Friendly Bear",
  description:
    "Visit The Friendly Bear on Slavyanska 23. A 1923 urban cabin featuring a secret garden, indoor fireplace, slow-roasted BBQ, and craft beer. English-speaking staff & pet friendly."
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
