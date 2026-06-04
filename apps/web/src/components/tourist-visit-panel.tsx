import { ActionLink } from "@/components/action-link";
import { CopyAddressButton } from "@/components/copy-address-button";
import { DeferredMapEmbed } from "@/components/deferred-map-embed";
import { getPhoneHref, type FrontendBusinessProfile } from "@/lib/business-profile-module";
import type { SiteLocale } from "@/lib/site";
import { buildActionTracking, type BusinessActionKind } from "@/lib/tracking";
import type { TouristMarketLocale } from "@/lib/tourist-market";

type TouristVisitLocale = SiteLocale | TouristMarketLocale;
type TouristVisitPanelContext = "tourists" | "tourist_page" | "market";

type TouristVisitCopy = {
  eyebrow: string;
  address: string;
  body: string;
  copyAddress: string;
  copied: string;
  menu: string;
  reserve: string;
  directions: string;
  mapAriaLabel: string;
  mapTitle: string;
  mapPinLabel: string;
  loadMap: string;
};

type TouristVisitPanelProps = {
  locale: TouristVisitLocale;
  businessProfile: FrontendBusinessProfile;
  context: TouristVisitPanelContext;
};

type VisitAction = {
  href: string;
  label: string;
  kind: BusinessActionKind;
  external?: boolean;
};

const visitPanelTrackingLocations = {
  tourists: "tourists_visit_panel",
  tourist_page: "tourist_page_visit_panel",
  market: "market_visit_panel"
} as const;

const touristVisitCopy = {
  en: {
    eyebrow: "Visit us",
    address: "Sofia Center, Slavyanska St 23, 1000 Sofia, Bulgaria",
    body: "Save the address, open directions, or call us. We are on Slavyanska 23, in central Sofia.",
    copyAddress: "Copy address",
    copied: "Copied",
    menu: "Menu",
    reserve: "Reserve",
    directions: "Directions",
    mapAriaLabel: "Map to The Friendly Bear Sofia",
    mapTitle: "The Friendly Bear Sofia map",
    mapPinLabel: "Map",
    loadMap: "Load map"
  },
  bg: {
    eyebrow: "Посетете ни",
    address: "Център София, ул. Славянска 23, 1000 София, България",
    body: "Запазете адреса, отворете упътванията или ни се обадете. Намираме се на Славянска 23, в центъра на София.",
    copyAddress: "Копирай адрес",
    copied: "Копирано",
    menu: "Меню",
    reserve: "Резервация",
    directions: "Упътвания",
    mapAriaLabel: "Карта до The Friendly Bear Sofia",
    mapTitle: "Карта до The Friendly Bear Sofia",
    mapPinLabel: "Карта",
    loadMap: "Зареди карта"
  },
  nl: {
    eyebrow: "Bezoek ons",
    address: "Centrum Sofia, Slavyanska St 23, 1000 Sofia, Bulgarije",
    body: "Sla het adres op, open de route of bel ons. We zitten op Slavyanska 23, in het centrum van Sofia.",
    copyAddress: "Kopieer adres",
    copied: "Gekopieerd",
    menu: "Menu",
    reserve: "Reserveer",
    directions: "Route",
    mapAriaLabel: "Kaart naar The Friendly Bear Sofia",
    mapTitle: "Kaart naar The Friendly Bear Sofia",
    mapPinLabel: "Kaart",
    loadMap: "Kaart laden"
  },
  de: {
    eyebrow: "Besuchen Sie uns",
    address: "Zentrum Sofia, Slavyanska St 23, 1000 Sofia, Bulgarien",
    body: "Speichern Sie die Adresse, öffnen Sie die Route oder rufen Sie uns an. Sie finden uns in der Slavyanska 23 im Zentrum von Sofia.",
    copyAddress: "Adresse kopieren",
    copied: "Kopiert",
    menu: "Speisekarte",
    reserve: "Reservieren",
    directions: "Route",
    mapAriaLabel: "Karte zu The Friendly Bear Sofia",
    mapTitle: "Karte zu The Friendly Bear Sofia",
    mapPinLabel: "Karte",
    loadMap: "Karte laden"
  },
  it: {
    eyebrow: "Vieni a trovarci",
    address: "Centro di Sofia, Slavyanska St 23, 1000 Sofia, Bulgaria",
    body: "Salva l'indirizzo, apri le indicazioni o chiamaci. Siamo in Slavyanska 23, nel centro di Sofia.",
    copyAddress: "Copia indirizzo",
    copied: "Copiato",
    menu: "Menu",
    reserve: "Prenota",
    directions: "Indicazioni",
    mapAriaLabel: "Mappa per The Friendly Bear Sofia",
    mapTitle: "Mappa per The Friendly Bear Sofia",
    mapPinLabel: "Mappa",
    loadMap: "Carica mappa"
  },
  es: {
    eyebrow: "Visítanos",
    address: "Centro de Sofía, Slavyanska St 23, 1000 Sofia, Bulgaria",
    body: "Guarda la dirección, abre las indicaciones o llámanos. Estamos en Slavyanska 23, en el centro de Sofía.",
    copyAddress: "Copiar dirección",
    copied: "Copiado",
    menu: "Menú",
    reserve: "Reservar",
    directions: "Cómo llegar",
    mapAriaLabel: "Mapa a The Friendly Bear Sofia",
    mapTitle: "Mapa a The Friendly Bear Sofia",
    mapPinLabel: "Mapa",
    loadMap: "Cargar mapa"
  },
  el: {
    eyebrow: "Επισκεφθείτε μας",
    address: "Κέντρο Σόφιας, Slavyanska St 23, 1000 Σόφια, Βουλγαρία",
    body: "Αποθηκεύστε τη διεύθυνση, ανοίξτε τις οδηγίες ή καλέστε μας. Βρισκόμαστε στη Slavyanska 23, στο κέντρο της Σόφιας.",
    copyAddress: "Αντιγραφή διεύθυνσης",
    copied: "Αντιγράφηκε",
    menu: "Μενού",
    reserve: "Κράτηση",
    directions: "Οδηγίες",
    mapAriaLabel: "Χάρτης προς The Friendly Bear Sofia",
    mapTitle: "Χάρτης προς The Friendly Bear Sofia",
    mapPinLabel: "Χάρτης",
    loadMap: "Φόρτωση χάρτη"
  },
  ro: {
    eyebrow: "Vizitează-ne",
    address: "Centrul Sofiei, Slavyanska St 23, 1000 Sofia, Bulgaria",
    body: "Salvează adresa, deschide indicațiile sau sună-ne. Suntem pe Slavyanska 23, în centrul Sofiei.",
    copyAddress: "Copiază adresa",
    copied: "Copiat",
    menu: "Meniu",
    reserve: "Rezervă",
    directions: "Indicații",
    mapAriaLabel: "Hartă către The Friendly Bear Sofia",
    mapTitle: "Hartă către The Friendly Bear Sofia",
    mapPinLabel: "Hartă",
    loadMap: "Încarcă harta"
  },
  "en-gb": {
    eyebrow: "Visit us",
    address: "Sofia Centre, Slavyanska St 23, 1000 Sofia, Bulgaria",
    body: "Save the address, open directions, or call us. We are on Slavyanska 23, in central Sofia.",
    copyAddress: "Copy address",
    copied: "Copied",
    menu: "Menu",
    reserve: "Reserve",
    directions: "Directions",
    mapAriaLabel: "Map to The Friendly Bear Sofia",
    mapTitle: "The Friendly Bear Sofia map",
    mapPinLabel: "Map",
    loadMap: "Load map"
  }
} satisfies Record<TouristVisitLocale, TouristVisitCopy>;

function getMenuHref(locale: TouristVisitLocale) {
  return locale === "bg" ? "/bg/menu" : "/en/menu";
}

function getReservationHref(locale: TouristVisitLocale) {
  return locale === "bg" ? "/bg/reservations" : "/en/reservations";
}

function getTrackingLocation(context: TouristVisitPanelContext, locale: TouristVisitLocale) {
  if (context === "market") {
    return `${locale}_${visitPanelTrackingLocations.market}`;
  }

  return visitPanelTrackingLocations[context];
}

export function TouristVisitPanel({ locale, businessProfile, context }: TouristVisitPanelProps) {
  const copy = touristVisitCopy[locale];
  const phoneHref = getPhoneHref(businessProfile);
  const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(businessProfile.mapsLabel.en)}&output=embed`;
  const trackingLocation = getTrackingLocation(context, locale);
  const reserveHref = phoneHref ?? getReservationHref(locale);
  const reserveKind: BusinessActionKind = phoneHref ? "phone" : "reservations";
  const actions: VisitAction[] = [
    { href: getMenuHref(locale), label: copy.menu, kind: "menu" },
    { href: reserveHref, label: copy.reserve, kind: reserveKind },
    { href: businessProfile.mapUrl, label: copy.directions, kind: "directions", external: true }
  ];

  return (
    <section className="home-section home-visit-panel">
      <div className="home-visit-copy">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.address}</h2>
        <p>{copy.body}</p>
        <CopyAddressButton address={copy.address} label={copy.copyAddress} copiedLabel={copy.copied} />
      </div>

      <div className="home-visit-actions">
        {actions.map((action) => (
          <ActionLink
            key={`${action.kind}-${action.href}`}
            href={action.href}
            label={action.label}
            className="home-visit-link"
            external={Boolean(action.external)}
            tracking={buildActionTracking({
              kind: action.kind,
              locale,
              location: trackingLocation,
              label: action.label,
              target: action.href,
              external: Boolean(action.external)
            })}
          />
        ))}
      </div>

      <div className="home-visit-map-card" aria-label={copy.mapAriaLabel}>
        <DeferredMapEmbed
          src={mapEmbedSrc}
          title={copy.mapTitle}
          mapPinLabel={copy.mapPinLabel}
          loadLabel={copy.loadMap}
        />
      </div>
    </section>
  );
}
