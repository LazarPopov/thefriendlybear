import { ActionLink } from "@/components/action-link";
import { FoodShowcaseStrip } from "@/components/food-showcase-strip";
import { TouristReviewSnippets } from "@/components/tourist-review-snippets";
import { VenueSnapshotSection } from "@/components/venue-snapshot-section";
import {
  getBusinessProfileData,
  getExternalBookingHref,
  getPhoneHref
} from "@/lib/business-profile-module";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import { getTouristReviewSnippetsData } from "@/lib/review-snippets";
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
    eyebrow: "El lugar",
    title: "Jardin reservado y salas acogedoras",
    intro:
      "En lugar de poner todas las fotos en un unico bloque, distribuimos las imagenes del espacio a lo largo de la pagina.",
    gardenLabel: "Jardin",
    interiorLabel: "Interior"
  },
  el: {
    eyebrow: "Ο χώρος",
    title: "Ήσυχος κήπος και ζεστό εσωτερικό",
    intro:
      "Αντί να συγκεντρώνουμε όλες τις φωτογραφίες σε ένα μόνο σημείο, απλώνουμε τα οπτικά στοιχεία του χώρου μέσα στη σελίδα.",
    gardenLabel: "Κήπος",
    interiorLabel: "Εσωτερικό"
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

function createVenueImages(marketLocale: TouristMarketLocale, venueCopy: (typeof venueMomentsCopy)[TouristMarketLocale]) {
  if (marketLocale !== "it") {
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
        alt: "Giardino segreto del ristorante The Friendly Bear a Sofia",
        label: venueCopy.gardenLabel
      });
    }

    if (interiorImage) {
      images.push({
        ...interiorImage,
        alt: "Interno accogliente del ristorante The Friendly Bear a Sofia",
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
  const isItalian = marketLocale === "it";
  const [businessProfile, toggles, touristPage, audienceReviews] = await Promise.all([
    getBusinessProfileData(),
    getModuleTogglesData(),
    getTouristMarketPageData(marketLocale),
    getTouristReviewSnippetsData("en", config.audience)
  ]);

  if (!touristPage) {
    return null;
  }

  const renderedTouristPage = isItalian
    ? {
        ...touristPage,
        title: italianPageCopy.title,
        intro: italianPageCopy.intro,
        vegetarianMessage: italianPageCopy.vegetarian,
        serviceMessage: italianPageCopy.service,
        primaryCtaLabel: "Vedi il Menu (English)",
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
  const heroActions: MarketAction[] = isItalian
    ? [
        {
          href: "/en/menu",
          label: "Vedi il Menu (English)",
          kind: "menu"
        },
        ...(phoneHref
          ? [
              {
                href: phoneHref,
                label: "Chiama per Prenotare",
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

  const nextSteps = [
    `${renderedTouristPage.primaryCtaLabel}.`,
    toggles.reservationsEnabled ? config.ui.openReservations : config.ui.openContact,
    config.ui.openDirections
  ];

  const localSignals = [
    businessProfile.address.en,
    config.ui.centralSignal,
    renderedTouristPage.vegetarianMessage,
    renderedTouristPage.serviceMessage
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
        {isItalian
          ? italianPageCopy.cards.map((card) => (
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

      {isItalian ? null : <FoodShowcaseStrip locale={marketLocale} />}

      {isItalian ? null : (
        <TouristReviewSnippets
          eyebrow={config.ui.highlights}
          title={
            marketLocale === "es"
              ? "Resenas relevantes, solo cuando existen de verdad"
              : "Σχετικές κριτικές, μόνο όταν υπάρχουν πραγματικά"
          }
          intro={
            marketLocale === "es"
              ? "Este bloque aparece solo si tenemos una resena real que podemos asociar honestamente con este publico."
              : "Αυτό το μπλοκ εμφανίζεται μόνο όταν έχουμε μια πραγματική κριτική που μπορούμε ειλικρινά να συνδέσουμε με αυτό το κοινό."
          }
          tagsLabel={config.ui.highlights}
          reviews={audienceReviews}
        />
      )}

      {isItalian ? null : <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">{config.ui.nextSteps}</p>
          <h2>{config.ui.nextSteps}</h2>
          <ol className="page-list page-list-numbered">
            {nextSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>

        <article className="page-card">
          <p className="page-card-label">{config.ui.whyThisWorks}</p>
          <h2>{config.ui.whyThisWorks}</h2>
          <ul className="page-list">
            {localSignals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>}

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
