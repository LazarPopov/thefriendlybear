import type { Metadata } from "next";
import { PhotosPage } from "@/components/photos-page";
import { StructuredData } from "@/components/structured-data";
import { buildPageMetadata } from "@/lib/metadata";
import { getPhotosPageSchema } from "@/lib/schema";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "photos",
  title: "The Friendly Bear Photos | Food, Garden & Interior",
  description:
    "See photos from The Friendly Bear Sofia: seasonal food, the hidden garden, and cozy interior rooms on Slavyanska 23."
});

export default function Page() {
  return (
    <>
      <StructuredData data={getPhotosPageSchema("en")} />
      <PhotosPage locale="en" />
    </>
  );
}
