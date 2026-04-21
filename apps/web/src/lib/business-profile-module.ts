import type { BusinessActionKind } from "@/lib/tracking";
import type { SiteLocale } from "@/lib/site";
import {
  businessProfileSource,
  type BookingMode,
  type BusinessHoursEntry,
  type LocalizedText,
  type LocalizedTextList
} from "@/lib/business-profile-source";
import {
  createBusinessProfileFallbackEntry,
  normalizeBusinessProfileEntry,
  type FrontendBusinessProfile
} from "@/lib/cms/business-profile-adapter";
import { fetchStrapiSingle } from "@/lib/cms/strapi";

type ActionLink = {
  href: string;
  label: string;
  kind: BusinessActionKind;
  external?: boolean;
};

const dayLabels: Record<BusinessHoursEntry["dayOfWeek"], LocalizedText> = {
  Monday: { bg: "Понеделник", en: "Monday" },
  Tuesday: { bg: "Вторник", en: "Tuesday" },
  Wednesday: { bg: "Сряда", en: "Wednesday" },
  Thursday: { bg: "Четвъртък", en: "Thursday" },
  Friday: { bg: "Петък", en: "Friday" },
  Saturday: { bg: "Събота", en: "Saturday" },
  Sunday: { bg: "Неделя", en: "Sunday" }
};

export type { BookingMode, BusinessHoursEntry, LocalizedText, LocalizedTextList };
export type { FrontendBusinessProfile };
export { businessProfileSource };
export const businessProfileFallbackEntry = createBusinessProfileFallbackEntry(businessProfileSource);

export const businessProfile: FrontendBusinessProfile = normalizeBusinessProfileEntry(businessProfileFallbackEntry);

function mergeBusinessProfileEntry(
  entry: Partial<typeof businessProfileFallbackEntry> | null | undefined
) {
  if (!entry) {
    return businessProfileFallbackEntry;
  }

  return {
    ...businessProfileFallbackEntry,
    ...entry,
    lastBusinessUpdateNote: entry.lastBusinessUpdateNote ?? businessProfileFallbackEntry.lastBusinessUpdateNote,
    address: entry.address ?? businessProfileFallbackEntry.address,
    area: entry.area ?? businessProfileFallbackEntry.area,
    mapsLabel: entry.mapsLabel ?? businessProfileFallbackEntry.mapsLabel,
    whatsappPrefill: entry.whatsappPrefill ?? businessProfileFallbackEntry.whatsappPrefill,
    externalBookingLabel: entry.externalBookingLabel ?? businessProfileFallbackEntry.externalBookingLabel,
    serviceOptions: entry.serviceOptions ?? businessProfileFallbackEntry.serviceOptions,
    openingHours: entry.openingHours ?? businessProfileFallbackEntry.openingHours,
    statusMessages: entry.statusMessages ?? businessProfileFallbackEntry.statusMessages,
    visitNotes: entry.visitNotes ?? businessProfileFallbackEntry.visitNotes,
    arrivalTips: entry.arrivalTips ?? businessProfileFallbackEntry.arrivalTips
  };
}

export async function getBusinessProfileData(): Promise<FrontendBusinessProfile> {
  const entry = await fetchStrapiSingle<Partial<typeof businessProfileFallbackEntry>>(
    "/api/business-profile?populate=*"
  );

  return normalizeBusinessProfileEntry(mergeBusinessProfileEntry(entry));
}

function normalizePhone(input: string) {
  return input.replace(/[^\d+]/g, "");
}

function normalizeWhatsapp(input: string) {
  return input.replace(/[^\d]/g, "");
}

export function getPhoneHref(profile: FrontendBusinessProfile = businessProfile) {
  if (!profile.phoneNumber) {
    return null;
  }

  return `tel:${normalizePhone(profile.phoneNumber)}`;
}

export function getWhatsAppHref(locale: SiteLocale, profile: FrontendBusinessProfile = businessProfile) {
  if (!profile.whatsappNumber) {
    return null;
  }

  const message = encodeURIComponent(profile.whatsappPrefill[locale]);
  return `https://wa.me/${normalizeWhatsapp(profile.whatsappNumber)}?text=${message}`;
}

export function getExternalBookingHref(profile: FrontendBusinessProfile = businessProfile) {
  return profile.externalBookingUrl;
}

export function hasOpeningHours(profile: FrontendBusinessProfile = businessProfile) {
  return profile.openingHours.length > 0;
}

export function getOpeningHoursRows(locale: SiteLocale, profile: FrontendBusinessProfile = businessProfile) {
  if (!hasOpeningHours(profile)) {
    return [
      {
        label: locale === "bg" ? "Работно време" : "Opening hours",
        value:
          locale === "bg"
            ? "Ще бъде публикувано след потвърждение."
            : "Will be published after confirmation."
      }
    ];
  }

  return profile.openingHours.map((entry) => ({
    label: dayLabels[entry.dayOfWeek][locale],
    value: entry.closed ? (locale === "bg" ? "Почивен ден" : "Closed") : `${entry.opens} - ${entry.closes}`
  }));
}

export function getBgPrimaryActions(profile: FrontendBusinessProfile = businessProfile): ActionLink[] {
  const actions: ActionLink[] = [];
  const phoneHref = getPhoneHref(profile);
  const whatsappHref = getWhatsAppHref("bg", profile);
  const bookingHref = getExternalBookingHref(profile);

  if (phoneHref) {
    actions.push({ href: phoneHref, label: "Обади се / Резервирай", kind: "phone" });
  }

  if (whatsappHref) {
    actions.push({ href: whatsappHref, label: "WhatsApp", kind: "whatsapp", external: true });
  }

  if (bookingHref) {
    actions.push({
      href: bookingHref,
      label: profile.externalBookingLabel.bg,
      kind: "external_booking",
      external: true
    });
  }

  actions.push(
    { href: profile.mapUrl, label: "Как да стигнете", kind: "directions", external: true },
    { href: "/bg/menu", label: "Меню", kind: "menu" },
    { href: "/bg/reservations", label: "Резервации", kind: "reservations" },
    { href: "/bg/contact", label: "Контакти", kind: "contact" }
  );

  return actions;
}

export function getEnPrimaryActions(profile: FrontendBusinessProfile = businessProfile): ActionLink[] {
  const actions: ActionLink[] = [];
  const phoneHref = getPhoneHref(profile);
  const whatsappHref = getWhatsAppHref("en", profile);
  const bookingHref = getExternalBookingHref(profile);

  if (phoneHref) {
    actions.push({ href: phoneHref, label: "Call / Reserve", kind: "phone" });
  }

  if (whatsappHref) {
    actions.push({ href: whatsappHref, label: "WhatsApp", kind: "whatsapp", external: true });
  }

  if (bookingHref) {
    actions.push({
      href: bookingHref,
      label: profile.externalBookingLabel.en,
      kind: "external_booking",
      external: true
    });
  }

  actions.push(
    { href: profile.mapUrl, label: "Directions", kind: "directions", external: true },
    { href: "/en/menu", label: "Menu", kind: "menu" },
    { href: "/en/reservations", label: "Reservations", kind: "reservations" },
    { href: "/en/contact", label: "Contact", kind: "contact" }
  );

  return actions;
}

export function getBgContactStatusRows(profile: FrontendBusinessProfile = businessProfile) {
  return [
    { label: "Адрес и упътвания", status: "Активни сега" },
    { label: "HTML меню", status: "Активно сега" },
    { label: "Телефон", status: profile.phoneNumber ? "Активен" : "Очаква потвърждение" },
    { label: "WhatsApp", status: profile.whatsappNumber ? "Активен" : "Не се използва" },
    { label: "Работно време", status: hasOpeningHours(profile) ? "Публикувано" : "Очаква потвърждение" }
  ];
}

export function getEnContactStatusRows(profile: FrontendBusinessProfile = businessProfile) {
  return [
    { label: "Address and directions", status: "Live now" },
    { label: "HTML menu", status: "Live now" },
    { label: "Phone", status: profile.phoneNumber ? "Active" : "Pending confirmation" },
    { label: "WhatsApp", status: profile.whatsappNumber ? "Active" : "Not used right now" },
    { label: "Opening hours", status: hasOpeningHours(profile) ? "Published" : "Pending confirmation" }
  ];
}

export function getBgReservationStatusRows(profile: FrontendBusinessProfile = businessProfile) {
  return [
    { label: "Меню и адрес", status: "Готови" },
    { label: "Страница за резервации", status: "Готова" },
    { label: "Обаждане", status: profile.phoneNumber ? "Активно" : "Чака номер" },
    { label: "WhatsApp", status: profile.whatsappNumber ? "Активен" : "Не се използва" },
    { label: "Външен booking", status: profile.externalBookingUrl ? "Активен" : "Не се използва" }
  ];
}

export function getEnReservationStatusRows(profile: FrontendBusinessProfile = businessProfile) {
  return [
    { label: "Menu and address", status: "Ready" },
    { label: "Reservations page", status: "Ready" },
    { label: "Phone", status: profile.phoneNumber ? "Active" : "Waiting for number" },
    { label: "WhatsApp", status: profile.whatsappNumber ? "Active" : "Not used right now" },
    { label: "External booking", status: profile.externalBookingUrl ? "Active" : "Not used right now" }
  ];
}
