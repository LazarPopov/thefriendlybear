import type { SiteLocale } from "@/lib/site";
import type { BusinessActionKind } from "@/lib/tracking";

export type LocalizedText = Record<SiteLocale, string>;
export type LocalizedTextList = Record<SiteLocale, string[]>;

export type BusinessHoursEntry = {
  dayOfWeek:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  opens?: string;
  closes?: string;
  closed?: boolean;
};

export type BookingMode =
  | "pending"
  | "call_only"
  | "call_whatsapp"
  | "external_booking"
  | "hybrid";

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

export const businessProfile = {
  address: {
    bg: "ул. Славянска 23, 1000 София, България",
    en: "Sofia Center, Slavyanska St 23, 1000 Sofia, Bulgaria"
  } satisfies LocalizedText,
  area: {
    bg: "Център на София",
    en: "Sofia Center"
  } satisfies LocalizedText,
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=The+Friendly+Bear+Sofia%2C+Slavyanska+23&query_place_id=ChIJ1_FHY3SFqkAR2aUhguBOwqQ",
  mapsLabel: {
    bg: "Sofia Center, Slavyanska St 23, 1000 Sofia, Bulgaria",
    en: "Sofia Center, Slavyanska St 23, 1000 Sofia, Bulgaria"
  } satisfies LocalizedText,
  phoneNumber: "+359 87 612 2114",
  phoneDisplay: "+359 87 612 2114",
  whatsappNumber: null as string | null,
  whatsappPrefill: {
    bg: "Здравейте, искам да попитам за резервация в The Friendly Bear Sofia.",
    en: "Hello, I would like to ask about a reservation at The Friendly Bear Sofia."
  } satisfies LocalizedText,
  bookingMode: "call_only" as BookingMode,
  externalBookingUrl: null as string | null,
  externalBookingLabel: {
    bg: "Резервирайте онлайн",
    en: "Book online"
  } satisfies LocalizedText,
  serviceOptions: {
    bg: ["Открити места", "Камина", "Страхотни коктейли"],
    en: ["Outdoor seating", "Fireplace", "Great cocktails"]
  } satisfies LocalizedTextList,
  openingHours: [
    { dayOfWeek: "Monday", closed: true },
    { dayOfWeek: "Tuesday", opens: "17:00", closes: "23:00" },
    { dayOfWeek: "Wednesday", opens: "17:00", closes: "23:00" },
    { dayOfWeek: "Thursday", opens: "17:00", closes: "23:00" },
    { dayOfWeek: "Friday", opens: "17:00", closes: "23:00" },
    { dayOfWeek: "Saturday", opens: "12:00", closes: "23:00" },
    { dayOfWeek: "Sunday", opens: "12:00", closes: "23:00" }
  ] as BusinessHoursEntry[],
  statusMessages: {
    bg: "Телефонът и работното време са публикувани. За резервация ни се обадете директно и ще помогнем с най-подходящата маса.",
    en: "Phone and opening hours are live. For a reservation, call us directly and we will help with the best available table."
  } satisfies LocalizedText,
  visitNotes: {
    bg: [
      "Локацията е подходяща за хора, които търсят място за вечеря в центъра на София.",
      "Има открити места, отопляема зона за пушачи и крафт напитки за спокойна вечер.",
      "Телефонът и работното време са активни, за да планирате посещението си спокойно."
    ],
    en: [
      "The location is a good fit for visitors looking for dinner in central Sofia.",
      "Outdoor seating, a heated smoking area, and craft drinks make the venue easy to understand at a glance.",
      "Phone and opening hours are published so you can plan your visit with confidence."
    ]
  } satisfies Record<SiteLocale, string[]>,
  arrivalTips: {
    bg: [
      "Използвайте Slavyanska 23 / ул. Славянска 23 в картите за най-точно упътване.",
      "Започнете от менюто, ако искате първо да проверите сезонните предложения.",
      "Използвайте телефонния бутон, ако искате най-бързия наличен контакт с ресторанта."
    ],
    en: [
      "Use Slavyanska 23 in maps for the most accurate route.",
      "Start from the menu page if you want to review seasonal dishes first.",
      "Use the phone action if you want the fastest available contact path."
    ]
  } satisfies Record<SiteLocale, string[]>
} as const;

function normalizePhone(input: string) {
  return input.replace(/[^\d+]/g, "");
}

function normalizeWhatsapp(input: string) {
  return input.replace(/[^\d]/g, "");
}

export function getPhoneHref() {
  if (!businessProfile.phoneNumber) {
    return null;
  }

  return `tel:${normalizePhone(businessProfile.phoneNumber)}`;
}

export function getWhatsAppHref(locale: SiteLocale) {
  if (!businessProfile.whatsappNumber) {
    return null;
  }

  const message = encodeURIComponent(businessProfile.whatsappPrefill[locale]);
  return `https://wa.me/${normalizeWhatsapp(businessProfile.whatsappNumber)}?text=${message}`;
}

export function getExternalBookingHref() {
  return businessProfile.externalBookingUrl;
}

export function hasOpeningHours() {
  return businessProfile.openingHours.length > 0;
}

export function getOpeningHoursRows(locale: SiteLocale) {
  if (!hasOpeningHours()) {
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

  return businessProfile.openingHours.map((entry) => ({
    label: dayLabels[entry.dayOfWeek][locale],
    value: entry.closed ? (locale === "bg" ? "Почивен ден" : "Closed") : `${entry.opens} - ${entry.closes}`
  }));
}

export function getBgPrimaryActions(): ActionLink[] {
  const actions: ActionLink[] = [];

  const phoneHref = getPhoneHref();
  const whatsappHref = getWhatsAppHref("bg");
  const bookingHref = getExternalBookingHref();

  if (phoneHref) {
    actions.push({ href: phoneHref, label: "Обади се / Резервирай", kind: "phone" });
  }

  if (whatsappHref) {
    actions.push({ href: whatsappHref, label: "WhatsApp", kind: "whatsapp", external: true });
  }

  if (bookingHref) {
    actions.push({
      href: bookingHref,
      label: businessProfile.externalBookingLabel.bg,
      kind: "external_booking",
      external: true
    });
  }

  actions.push(
    { href: businessProfile.mapUrl, label: "Как да стигнете", kind: "directions", external: true },
    { href: "/bg/menu", label: "Меню", kind: "menu" },
    { href: "/bg/reservations", label: "Резервации", kind: "reservations" },
    { href: "/bg/contact", label: "Контакти", kind: "contact" }
  );

  return actions;
}

export function getEnPrimaryActions(): ActionLink[] {
  const actions: ActionLink[] = [];

  const phoneHref = getPhoneHref();
  const whatsappHref = getWhatsAppHref("en");
  const bookingHref = getExternalBookingHref();

  if (phoneHref) {
    actions.push({ href: phoneHref, label: "Call / Reserve", kind: "phone" });
  }

  if (whatsappHref) {
    actions.push({ href: whatsappHref, label: "WhatsApp", kind: "whatsapp", external: true });
  }

  if (bookingHref) {
    actions.push({
      href: bookingHref,
      label: businessProfile.externalBookingLabel.en,
      kind: "external_booking",
      external: true
    });
  }

  actions.push(
    { href: businessProfile.mapUrl, label: "Directions", kind: "directions", external: true },
    { href: "/en/menu", label: "Menu", kind: "menu" },
    { href: "/en/reservations", label: "Reservations", kind: "reservations" },
    { href: "/en/contact", label: "Contact", kind: "contact" }
  );

  return actions;
}

export function getBgContactStatusRows() {
  return [
    {
      label: "Адрес и упътвания",
      status: "Активни сега"
    },
    {
      label: "HTML меню",
      status: "Активно сега"
    },
    {
      label: "Телефон",
      status: businessProfile.phoneNumber ? "Активен" : "Очаква потвърждение"
    },
    {
      label: "WhatsApp",
      status: businessProfile.whatsappNumber ? "Активен" : "Очаква потвърждение"
    },
    {
      label: "Работно време",
      status: hasOpeningHours() ? "Публикувано" : "Очаква потвърждение"
    }
  ];
}

export function getEnContactStatusRows() {
  return [
    {
      label: "Address and directions",
      status: "Live now"
    },
    {
      label: "HTML menu",
      status: "Live now"
    },
    {
      label: "Phone",
      status: businessProfile.phoneNumber ? "Active" : "Pending confirmation"
    },
    {
      label: "WhatsApp",
      status: businessProfile.whatsappNumber ? "Active" : "Pending confirmation"
    },
    {
      label: "Opening hours",
      status: hasOpeningHours() ? "Published" : "Pending confirmation"
    }
  ];
}

export function getBgReservationStatusRows() {
  return [
    { label: "Меню и адрес", status: "Готови" },
    { label: "Страница за резервации", status: "Готова" },
    {
      label: "Call now",
      status: businessProfile.phoneNumber ? "Активен" : "Чака номер"
    },
    {
      label: "WhatsApp",
      status: businessProfile.whatsappNumber ? "Активен" : "Чака номер"
    },
    {
      label: "External booking",
      status: businessProfile.externalBookingUrl ? "Активен" : "По избор"
    }
  ];
}

export function getEnReservationStatusRows() {
  return [
    { label: "Menu and address", status: "Ready" },
    { label: "Reservations page", status: "Ready" },
    {
      label: "Call now",
      status: businessProfile.phoneNumber ? "Active" : "Waiting for number"
    },
    {
      label: "WhatsApp",
      status: businessProfile.whatsappNumber ? "Active" : "Waiting for number"
    },
    {
      label: "External booking",
      status: businessProfile.externalBookingUrl ? "Active" : "Optional"
    }
  ];
}
