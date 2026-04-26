import type { CmsPageEntry } from "@/lib/cms/page-adapter";

export const pageContentFallback: CmsPageEntry[] = [
  {
    key: "home",
    slug: {
      bg: "",
      en: ""
    },
    title: {
      bg: "Уютна градска бърлога в къща от 1923 г.",
      en: "A cozy urban den in a 1923 house"
    },
    intro: {
      bg: "Скрит зад хотел „Радисън“, ресторант „The Friendly Bear“ е кътче, направено почти изцяло на ръка.",
      en: "Hidden behind the Radisson hotel, The Friendly Bear is a place made almost entirely by hand."
    },
    body: {
      bg: "<p>Близо 7 месеца създавахме нашите места за хранене, лампи, бар, декорации... Дадохме живот на стари предмети, за да ги превърнем в място, което се усеща като дом.</p>",
      en: "<p>For nearly seven months we built our dining areas, lamps, bar, decorations, and details, giving old objects a new life and turning them into a place that feels like home.</p>"
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
      en: "Discover our 1923 house on Slavyanska 23, restored by hand with love and attention to detail."
    },
    body: {
      bg: "<p>Спасен от събаряне и възстановен на ръка, нашият дом от 1923 г. е проект, създаден с много любов и внимание към детайла.</p><p>Искахме място, което се усеща като дом за съседи, пътешественици и техните домашни любимци.</p>",
      en: "<p>Saved from demolition and restored by hand, our 1923 home is where old Sofia history meets the comfort of a forest lodge.</p><p>We wanted a place that feels like home for neighbors, travelers, and their pets.</p>"
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
      bg: "Вижте реални впечатления от гости, които се връщат за бавно готвените меса, крафт бирата и уютната атмосфера.",
      en: "Read real impressions from guests who come back for slow-cooked meats, craft beer, and the cozy atmosphere."
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
