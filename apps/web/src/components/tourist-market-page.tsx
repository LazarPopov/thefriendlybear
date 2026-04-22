import { ActionLink } from "@/components/action-link";
import { VenueSnapshotSection } from "@/components/venue-snapshot-section";
import {
  getBusinessProfileData,
  getExternalBookingHref,
  getPhoneHref
} from "@/lib/business-profile-module";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import {
  getTouristActionKind,
  type TouristAudience
} from "@/lib/tourist-landing-page-module";
import { buildActionTracking, type BusinessActionKind } from "@/lib/tracking";
import {
  getTouristMarketConfig,
  getTouristMarketPageData,
  type TouristMarketLocale
} from "@/lib/tourist-market";
import { gardenGalleryImages, interiorGalleryImages } from "@/lib/venue-gallery-images";

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
    title: "Giardino segreto e calore da baita urbana",
    intro:
      "Una piccola galleria per sentire il luogo prima di arrivare: luci in giardino, dettagli in legno e il calore degli interni.",
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
    "Nascosto dietro l'hotel InterContinental (ex Radisson) nel cuore di Sofia, The Friendly Bear e una baita urbana del 1923 restaurata a mano. Un rifugio perfetto per chi cerca cibo autentico, birra artigianale e calore umano.",
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
    "Ubicado en una cabaña urbana de 1923 en la calle Slavyanska 23, The Friendly Bear es el lugar ideal para cenar, comer buena comida búlgara y relajarse. Disfruta de nuestro jardín secreto o de la calidez de nuestra chimenea mientras pruebas lo mejor de la cocina local.",
  vegetarian:
    "No todo es carne. Tenemos una variada selección de ensaladas frescas y platos vegetarianos calientes claramente indicados en nuestra carta.",
  service:
    "Queremos que te sientas como en casa. Nuestro equipo habla inglés con fluidez y nuestro menú digital está disponible en inglés para tu comodidad.",
  lateDinnerNote:
    "Abierto hasta las 23:00. Perfecto para una cena tranquila después de pasear por el centro de Sofía, con comida auténtica si buscas algo barato frente a muchas trampas turísticas del centro.",
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
    "Κρυμμένο πίσω από το ξενοδοχείο InterContinental στο κέντρο της Σόφιας (Slavyanska 23), το The Friendly Bear στεγάζεται σε μια παραδοσιακή οικία από το 1923. Απολαύστε τον κρυφό μας κήπο ή τη ζεστασιά του τζακιού μας με αυθεντικό φαγητό και εξαιρετικές μπύρες.",
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

function createVenueImages(marketLocale: TouristMarketLocale, venueCopy: (typeof venueMomentsCopy)[TouristMarketLocale]) {
  const useSingleCarousel = marketLocale === "it" || marketLocale === "es" || marketLocale === "el";

  if (!useSingleCarousel) {
    return [
      ...gardenGalleryImages.map((image) => ({
        ...image,
        label: venueCopy.gardenLabel
      })),
      ...interiorGalleryImages.map((image) => ({
        ...image,
        label: venueCopy.interiorLabel
      }))
    ];
  }

  const maxLength = Math.max(gardenGalleryImages.length, interiorGalleryImages.length);
  const images = [];

  for (let index = 0; index < maxLength; index += 1) {
    const gardenImage = gardenGalleryImages[index];
    const interiorImage = interiorGalleryImages[index];

    if (gardenImage) {
      images.push({
        ...gardenImage,
        alt:
          marketLocale === "es"
            ? "Jardín tranquilo del restaurante The Friendly Bear en Sofía"
            : marketLocale === "el"
              ? "Ο πανέμορφος κήπος του εστιατορίου The Friendly Bear στη Σόφια"
              : "Giardino segreto del ristorante The Friendly Bear a Sofia",
        label: venueCopy.gardenLabel
      });
    }

    if (interiorImage) {
      images.push({
        ...interiorImage,
        alt:
          marketLocale === "es"
            ? "Interior acogedor del restaurante The Friendly Bear en Sofía"
            : marketLocale === "el"
              ? "Το ζεστό εσωτερικό του εστιατορίου The Friendly Bear στη Σόφια"
              : "Interno accogliente del ristorante The Friendly Bear a Sofia",
        label: venueCopy.interiorLabel
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
    label: "🇬🇧 English",
    kind: "contact"
  });

  return actions;
}

export async function TouristMarketPage({ marketLocale }: TouristMarketPageProps) {
  const config = getTouristMarketConfig(marketLocale);
  const venueCopy = venueMomentsCopy[marketLocale];
  const isSpanish = marketLocale === "es";
  const isGreek = marketLocale === "el";
  const localizedCopy = getLocalizedMarketPageCopy(marketLocale);
  const [businessProfile, toggles, touristPage] = await Promise.all([
    getBusinessProfileData(),
    getModuleTogglesData(),
    getTouristMarketPageData(marketLocale)
  ]);

  if (!touristPage) {
    return null;
  }

  const renderedTouristPage = localizedCopy
    ? {
        ...touristPage,
        title: localizedCopy.title,
        intro: localizedCopy.intro,
        vegetarianMessage: localizedCopy.vegetarian,
        serviceMessage: localizedCopy.service,
        primaryCtaLabel: localizedCopy.primaryCtaLabel,
        primaryCtaUrl: "/en/menu"
      }
    : touristPage;
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

  const primaryCtaExternal = /^https?:\/\//.test(renderedTouristPage.primaryCtaUrl);
  const heroActions: MarketAction[] = localizedCopy
    ? [
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
      ]
    : [
        {
          href: renderedTouristPage.primaryCtaUrl,
          label: renderedTouristPage.primaryCtaLabel,
          kind: getTouristActionKind(renderedTouristPage.primaryCtaUrl, primaryCtaExternal),
          external: primaryCtaExternal
        },
        toggles.reservationsEnabled
          ? {
              href: "/en/reservations",
              label: config.nav.reservations,
              kind: "reservations"
            }
          : {
              href: "/en/contact",
              label: config.nav.contact,
              kind: "contact"
            },
        {
          href: businessProfile.mapUrl,
          label: config.nav.directions,
          kind: "directions",
          external: true
        }
      ];

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">{config.ui.pageLabel}</p>
        <h1>{renderedTouristPage.title}</h1>
        <p className="page-lead">{renderedTouristPage.intro}</p>

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
                locale: "en",
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
      />

      <section className="page-grid page-grid-three">
        {localizedCopy
          ? localizedCopy.cards.map((card) => (
              <article key={card.title} className="page-card">
                <p className="page-card-label">{card.label}</p>
                <h2>{card.title}</h2>
                <p>{card.text}</p>
              </article>
            ))
          : (
              <>
                <article className="page-card">
                  <p className="page-card-label">{config.ui.highlights}</p>
                  <p>{renderedTouristPage.intro}</p>
                </article>

                <article className="page-card">
                  <p className="page-card-label">{config.ui.vegetarian}</p>
                  <p>{renderedTouristPage.vegetarianMessage}</p>
                </article>

                <article className="page-card">
                  <p className="page-card-label">{config.ui.service}</p>
                  <p>{renderedTouristPage.serviceMessage}</p>
                </article>
              </>
            )}
      </section>

      {isSpanish ? (
        <aside className="page-card tourist-late-dinner-note" aria-label="Abierto hasta las 23:00">
          <p className="page-card-label">Cena tarde</p>
          <p>{spanishPageCopy.lateDinnerNote}</p>
        </aside>
      ) : null}

      {isGreek ? (
        <aside className="page-card tourist-late-dinner-note" aria-label="Σας περιμένουμε">
          <p className="page-card-label">Φιλοξενία</p>
          <p>{greekPageCopy.welcomeNote}</p>
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
              locale: "en",
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
