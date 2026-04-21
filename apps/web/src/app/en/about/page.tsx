import type { Metadata } from "next";
import { EnglishAboutPageCms } from "@/components/en-about-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getAboutPageSchema } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "about",
  title: "The Story of The Friendly Bear | 1923 Heritage Restaurant Sofia",
  description:
    "Discover the heritage of our 1923 urban cabin. Built by hand by the founders of Mish-Mash Recipes and Ainterior. A cozy escape in central Sofia."
});

export default function Page() {
  return (
    <>
      <StructuredData data={getAboutPageSchema("en")} />
      <EnglishAboutPageCms />
    </>
  );
}
