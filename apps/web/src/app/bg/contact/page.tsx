import type { Metadata } from "next";
import { BulgarianContactPageCms } from "@/components/bg-contact-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getContactPageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "contact",
  title: "Контакт, упътвания и FAQ | The Friendly Bear София",
  description:
    "Намерете ни на ул. Славянска 23. Работно време, плащане с карти, правила за домашни любимци и тайната на вратите със ски."
});

export default async function Page() {
  const schema = await getContactPageSchemaData("bg");

  return (
    <>
      <StructuredData data={schema} />
      <BulgarianContactPageCms />
    </>
  );
}
