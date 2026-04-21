import type { Metadata } from "next";
import { EnglishContactPageCms } from "@/components/en-contact-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getContactPageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "contact",
  title: "Contact, Directions & FAQ | The Friendly Bear Sofia",
  description:
    "Find us at Slavyanska 23. Opening hours, card payment info, pet-friendly rules, and the secret of the sliding ski doors."
});

export default async function Page() {
  const schema = await getContactPageSchemaData("en");

  return (
    <>
      <StructuredData data={schema} />
      <EnglishContactPageCms />
    </>
  );
}
