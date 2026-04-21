import type { Metadata } from "next";
import { EnglishReviewsPageCms } from "@/components/en-reviews-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getReviewsPageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "reviews",
  title: "Guest Reviews & Ratings | The Friendly Bear Sofia",
  description:
    "See why guests love The Friendly Bear. High ratings for our slow-roasted lamb, craft beer, and cozy 1923 atmosphere. Read real reviews from our Sofia community."
});

export default async function Page() {
  const schema = await getReviewsPageSchemaData("en");

  return (
    <>
      <StructuredData data={schema} />
      <EnglishReviewsPageCms />
    </>
  );
}
