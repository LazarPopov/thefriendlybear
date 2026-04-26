import type { SiteLocale } from "@/lib/site";

export type StaticVenueGalleryImage = {
  src: string;
  alt: string;
};

type LocalizedAlt = Record<SiteLocale, string>;

function getLocalizedImage(src: string, alts: LocalizedAlt, locale: SiteLocale): StaticVenueGalleryImage {
  return {
    src,
    alt: alts[locale] || alts.en
  };
}

export const getGardenGalleryImages = (locale: SiteLocale): StaticVenueGalleryImage[] => [
  getLocalizedImage(
    "/images/garden_1.jpg",
    {
      bg: "Мечата градина в The Friendly Bear София",
      en: "The secret garden at The Friendly Bear Sofia"
    },
    locale
  ),
  getLocalizedImage(
    "/images/garden_2.jpg",
    {
      bg: "Мечата тераса в The Friendly Bear София",
      en: "The cozy terrace at The Friendly Bear Sofia"
    },
    locale
  ),
  getLocalizedImage(
    "/images/garden_3.jpg",
    {
      bg: "Гледка от бърлогата в The Friendly Bear София",
      en: "View from the den at The Friendly Bear Sofia"
    },
    locale
  )
];

export const getInteriorGalleryImages = (locale: SiteLocale): StaticVenueGalleryImage[] => [
  getLocalizedImage(
    "/images/interior_1.jpg",
    {
      bg: "Уютна бърлога в The Friendly Bear София",
      en: "Cozy den interior at The Friendly Bear Sofia"
    },
    locale
  ),
  getLocalizedImage(
    "/images/interior_2.jpg",
    {
      bg: "Маса за дълги разговори в The Friendly Bear София",
      en: "Dining table for long conversations at The Friendly Bear Sofia"
    },
    locale
  ),
  getLocalizedImage(
    "/images/interior_3.jpg",
    {
      bg: "Цветният коридор в The Friendly Bear София",
      en: "The colorful hallway at The Friendly Bear Sofia"
    },
    locale
  ),
  getLocalizedImage(
    "/images/interior_4.jpg",
    {
      bg: "Мечо в The Friendly Bear София",
      en: "Teddy bear decor at The Friendly Bear Sofia"
    },
    locale
  ),
  getLocalizedImage(
    "/images/interior_5.jpg",
    {
      bg: "Уютна вечер в The Friendly Bear София",
      en: "Cozy evening atmosphere at The Friendly Bear Sofia"
    },
    locale
  )
];

export const getFoodGalleryImages = (locale: SiteLocale): StaticVenueGalleryImage[] => [
  getLocalizedImage(
    "/images/food_1.jpg",
    {
      bg: "Крехко агнешко с бейби картофи в The Friendly Bear София",
      en: "Signature slow-roasted lamb with baby potatoes at The Friendly Bear Sofia"
    },
    locale
  ),
  getLocalizedImage(
    "/images/food_2.jpg",
    {
      bg: "Свежа сезонна салата от седмичното ни меню в The Friendly Bear София",
      en: "Fresh seasonal salad from The Friendly Bear Sofia weekly menu"
    },
    locale
  ),
  getLocalizedImage(
    "/images/food_3.jpg",
    {
      bg: "Хрупкави лучени кръгчета със сос в The Friendly Bear София",
      en: "Crispy onion rings with sauce at The Friendly Bear Sofia"
    },
    locale
  ),
  getLocalizedImage(
    "/images/food_4.jpg",
    {
      bg: "Традиционно българско сезонно ястие в The Friendly Bear София",
      en: "Traditional Bulgarian seasonal dish at The Friendly Bear Sofia"
    },
    locale
  ),
  getLocalizedImage(
    "/images/food_5.jpg",
    {
      bg: "Вегетарианско ястие в The Friendly Bear София",
      en: "Vegetarian-friendly plate at The Friendly Bear Sofia"
    },
    locale
  ),
  getLocalizedImage(
    "/images/food_6.jpg",
    {
      bg: "Комбинация от крафт бира и храна в The Friendly Bear София",
      en: "Craft beer and food pairing at The Friendly Bear Sofia"
    },
    locale
  ),
  getLocalizedImage(
    "/images/food_7.jpg",
    {
      bg: "Сезонен десерт в The Friendly Bear София",
      en: "Seasonal dessert or house plate at The Friendly Bear Sofia"
    },
    locale
  )
];
