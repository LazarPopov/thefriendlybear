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
    "Discover The Friendly Bear: a 1923 house on Slavyanska 23 restored by hand, where old Sofia history meets the comfort of a forest lodge."
});

export default function Page() {
  return (
    <>
      <StructuredData data={getAboutPageSchema("en")} />
      <EnglishAboutPageCms />
    </>
  );
}
