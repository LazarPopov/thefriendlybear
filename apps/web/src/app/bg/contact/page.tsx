import type { Metadata } from "next";
import { BulgarianContactPageCms } from "@/components/bg-contact-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getContactPageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "contact",
  title: "Контакти и упътвания | The Friendly Bear Sofia",
  description:
    "Контактна страница за The Friendly Bear Sofia с адрес на ул. Славянска 23, упътвания, меню и резервационен статус."
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
