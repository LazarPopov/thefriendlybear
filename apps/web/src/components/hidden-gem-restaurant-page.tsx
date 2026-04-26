import { ActionLink } from "@/components/action-link";
import { VenueSnapshotSection } from "@/components/venue-snapshot-section";
import {
  getBusinessProfileData,
  getEnPrimaryActions,
  getPhoneHref
} from "@/lib/business-profile-module";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import { touristBrandMotto } from "@/lib/tourist-market-copy";
import { buildActionTracking } from "@/lib/tracking";
import { foodGalleryImages, gardenGalleryImages, interiorGalleryImages } from "@/lib/venue-gallery-images";

const hiddenGemDishes = [
  "Veal tongue sandwich with caramelised onions",
  "Slow-roasted lamb with mushrooms",
  "Fish soup",
  "Baileys Crème Brûlée"
] as const;

const hiddenGemVenue = {
  eyebrow: "Hidden gem",
  title: "A 1923 house with a hidden courtyard and retro rooms",
  intro:
    "The slightly underground room, soft carpet on the wall and calm courtyard make the restaurant feel tucked away even though it sits in Sofia Center.",
  gardenLabel: "Courtyard",
  interiorLabel: "Retro interior"
} as const;

function buildHiddenGemImages() {
  const maxLength = Math.max(gardenGalleryImages.length, interiorGalleryImages.length, foodGalleryImages.length);
  const images = [];
  const label = "Courtyard + interior + food";

  for (let index = 0; index < maxLength; index += 1) {
    const gardenImage = gardenGalleryImages[index];
    const interiorImage = interiorGalleryImages[index];
    const foodImage = foodGalleryImages[index];

    if (gardenImage) {
      images.push({
        ...gardenImage,
        alt: "Hidden courtyard at The Friendly Bear Sofia",
        label
      });
    }

    if (interiorImage) {
      images.push({
        ...interiorImage,
        alt: "Slightly underground retro interior at The Friendly Bear Sofia",
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

export async function HiddenGemRestaurantPage() {
  const [businessProfile, toggles] = await Promise.all([
    getBusinessProfileData(),
    getModuleTogglesData()
  ]);
  const phoneHref = getPhoneHref(businessProfile);
  const primaryActions = filterActionsByModuleToggles(getEnPrimaryActions(businessProfile), toggles);
  const heroActions = [
    {
      href: "/en/menu",
      label: "See the Menu",
      kind: "menu" as const,
      external: false
    },
    ...(phoneHref
      ? [
          {
            href: phoneHref,
            label: "Call to Reserve",
            kind: "phone" as const,
            external: false
          }
        ]
      : []),
    {
      href: businessProfile.mapUrl,
      label: "Directions",
      kind: "directions" as const,
      external: true
    }
  ];

  return (
    <main className="page-shell">
      <section
        className="page-hero"
        data-track-section="hidden_gem_hero"
        data-track-section-label="Hidden gem restaurant Sofia"
      >
        <p className="eyebrow">Hidden gem restaurant Sofia</p>
        <h1>Sofia's best kept secret for authentic food and character</h1>
        <p className="page-lead">
          The Friendly Bear is a unique restaurant in central Sofia set inside a 1923 house, with a slightly
          underground retro interior, a soft carpet on the wall, a hidden courtyard and food that feels local rather
          than staged.
        </p>
        <p className="tourist-brand-motto">{touristBrandMotto}</p>

        <div className="page-tags" aria-label="Hidden gem restaurant highlights">
          <span>{businessProfile.address.en}</span>
          <span>1923 historic house</span>
          <span>Hidden courtyard</span>
          <span>Retro interior</span>
        </div>

        <div className="actions">
          {heroActions.map((action) => (
            <ActionLink
              key={`${action.kind}-${action.href}`}
              href={action.href}
              label={action.label}
              external={action.external}
              tracking={buildActionTracking({
                kind: action.kind,
                locale: "en",
                location: "hidden_gem_hero",
                label: action.label,
                target: action.href,
                external: action.external
              })}
            />
          ))}
        </div>
      </section>

      <VenueSnapshotSection
        locale="en"
        eyebrow={hiddenGemVenue.eyebrow}
        title={hiddenGemVenue.title}
        intro={hiddenGemVenue.intro}
        images={buildHiddenGemImages()}
        maxImagesBeforeCta={6}
      />

      <section
        className="page-grid page-grid-three"
        data-track-section="hidden_gem_positioning"
        data-track-section-label="Sofia's best kept secret"
      >
        <article className="page-card">
          <p className="page-card-label">Quirky atmosphere</p>
          <h2>Slightly underground and retro</h2>
          <p>
            The interior feels like a local discovery: warm wood, vintage detail and the memorable soft carpet on the
            wall.
          </p>
        </article>

        <article className="page-card">
          <p className="page-card-label">Historic address</p>
          <h2>A 1923 house in Sofia Center</h2>
          <p>
            The building gives the visit a real sense of place, while the location stays easy to reach from the
            National Theatre area.
          </p>
        </article>

        <article className="page-card">
          <p className="page-card-label">Off the obvious path</p>
          <h2>Central, but tucked away</h2>
          <p>
            The courtyard and lower-level rooms create the hidden-gem feeling travellers search for without leaving the
            centre.
          </p>
        </article>
      </section>

      <section
        className="page-grid page-grid-two"
        data-track-section="hidden_gem_signature_dishes"
        data-track-section-label="Best authentic food Sofia"
      >
        <article className="page-card">
          <p className="page-card-label">Culinary adventure</p>
          <h2>Signature dishes to remember</h2>
          <ul className="page-list">
            {hiddenGemDishes.map((dish) => (
              <li key={dish}>{dish}</li>
            ))}
          </ul>
        </article>

        <article className="page-card">
          <p className="page-card-label">Search intent</p>
          <h2>Unique, authentic and relaxed</h2>
          <p>
            A strong fit for visitors searching for unique restaurants in Sofia, hidden gem restaurants in Sofia, or
            the best authentic food in Sofia after a day of exploring.
          </p>
        </article>
      </section>

      <nav className="mobile-quickbar" aria-label="Quick actions">
        {primaryActions.map((action) => (
          <ActionLink
            key={action.href}
            href={action.href}
            label={action.label}
            className="mobile-quickbar-link"
            external={Boolean(action.external)}
            tracking={buildActionTracking({
              kind: action.kind,
              locale: "en",
              location: "mobile_quickbar",
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
