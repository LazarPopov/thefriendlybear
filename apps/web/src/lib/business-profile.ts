import type { SiteLocale } from "@/lib/site";
import type { BusinessActionKind } from "@/lib/tracking";

export type LocalizedText = Record<SiteLocale, string>;

type BusinessHoursEntry = {
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

type BookingMode = "pending" | "call_whatsapp" | "external_booking" | "hybrid";

type ActionLink = {
  href: string;
  label: string;
  kind: BusinessActionKind;
  external?: boolean;
};

const dayLabels: Record<
  BusinessHoursEntry["dayOfWeek"],
  LocalizedText
> = {
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
    bg: "ул. Славянска 23, София",
    en: "Slavyanska 23, Sofia"
  } satisfies LocalizedText,
  area: {
    bg: "Център на София",
    en: "Central Sofia"
  } satisfies LocalizedText,
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=The+Friendly+Bear+Sofia%2C+Slavyanska+23&query_place_id=ChIJ1_FHY3SFqkAR2aUhguBOwqQ",
  mapsLabel: {
    bg: "Slavyanska 23, Sofia, Bulgaria",
    en: "Slavyanska 23, Sofia, Bulgaria"
  } satisfies LocalizedText,
  phoneNumber: null as string | null,
  phoneDisplay: null as string | null,
  whatsappNumber: null as string | null,
  whatsappPrefill: {
    bg: "Здравейте, искам да попитам за резервация в The Friendly Bear Sofia.",
    en: "Hello, I would like to ask about a reservation at The Friendly Bear Sofia."
  } satisfies LocalizedText,
  bookingMode: "pending" as BookingMode,
  externalBookingUrl: null as string | null,
  externalBookingLabel: {
    bg: "Резервирайте онлайн",
    en: "Book online"
  } satisfies LocalizedText,
  openingHours: [] as BusinessHoursEntry[],
  statusMessages: {
    bg: "Телефонът, WhatsApp, работното време и live booking линкът ще бъдат публикувани веднага след потвърждение.",
    en: "Phone, WhatsApp, opening hours, and the live booking link will be published as soon as they are confirmed."
  } satisfies LocalizedText,
  visitNotes: {
    bg: [
      "Локацията е подходяща за хора, които търсят място за вечеря в центъра на София.",
      "Менюто вече е HTML и може да се отвори бързо от мобилен телефон.",
      "Резервационните канали са подготвени за включване веднага щом финализираме данните."
    ],
    en: [
      "The location is a good fit for visitors looking for dinner in central Sofia.",
      "The menu is already available as fast HTML content on mobile.",
      "Reservation channels are ready to be activated as soon as the final details are confirmed."
    ]
  } satisfies Record<SiteLocale, string[]>,
  arrivalTips: {
    bg: [
      "Използвайте Slavyanska 23 / ул. Славянска 23 в картите за най-точно упътване.",
      "Започнете от менюто, ако искате първо да проверите сезонните предложения.",
      "Отворете страницата за резервации, за да видите най-актуалния канал за booking."
    ],
    en: [
      "Use Slavyanska 23 in maps for the most accurate route.",
      "Start from the menu page if you want to review seasonal dishes first.",
      "Open the reservations page to see the most current booking channel."
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
    { href: "/bg/menu", label: "Меню", kind: "menu" },
    { href: "/bg/reservations", label: "Резервации", kind: "reservations" },
    { href: "/bg/contact", label: "Контакти", kind: "contact" },
    { href: businessProfile.mapUrl, label: "Как да стигнете", kind: "directions", external: true }
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
    { href: "/en/menu", label: "Menu", kind: "menu" },
    { href: "/en/reservations", label: "Reservations", kind: "reservations" },
    { href: "/en/contact", label: "Contact", kind: "contact" },
    { href: businessProfile.mapUrl, label: "Directions", kind: "directions", external: true }
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
