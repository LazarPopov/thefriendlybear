import type { Metadata } from "next";
import { EnglishReservationsPageCms } from "@/components/en-reservations-page-cms";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "reservations",
  title: "Reservations | The Friendly Bear Sofia",
  description:
    "English reservations page for The Friendly Bear Sofia with current booking status, menu access, and directions to Slavyanska 23."
});

export default function Page() {
  return <EnglishReservationsPageCms />;
}
