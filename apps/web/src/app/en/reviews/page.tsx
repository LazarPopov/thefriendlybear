import type { Metadata } from "next";
import { EnglishReviewsPageCms } from "@/components/en-reviews-page-cms";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "reviews",
  title: "Reviews and social proof | The Friendly Bear Sofia",
  description:
    "English social proof page for The Friendly Bear Sofia prepared for Google reviews, TripAdvisor snippets, and keyword-driven restaurant discovery."
});

export default function Page() {
  return <EnglishReviewsPageCms />;
}
