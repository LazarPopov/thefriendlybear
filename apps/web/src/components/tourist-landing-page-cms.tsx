import { ActionLink } from "@/components/action-link";
import { TouristReviewSnippets } from "@/components/tourist-review-snippets";
import { VenueSnapshotSection } from "@/components/venue-snapshot-section";
import {
  getBgPrimaryActions,
  getBusinessProfileData,
  getEnPrimaryActions
} from "@/lib/business-profile-module";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import { getTouristReviewSnippetsData } from "@/lib/review-snippets";
import type { SiteLocale } from "@/lib/site";
import {
  getTouristActionKind,
  getTouristAudienceLabel,
  getTouristLandingPageData,
  type FrontendTouristLandingPage,
  type TouristAudience
} from "@/lib/tourist-landing-page-module";
import { buildActionTracking, type BusinessActionKind } from "@/lib/tracking";
import {
  getFoodGalleryImages,
  getGardenGalleryImages,
  getInteriorGalleryImages
} from "@/lib/venue-gallery-images";

type TouristLandingPageCmsProps = {
  locale: SiteLocale;
  audience: TouristAudience;
  touristPage?: FrontendTouristLandingPage;
};

type HeroAction = {
  href: string;
  label: string;
  kind: BusinessActionKind;
  external?: boolean;
};

function buildCombinedTouristGalleryImages(label: string, locale: SiteLocale) {
  const gardenImages = getGardenGalleryImages(locale);
  const interiorImages = getInteriorGalleryImages(locale);
  const foodImages = getFoodGalleryImages(locale);

  const maxLength = Math.max(gardenImages.length, interiorImages.length, foodImages.length);
  const images = [];

  for (let index = 0; index < maxLength; index += 1) {
    const gardenImage = gardenImages[index];
    const interiorImage = interiorImages[index];
    const foodImage = foodImages[index];

    if (gardenImage) {
      images.push({
        ...gardenImage,
        label
      });
    }

    if (interiorImage) {
      images.push({
        ...interiorImage,
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

export async function TouristLandingPageCms({
  locale,
  audience,
  touristPage: initialTouristPage
}: TouristLandingPageCmsProps) {
  const [businessProfile, toggles, touristPage, audienceReviews] = await Promise.all([
    getBusinessProfileData(),
    getModuleTogglesData(),
    initialTouristPage ? Promise.resolve(initialTouristPage) : getTouristLandingPageData(audience, locale),
    getTouristReviewSnippetsData(locale, audience)
  ]);

  if (!touristPage) {
    return null;
  }

  // Ensure we use a supported site locale for images
  const imageLocale: SiteLocale = locale === "bg" ? "bg" : "en";

  const isBg = locale === "bg";
  const primaryActions = filterActionsByModuleToggles(
    isBg ? getBgPrimaryActions(businessProfile) : getEnPrimaryActions(businessProfile),
    toggles
  );

  const primaryCtaExternal = /^https?:\/\//.test(touristPage.primaryCtaUrl);
  const heroActions: HeroAction[] = [
    {
      href: touristPage.primaryCtaUrl,
      label: touristPage.primaryCtaLabel,
      kind: getTouristActionKind(touristPage.primaryCtaUrl, primaryCtaExternal),
      external: primaryCtaExternal
    },
    toggles.reservationsEnabled
      ? {
          href: isBg ? "/bg/reservations" : "/en/reservations",
          label: isBg ? "Резервации" : "Reservations",
          kind: "reservations" as const
        }
      : {
          href: isBg ? "/bg/contact" : "/en/contact",
          label: isBg ? "Контакти" : "Contact",
          kind: "contact" as const
        },
    {
      href: businessProfile.mapUrl,
      label: isBg ? "Как да стигнете" : "Directions",
      kind: "directions" as const,
      external: true
    }
  ];

  const nextSteps = isBg
    ? [
        `${touristPage.primaryCtaLabel}, ако искате най-бързия достъп до основното действие.`,
        toggles.reservationsEnabled
          ? "Отворете резервациите, ако искате да видите текущия booking път."
          : "Използвайте контактната страница, ако искате обща информация преди посещение.",
        "Пуснете упътванията до Славянска 23, когато сте готови да тръгнете."
      ]
    : [
        `${touristPage.primaryCtaLabel} if you want the fastest route to the main visitor action.`,
        toggles.reservationsEnabled
          ? "Open reservations if you want to see the current booking path."
          : "Use the contact page if you want general information before visiting.",
        "Open directions to Slavyanska 23 when you are ready to head over."
      ];

  const localSignals = isBg
    ? [
        `Локация: ${businessProfile.address.bg}`,
        "Центърът на София остава ясно видим в страницата.",
        touristPage.vegetarianMessage,
        touristPage.serviceMessage
      ]
    : [
        `Location: ${businessProfile.address.en}`,
        "Central Sofia stays clearly visible across the page.",
        touristPage.vegetarianMessage,
        touristPage.serviceMessage
      ];

  const venueSection = isBg
    ? {
        eyebrow: "Атмосфера",
        title: "Градина, уютен интериор и кухня в една галерия",
        intro:
          "Една обща визуална секция показва градината, ретро интериора и част от храната, за да няма повече от една галерия на страницата.",
        galleryLabel: "Място и кухня"
      }
    : {
        eyebrow: "Atmosphere",
        title: "Garden, warm interior and food in one gallery",
        intro:
          "One combined visual section shows the garden, retro rooms and food highlights, keeping the page to a single gallery.",
        galleryLabel: "Venue and food"
      };

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">{getTouristAudienceLabel(locale, audience)}</p>
        <h1>{touristPage.title}</h1>
        <p className="page-lead">{touristPage.intro}</p>

        <div className="page-tags" aria-label={isBg ? "Основни сигнали" : "Visitor page highlights"}>
          <span>{isBg ? businessProfile.address.bg : businessProfile.address.en}</span>
          <span>{isBg ? businessProfile.area.bg : businessProfile.area.en}</span>
          <span>{isBg ? "Вегетариански опции" : "Vegetarian options"}</span>
          <span>{isBg ? "Любезно обслужване" : "Friendly service"}</span>
        </div>

        <div className="actions">
          {heroActions.map((action) => (
            <ActionLink
              key={action.href}
              href={action.href}
              label={action.label}
              external={Boolean(action.external)}
              tracking={buildActionTracking({
                kind: action.kind,
                locale,
                location: "tourist_page_hero",
                label: action.label,
                target: action.href,
                external: Boolean(action.external)
              })}
            />
          ))}
        </div>
      </section>

      <VenueSnapshotSection
        locale={locale}
        eyebrow={venueSection.eyebrow}
        title={venueSection.title}
        intro={venueSection.intro}
        images={buildCombinedTouristGalleryImages(venueSection.galleryLabel, imageLocale)}
        maxImagesBeforeCta={6}
      />

      <section className="page-grid page-grid-three">
        <article className="page-card">
          <p className="page-card-label">{isBg ? "Намерения за откриване" : "Discovery intent"}</p>
          <p>{touristPage.intro}</p>
        </article>

        <article className="page-card">
          <p className="page-card-label">{isBg ? "Вегетарианско уверение" : "Vegetarian reassurance"}</p>
          <p>{touristPage.vegetarianMessage}</p>
        </article>

        <article className="page-card">
          <p className="page-card-label">{isBg ? "Обслужване и tone" : "Service and tone"}</p>
          <p>{touristPage.serviceMessage}</p>
        </article>
      </section>

      <TouristReviewSnippets
        eyebrow={isBg ? "Отзиви от близък тип посетители" : "Relevant visitor reviews"}
        title={
          isBg
            ? "Когато има подходящи откъси, ги показваме директно на страницата"
            : "When relevant snippets exist, we surface them directly on the page"
        }
        intro={
          isBg
            ? "Този блок се показва само когато имаме реален откъс, който можем честно да свържем с този visitor audience."
            : "This block appears only when there is a real snippet we can honestly associate with this visitor audience."
        }
        tagsLabel={isBg ? "Ключови теми" : "Key themes"}
        reviews={audienceReviews}
      />

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">{isBg ? "Полезни първи стъпки" : "Useful first steps"}</p>
          <h2>{isBg ? "Какво може да направи посетителят веднага" : "What the visitor can do next"}</h2>
          <ol className="page-list page-list-numbered">
            {nextSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>

        <article className="page-card">
          <p className="page-card-label">{isBg ? "Local signals" : "Local signals"}</p>
          <h2>{isBg ? "Защо страницата е подредена така" : "Why the page is built this way"}</h2>
          <ul className="page-list">
            {localSignals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <nav className="mobile-quickbar" aria-label={isBg ? "Бързи действия" : "Quick actions"}>
        {primaryActions.map((action) => (
          <ActionLink
            key={action.href}
            href={action.href}
            label={action.label}
            className="mobile-quickbar-link"
            external={Boolean(action.external)}
            tracking={buildActionTracking({
              kind: action.kind,
              locale,
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
