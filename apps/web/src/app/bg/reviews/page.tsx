import type { Metadata } from "next";
import { BulgarianReviewsPageCms } from "@/components/bg-reviews-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getReviewsPageSchemaData } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "reviews",
  title: "Отзиви на гости и впечатления | The Friendly Bear София",
  description:
    "Вижте защо гостите обичат The Friendly Bear. Високи оценки за нашето агнешко, крафт бира и атмосферата от 1923 г. Прочетете реални отзиви от София."
});

export default async function Page() {
  const schema = await getReviewsPageSchemaData("bg");

  return (
    <>
      <StructuredData data={schema} />
      <BulgarianReviewsPageCms />
    </>
  );
}
