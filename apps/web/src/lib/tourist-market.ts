import {
  getTouristMarketLocalizedSlug,
  normalizeTouristMarketLandingPageEntry,
  type FrontendTouristLandingPage,
  type TouristAudience,
  type TouristMarketLocale
} from "@/lib/cms/tourist-landing-page-adapter";
import { getTouristLandingPageEntry } from "@/lib/tourist-landing-page-module";

type TouristMarketConfig = {
  audience: TouristAudience;
  label: string;
  ogLocale: string;
  nav: {
    menu: string;
    reservations: string;
    contact: string;
    directions: string;
    phone: string;
  };
  ui: {
    pageLabel: string;
    highlights: string;
    vegetarian: string;
    service: string;
    nextSteps: string;
    whyThisWorks: string;
    quickActions: string;
    openReservations: string;
    openContact: string;
    openDirections: string;
    centralSignal: string;
  };
};

const touristMarketConfig: Record<TouristMarketLocale, TouristMarketConfig> = {
  it: {
    audience: "italian",
    label: "Visitatori italiani",
    ogLocale: "it_IT",
    nav: {
      menu: "Menu",
      reservations: "Prenotazioni",
      contact: "Contatti",
      directions: "Indicazioni",
      phone: "Chiama per Prenotare"
    },
    ui: {
      pageLabel: "Pagina per visitatori italiani",
      highlights: "Punti chiave",
      vegetarian: "Opzioni vegetariane",
      service: "Accoglienza e servizio",
      nextSteps: "Cosa fare adesso",
      whyThisWorks: "Perche scegliere The Friendly Bear",
      quickActions: "Azioni rapide",
      openReservations: "Chiama per prenotare o apri il menu in inglese prima della visita.",
      openContact: "Chiama per prenotare o apri il menu in inglese prima della visita.",
      openDirections: "Apri le indicazioni per Slavyanska 23 quando sei pronto a partire.",
      centralSignal: "Posizione centrale a Sofia"
    }
  },
  es: {
    audience: "spanish",
    label: "Visitantes hispanohablantes",
    ogLocale: "es_ES",
    nav: {
      menu: "Menú",
      reservations: "Reservas",
      contact: "Contacto",
      directions: "Cómo llegar",
      phone: "Llamar para Reservar"
    },
    ui: {
      pageLabel: "Página para visitantes hispanohablantes",
      highlights: "Puntos clave",
      vegetarian: "Opciones vegetarianas",
      service: "Servicio y atención",
      nextSteps: "Qué hacer ahora",
      whyThisWorks: "Por qué elegir The Friendly Bear",
      quickActions: "Acciones rápidas",
      openReservations: "Llama para reservar o abre el menú en inglés antes de venir.",
      openContact: "Llama para reservar o abre el menú en inglés antes de venir.",
      openDirections: "Abre las indicaciones hacia Slavyanska 23 cuando estés listo.",
      centralSignal: "Ubicación céntrica en Sofía"
    }
  },
  el: {
    audience: "greek",
    label: "Επισκέπτες από την Ελλάδα",
    ogLocale: "el_GR",
    nav: {
      menu: "Μενού",
      reservations: "Κρατήσεις",
      contact: "Επικοινωνία",
      directions: "Οδηγίες",
      phone: "Κλήση για Κράτηση"
    },
    ui: {
      pageLabel: "Σελίδα για επισκέπτες από την Ελλάδα",
      highlights: "Βασικά σημεία",
      vegetarian: "Χορτοφαγικές επιλογές",
      service: "Εξυπηρέτηση και φιλοξενία",
      nextSteps: "Πρακτικές πληροφορίες",
      whyThisWorks: "Γιατί να επιλέξετε The Friendly Bear",
      quickActions: "Γρήγορες ενέργειες",
      openReservations: "Καλέστε για κράτηση ή ανοίξτε το μενού στα αγγλικά πριν την επίσκεψη.",
      openContact: "Καλέστε για κράτηση ή ανοίξτε το μενού στα αγγλικά πριν την επίσκεψη.",
      openDirections: "Ανοίξτε τις οδηγίες προς Slavyanska 23 όταν είστε έτοιμοι να ξεκινήσετε.",
      centralSignal: "Κεντρική τοποθεσία στη Σόφια"
    }
  },
  de: {
    audience: "german",
    label: "Gäste aus Deutschland",
    ogLocale: "de_DE",
    nav: {
      menu: "Speisekarte",
      reservations: "Reservierung",
      contact: "Kontakt",
      directions: "Route",
      phone: "Anrufen"
    },
    ui: {
      pageLabel: "Seite für deutsche Gäste",
      highlights: "Highlights",
      vegetarian: "Frische Salate",
      service: "Service auf Englisch",
      nextSteps: "Nächste Schritte",
      whyThisWorks: "Warum The Friendly Bear",
      quickActions: "Schnellzugriff",
      openReservations: "Rufen Sie an oder öffnen Sie die englische Speisekarte vor dem Besuch.",
      openContact: "Rufen Sie an oder öffnen Sie die englische Speisekarte vor dem Besuch.",
      openDirections: "Öffnen Sie die Route nach Slavyanska 23, wenn Sie losgehen.",
      centralSignal: "Zentrale Lage in Sofia"
    }
  },
  ro: {
    audience: "romanian",
    label: "Vizitatori din România",
    ogLocale: "ro_RO",
    nav: {
      menu: "Meniu",
      reservations: "Rezervări",
      contact: "Contact",
      directions: "Indicații",
      phone: "Sună pentru Rezervare"
    },
    ui: {
      pageLabel: "Pagină pentru vizitatori români",
      highlights: "Repere",
      vegetarian: "Opțiuni vegetariene",
      service: "Serviciu în engleză",
      nextSteps: "Pașii următori",
      whyThisWorks: "De ce The Friendly Bear",
      quickActions: "Acțiuni rapide",
      openReservations: "Sună pentru rezervare sau deschide meniul în engleză înainte de vizită.",
      openContact: "Sună pentru rezervare sau deschide meniul în engleză înainte de vizită.",
      openDirections: "Deschide indicațiile către Slavyanska 23 când ești gata.",
      centralSignal: "Locație centrală în Sofia"
    }
  },
  "en-gb": {
    audience: "uk",
    label: "UK visitors",
    ogLocale: "en_GB",
    nav: {
      menu: "Menu",
      reservations: "Reservations",
      contact: "Contact",
      directions: "Directions",
      phone: "Call to Reserve"
    },
    ui: {
      pageLabel: "Page for UK visitors",
      highlights: "Highlights",
      vegetarian: "Vegetarian options",
      service: "English-speaking staff",
      nextSteps: "Next steps",
      whyThisWorks: "Why choose The Friendly Bear",
      quickActions: "Quick actions",
      openReservations: "Call to reserve or open the English menu before you visit.",
      openContact: "Call to reserve or open the English menu before you visit.",
      openDirections: "Open directions to Slavyanska 23 when you are ready to go.",
      centralSignal: "Central Sofia location"
    }
  }
};

export type { TouristMarketLocale };

export function getTouristMarketConfig(locale: TouristMarketLocale) {
  return touristMarketConfig[locale];
}

export async function getTouristMarketPageData(
  locale: TouristMarketLocale
): Promise<FrontendTouristLandingPage | null> {
  const config = getTouristMarketConfig(locale);
  const entry = await getTouristLandingPageEntry(config.audience);

  if (!entry) {
    return null;
  }

  return normalizeTouristMarketLandingPageEntry(entry, locale);
}

export async function getTouristMarketSlug(locale: TouristMarketLocale) {
  const config = getTouristMarketConfig(locale);
  const entry = await getTouristLandingPageEntry(config.audience);

  return entry ? getTouristMarketLocalizedSlug(entry, locale) : config.audience;
}
