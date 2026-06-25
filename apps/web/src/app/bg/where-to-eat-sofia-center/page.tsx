import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { WhereToEatPage } from "@/components/where-to-eat-page";
import { buildPageMetadata } from "@/lib/metadata";
import { getWhereToEatPageSchema } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "whereToEat",
  title: "Къде да хапнете в центъра на София | The Friendly Bear",
  description:
    "Практичен избор за вечеря и уикенд обяд в центъра на София: градина, бавно готвени меса, вегетариански опции и резервации на Славянска 23."
});

export default function Page() {
  return (
    <>
      <StructuredData data={getWhereToEatPageSchema("bg")} />
      <WhereToEatPage locale="bg" />
    </>
  );
}
