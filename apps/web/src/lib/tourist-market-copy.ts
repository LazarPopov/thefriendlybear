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
    title: "Dove mangiare bene a Sofia: The Cozy Culinary Escape",
    intro:
      "Nascosto in una via tranquilla del centro, The Friendly Bear è una casa urbana del 1923 con giardino, sale retro leggermente sotterranee e un'atmosfera perfetta per cena, drink e nightlife. Altamente raccomandato su Reddit da altri viaggiatori italiani.",
    vegetarian:
      "Il nostro menu celebra sapori autentici: dal famoso panino con lingua di vitello e cipolle caramellate all'agnello cotto lentamente con funghi, fino a fresche opzioni vegetariane.",
    service:
      "Un'accoglienza calorosa e autentica: staff che parla inglese, menu digitale facile e un'atmosfera rilassata che ti farà sentire subito a casa nel cuore di Sofia.",
    primaryCtaLabel: "Vedi il Menu (English)",
    callLabel: "Chiama per Prenotare",
    cards: [
      {
        label: "Social proof",
        title: "Consigliato da italiani a Sofia",
        text:
          "The Friendly Bear è già un punto di riferimento su Reddit per i viaggiatori italiani che cercano un posto centrale, autentico e con carattere."
      },
      {
        label: "Atmosfera",
        title: "Retro, intimo e vibrante",
        text:
          "Una base perfetta per mangiare bene, bere qualcosa e godersi il design unico con le pareti in tappeto prima di scoprire la nightlife di Sofia."
      },
      {
        label: "Posizione",
        title: "Centro città, via Slavyanska 23",
        text:
          "Ci trovi a pochi passi dal Teatro Nazionale, in una delle zone più affascinanti e vive della capitale bulgara."
      }
    ],
    signature: {
      label: "Piatti firma",
      title: "Sapori che non dimenticherai",
      dishes: [
        "Panino con lingua di vitello e cipolle caramellate",
        "Agnello cotto lentamente con funghi",
        "Zuppa di pesce della casa",
        "Baileys Crème Brûlée"
      ]
    },
    atmosphere: {
      label: "L'Ambiente",
      title: "Design unico, spirito retro",
      text:
        "La sala interna con la sua iconica parete in morbido tappeto crea un'atmosfera 'hidden gem' perfetta per chi cerca qualcosa di diverso dai soliti posti turistici."
    },
    venue: {
      eyebrow: "Atmosfera",
      title: "Giardino nascosto e calore urbano",
      intro:
        "Scopri il nostro spazio: dalle luci soffuse del giardino ai dettagli in legno delle sale interne, ogni angolo racconta la storia di una casa del 1923.",
      gardenLabel: "Giardino",
      interiorLabel: "Interno retro",
      gardenAlt: "Giardino segreto del ristorante The Friendly Bear a Sofia",
      interiorAlt: "Interno retro leggermente sotterraneo del ristorante The Friendly Bear a Sofia"
    }
  },
  es: {
    title: "Dónde comer en Sofía: Un refugio con encanto y sabor",
    intro:
      "Ubicado en una casa histórica de 1923, The Friendly Bear es ese 'hidden gem' que buscas en el centro de Sofía. Un ambiente retro, ligeramente subterráneo y acogedor para socializar sin prisas.",
    vegetarian:
      "Nuestra cocina se centra en la calidad: desde el cordero cocinado lentamente con setas hasta ensaladas frescas y platos vegetarianos que sorprenden.",
    service:
      "Abierto hasta las 23:00, con un equipo que habla inglés y una hospitalidad genuina que te hará sentir como un local desde el primer momento.",
    primaryCtaLabel: "Ver el Menú (English)",
    callLabel: "Llamar para Reservar",
    cards: [
      {
        label: "Refugio",
        title: "Cena con calma en el centro",
        text:
          "El ambiente retro y sus salas íntimas ofrecen el refugio perfecto tras un día explorando las calles de la capital."
      },
      {
        label: "Horario",
        title: "Abierto hasta las 23:00",
        text:
          "Sabemos que el tiempo es diferente para nosotros. Disfruta de una cena tarde sin prisas antes de seguir tu ruta por Sofía."
      },
      {
        label: "Especialidad",
        title: "Cordero y Baileys Crème Brûlée",
        text:
          "Platos con identidad que combinan la tradición búlgara con un toque contemporáneo y acogedor."
      }
    ],
    signature: {
      label: "Platos destacados",
      title: "Sabores con carácter",
      dishes: [
        "Sándwich de lengua de ternera con cebolla caramelizada",
        "Cordero cocinado lentamente con setas",
        "Sopa de pescado casera",
        "Baileys Crème Brûlée"
      ]
    },
    atmosphere: {
      label: "Ambiente",
      title: "Casa de 1923 e interior retro",
      text:
        "Nuestro jardín escondido es un oasis en verano, mientras que las paredes con alfombras suaves crean un interior curioso y fotografiable en invierno."
    },
    venue: {
      eyebrow: "Ambiente",
      title: "Jardín secreto y calidez interior",
      intro:
        "Echa un vistazo a nuestro refugio urbano: una mezcla de historia, madera y luces tenues que crean una atmósfera inolvidable.",
      gardenLabel: "Jardín",
      interiorLabel: "Interior",
      gardenAlt: "Jardín tranquilo del restaurante The Friendly Bear en Sofía",
      interiorAlt: "Interior acogedor y retro del restaurante The Friendly Bear en Sofía"
    },
    specialNote: {
      ariaLabel: "Abierto hasta las 23:00",
      label: "Cena tarde",
      text:
        "Perfecto para una cena tranquila después de pasear por el centro de Sofía, con carnes cocinadas lentamente y opciones frescas."
    }
  },
  el: {
    title: "Καλύτερα εστιατόρια Σόφια: Your Weekend Culinary Home",
    intro:
      "Κρυμμένο στην καρδιά της Σόφιας, το The Friendly Bear είναι ο ιδανικός προορισμός για το weekend getaway σας. Μια ιστορική κατοικία του 1923 που προσφέρει ζεστασιά, αυθεντικές γεύσεις και έναν υπέροχο κρυφό κήπο.",
    vegetarian:
      "Ανακαλύψτε το αργοψημένο αρνί με μανιτάρια, το διάσημο σάντουιτς με γλώσσα μοσχαριού και φρέσκιες επιλογές για κάθε γούστο.",
    service:
      "Εδώ η φιλοξενία είναι προσωπική: αγγλόφωνο προσωπικό, φιλική ατμόσφαιρα (χωρίς 'αρκούδες' και απότομους τρόπους) και ζεστό καλωσόρισμα.",
    primaryCtaLabel: "Δείτε το Μενού (English)",
    callLabel: "Κλήση για Κράτηση",
    cards: [
      {
        label: "Weekend",
        title: "Το σπίτι σας στη Σόφια",
        text:
          "Ιδανικό για ένα χαλαρό μεσημεριανό ή δείπνο κατά τη διάρκεια της απόδρασής σας στην πόλη."
      },
      {
        label: "Γεύση",
        title: "Αυθεντικότητα και ποιότητα",
        text:
          "Από την ψαρόσουπα μέχρι το Baileys Crème Brûlée, κάθε πιάτο είναι φτιαγμένο με μεράκι και προσοχή στη λεπτομέρεια."
      },
      {
        label: "Φιλοξενία",
        title: "Άνεση στα αγγλικά",
        text:
          "Η ομάδα μας είναι εδώ για να σας βοηθήσει με το μενού και να κάνει την επίσκεψή σας αξέχαστη."
      }
    ],
    signature: {
      label: "Πιάτα που πρέπει να δοκιμάσετε",
      title: "Γεύσεις με ταυτότητα",
      dishes: [
        "Σάντουιτς με γλώσσα μοσχαριού και καραμελωμένα κρεμμύδια",
        "Αργοψημένο αρνί με μανιτάρια",
        "Σπιτική ψαρόσουπα",
        "Baileys Crème Brûlée"
      ]
    },
    atmosphere: {
      label: "Ατμόσφαιρα",
      title: "Ρετρό γοητεία και κρυφός κήπος",
      text:
        "Το μοναδικό εσωτερικό με τη μαλακή ταπετσαρία στον τοίχο και ο ήσυχος κήπος δημιουργούν την αίσθηση ενός κρυμμένου θησαυρού."
    },
    venue: {
      eyebrow: "Ατμόσφαιρα",
      title: "Κρυφός κήπος και ζεστή φιλοξενία",
      intro:
        "Πάρτε μια γεύση από τον χώρο μας: ξύλινες λεπτομέρειες, ατμοσφαιρικός φωτισμός και η ιστορία μιας άλλης εποχής.",
      gardenLabel: "Κήπος",
      interiorLabel: "Εσωτερικό",
      gardenAlt: "Ο κήπος του εστιατορίου The Friendly Bear στη Σόφια",
      interiorAlt: "Το ζεστό ρετρό εσωτερικό του εστιατορίου The Friendly Bear στη Σόφια"
    },
    specialNote: {
      ariaLabel: "Σας περιμένουμε",
      label: "Φιλοξενία",
      text:
        "Σας περιμένουμε με ζεστή φιλοξενία και αυθεντικές γεύσεις στο κέντρο της Σόφιας."
    }
  },
  de: {
    title: "Gute Restaurants Sofia: Authentic Flavors & Quality",
    intro:
      "The Friendly Bear ist kein gewöhnlicher Touristenort. In einer Stadtvilla von 1923 an der Slavyanska 23 finden Sie ehrliche Küche, ein leicht unterirdisches Retro-Interieur und eine entspannte, echte Atmosphäre.",
    vegetarian:
      "Wir setzen auf Qualität und langsame Zubereitung: Probieren Sie unser langsam gegartes Lamm mit Pilzen, das Kalbszungensandwich oder unsere frischen saisonalen Salate.",
    service:
      "Unser Team spricht fließend Englisch und sorgt für eine gastfreundliche, unaufgeregte Stimmung – ideal für Business-Gäste und Städtereisende.",
    primaryCtaLabel: "Speisekarte öffnen (English)",
    callLabel: "Anrufen",
    cards: [
      {
        label: "Authentisch",
        title: "Ein echtes Stück Sofia",
        text:
          "Das Retro-Design mit der markanten Teppichwand und die historische Villa bieten ein Erlebnis abseits der Massen."
      },
      {
        label: "Qualität",
        title: "Slow-roasted Tradition",
        text:
          "Unsere Spezialitäten wie das langsam gegarte Lamm stehen für Zeit, Sorgfalt und exzellente Zutaten."
      },
      {
        label: "Innenhof",
        title: "Ruheoase im Zentrum",
        text:
          "Der ruhige Garten ist der perfekte Ort, um nach einem langen Tag in der Stadt oder einem Meeting zu entspannen."
      }
    ],
    signature: {
      label: "Empfehlungen",
      title: "Gerichte mit Charakter",
      dishes: [
        "Kalbszungensandwich with karamellisierten Zwiebeln",
        "Langsam gegartes Lamm mit Pilzen",
        "Hausgemachte Fischsuppe",
        "Baileys Crème Brûlée"
      ]
    },
    atmosphere: {
      label: "Atmosphäre",
      title: "Retro, gemütlich und unverkennbar",
      text:
        "Der leicht unterirdische Gastraum und das Shabby-Chic-Ambiente machen uns zu einem 'Hidden Gem' für Kenner und Entdecker."
    },
    venue: {
      eyebrow: "Atmosphäre",
      title: "Ruhiger Hof und warmes Interieur",
      intro:
        "Ein Blick in unsere Welt: Historische Räume, warme Holzdetails und die entspannte Stimmung einer vergangenen Ära.",
      gardenLabel: "Hof",
      interiorLabel: "Interieur",
      gardenAlt: "Ruhiger Hof des Restaurants The Friendly Bear in Sofia",
      interiorAlt: "Retro-Interieur mit Teppichwand im The Friendly Bear Sofia"
    }
  },
  ro: {
    title: "Unde mâncăm în Sofia: Hearty Comfort Food in Sofia",
    intro:
      "The Friendly Bear este locul unde mâncarea bună întâlnește ospitalitatea caldă. O casă istorică din 1923, un interior retro plin de caracter și cele mai bune preparate gătite lent din centrul Sofiei.",
    vegetarian:
      "De la celebrul sandviș cu limbă de vițel și ceapă caramelizată la mielul copt lent cu ciuperci, meniul nostru este despre gust autentic și porții sățioase.",
    service:
      "Echipa vorbește engleză și te întâmpină cu un zâmbet, fără atitudini rigide, într-o atmosferă relaxată ideală pentru un city break sau un popas de tranzit.",
    primaryCtaLabel: "Deschide meniul (English)",
    callLabel: "Sună pentru Rezervare",
    cards: [
      {
        label: "City break",
        title: "Gustul autentic al Sofiei",
        text:
          "Situat pe Slavyanska 23, suntem oprirea perfectă pentru cei care vor să descopere centrul orașului la pas."
      },
      {
        label: "Porții",
        title: "Mâncare bogată, gătite lent",
        text:
          "Mielul nostru cu ciuperci și supele calde sunt exact ce ai nevoie după un drum lung sau o plimbare prin oraș."
      },
      {
        label: "Atmosferă",
        title: "Un loc de ținut minte",
        text:
          "Designul retro cu peretele acoperit de covor și grădina ascunsă fac din The Friendly Bear o experiență unică."
      }
    ],
    signature: {
      label: "Ce să încerci",
      title: "Comfort food cu identitate",
      dishes: [
        "Sandviș cu limbă de vițel și ceapă caramelizată",
        "Miel copt lent cu ciuperci",
        "Supă de pește a casei",
        "Baileys Crème Brûlée"
      ]
    },
    atmosphere: {
      label: "Atmosferă",
      title: "Retro, cald și primitor",
      text:
        "Interiorul ușor subteran și grădina liniștită oferă un refugiu perfect, departe de agitația turistică obișnuită."
    },
    venue: {
      eyebrow: "Atmosferă",
      title: "Grădină ascunsă și interior cald",
      intro:
        "Descoperă universul nostru înainte de vizită: camere retro, detalii din lemn și farmecul unei case de la 1923.",
      gardenLabel: "Grădină",
      interiorLabel: "Interior",
      gardenAlt: "Grădina ascunsă a restaurantului The Friendly Bear din Sofia",
      interiorAlt: "Interiorul retro al restaurantului The Friendly Bear din Sofia"
    }
  },
  "en-gb": {
    title: "Sofia's Best Kept Secret: Traditional Food & A Proper Welcome",
    intro:
      "Tucked away in a 1923 town house, The Friendly Bear is a proper hidden gem in central Sofia. Expect hearty comfort food, a unique retro interior and a genuinely friendly attitude.",
    vegetarian:
      "Our menu is all about character: from our signature veal tongue sandwich with caramelised onions to slow-roasted lamb with mushrooms and fresh seasonal greens.",
    service:
      "Our team speaks fluent English and keeps things relaxed and 'danger-free' – a warm, tavern-style welcome for couples, groups and solo travellers.",
    primaryCtaLabel: "See the Menu",
    callLabel: "Call to Reserve",
    cards: [
      {
        label: "Hidden Gem",
        title: "Beyond the tourist spots",
        text:
          "The slightly underground rooms and soft carpet on the wall give the place a quirky, memorable character you won't find elsewhere."
      },
      {
        label: "Comfort Food",
        title: "Proper food, slowly prepared",
        text:
          "Whether it's the slow-roasted lamb or the fish soup, our kitchen focuses on authentic flavors and satisfying portions."
      },
      {
        label: "Location",
        title: "Heart of Sofia, Slavyanska 23",
        text:
          "Just a short walk from the National Theatre, we're the perfect base before a night out or after a day of exploring."
      }
    ],
    signature: {
      label: "What to order",
      title: "Signature Comfort Food",
      dishes: [
        "Veal tongue sandwich with caramelised onions",
        "Slow-roasted lamb with mushrooms",
        "Homemade fish soup",
        "Baileys Crème Brûlée"
      ]
    },
    atmosphere: {
      label: "Atmosphere",
      title: "Cosy, retro and full of soul",
      text:
        "The historic 1923 setting and hidden courtyard offer a peaceful retreat with a unique, slightly underground retro vibe."
    },
    venue: {
      eyebrow: "Atmosphere",
      title: "Hidden courtyard and cosy retro rooms",
      intro:
        "A quick look inside: warm wooden details, courtyard lights and the authentic charm of a century-old Sofia house.",
      gardenLabel: "Courtyard",
      interiorLabel: "Interior",
      gardenAlt: "Hidden courtyard at The Friendly Bear Sofia",
      interiorAlt: "Cosy retro interior at The Friendly Bear Sofia"
    }
  }
};
