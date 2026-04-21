import type { Metadata } from "next";
import { BulgarianReservationsPageCms } from "@/components/bg-reservations-page-cms";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "reservations",
  title: "Резервации | The Friendly Bear Sofia",
  description:
    "Резервационна страница за The Friendly Bear Sofia с най-актуалния booking статус, меню и упътвания до Slavyanska 23."
});

export default function Page() {
  return <BulgarianReservationsPageCms />;
}
