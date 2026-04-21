import type { Metadata } from "next";
import { TouristsPageCms } from "@/components/tourists-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getTouristsHubSchema } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "tourists",
  title: "Sofia Visitor Guide: Dining & Hospitality | The Friendly Bear",
  description:
    "A traveler's guide to dining in central Sofia. Discover our 1923 heritage cabin, English-speaking staff, and secret garden. Perfect for international guests."
});

export default function Page() {
  return (
    <>
      <StructuredData data={getTouristsHubSchema("en")} />
      <TouristsPageCms locale="en" />
    </>
  );
}
