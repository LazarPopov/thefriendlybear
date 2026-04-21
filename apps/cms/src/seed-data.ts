export const businessProfileSeed = {
  sourceMode: "manual",
  futureConnector: "google_business_profile",
  syncReady: true,
  lastBusinessUpdateNote: {
    bg: "Обновено от бизнеса преди 9 седмици",
    en: "Updated by this business 9 weeks ago"
  },
  address: {
    bg: "ул. Славянска 23, 1000 София, България",
    en: "Sofia Center, Slavyanska St 23, 1000 Sofia, Bulgaria"
  },
  area: {
    bg: "Център на София",
    en: "Sofia Center"
  },
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Sofia+Center%2C+Slavyanska+St+23%2C+1000+Sofia%2C+Bulgaria",
  mapsLabel: {
    bg: "ул. Славянска 23, 1000 София, България",
    en: "Sofia Center, Slavyanska St 23, 1000 Sofia, Bulgaria"
  },
  phoneNumber: "+359 87 612 2114",
  phoneDisplay: "+359 87 612 2114",
  whatsappPrefill: {
    bg: "Здравейте, искам да попитам за резервация в The Friendly Bear Sofia.",
    en: "Hello, I would like to ask about a reservation at The Friendly Bear Sofia."
  },
  bookingMode: "call_only",
  externalBookingLabel: {
    bg: "Онлайн резервация",
    en: "Book online"
  },
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
  ],
  statusMessages: {
    bg: "Телефонът и работното време са активни. В момента ресторантът не използва WhatsApp или външен booking линк, но модулът е готов за добавяне по-късно.",
    en: "Phone and opening hours are now live. The restaurant is not currently using WhatsApp or an external booking link, but the module is ready for those later."
  },
  visitNotes: {
    bg: [
      "Локацията е подходяща за хора, които търсят място за вечеря в центъра на София.",
      "Местата на открито, камината и коктейлите правят профила на ресторанта по-ясен още от първия екран.",
      "Телефонът и работното време вече са публикувани, а допълнителни канали могат да се добавят по-късно."
    ],
    en: [
      "The location is a good fit for visitors looking for dinner in central Sofia.",
      "Outdoor seating, a fireplace, and strong cocktail signals make the venue easier to understand at a glance.",
      "Phone and opening hours are already live, while additional booking channels can be added later."
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
} as const;

export const reservationSettingsSeed = {
  isEnabled: true,
  mode: "call_only",
  stickyCallEnabled: true,
  stickyWhatsappEnabled: false,
  phoneNumber: "+359 87 612 2114",
  ctaLabel: {
    bg: "Обади се за резервация",
    en: "Call for reservation"
  },
  confirmationMessage: {
    bg: "Най-бързият текущ път за резервация е по телефон.",
    en: "The fastest current reservation path is by phone."
  }
} as const;

export const moduleTogglesSeed = {
  promotionsEnabled: true,
  reservationsEnabled: true,
  reviewsEnabled: true,
  socialFeedEnabled: true
} as const;

export const promotionSeeds = [
  {
    slug: {
      bg: "proletno-specialno-menyu",
      en: "special-spring-menu"
    },
    title: {
      bg: "Пролетно специално меню",
      en: "Special Spring Menu"
    },
    summary: {
      bg: "Сезонни предложения с бавно печено агнешко, свежи салати и вегетариански опции.",
      en: "Seasonal offers with slow roasted lamb, fresh salads, and vegetarian options."
    },
    body: {
      bg: "<p>Пролетното меню изкарва отпред агнешките предложения, свежите салати и вегетарианските опции, така че сезонният характер на кухнята да се вижда веднага.</p>",
      en: "<p>The spring menu brings forward the lamb dishes, fresh salads, and vegetarian options so the seasonal character of the kitchen is visible immediately.</p>"
    },
    ctaLabel: {
      bg: "Виж менюто",
      en: "See the menu"
    },
    ctaUrl: {
      bg: "/bg/menu",
      en: "/en/menu"
    },
    isEnabled: true
  }
] as const;

export const reviewSnippetSeeds = [
  {
    source: "google",
    authorName: "Lazar Popov",
    rating: 5,
    reviewText: {
      bg: "Един от по-добрите ресторанти в София ... Още",
      en: "One of the better restaurants in Sofia ... More"
    },
    relativeDateLabel: {
      bg: "преди година",
      en: "a year ago"
    },
    keywordTags: {
      bg: ["София", "качество", "добро впечатление"],
      en: ["Sofia", "quality", "good impression"]
    },
    isFeatured: true
  },
  {
    source: "google",
    authorName: "J Moreno",
    rating: 5,
    reviewText: {
      bg: "The Friendly Bear в София е чудесно място, ако търсите топла атмосфера и приветливо обслужване. Персоналът е искрено любезен и ... Още",
      en: "The Friendly Bear in Sofia is a great place to visit if you're looking for a warm atmosphere and welcoming service. The staff are genuinely friendly and ... More"
    },
    relativeDateLabel: {
      bg: "преди месец",
      en: "a month ago"
    },
    keywordTags: {
      bg: ["уютно", "обслужване", "атмосфера"],
      en: ["cozy", "service", "atmosphere"]
    },
    isFeatured: true
  },
  {
    source: "google",
    authorName: "Viltė Čepulytė",
    rating: 5,
    reviewText: {
      bg: "Перфектно място с невероятно обслужване и страхотна храна. България ни изненада по много начини, но The Friendly Bear го направи по най-добрия възможен начин. ... Още",
      en: "Perfect place with amazing service and great food. Bulgaria has surprised us in many ways whilst visiting, but the Friendly Bear has done it in the best way. ... More"
    },
    relativeDateLabel: {
      bg: "преди 2 месеца",
      en: "2 months ago"
    },
    keywordTags: {
      bg: ["обслужване", "храна", "преживяване"],
      en: ["service", "food", "experience"]
    },
    isFeatured: true
  },
  {
    source: "google",
    authorName: "Alice T",
    rating: 5,
    reviewText: {
      bg: "Влязохме без резервация, сервитьорът ни помогна да седнем на чудесна маса. Докато поръчвахме, ни даде съвет какво би избрал и ... Още",
      en: "We came in without a reservation, the waiter helped us to a great table. While we ordered our food, he gave us some advice about what dish he would pick, and so ... More"
    },
    relativeDateLabel: {
      bg: "преди 2 месеца",
      en: "2 months ago"
    },
    keywordTags: {
      bg: ["без резервация", "обслужване", "гостоприемство"],
      en: ["walk-in", "service", "hospitality"]
    },
    isFeatured: true
  }
] as const;

export const touristLandingPageSeeds = [
  {
    audience: "italian",
    slug: {
      bg: "italian",
      en: "italian"
    },
    marketSlug: {
      it: "ristorante-sofia-centro"
    },
    title: {
      bg: "Приветливо място в София за италиански посетители",
      en: "A friendly Sofia restaurant for Italian visitors"
    },
    marketTitle: {
      it: "Benvenuti al The Friendly Bear"
    },
    intro: {
      bg: "Тази страница е подредена за international travel intent: централна локация, приветливо усещане, ясен достъп до менюто и бързо уверение за вегетариански опции и обслужване.",
      en: "This page is shaped for Italian-speaking travel intent: central location, welcoming atmosphere, clear menu access, and quick reassurance around vegetarian options and service."
    },
    marketIntro: {
      it: "Un angolo accogliente nel cuore di Sofia (Slavyanska 23). Godetevi l'atmosfera rilassata del nostro giardino segreto o il calore della nostra camera con camino. Tradizione bulgara e un benvenuto caloroso vi aspettano."
    },
    vegetarianMessage: {
      bg: "Вегетарианските опции вече се виждат ясно в менюто, така че човек не трябва да се чуди дали ще има подходящ избор.",
      en: "Vegetarian-friendly choices are already visible in the menu so visitors do not have to wonder whether there is a suitable option."
    },
    marketVegetarianMessage: {
      it: "Ampia scelta di piatti vegetariani freschi chiaramente indicati nel nostro menu. Dalle insalate tradizionali alle specialita calde, troverete sempre l'opzione perfetta senza incertezze."
    },
    serviceMessage: {
      bg: "Тонът и структурата на страницата подчертават приветливо обслужване и лесен mobile path към менюто, контактите и посоките.",
      en: "The structure and tone of the page reinforce welcoming service and an easy mobile path toward menu, contact, and directions."
    },
    marketServiceMessage: {
      it: "Il nostro staff parla correntemente inglese per garantirvi un'accoglienza senza barriere. Il menu e ottimizzato per mobile: potrete consultare piatti e contatti facilmente mentre scoprite il centro della citta."
    },
    primaryCtaLabel: {
      bg: "Виж менюто",
      en: "See the menu"
    },
    marketPrimaryCtaLabel: {
      it: "Vedi il Menu e Contattaci"
    },
    primaryCtaUrl: {
      bg: "/bg/menu",
      en: "/en/menu"
    }
  },
  {
    audience: "spanish",
    slug: {
      bg: "spanish",
      en: "spanish"
    },
    marketSlug: {
      es: "restaurante-centro-sofia"
    },
    title: {
      bg: "Приветлив ресторант в София за испански посетители",
      en: "A welcoming Sofia restaurant for Spanish visitors"
    },
    intro: {
      bg: "Тази страница е насочена към бързо restaurant discovery около центъра, с ясен път към меню, резервации и упътвания, плюс увереност за любезно обслужване и по-леки опции.",
      en: "This page targets fast restaurant discovery near the center, with a simple path to menu, reservations, and directions plus reassurance around friendly service and lighter food options."
    },
    vegetarianMessage: {
      bg: "Вегетарианските опции не са скрити дълбоко в сайта и могат да се открият бързо още при първия преглед на менюто.",
      en: "Vegetarian options are not buried deep in the site structure and can be found quickly from the first menu scan."
    },
    serviceMessage: {
      bg: "Страницата е написана така, че friendly service да се усеща още преди човек да отвори контактите или резервациите.",
      en: "The page is written so friendly service comes through before the visitor even opens contact or reservations."
    },
    primaryCtaLabel: {
      bg: "Отвори менюто",
      en: "Open the menu"
    },
    primaryCtaUrl: {
      bg: "/bg/menu",
      en: "/en/menu"
    }
  },
  {
    audience: "greek",
    slug: {
      bg: "greek",
      en: "greek"
    },
    title: {
      bg: "Централен ресторант в София за гръцки посетители",
      en: "A central Sofia restaurant for Greek visitors"
    },
    intro: {
      bg: "Тази страница поддържа Greek visitor intent с по-спокоен и welcoming flow, фокусиран върху централна локация, ясни действия, вегетарианско уверение и лесен достъп до менюто.",
      en: "This page supports Greek visitor intent with a calm, welcoming flow focused on central location, straightforward actions, vegetarian reassurance, and easy menu access."
    },
    vegetarianMessage: {
      bg: "Вегетарианските предложения вече са част от менюто и могат да се видят без излишно търсене от мобилен телефон.",
      en: "Vegetarian-friendly choices are already part of the menu content and can be checked quickly from a phone."
    },
    serviceMessage: {
      bg: "Страницата е умишлено проста и приветлива, така че посетителят да стигне бързо до меню, упътвания или резервационен път.",
      en: "The page is intentionally simple and welcoming so the visitor can move quickly toward menu, directions, or the reservation path."
    },
    primaryCtaLabel: {
      bg: "Към менюто",
      en: "Go to the menu"
    },
    primaryCtaUrl: {
      bg: "/bg/menu",
      en: "/en/menu"
    }
  }
] as const;

export const menuCategorySeeds = [
  {
    key: "drinks",
    slug: {
      bg: "napitki",
      en: "drinks"
    },
    name: {
      bg: "Напитки",
      en: "Drinks"
    },
    sortOrder: 1,
    isActive: true
  },
  {
    key: "starters",
    slug: {
      bg: "predyastiya",
      en: "starters"
    },
    name: {
      bg: "Предястия",
      en: "Starters"
    },
    sortOrder: 2,
    isActive: true
  },
  {
    key: "main-course",
    slug: {
      bg: "osnovni-yastiya",
      en: "main-course"
    },
    name: {
      bg: "Основни ястия",
      en: "Main Course"
    },
    sortOrder: 3,
    isActive: true
  },
  {
    key: "dessert",
    slug: {
      bg: "desert",
      en: "dessert"
    },
    name: {
      bg: "Десерт",
      en: "Dessert"
    },
    sortOrder: 4,
    isActive: true
  }
] as const;

export const menuItemSeeds = [
  {
    key: "glass-syrah-merlot-wine",
    categoryKey: "drinks",
    slug: {
      bg: "chasha-vino-sira-merlo",
      en: "glass-syrah-merlot-wine"
    },
    name: {
      bg: "Чаша вино Сира и Мерло",
      en: "Glass of Syrah and Merlot wine"
    },
    description: {
      bg: "Find Me, България\nСъс силен вкус на червени плодове и леки нотки на шоколад",
      en: "Find Me, Bulgaria\nWith a strong taste of red fruits and light notes of chocolate"
    },
    servingLabel: {
      bg: "150 мл",
      en: "150 ml"
    },
    caloriesLabel: {
      bg: "около 125 kcal",
      en: "about 125 kcal"
    },
    price: 8.21,
    currency: "BGN",
    priceDisplayBgn: "8,21 лв",
    priceDisplayEur: "4,20 EUR",
    sortOrder: 1
  },
  {
    key: "classic-green-salad",
    categoryKey: "starters",
    slug: {
      bg: "klasicheska-zelena-salata",
      en: "classic-green-salad"
    },
    name: {
      bg: "Класическа зелена салата",
      en: "Classic green salad"
    },
    description: {
      bg: "С варено яйце, краставици, репички и пресен лук",
      en: "With boiled egg, cucumbers, radishes, and fresh spring onion"
    },
    allergens: {
      bg: "Алергени: яйца",
      en: "Allergens: eggs"
    },
    servingLabel: {
      bg: "350 г",
      en: "350 g"
    },
    caloriesLabel: {
      bg: "около 260 kcal",
      en: "about 260 kcal"
    },
    price: 14.96,
    currency: "BGN",
    priceDisplayBgn: "14,96 лв",
    priceDisplayEur: "7,65 EUR",
    sortOrder: 1
  },
  {
    key: "quinoa-salad",
    categoryKey: "starters",
    slug: {
      bg: "salata-s-kinoa",
      en: "quinoa-salad"
    },
    name: {
      bg: "Салата с киноа, бейби спанак, чери домати, мус от сирена и мариновани орехи",
      en: "Salad with quinoa, baby spinach, cherry tomatoes, cheese mousse, and marinated walnuts"
    },
    allergens: {
      bg: "Алергени: млечни продукти, ядки, соев сос",
      en: "Allergens: dairy products, nuts, soy sauce"
    },
    servingLabel: {
      bg: "300 г",
      en: "300 g"
    },
    caloriesLabel: {
      bg: "около 520 kcal",
      en: "about 520 kcal"
    },
    price: 17.41,
    currency: "BGN",
    priceDisplayBgn: "17,41 лв",
    priceDisplayEur: "8,90 EUR",
    sortOrder: 2
  },
  {
    key: "crispy-onion-rings",
    categoryKey: "starters",
    slug: {
      bg: "hrupkavi-lucheni-kragcheta",
      en: "crispy-onion-rings"
    },
    name: {
      bg: "Хрупкави лучени кръгчета",
      en: "Crispy onion rings"
    },
    description: {
      bg: "С млечен сос",
      en: "With milk based sauce"
    },
    allergens: {
      bg: "Алергени: глутен, яйца, млечни продукти",
      en: "Allergens: gluten, eggs, dairy products"
    },
    servingLabel: {
      bg: "300 г",
      en: "300 g"
    },
    caloriesLabel: {
      bg: "около 620 kcal",
      en: "about 620 kcal"
    },
    price: 13.89,
    currency: "BGN",
    priceDisplayBgn: "13,89 лв",
    priceDisplayEur: "7,10 EUR",
    sortOrder: 3
  },
  {
    key: "slow-roasted-lamb",
    categoryKey: "main-course",
    slug: {
      bg: "bavno-pecheno-agneshko",
      en: "slow-roasted-lamb"
    },
    name: {
      bg: "Бавно печено агнешко с бейби картофки",
      en: "Slow roasted lamb with baby potatoes"
    },
    description: {
      bg: "Зелена салата, люта чушка и стрък пресен лук",
      en: "Green salad, hot pepper, and a stalk of fresh spring onion"
    },
    servingLabel: {
      bg: "450 г",
      en: "450 g"
    },
    caloriesLabel: {
      bg: "около 980 kcal",
      en: "about 980 kcal"
    },
    price: 38.63,
    currency: "BGN",
    priceDisplayBgn: "38,63 лв",
    priceDisplayEur: "19,75 EUR",
    sortOrder: 1
  },
  {
    key: "lamb-drob-sarma",
    categoryKey: "main-course",
    slug: {
      bg: "agneshka-drob-sarma",
      en: "lamb-drob-sarma"
    },
    name: {
      bg: "Агнешка дроб сарма",
      en: "Lamb drob sarma"
    },
    description: {
      bg: "С млечна заливка",
      en: "With milk topping"
    },
    allergens: {
      bg: "Алергени: яйца, млечни продукти",
      en: "Allergens: eggs, dairy products"
    },
    servingLabel: {
      bg: "350 г",
      en: "350 g"
    },
    caloriesLabel: {
      bg: "около 720 kcal",
      en: "about 720 kcal"
    },
    price: 21.32,
    currency: "BGN",
    priceDisplayBgn: "21,32 лв",
    priceDisplayEur: "10,90 EUR",
    sortOrder: 2
  },
  {
    key: "vegetarian-drob-sarma",
    categoryKey: "main-course",
    slug: {
      bg: "vegetarianska-drob-sarma",
      en: "vegetarian-drob-sarma"
    },
    name: {
      bg: "Вегетарианска дроб сарма",
      en: "Vegetarian drob sarma"
    },
    description: {
      bg: "С гъби микс, ориз и млечна заливка\n(печурки, манатарки, пачи крак, кладница)",
      en: "With mixed mushrooms, rice, and milk topping\n(button mushrooms, porcini, chanterelles, oyster mushrooms)"
    },
    allergens: {
      bg: "Алергени: яйца, млечни продукти",
      en: "Allergens: eggs, dairy products"
    },
    servingLabel: {
      bg: "350 г",
      en: "350 g"
    },
    caloriesLabel: {
      bg: "около 560 kcal",
      en: "about 560 kcal"
    },
    price: 18.97,
    currency: "BGN",
    priceDisplayBgn: "18,97 лв",
    priceDisplayEur: "9,70 EUR",
    sortOrder: 3,
    isVegetarian: true,
    dietaryTags: ["vegetarian"]
  },
  {
    key: "dessert-of-the-day",
    categoryKey: "dessert",
    slug: {
      bg: "desert-na-denya",
      en: "dessert-of-the-day"
    },
    name: {
      bg: "Попитайте вашия сервитьор за десерта на деня",
      en: "Please ask your server about the dessert of the day"
    },
    price: 0,
    currency: "BGN",
    sortOrder: 1
  }
] as const;

export const pageSeeds = [
  {
    key: "home",
    slug: {
      bg: "",
      en: ""
    },
    title: {
      bg: "Уютен ресторант на Славянска 23 в София",
      en: "A cozy restaurant on Slavyanska 23 in Sofia"
    },
    intro: {
      bg: "Скрити зад Radisson, ви посрещаме с тайна градина, камина, бавно печени меса, крафт бира и атмосфера, която се усеща като у дома.",
      en: "Hidden behind the Radisson, we welcome you with a secret garden, a fireplace, slow-roasted meats, craft beer, and an atmosphere that feels like home."
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
      bg: "Страницата „За нас“ обяснява ресторанта през сигналите, които помагат на реален избор: къде сте, какво предлагате и защо мястото е лесно за посещение.",
      en: "The About page explains the restaurant through the signals that support a real decision: where it is, what it offers, and why it feels easy to visit."
    },
    body: {
      bg: "<p>Брандът трябва ясно да се свързва със Славянска 23 и центъра на София във всяка важна страница, schema слой и CTA поток.</p><p>Сайтът не се опитва да звучи общо, а подрежда историята около менюто, атмосферата и достъпа от мобилен телефон.</p>",
      en: "<p>The brand should stay clearly tied to Slavyanska 23 and central Sofia across the important pages, schema layer, and CTA flows.</p><p>The site is not trying to sound generic. It organizes the story around the menu, the atmosphere, and the mobile visitor journey.</p>"
    }
  },
  {
    key: "contact",
    slug: {
      bg: "contact",
      en: "contact"
    },
    title: {
      bg: "Контакти и посещение",
      en: "Contact and visit"
    },
    intro: {
      bg: "Контактната страница извежда адреса, картата, часовете и най-важните действия отпред, за да има ясен път към посещение.",
      en: "The contact page brings the address, map, hours, and key actions forward so the visit path stays clear."
    },
    body: {
      bg: "<p>Страницата трябва да работи добре на мобилен телефон, защото голяма част от потребителите ще я отварят точно когато вече търсят как да стигнат до ресторанта.</p><p>Затова адресът, упътванията и status сигналите за контактните канали остават видими и подредени.</p>",
      en: "<p>This page needs to work especially well on mobile because many users will open it right when they are trying to get to the restaurant.</p><p>That is why the address, directions, and contact-status signals stay visible and well structured.</p>"
    }
  },
  {
    key: "reviews",
    slug: {
      bg: "reviews",
      en: "reviews"
    },
    title: {
      bg: "Отзиви и социално доказателство",
      en: "Reviews and social proof"
    },
    intro: {
      bg: "Тук The Friendly Bear Sofia показва curated review snippets, които дават реални сигнали за атмосфера, обслужване и храна.",
      en: "This page lets The Friendly Bear Sofia show curated review snippets that communicate real signals around atmosphere, service, and food."
    },
    body: {
      bg: "<p>Review слоят вече работи с подбрани Google откъси и keyword тагове, така че страницата може да подкрепя както SEO, така и бързия избор на потребителя.</p><p>По-късно тази структура може да се разшири с одобрен автоматизиран review source и social feed интеграция.</p>",
      en: "<p>The review layer already works with selected Google snippets and keyword tags, which means the page can support both SEO and fast user decision-making.</p><p>Later, the same structure can be expanded with an approved automated review source and social feed integration.</p>"
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
] as const;
