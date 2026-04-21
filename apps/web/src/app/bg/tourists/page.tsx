import type { Metadata } from "next";
import { TouristsPageCms } from "@/components/tourists-page-cms";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getTouristsHubSchema } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "tourists",
  title: "Наръчник за туристи в София: Храна и гостоприемство | The Friendly Bear",
  description:
    "Наръчник за международни гости в София. Открийте нашата къща от 1923 г., екип с английски език и скрита градина в центъра."
});

export default function Page() {
  return (
    <>
      <StructuredData data={getTouristsHubSchema("bg")} />
      <TouristsPageCms locale="bg" />
    </>
  );
}
