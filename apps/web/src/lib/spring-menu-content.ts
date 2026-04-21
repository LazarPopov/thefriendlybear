import type { SiteLocale } from "@/lib/site";

type MenuItem = {
  name: string;
  description?: string[];
  allergens?: string;
  serving?: string;
  calories?: string;
  priceEuro?: string;
  priceBgn?: string;
  isVegetarian?: boolean;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

type SpringMenuContent = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: MenuSection[];
};

export const springMenuContent: Record<SiteLocale, SpringMenuContent> = {
  bg: {
    eyebrow: "Специално пролетно меню",
    title: "Вкусът на сезона",
    intro:
      "Подбрано от Жана (Mish-Mash Recipes), нашето пролетно меню съчетава традиционни български вкусове с модерен почерк. От запазената ни марка - бавно печено агнешко, до свежи вегетариански предложения.",
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
            calories: "около 125 kcal",
            priceEuro: "4,20 EUR",
            priceBgn: "8,21 лв"
          }
        ]
      },
      {
        title: "Предястия",
        items: [
          {
            name: "Класическа зелена салата",
            description: ["С варено яйце, краставици, репички и пресен лук"],
            allergens: "Алергени: яйца",
            serving: "350 г",
            calories: "около 260 kcal",
            priceEuro: "7,65 EUR",
            priceBgn: "14,96 лв",
            isVegetarian: true
          },
          {
            name: "Салата с киноа, бейби спанак, чери домати, мус от сирена и мариновани орехи",
            allergens: "Алергени: млечни продукти, ядки, соев сос",
            serving: "300 г",
            calories: "около 520 kcal",
            priceEuro: "8,90 EUR",
            priceBgn: "17,41 лв",
            isVegetarian: true
          },
          {
            name: "Хрупкави лучени кръгчета",
            description: ["С млечен сос"],
            allergens: "Алергени: глутен, яйца, млечни продукти",
            serving: "300 г",
            calories: "около 620 kcal",
            priceEuro: "7,10 EUR",
            priceBgn: "13,89 лв",
            isVegetarian: true
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
            calories: "около 980 kcal",
            priceEuro: "19,75 EUR",
            priceBgn: "38,63 лв"
          },
          {
            name: "Агнешка дроб сарма",
            description: ["С млечна заливка"],
            allergens: "Алергени: яйца, млечни продукти",
            serving: "350 г",
            calories: "около 720 kcal",
            priceEuro: "10,90 EUR",
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
            calories: "около 560 kcal",
            priceEuro: "9,70 EUR",
            priceBgn: "18,97 лв",
            isVegetarian: true
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
    eyebrow: "Special Spring Menu",
    title: "A Taste of the Season",
    intro:
      "Curated by Jana (Mish-Mash Recipes), our spring menu celebrates traditional Bulgarian flavors with a modern twist. From our signature slow-roasted BBQ to garden-fresh vegetarian plates.",
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
            calories: "about 125 kcal",
            priceEuro: "EUR 4.20",
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
            calories: "about 260 kcal",
            priceEuro: "EUR 7.65",
            priceBgn: "14.96 BGN",
            isVegetarian: true
          },
          {
            name: "Salad with quinoa, baby spinach, cherry tomatoes, cheese mousse, and marinated walnuts",
            allergens: "Allergens: dairy products, nuts, soy sauce",
            serving: "300 g",
            calories: "about 520 kcal",
            priceEuro: "EUR 8.90",
            priceBgn: "17.41 BGN",
            isVegetarian: true
          },
          {
            name: "Crispy onion rings",
            description: ["With milk based sauce"],
            allergens: "Allergens: gluten, eggs, dairy products",
            serving: "300 g",
            calories: "about 620 kcal",
            priceEuro: "EUR 7.10",
            priceBgn: "13.89 BGN",
            isVegetarian: true
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
            calories: "about 980 kcal",
            priceEuro: "EUR 19.75",
            priceBgn: "38.63 BGN"
          },
          {
            name: "Lamb drob sarma",
            description: ["With milk topping"],
            allergens: "Allergens: eggs, dairy products",
            serving: "350 g",
            calories: "about 720 kcal",
            priceEuro: "EUR 10.90",
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
            calories: "about 560 kcal",
            priceEuro: "EUR 9.70",
            priceBgn: "18.97 BGN",
            isVegetarian: true
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
