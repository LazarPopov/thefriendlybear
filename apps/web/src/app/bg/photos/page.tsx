import type { Metadata } from "next";
import { PhotosPage } from "@/components/photos-page";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getPhotosPageSchema } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "photos",
  title: "Снимки от The Friendly Bear Sofia | Храна, градина и интериор",
  description:
    "Вижте снимки от The Friendly Bear Sofia: сезонни ястия, скрита градина и уютен интериор на ул. Славянска 23."
});

export default function Page() {
  return (
    <>
      <StructuredData data={getPhotosPageSchema("bg")} />
      <PhotosPage locale="bg" />
    </>
  );
}
