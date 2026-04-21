import type { Metadata } from "next";
import { EnglishReservationsPageCms } from "@/components/en-reservations-page-cms";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  routeKey: "reservations",
  title: "Reservations | The Friendly Bear Sofia",
  description:
    "Call to reserve a table at The Friendly Bear Sofia on Slavyanska 23 and ask about garden seats, fireplace tables, or dinner with friends."
});

export default function Page() {
  return <EnglishReservationsPageCms />;
}
