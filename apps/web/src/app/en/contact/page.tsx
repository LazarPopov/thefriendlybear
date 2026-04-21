import type { Metadata } from "next";
import { EnglishContactPageCms } from "@/components/en-contact-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getContactPageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "contact",
  title: "Contact and directions | The Friendly Bear Sofia",
  description:
    "English contact page for The Friendly Bear Sofia with Slavyanska 23 address, directions, menu access, and reservation status."
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
