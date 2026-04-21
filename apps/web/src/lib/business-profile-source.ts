import type { SiteLocale } from "@/lib/site";

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

export type BusinessProfileSource = {
  source: {
    mode: "manual";
    futureConnector: "google_business_profile";
    syncReady: boolean;
    lastBusinessUpdateNote: LocalizedText;
  };
  identity: {
    address: LocalizedText;
    area: LocalizedText;
    mapUrl: string;
    mapsLabel: LocalizedText;
  };
  contact: {
    phoneNumber: string | null;
    phoneDisplay: string | null;
    whatsappNumber: string | null;
    whatsappPrefill: LocalizedText;
  };
  reservations: {
    bookingMode: BookingMode;
    externalBookingUrl: string | null;
    externalBookingLabel: LocalizedText;
  };
  venue: {
    serviceOptions: LocalizedTextList;
    openingHours: BusinessHoursEntry[];
  };
  messaging: {
    statusMessages: LocalizedText;
    visitNotes: Record<SiteLocale, string[]>;
    arrivalTips: Record<SiteLocale, string[]>;
  };
};

export const businessProfileSource: BusinessProfileSource = {
  source: {
    mode: "manual",
    futureConnector: "google_business_profile",
    syncReady: true,
    lastBusinessUpdateNote: {
      bg: "Обновено от бизнеса преди 9 седмици",
      en: "Updated by this business 9 weeks ago"
    }
  },
  identity: {
    address: {
      bg: "ул. Славянска 23, 1000 София, България",
      en: "Sofia Center, Slavyanska St 23, 1000 Sofia, Bulgaria"
    },
    area: {
      bg: "Център на София",
      en: "Sofia Center"
    },
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=The+Friendly+Bear+Sofia%2C+Slavyanska+23&query_place_id=ChIJ1_FHY3SFqkAR2aUhguBOwqQ",
    mapsLabel: {
      bg: "ул. Славянска 23, 1000 София, България",
      en: "Sofia Center, Slavyanska St 23, 1000 Sofia, Bulgaria"
    }
  },
  contact: {
    phoneNumber: "+359 87 612 2114",
    phoneDisplay: "+359 87 612 2114",
    whatsappNumber: null,
    whatsappPrefill: {
      bg: "Здравейте, искам да попитам за резервация в The Friendly Bear Sofia.",
      en: "Hello, I would like to ask about a reservation at The Friendly Bear Sofia."
    }
  },
  reservations: {
    bookingMode: "call_only",
    externalBookingUrl: null,
    externalBookingLabel: {
      bg: "Онлайн резервация",
      en: "Book online"
    }
  },
  venue: {
    serviceOptions: {
      bg: ["Места на открито", "Камина", "Страхотни коктейли"],
      en: ["Outdoor seating", "Fireplace", "Great cocktails"]
    },
    openingHours: [
      { dayOfWeek: "Monday", closed: true },
      { dayOfWeek: "Tuesday", opens: "17:00", closes: "23:00" },
      { dayOfWeek: "Wednesday", opens: "17:00", closes: "23:00" },
      { dayOfWeek: "Thursday", opens: "17:00", closes: "23:00" },
      { dayOfWeek: "Friday", opens: "17:00", closes: "23:00" },
      { dayOfWeek: "Saturday", opens: "12:00", closes: "23:00" },
      { dayOfWeek: "Sunday", opens: "12:00", closes: "23:00" }
    ]
  },
  messaging: {
    statusMessages: {
      bg: "Телефонът и работното време са активни. За резервация ни се обадете директно и ще помогнем с най-подходящата маса.",
      en: "Phone and opening hours are live. For a reservation, call us directly and we will help with the best available table."
    },
    visitNotes: {
      bg: [
        "Локацията е подходяща за хора, които търсят място за вечеря в центъра на София.",
        "Местата на открито, камината и коктейлите правят профила на ресторанта по-ясен още от първия екран.",
        "Телефонът и работното време са публикувани, за да планирате посещението си спокойно."
      ],
      en: [
        "The location is a good fit for visitors looking for dinner in central Sofia.",
        "Outdoor seating, a fireplace, and craft drinks make the venue easy to understand at a glance.",
        "Phone and opening hours are published so you can plan your visit with confidence."
      ]
    },
    arrivalTips: {
      bg: [
        "Използвайте ул. Славянска 23 в картите за най-точно упътване.",
        "Започнете от менюто, ако искате първо да прегледате сезонните предложения.",
        "Използвайте телефонния бутон, ако искате най-бързия наличен контакт с ресторанта."
      ],
      en: [
        "Use Slavyanska 23 in maps for the most accurate route.",
        "Start from the menu page if you want to review seasonal dishes first.",
        "Use the phone action if you want the fastest available contact path."
      ]
    }
  }
};
