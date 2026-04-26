import type { TouristMarketLocale } from "@/lib/cms/tourist-landing-page-adapter";

type MarketCard = {
  label: string;
  title: string;
  text: string;
};

type MarketNote = {
  ariaLabel: string;
  label: string;
  text: string;
};

type VenueCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  gardenLabel: string;
  interiorLabel: string;
  gardenAlt: string;
  interiorAlt: string;
};

export type TouristMarketPageCopy = {
  title: string;
  intro: string;
  vegetarian: string;
  service: string;
  primaryCtaLabel: string;
  callLabel: string;
  cards: MarketCard[];
  signature: {
    label: string;
    title: string;
    dishes: string[];
  };
  atmosphere: {
    label: string;
    title: string;
    text: string;
  };
  venue: VenueCopy;
  specialNote?: MarketNote;
};

export const touristBrandMotto =
  "The Friendly Bear - The den of the good taste - come in, relax and enjoy.";

export const touristMarketPageCopy: Record<TouristMarketLocale, TouristMarketPageCopy> = {
  it: {
    title: "Dove mangiare bene a Sofia prima della serata",
    intro:
      "Nascosto dietro l'hotel Radisson nel cuore di Sofia, The Friendly Bear e una casa urbana del 1923 con giardino, sale retro leggermente sotterranee e un'atmosfera perfetta per cena, drink, sport in TV e nightlife.",
    vegetarian:
      "Oltre alle insalate fresche, il menu mette in evidenza piatti memorabili come il panino con lingua di vitello e cipolle caramellate e l'agnello cotto lentamente con funghi.",
    service:
      "Altamente consigliato da viaggiatori italiani a Sofia: staff che parla inglese, menu facile da consultare e un'atmosfera calda prima di uscire nel centro.",
    primaryCtaLabel: "Vedi il Menu (English)",
    callLabel: "Chiama per Prenotare",
    cards: [
      {
        label: "Social proof",
        title: "Consigliato da italiani a Sofia",
        text:
          "The Friendly Bear e gia segnalato da viaggiatori italiani che cercano un posto centrale, autentico e rilassato."
      },
      {
        label: "Prima della serata",
        title: "Cena, drink e partita",
        text:
          "Una base atmosferica per mangiare bene, bere qualcosa e guardare una partita prima di scoprire la nightlife di Sofia."
      },
      {
        label: "Posizione",
        title: "Centro citta, facile da trovare",
        text:
          "Ci trovi in via Slavyanska 23, a pochi passi dal Teatro Nazionale e dalle strade piu vive del centro."
      }
    ],
    signature: {
      label: "Piatti da provare",
      title: "Sapori concreti, non generici",
      dishes: [
        "Panino con lingua di vitello e cipolle caramellate",
        "Agnello cotto lentamente con funghi",
        "Zuppa di pesce",
        "Baileys Crème Brûlée"
      ]
    },
    atmosphere: {
      label: "Atmosfera",
      title: "Retro, leggermente sotterraneo, memorabile",
      text:
        "La sala interna con parete rivestita in morbido tappeto crea un dettaglio curioso e fotografabile, mentre il giardino nascosto porta calma nelle serate calde."
    },
    venue: {
      eyebrow: "Atmosfera",
      title: "Giardino nascosto e calore da baita urbana",
      intro:
        "Una piccola galleria per sentire il luogo prima di arrivare: luci in giardino, dettagli in legno e sale interne accoglienti.",
      gardenLabel: "Giardino",
      interiorLabel: "Interno retro",
      gardenAlt: "Giardino segreto del ristorante The Friendly Bear a Sofia",
      interiorAlt: "Interno retro leggermente sotterraneo del ristorante The Friendly Bear a Sofia"
    }
  },
  es: {
    title: "Dónde comer en Sofía: un refugio con encanto",
    intro:
      "Ubicado en una casa urbana de 1923 en la calle Slavyanska 23, The Friendly Bear es un refugio acogedor, ligeramente subterráneo y retro para socializar después de un día largo por Sofía.",
    vegetarian:
      "No todo es carne. Hay ensaladas frescas, platos vegetarianos calientes y especialidades como el cordero cocinado lentamente con setas.",
    service:
      "Abierto hasta las 23:00, con equipo que habla inglés y el Baileys Crème Brûlée como final perfecto para una cena tarde en el centro.",
    primaryCtaLabel: "Ver el Menú (English)",
    callLabel: "Llamar para Reservar",
    cards: [
      {
        label: "Refugio",
        title: "Una cena con calma",
        text:
          "El ambiente retro y ligeramente subterráneo funciona como un refugio íntimo después de caminar por el centro."
      },
      {
        label: "Cena tarde",
        title: "Abierto hasta las 23:00",
        text:
          "Un horario cómodo para visitantes españoles que prefieren cenar sin prisa después de turismo, teatro o paseo."
      },
      {
        label: "Dulce final",
        title: "Baileys Crème Brûlée",
        text:
          "Un postre reconocible y especial para cerrar una cena larga antes de volver al hotel o salir por Sofía."
      }
    ],
    signature: {
      label: "Platos destacados",
      title: "Una mesa con ganchos claros",
      dishes: [
        "Sándwich de lengua de ternera con cebolla caramelizada",
        "Cordero cocinado lentamente con setas",
        "Sopa de pescado",
        "Baileys Crème Brûlée"
      ]
    },
    atmosphere: {
      label: "Ambiente",
      title: "Casa de 1923 con interior retro",
      text:
        "El jardín escondido funciona en los meses cálidos, mientras las salas interiores conservan un encanto cálido, curioso y local."
    },
    venue: {
      eyebrow: "Ambiente",
      title: "Jardín secreto y calidez interior",
      intro:
        "Una pequeña galería para sentir el lugar antes de llegar: terraza tranquila, detalles acogedores y el encanto de una casa de 1923.",
      gardenLabel: "Jardín",
      interiorLabel: "Interior",
      gardenAlt: "Jardín tranquilo del restaurante The Friendly Bear en Sofía",
      interiorAlt: "Interior acogedor y retro del restaurante The Friendly Bear en Sofía"
    },
    specialNote: {
      ariaLabel: "Abierto hasta las 23:00",
      label: "Cena tarde",
      text:
        "Abierto hasta las 23:00. Perfecto para una cena tranquila después de pasear por el centro de Sofía, con comida auténtica, carnes cocinadas lentamente, ensaladas frescas y opciones vegetarianas."
    }
  },
  el: {
    title: "Καλύτερα εστιατόρια Σόφια για ένα χαλαρό Σαββατοκύριακο",
    intro:
      "Κρυμμένο πίσω από το Radisson στο κέντρο της Σόφιας, το The Friendly Bear είναι ιδανικό για μεγάλο, χαλαρό γεύμα ή δείπνο στον κήπο σε ένα weekend getaway.",
    vegetarian:
      "Στο μενού θα βρείτε ψαρόσουπα, αργοψημένο αρνί με μανιτάρια, φρέσκες σαλάτες και ζεστά χορτοφαγικά πιάτα.",
    service:
      "Θέλουμε να νιώθετε άνετα: αγγλόφωνο προσωπικό, εύκολο ψηφιακό μενού και ζεστή φιλοξενία για παρέες από τη Θεσσαλονίκη, τη Βόρεια Ελλάδα και όλη την Ελλάδα.",
    primaryCtaLabel: "Δείτε το Μενού (English)",
    callLabel: "Κλήση για Κράτηση",
    cards: [
      {
        label: "Weekend",
        title: "Μακρύ γεύμα στον κήπο",
        text:
          "Ο κρυφός κήπος είναι το πιο χαλαρό σημείο για μεσημεριανό ή δείπνο σε σύντομη απόδραση στη Σόφια."
      },
      {
        label: "Γεύση",
        title: "Ψαρόσουπα και αρνί",
        text:
          "Η ψαρόσουπα και το αργοψημένο αρνί με μανιτάρια δίνουν οικεία, μεσογειακή αίσθηση σε βουλγαρικό τραπέζι."
      },
      {
        label: "Φιλοξενία",
        title: "Άνετα στα αγγλικά",
        text:
          "Η ομάδα βοηθάει με μενού, οδηγίες και κράτηση, ώστε η επίσκεψη να ξεκινήσει χωρίς άγχος."
      }
    ],
    signature: {
      label: "Πιάτα που αξίζει να δοκιμάσετε",
      title: "Ζεστό, χορταστικό και φιλόξενο",
      dishes: [
        "Σάντουιτς με γλώσσα μοσχαριού και καραμελωμένα κρεμμύδια",
        "Αργοψημένο αρνί με μανιτάρια",
        "Ψαρόσουπα",
        "Baileys Crème Brûlée"
      ]
    },
    atmosphere: {
      label: "Ατμόσφαιρα",
      title: "Κήπος για το καλοκαίρι, ζεστό εσωτερικό για τον χειμώνα",
      text:
        "Η ιστορική κατοικία του 1923, το ρετρό εσωτερικό και η μαλακή ταπετσαρία στον τοίχο κάνουν το μέρος εύκολο να το θυμάσαι."
    },
    venue: {
      eyebrow: "Ατμόσφαιρα",
      title: "Κρυφός κήπος και ζεστό εσωτερικό",
      intro:
        "Μια μικρή gallery για να πάρετε μια πρώτη αίσθηση του χώρου πριν φτάσετε: κήπος, ζεστασιά, ξύλινες λεπτομέρειες και αληθινή φιλοξενία.",
      gardenLabel: "Κήπος",
      interiorLabel: "Εσωτερικό",
      gardenAlt: "Ο κήπος του εστιατορίου The Friendly Bear στη Σόφια",
      interiorAlt: "Το ζεστό ρετρό εσωτερικό του εστιατορίου The Friendly Bear στη Σόφια"
    },
    specialNote: {
      ariaLabel: "Σας περιμένουμε",
      label: "Φιλοξενία",
      text:
        "Σας περιμένουμε με ζεστή φιλοξενία, κρυφό κήπο και φαγητό στο κέντρο της Σόφιας."
    }
  },
  de: {
    title: "Gute Restaurants Sofia: Authentisch essen im Zentrum",
    intro:
      "The Friendly Bear liegt in einer Stadtvilla von 1923 an der Slavyanska 23. Das leicht unterirdische Retro-Interieur, die Teppichwand und der ruhige Hof wirken echt, lokal und ungekünstelt.",
    vegetarian:
      "Frische Salate, sorgfältig zubereitete Beilagen und saisonale Zutaten ergänzen das langsam gegarte Lamm mit Pilzen.",
    service:
      "Unser Team spricht Englisch, das Menü ist leicht vom Smartphone aus zu öffnen, und der Hof bleibt ein ruhiger Ort zum Ankommen und Entspannen.",
    primaryCtaLabel: "Speisekarte öffnen (English)",
    callLabel: "Anrufen",
    cards: [
      {
        label: "Authentisch",
        title: "Kein generischer Touristenspot",
        text:
          "Das Retro-Interieur, die Teppichwand und die historische Villa fühlen sich lokal an, nicht wie eine inszenierte Kulisse."
      },
      {
        label: "Qualität",
        title: "Langsam gegart, klar vorbereitet",
        text:
          "Das Lamm mit Pilzen steht für einfache, gute Zutaten und ruhige Zubereitung statt schneller Massenküche."
      },
      {
        label: "Innenhof",
        title: "Ruhig mitten in Sofia",
        text:
          "Der Hof ist ein angenehmer Ort zum Entspannen nach Business-Terminen, Stadtrundgang oder Ausflug in die Berge."
      }
    ],
    signature: {
      label: "Empfehlungen",
      title: "Gerichte mit Charakter",
      dishes: [
        "Kalbszungensandwich mit karamellisierten Zwiebeln",
        "Langsam gegartes Lamm mit Pilzen",
        "Fischsuppe",
        "Baileys Crème Brûlée"
      ]
    },
    atmosphere: {
      label: "Atmosphäre",
      title: "Shabby-chic, ruhig und echt",
      text:
        "Der leicht unterirdische Raum mit weicher Teppichwand macht The Friendly Bear zu einer guten Wahl für Gäste, die Sofia abseits austauschbarer Restaurants erleben möchten."
    },
    venue: {
      eyebrow: "Atmosphäre",
      title: "Ruhiger Hof und warmes Retro-Interieur",
      intro:
        "Ein erster Blick auf den Ort: Gartenlicht, Holzdetails, historische Räume und die ruhige Stimmung einer Stadtvilla von 1923.",
      gardenLabel: "Hof",
      interiorLabel: "Interieur",
      gardenAlt: "Ruhiger Hof des Restaurants The Friendly Bear in Sofia",
      interiorAlt: "Retro-Interieur mit Teppichwand im The Friendly Bear Sofia"
    }
  },
  ro: {
    title: "Unde mâncăm în Sofia: comfort food în centru",
    intro:
      "The Friendly Bear este o oprire sățioasă chiar în centrul Sofiei, pe Slavyanska 23, cu grădină ascunsă, interior retro și mâncare consistentă după drum.",
    vegetarian:
      "Caută sandvișul cu limbă de vițel și ceapă caramelizată, mielul copt lent cu ciuperci, supele calde și salatele proaspete.",
    service:
      "Echipa vorbește engleză, meniul se deschide ușor pe telefon, iar atmosfera este primitoare pentru prânz, cină sau o oprire de tranzit.",
    primaryCtaLabel: "Deschide meniul (English)",
    callLabel: "Sună pentru Rezervare",
    cards: [
      {
        label: "City break",
        title: "Oprire rapidă în centru",
        text:
          "Locația de pe Slavyanska 23 funcționează bine pentru weekenduri scurte, drumuri prin Bulgaria sau o seară în Sofia."
      },
      {
        label: "Porții",
        title: "Mâncare bogată și sățioasă",
        text:
          "Meniul scoate în față preparate pline de gust, potrivite după condus, plimbare sau cumpărături."
      },
      {
        label: "Valoare",
        title: "Calitate fără complicații",
        text:
          "O atmosferă caldă, servire în engleză și preparate consistente fac alegerea ușoară pentru vizitatori români."
      }
    ],
    signature: {
      label: "Ce să încerci",
      title: "Comfort food cu identitate locală",
      dishes: [
        "Sandviș cu limbă de vițel și ceapă caramelizată",
        "Miel copt lent cu ciuperci",
        "Supă de pește",
        "Baileys Crème Brûlée"
      ]
    },
    atmosphere: {
      label: "Atmosferă",
      title: "Retro, cald, ușor de ținut minte",
      text:
        "Interiorul ușor subteran și peretele cu covor moale creează un detaliu neobișnuit, iar grădina ascunsă aduce liniște vara."
    },
    venue: {
      eyebrow: "Atmosferă",
      title: "Grădină ascunsă și interior cald",
      intro:
        "O privire rapidă asupra locului înainte să ajungi: lumini în grădină, lemn, camere retro și o casă istorică din 1923.",
      gardenLabel: "Grădină",
      interiorLabel: "Interior",
      gardenAlt: "Grădina ascunsă a restaurantului The Friendly Bear din Sofia",
      interiorAlt: "Interiorul retro al restaurantului The Friendly Bear din Sofia"
    }
  },
  "en-gb": {
    title: "Traditional Bulgarian food in Sofia with a proper welcome",
    intro:
      "The Friendly Bear is a cosy central Sofia restaurant for proper comfort food, good drinks and a friendly attitude before a night out, a ski transfer or a relaxed group dinner.",
    vegetarian:
      "Go for slow-roasted lamb with mushrooms, the veal tongue sandwich with caramelised onions, fish soup, and Baileys Crème Brûlée when you want something memorable.",
    service:
      "Our team speaks English and keeps the atmosphere friendly, relaxed and danger-free for couples, groups and solo travellers.",
    primaryCtaLabel: "See the Menu",
    callLabel: "Call to Reserve",
    cards: [
      {
        label: "Comfort food",
        title: "Hearty food before the next plan",
        text:
          "A strong choice before a night out, after landing in Sofia, or on the way to Bansko or Borovets."
      },
      {
        label: "Groups",
        title: "Welcoming for small groups",
        text:
          "Clear English communication, filling dishes and good drinks make group dinners easier to settle."
      },
      {
        label: "Value",
        title: "Central Sofia without fuss",
        text:
          "A warm tavern-style welcome, generous dishes and easy directions from the city centre."
      }
    ],
    signature: {
      label: "What to order",
      title: "Proper comfort food",
      dishes: [
        "Veal tongue sandwich with caramelised onions",
        "Slow-roasted lamb with mushrooms",
        "Fish soup",
        "Baileys Crème Brûlée"
      ]
    },
    atmosphere: {
      label: "Atmosphere",
      title: "Cosy, retro and a little hidden",
      text:
        "The slightly underground dining room, soft carpet on the wall and hidden courtyard give the place the kind of character travellers remember."
    },
    venue: {
      eyebrow: "Atmosphere",
      title: "Hidden courtyard and cosy retro rooms",
      intro:
        "A quick look before you arrive: courtyard lights, warm rooms, wooden details and a 1923 house in central Sofia.",
      gardenLabel: "Courtyard",
      interiorLabel: "Interior",
      gardenAlt: "Hidden courtyard at The Friendly Bear Sofia",
      interiorAlt: "Cosy retro interior at The Friendly Bear Sofia"
    }
  }
};
