import type { SiteLocale } from "@/lib/site";

export type BusinessActionKind =
  | "phone"
  | "whatsapp"
  | "external_booking"
  | "menu"
  | "menu_category"
  | "about"
  | "reservations"
  | "contact"
  | "directions";

export type ActionTrackingData = {
  event: string;
  actionType: BusinessActionKind;
  location: string;
  label: string;
  locale: SiteLocale;
  target: string;
  external: boolean;
};

type BuildActionTrackingInput = {
  kind: BusinessActionKind;
  location: string;
  label: string;
  locale: SiteLocale;
  target: string;
  external?: boolean;
};

const eventNameMap: Record<BusinessActionKind, string> = {
  phone: "click_to_call",
  whatsapp: "whatsapp_click",
  external_booking: "external_booking_click",
  menu: "menu_cta_click",
  menu_category: "menu_category_click",
  about: "story_cta_click",
  reservations: "reservation_cta_click",
  contact: "contact_cta_click",
  directions: "directions_click"
};

export function buildActionTracking({
  kind,
  location,
  label,
  locale,
  target,
  external = false
}: BuildActionTrackingInput): ActionTrackingData {
  return {
    event: eventNameMap[kind],
    actionType: kind,
    location,
    label,
    locale,
    target,
    external
  };
}
