export type BusinessActionKind =
  | "phone"
  | "whatsapp"
  | "external_booking"
  | "external"
  | "menu"
  | "menu_category"
  | "about"
  | "reservations"
  | "contact"
  | "directions"
  | "facebook"
  | "instagram"
  | "language";

export type ActionTrackingData = {
  event: string;
  actionType: BusinessActionKind;
  location: string;
  label: string;
  locale: string;
  target: string;
  external: boolean;
};

type BuildActionTrackingInput = {
  kind: BusinessActionKind;
  location: string;
  label: string;
  locale: string;
  target: string;
  external?: boolean;
};

const eventNameMap: Record<BusinessActionKind, string> = {
  phone: "click_to_call",
  whatsapp: "whatsapp_click",
  external_booking: "external_booking_click",
  external: "external_link_click",
  menu: "menu_cta_click",
  menu_category: "menu_category_click",
  about: "story_cta_click",
  reservations: "reservation_cta_click",
  contact: "contact_cta_click",
  directions: "directions_click",
  facebook: "social_click",
  instagram: "social_click",
  language: "language_switch_click"
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

export function getActionTrackingAttributes(tracking: ActionTrackingData) {
  return {
    "data-track-event": tracking.event,
    "data-track-action-type": tracking.actionType,
    "data-track-location": tracking.location,
    "data-track-label": tracking.label,
    "data-track-locale": tracking.locale,
    "data-track-target": tracking.target,
    "data-track-external": String(tracking.external)
  };
}
