import type { Metadata } from "next";
import { BulgarianAboutPageCms } from "@/components/bg-about-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getAboutPageSchema } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "about",
  title: "Историята на The Friendly Bear | Ресторант с история от 1923 г.",
  description:
    "Открийте историята на нашата градска бърлога от 1923 г. Създадена с любов от основателите на Mish-Mash Recipes и Ainterior в центъра на София."
});

export default function Page() {
  return (
    <>
      <StructuredData data={getAboutPageSchema("bg")} />
      <BulgarianAboutPageCms />
    </>
  );
}
