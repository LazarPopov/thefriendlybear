import type { SiteLocale } from "@/lib/site";

type MenuItem = {
  name: string;
  description?: string[];
  allergens?: string;
  serving?: string;
  priceEuro?: string;
  priceBgn?: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

type SeasonalMenuContent = {
  eyebrow: string;
  title: string;
  intro: string;
  actions: Array<{ href: string; label: string }>;
  sections: MenuSection[];
};

export const seasonalMenu: Record<SiteLocale, SeasonalMenuContent> = {
  bg: {
    eyebrow: "Специално седмично меню",
    title: "Вкусът на сезона",
    intro:
      "Подбрано от Жана (Mish-Mash Recipes) и екипът на Friendly Bear, нашето седмично меню съчетава традиционни български вкусове с модерен почерк. От запазената ни марка - бавно печени меса, до вегетариански предложения, свежи салати и класически десерти.",
    actions: [
      { href: "/bg/reservations", label: "Резервации" },
      { href: "/bg/contact", label: "Контакти" }
    ],
    sections: [
      {
        title: "Напитки",
        items: [
          {
            name: "Чаша вино Сира и Мерло",
            description: [
              "Find Me, България",
              "Със силен вкус на червени плодове и леки нотки на шоколад"
            ],
            serving: "150 мл",
            priceEuro: "4,20 €",
            priceBgn: "8,21 лв"
          }
        ]
      },
      {
        title: "Стартери",
        items: [
          {
            name: "Класическа зелена салата",
            description: ["С варено яйце, краставици, репички и пресен лук"],
            allergens: "Алергени: яйца",
            serving: "350 г",
            priceEuro: "7,65 €",
            priceBgn: "14,96 лв"
          },
          {
            name: "Салата с киноа, бейби спанак, чери домати, мус от сирена и мариновани орехи",
            description: [],
            allergens: "Алергени: млечни продукти, ядки, соев сос",
            serving: "300 г",
            priceEuro: "8,90 €",
            priceBgn: "17,41 лв"
          },
          {
            name: "Хрупкави лучени кръгчета",
            description: ["С млечен сос"],
            allergens: "Алергени: глутен, яйца, млечни продукти",
            serving: "300 г",
            priceEuro: "7,10 €",
            priceBgn: "13,89 лв"
          }
        ]
      },
      {
        title: "Основни ястия",
        items: [
          {
            name: "Бавно печено агнешко с бейби картофки",
            description: ["Зелена салата, люта чушка и стрък пресен лук"],
            serving: "450 г",
            priceEuro: "19,75 €",
            priceBgn: "38,63 лв"
          },
          {
            name: "Агнешка дроб сарма",
            description: ["С млечна заливка"],
            allergens: "Алергени: яйца, млечни продукти",
            serving: "350 г",
            priceEuro: "10,90 €",
            priceBgn: "21,32 лв"
          },
          {
            name: "Вегетарианска дроб сарма",
            description: [
              "С гъби микс, ориз и млечна заливка",
              "(печурки, манатарки, пачи крак, кладница)"
            ],
            allergens: "Алергени: яйца, млечни продукти",
            serving: "350 г",
            priceEuro: "9,70 €",
            priceBgn: "18,97 лв"
          }
        ]
      },
      {
        title: "Десерт",
        items: [
          {
            name: "Попитайте вашия сервитьор за десерта на деня"
          }
        ]
      }
    ]
  },
  en: {
    eyebrow: "Special Weekly Menu",
    title: "A Taste of the Season",
    intro:
      "Curated by Jana (Mish-Mash Recipes) and the Friendly Bear team, our weekly menu brings traditional Bulgarian flavors together with a modern touch. From our signature slow-cooked meats to vegetarian dishes, fresh salads, and classic desserts.",
    actions: [
      { href: "/en/reservations", label: "Reservations" },
      { href: "/en/contact", label: "Contact" }
    ],
    sections: [
      {
        title: "Drinks",
        items: [
          {
            name: "Glass of Syrah and Merlot wine",
            description: [
              "Find Me, Bulgaria",
              "With a strong taste of red fruits and light notes of chocolate"
            ],
            serving: "150 ml",
            priceEuro: "€4.20",
            priceBgn: "8.21 BGN"
          }
        ]
      },
      {
        title: "Starters",
        items: [
          {
            name: "Classic green salad",
            description: ["With boiled egg, cucumbers, radishes, and fresh spring onion"],
            allergens: "Allergens: eggs",
            serving: "350 g",
            priceEuro: "€7.65",
            priceBgn: "14.96 BGN"
          },
          {
            name: "Salad with quinoa, baby spinach, cherry tomatoes, cheese mousse, and marinated walnuts",
            allergens: "Allergens: dairy products, nuts, soy sauce",
            serving: "300 g",
            priceEuro: "€8.90",
            priceBgn: "17.41 BGN"
          },
          {
            name: "Crispy onion rings",
            description: ["With milk based sauce"],
            allergens: "Allergens: gluten, eggs, dairy products",
            serving: "300 g",
            priceEuro: "€7.10",
            priceBgn: "13.89 BGN"
          }
        ]
      },
      {
        title: "Main Course",
        items: [
          {
            name: "Slow roasted lamb with baby potatoes",
            description: ["Green salad, hot pepper, and a stalk of fresh spring onion"],
            serving: "450 g",
            priceEuro: "€19.75",
            priceBgn: "38.63 BGN"
          },
          {
            name: "Lamb drob sarma",
            description: ["With milk topping"],
            allergens: "Allergens: eggs, dairy products",
            serving: "350 g",
            priceEuro: "€10.90",
            priceBgn: "21.32 BGN"
          },
          {
            name: "Vegetarian drob sarma",
            description: [
              "With mixed mushrooms, rice, and milk topping",
              "(button mushrooms, porcini, chanterelles, oyster mushrooms)"
            ],
            allergens: "Allergens: eggs, dairy products",
            serving: "350 g",
            priceEuro: "€9.70",
            priceBgn: "18.97 BGN"
          }
        ]
      },
      {
        title: "Dessert",
        items: [
          {
            name: "Please ask your server about the dessert of the day"
          }
        ]
      }
    ]
  }
};
