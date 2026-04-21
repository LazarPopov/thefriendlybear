import type { CmsPageEntry } from "@/lib/cms/page-adapter";

export const pageContentFallback: CmsPageEntry[] = [
  {
    key: "home",
    slug: {
      bg: "",
      en: ""
    },
    title: {
      bg: "Уютна градска бърлога на Славянска 23",
      en: "A cozy urban cabin on Slavyanska 23"
    },
    intro: {
      bg: "Скрито до Народния театър, ви посрещаме с тайна градина, камина, бавно печени меса, крафт бира и атмосфера, която се усеща като у дома.",
      en: "Tucked away near the National Theatre, we welcome you with a secret garden, a fireplace, slow-roasted meats, craft beer, and an atmosphere that feels like home."
    },
    body: {
      bg: "<p>Елате за спокойна вечер в центъра на София: сезонно меню, тиха градина, уют до камината и бавно печени специалитети на Славянска 23.</p>",
      en: "<p>Come for a relaxed evening in central Sofia: seasonal dishes, a quiet garden, a cozy fireplace room, and slow-roasted specialties on Slavyanska 23.</p>"
    }
  },
  {
    key: "about",
    slug: {
      bg: "about",
      en: "about"
    },
    title: {
      bg: "За The Friendly Bear Sofia",
      en: "About The Friendly Bear Sofia"
    },
    intro: {
      bg: "Открийте историята на нашата градска бърлога от 1923 г., създадена с любов в центъра на София.",
      en: "Discover the story of our 1923 urban cabin, restored with love in the heart of Sofia."
    },
    body: {
      bg: "<p>Спасена от събаряне и възстановена на ръка, къщата ни събира тайна градина, камина, сезонна кухня и приветливо обслужване.</p><p>Искахме място, което се усеща като дом за съседи, пътешественици и техните домашни любимци.</p>",
      en: "<p>Saved from demolition and restored by hand, our house brings together a secret garden, fireplace, seasonal food, and warm service.</p><p>We wanted a place that feels like home for locals, travelers, and their pets.</p>"
    }
  },
  {
    key: "contact",
    slug: {
      bg: "contact",
      en: "contact"
    },
    title: {
      bg: "Как да стигнете до The Friendly Bear Sofia",
      en: "How to get to The Friendly Bear Sofia"
    },
    intro: {
      bg: "Намерете ни лесно на ул. Славянска 23 и вижте работното време, упътванията и най-честите въпроси преди посещение.",
      en: "Find us easily on Slavyanska 23 and check opening hours, directions, and common guest questions before your visit."
    },
    body: {
      bg: "<p>Отворете картата, обадете се за маса или проверете FAQ за паркиране, плащане с карта, домашни любимци и тайната на ски-вратите.</p>",
      en: "<p>Open the map, call for a table, or check the FAQ for parking, card payments, pets, and the secret of the sliding ski doors.</p>"
    }
  },
  {
    key: "reviews",
    slug: {
      bg: "reviews",
      en: "reviews"
    },
    title: {
      bg: "Отзиви за The Friendly Bear Sofia",
      en: "Guest reviews for The Friendly Bear Sofia"
    },
    intro: {
      bg: "Вижте реални впечатления от гости, които се връщат за бавно печеното BBQ, крафт бирата и уютната атмосфера.",
      en: "Read real impressions from guests who come back for slow-roasted BBQ, craft beer, and the cozy atmosphere."
    },
    body: {
      bg: "<p>Гостите често споменават добрата енергия, внимателното обслужване и спокойствието на нашата бърлога на Славянска 23.</p>",
      en: "<p>Guests often mention the good energy, thoughtful service, and calm feeling of our den on Slavyanska 23.</p>"
    }
  },
  {
    key: "promotions",
    slug: {
      bg: "promotions",
      en: "promotions"
    },
    title: {
      bg: "Промоции и сезонни предложения",
      en: "Promotions and seasonal offers"
    },
    intro: {
      bg: "Тук ще откривате сезонни предложения, специални ястия и поводи да се върнете в бърлогата.",
      en: "Here you can find seasonal offers, special dishes, and good reasons to come back to the den."
    },
    body: {
      bg: "<p>Следете страницата за нови сезонни предложения, празнични менюта и специални вечери на Славянска 23.</p>",
      en: "<p>Check back for new seasonal offers, holiday menus, and special evenings on Slavyanska 23.</p>"
    }
  }
];
