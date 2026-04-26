import { ActionLink } from "@/components/action-link";
import { VenueSnapshotSection } from "@/components/venue-snapshot-section";
import {
  getBusinessProfileData,
  getExternalBookingHref,
  getPhoneHref
} from "@/lib/business-profile-module";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import type { TouristAudience } from "@/lib/tourist-landing-page-module";
import { buildActionTracking, type BusinessActionKind } from "@/lib/tracking";
import {
  getTouristMarketConfig,
  getTouristMarketPageData,
  type TouristMarketLocale
} from "@/lib/tourist-market";
import {
  touristBrandMotto,
  touristMarketPageCopy,
  type TouristMarketPageCopy
} from "@/lib/tourist-market-copy";
import {
  getFoodGalleryImages,
  getGardenGalleryImages,
  getInteriorGalleryImages
} from "@/lib/venue-gallery-images";

type TouristMarketPageProps = {
  marketLocale: TouristMarketLocale;
};

type MarketAction = {
  href: string;
  label: string;
  kind: BusinessActionKind;
  external?: boolean;
};

const venueMomentsCopy = {
  it: {
    eyebrow: "Atmosfera",
    title: "Giardino nascosto e calore da baita urbana",
    intro:
      "Una piccola galleria per sentire il luogo prima di arrivare: luci in giardino, dettagli in legno e sale interne accoglienti.",
    gardenLabel: "Atmosfera",
    interiorLabel: "Atmosfera"
  },
  es: {
    eyebrow: "Ambiente",
    title: "Jardín secreto y calidez interior",
    intro:
      "Una pequeña galería para sentir el lugar antes de llegar: terraza tranquila, detalles acogedores y el encanto de una casa de 1923.",
    gardenLabel: "Ambiente",
    interiorLabel: "Ambiente"
  },
  el: {
    eyebrow: "Ατμόσφαιρα",
    title: "Κρυφός κήπος και ζεστό εσωτερικό",
    intro:
      "Μια μικρή gallery για να πάρετε μια πρώτη αίσθηση του χώρου πριν φτάσετε: κήπος, ζεστασιά, ξύλινες λεπτομέρειες και αληθινή φιλοξενία.",
    gardenLabel: "Ατμόσφαιρα",
    interiorLabel: "Ατμόσφαιρα"
  }
} as const;

const italianPageCopy = {
  title: "Un'atmosfera magica a Sofia: Giardino e Tradizione",
  intro:
    "Nascosto dietro l'hotel Radisson nel cuore di Sofia, The Friendly Bear e una casa urbana del 1923 restaurata a mano. Un rifugio perfetto per chi cerca cibo autentico, carni cotte lentamente, opzioni vegetariane e calore umano.",
  vegetarian:
    "La cucina bulgara offre splendide alternative vegetariane. Nel nostro menu troverai insalate fresche e piatti caldi chiaramente segnalati.",
  service:
    "Non preoccuparti per la lingua. Il nostro staff parla inglese e il nostro menu disponibile in inglese e facile da consultare sul tuo smartphone.",
  cards: [
    {
      label: "Il Posto",
      title: "Posizione Centrale",
      text:
        "Ci trovi in via Slavyanska 23, a pochi passi dal Teatro Nazionale. Una zona tranquilla e sicura nel pieno centro citta."
    },
    {
      label: "Vegetariano",
      title: "Opzioni Vegetariane",
      text:
        "La cucina bulgara offre splendide alternative vegetariane. Nel nostro menu troverai insalate fresche e piatti caldi chiaramente segnalati."
    },
    {
      label: "Lingua",
      title: "Parliamo Inglese",
      text:
        "Non preoccuparti per la lingua. Il nostro staff parla inglese e il nostro menu disponibile in inglese e facile da consultare sul tuo smartphone."
    }
  ]
} as const;

const spanishPageCopy = {
  title: "Un refugio con historia en el corazón de Sofía",
  intro:
    "Ubicado en una casa urbana de 1923 en la calle Slavyanska 23, The Friendly Bear es el lugar ideal para cenar, comer buena comida búlgara y relajarse. Disfruta de nuestro jardín, carnes cocinadas lentamente, opciones vegetarianas y el ambiente acogedor de nuestras salas.",
  vegetarian:
    "No todo es carne. Tenemos una variada selección de ensaladas frescas y platos vegetarianos calientes claramente indicados en nuestra carta.",
  service:
    "Queremos que te sientas como en casa. Nuestro equipo habla inglés con fluidez y nuestro menú digital está disponible en inglés para tu comodidad.",
  lateDinnerNote:
    "Abierto hasta las 23:00. Perfecto para una cena tranquila después de pasear por el centro de Sofía, con comida auténtica, carnes cocinadas lentamente, ensaladas frescas y opciones vegetarianas.",
  cards: [
    {
      label: "Ubicación",
      title: "Pleno Centro",
      text:
        "Nos encontramos a unos pasos del Teatro Nacional. Es el lugar perfecto para cenar después de caminar por el centro de la ciudad."
    },
    {
      label: "Vegetariano",
      title: "Opciones Vegetarianas",
      text:
        "No todo es carne. Tenemos una variada selección de ensaladas frescas y platos vegetarianos calientes claramente indicados en nuestra carta."
    },
    {
      label: "Idioma",
      title: "Hablamos Inglés",
      text:
        "Queremos que te sientas como en casa. Nuestro equipo habla inglés con fluidez y nuestro menú digital está disponible en inglés para tu comodidad."
    }
  ]
} as const;

const greekPageCopy = {
  title: "Μια ζεστή γωνιά με ιστορία στην καρδιά της Σόφιας",
  intro:
    "Κρυμμένο πίσω από το ξενοδοχείο Radisson στο κέντρο της Σόφιας (Slavyanska 23), το The Friendly Bear στεγάζεται σε μια παραδοσιακή οικία του 1923. Απολαύστε τον κήπο μας, ζεστές εσωτερικές αίθουσες, αυθεντικό φαγητό και πιάτα αργού μαγειρέματος.",
  vegetarian:
    "Διαθέτουμε μεγάλη ποικιλία από φρέσκες σαλάτες και ζεστά χορτοφαγικά πιάτα, όλα ξεκάθαρα σημειωμένα στο μενού μας.",
  service:
    "Θέλουμε να νιώθετε άνετα. Το προσωπικό μας μιλάει άπταιστα αγγλικά και το ψηφιακό μας μενού είναι διαθέσιμο στα αγγλικά για τη διευκόλυνσή σας.",
  welcomeNote:
    "Σας περιμένουμε με ζεστή φιλοξενία, κρυφό κήπο και φαγητό στο κέντρο της Σόφιας.",
  cards: [
    {
      label: "Τοποθεσία",
      title: "Κεντρικό Σημείο",
      text:
        "Θα μας βρείτε λίγα βήματα από το Εθνικό Θέατρο. Η ιδανική στάση για φαγητό κατά τη διάρκεια της περιήγησής σας στην πόλη."
    },
    {
      label: "Χορτοφάγοι",
      title: "Χορτοφαγικές Επιλογές",
      text:
        "Διαθέτουμε μεγάλη ποικιλία από φρέσκες σαλάτες και ζεστά χορτοφαγικά πιάτα, όλα ξεκάθαρα σημειωμένα στο μενού μας."
    },
    {
      label: "Εξυπηρέτηση",
      title: "Μιλάμε Αγγλικά",
      text:
        "Θέλουμε να νιώθετε άνετα. Το προσωπικό μας μιλάει άπταιστα αγγλικά και το ψηφιακό μας μενού είναι διαθέσιμο στα αγγλικά για τη διευκόλυνσή σας."
    }
  ]
} as const;

function getLocalizedMarketPageCopy(marketLocale: TouristMarketLocale) {
  if (marketLocale === "it") {
    return {
      ...italianPageCopy,
      primaryCtaLabel: "Vedi il Menu (English)",
      callLabel: "Chiama per Prenotare"
    };
  }

  if (marketLocale === "es") {
    return {
      ...spanishPageCopy,
      primaryCtaLabel: "Ver el Menú (English)",
      callLabel: "Llamar para Reservar"
    };
  }

  if (marketLocale === "el") {
    return {
      ...greekPageCopy,
      primaryCtaLabel: "Δείτε το Μενού (English)",
      callLabel: "Κλήση για Κράτηση"
    };
  }

  return null;
}

function createVenueImages(_marketLocale: TouristMarketLocale, venueCopy: TouristMarketPageCopy["venue"]) {
  const gardenImages = getGardenGalleryImages("en");
  const interiorImages = getInteriorGalleryImages("en");
  const foodImages = getFoodGalleryImages("en");

  const maxLength = Math.max(gardenImages.length, interiorImages.length, foodImages.length);
  const images = [];
  const label = `${venueCopy.gardenLabel} + ${venueCopy.interiorLabel}`;

  for (let index = 0; index < maxLength; index += 1) {
    const gardenImage = gardenImages[index];
    const interiorImage = interiorImages[index];
    const foodImage = foodImages[index];

    if (gardenImage) {
      images.push({
        ...gardenImage,
        alt: venueCopy.gardenAlt,
        label
      });
    }

    if (interiorImage) {
      images.push({
        ...interiorImage,
        alt: venueCopy.interiorAlt,
        label
      });
    }

    if (foodImage) {
      images.push({
        ...foodImage,
        label
      });
    }
  }

  return images;
}

function buildMarketActions(
  marketLocale: TouristMarketLocale,
  audience: TouristAudience,
  phoneHref: string | null,
  bookingHref: string | null | undefined,
  reservationsEnabled: boolean,
  mapUrl: string
) {
  const config = getTouristMarketConfig(marketLocale);
  const actions: MarketAction[] = [];

  if (phoneHref) {
    actions.push({ href: phoneHref, label: config.nav.phone, kind: "phone" });
  }

  if (bookingHref) {
    actions.push({
      href: bookingHref,
      label: config.nav.reservations,
      kind: "external_booking",
      external: true
    });
  }

  actions.push({
    href: mapUrl,
    label: config.nav.directions,
    kind: "directions",
    external: true
  });

  actions.push({
    href: "/en/menu",
    label: config.nav.menu,
    kind: "menu"
  });

  actions.push({
    href: reservationsEnabled ? "/en/reservations" : "/en/contact",
    label: reservationsEnabled ? config.nav.reservations : config.nav.contact,
    kind: reservationsEnabled ? "reservations" : "contact"
  });

  actions.push({
    href: `/en/tourists/${audience}`,
    label: "English guide",
    kind: "language"
  });

  return actions;
}

export async function TouristMarketPage({ marketLocale }: TouristMarketPageProps) {
  const config = getTouristMarketConfig(marketLocale);
  const localizedCopy = touristMarketPageCopy[marketLocale];
  const venueCopy = localizedCopy.venue;
  const [businessProfile, toggles, touristPage] = await Promise.all([
    getBusinessProfileData(),
    getModuleTogglesData(),
    getTouristMarketPageData(marketLocale)
  ]);

  if (!touristPage) {
    return null;
  }

  const renderedTouristPage = {
    ...touristPage,
    title: localizedCopy.title,
    intro: localizedCopy.intro,
    vegetarianMessage: localizedCopy.vegetarian,
    serviceMessage: localizedCopy.service,
    primaryCtaLabel: localizedCopy.primaryCtaLabel,
    primaryCtaUrl: "/en/menu"
  };
  const phoneHref = getPhoneHref(businessProfile);

  const marketActions = filterActionsByModuleToggles(
    buildMarketActions(
      marketLocale,
      config.audience,
      phoneHref,
      getExternalBookingHref(businessProfile),
      toggles.reservationsEnabled,
      businessProfile.mapUrl
    ),
    toggles
  );

  const heroActions: MarketAction[] = [
    {
      href: "/en/menu",
      label: localizedCopy.primaryCtaLabel,
      kind: "menu"
    },
    ...(phoneHref
      ? [
          {
            href: phoneHref,
            label: localizedCopy.callLabel,
            kind: "phone" as const
          }
        ]
      : [])
  ];

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">{config.ui.pageLabel}</p>
        <h1>{renderedTouristPage.title}</h1>
        <p className="page-lead">{renderedTouristPage.intro}</p>
        <p className="tourist-brand-motto">{touristBrandMotto}</p>

        <div className="page-tags" aria-label={config.ui.highlights}>
          <span>{businessProfile.address.en}</span>
          <span>{businessProfile.area.en}</span>
          <span>{config.ui.vegetarian}</span>
          <span>{config.ui.service}</span>
        </div>

        <div className="actions">
          {heroActions.map((action) => (
            <ActionLink
              key={`${action.kind}-${action.href}`}
              href={action.href}
              label={action.label}
              external={Boolean(action.external)}
              tracking={buildActionTracking({
                kind: action.kind,
                locale: marketLocale,
                location: `${marketLocale}_market_hero`,
                label: action.label,
                target: action.href,
                external: Boolean(action.external)
              })}
            />
          ))}
        </div>
      </section>

      <VenueSnapshotSection
        locale={marketLocale}
        eyebrow={venueCopy.eyebrow}
        title={venueCopy.title}
        intro={venueCopy.intro}
        images={createVenueImages(marketLocale, venueCopy)}
        maxImagesBeforeCta={6}
      />

      <section
        className="page-grid page-grid-three"
        data-track-section={`${marketLocale}_market_positioning`}
        data-track-section-label={config.ui.whyThisWorks}
      >
        {localizedCopy.cards.map((card) => (
          <article key={card.title} className="page-card">
            <p className="page-card-label">{card.label}</p>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </article>
        ))}
      </section>

      <section
        className="page-grid page-grid-two"
        data-track-section={`${marketLocale}_market_signature_dishes`}
        data-track-section-label={localizedCopy.signature.title}
      >
        <article className="page-card">
          <p className="page-card-label">{localizedCopy.signature.label}</p>
          <h2>{localizedCopy.signature.title}</h2>
          <ul className="page-list">
            {localizedCopy.signature.dishes.map((dish) => (
              <li key={dish}>{dish}</li>
            ))}
          </ul>
        </article>

        <article className="page-card">
          <p className="page-card-label">{localizedCopy.atmosphere.label}</p>
          <h2>{localizedCopy.atmosphere.title}</h2>
          <p>{localizedCopy.atmosphere.text}</p>
        </article>
      </section>

      {localizedCopy.specialNote ? (
        <aside
          className="page-card tourist-late-dinner-note"
          aria-label={localizedCopy.specialNote.ariaLabel}
          data-track-section={`${marketLocale}_market_note`}
          data-track-section-label={localizedCopy.specialNote.label}
        >
          <p className="page-card-label">{localizedCopy.specialNote.label}</p>
          <p>{localizedCopy.specialNote.text}</p>
        </aside>
      ) : null}

      <nav className="mobile-quickbar" aria-label={config.ui.quickActions}>
        {marketActions.map((action) => (
          <ActionLink
            key={`${action.kind}-${action.href}`}
            href={action.href}
            label={action.label}
            className="mobile-quickbar-link"
            external={Boolean(action.external)}
            tracking={buildActionTracking({
              kind: action.kind,
              locale: marketLocale,
              location: `${marketLocale}_market_quickbar`,
              label: action.label,
              target: action.href,
              external: Boolean(action.external)
            })}
          />
        ))}
      </nav>
    </main>
  );
}
