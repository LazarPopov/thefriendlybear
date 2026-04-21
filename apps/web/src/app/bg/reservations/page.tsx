import type { Metadata } from "next";
import { BulgarianReservationsPageCms } from "@/components/bg-reservations-page-cms";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  locale: "bg",
  routeKey: "reservations",
  title: "Резервации | The Friendly Bear Sofia",
  description:
    "Обадете се за маса в The Friendly Bear Sofia на ул. Славянска 23 и попитайте за градината, камината или вечеря с приятели."
});

export default function Page() {
  return <BulgarianReservationsPageCms />;
}
