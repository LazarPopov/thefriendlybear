import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { WhereToEatPage } from "@/components/where-to-eat-page";
import { buildPageMetadata } from "@/lib/metadata";
import { getWhereToEatPageSchema } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "whereToEat",
  title: "Where to Eat in Sofia Center | The Friendly Bear",
  description:
    "A practical dinner and weekend lunch answer for Sofia Center: garden seating, slow-cooked meats, vegetarian options, and reservations on Slavyanska 23."
});

export default function Page() {
  return (
    <>
      <StructuredData data={getWhereToEatPageSchema("en")} />
      <WhereToEatPage locale="en" />
    </>
  );
}
