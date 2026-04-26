import type { Metadata } from "next";
import { EnglishAboutPageCms } from "@/components/en-about-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getAboutPageSchema } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "about",
  title: "About The Friendly Bear | Cozy Restaurant in Sofia with 1923 Heritage",
  description:
    "Learn about our journey on Slavyanska 23. A 1923 Sofia house transformed into a cozy urban den, combining traditional heritage with modern culinary passion."
});

export default function Page() {
  return (
    <>
      <StructuredData data={getAboutPageSchema("en")} />
      <EnglishAboutPageCms />
    </>
  );
}
