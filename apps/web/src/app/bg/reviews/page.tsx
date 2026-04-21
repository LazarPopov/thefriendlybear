import type { Metadata } from "next";
import { BulgarianReviewsPageCms } from "@/components/bg-reviews-page-cms";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "reviews",
  title: "Отзиви и социално доказателство | The Friendly Bear Sofia",
  description:
    "Българска страница за социално доказателство на The Friendly Bear Sofia, подготвена за Google отзиви, TripAdvisor откъси и keyword-driven discovery."
});

export default function Page() {
  return <BulgarianReviewsPageCms />;
}
