import type { Metadata } from "next";
import { EnglishPromotionsPageCms } from "@/components/en-promotions-page-cms";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "promotions",
  title: "Seasonal Offers | The Friendly Bear Sofia",
  description: "Follow seasonal dishes, special evenings, and reasons to come back to The Friendly Bear on Slavyanska 23."
});

export default function Page() {
  return <EnglishPromotionsPageCms />;
}
