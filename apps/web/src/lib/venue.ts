import type { SiteLocale } from "@/lib/site";

type LocalizedText = Record<SiteLocale, string>;

export const venueInfo = {
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
  reservationStatus: {
    bg: "Телефонът, WhatsApp и live booking линкът ще бъдат публикувани веднага след потвърждение.",
    en: "Phone, WhatsApp, and the live booking link will be published as soon as they are confirmed."
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

export const bgCoreActions = [
  { href: "/bg/menu", label: "Меню" },
  { href: "/bg/reservations", label: "Резервации" },
  { href: "/bg/contact", label: "Контакти" },
  { href: venueInfo.mapUrl, label: "Как да стигнете", external: true }
] as const;
