import type { Metadata } from "next";
import { BulgarianAboutPageCms } from "@/components/bg-about-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getAboutPageSchema } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "about",
  title: "За The Friendly Bear | Уютен ресторант в София с история от 1923 г.",
  description:
    "Запознайте се с историята на нашата бърлога в центъра на София. Традиция, уют и кулинарна страст от 1923 г., вдъхновени от Mish-Mash Recipes."
});

export default function Page() {
  return (
    <>
      <StructuredData data={getAboutPageSchema("bg")} />
      <BulgarianAboutPageCms />
    </>
  );
}
