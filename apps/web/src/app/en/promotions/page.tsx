import type { Metadata } from "next";
import { EnglishPromotionsPageCms } from "@/components/en-promotions-page-cms";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "promotions",
  title: "Promotions at The Friendly Bear Sofia",
  description: "CMS-managed promotions and seasonal offers for The Friendly Bear Sofia."
});

export default function Page() {
  return <EnglishPromotionsPageCms />;
}
