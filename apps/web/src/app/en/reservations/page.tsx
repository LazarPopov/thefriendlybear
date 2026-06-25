import type { Metadata } from "next";
import { EnglishReservationsPageCms } from "@/components/en-reservations-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getReservationsPageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "reservations",
  title: "Reservations | The Friendly Bear Sofia",
  description:
    "Call to reserve a table at The Friendly Bear Sofia on Slavyanska 23 and ask about the garden, heated smoking area, or indoor dining rooms."
});

export default async function Page() {
  const schema = await getReservationsPageSchemaData("en");

  return (
    <>
      <StructuredData data={schema} />
      <EnglishReservationsPageCms />
    </>
  );
}
