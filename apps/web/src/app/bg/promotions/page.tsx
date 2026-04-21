import type { Metadata } from "next";
import { BulgarianPromotionsPageCms } from "@/components/bg-promotions-page-cms";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "promotions",
  title: "Сезонни предложения | The Friendly Bear Sofia",
  description: "Следете сезонните предложения, специалните ястия и поводи за спокойна вечер на ул. Славянска 23."
});

export default function Page() {
  return <BulgarianPromotionsPageCms />;
}
