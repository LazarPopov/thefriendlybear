import type { Metadata } from "next";
import { BulgarianPromotionsPageCms } from "@/components/bg-promotions-page-cms";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "promotions",
  title: "Промоции в The Friendly Bear Sofia",
  description: "Промоции и сезонни предложения, управлявани от CMS."
});

export default function Page() {
  return <BulgarianPromotionsPageCms />;
}
