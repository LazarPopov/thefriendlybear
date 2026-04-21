import { ActionLink } from "@/components/action-link";
import { FoodShowcaseStrip } from "@/components/food-showcase-strip";
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
import { gardenGalleryImages, interiorGalleryImages } from "@/lib/venue-gallery-images";

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
        title: "Градина и уютен интериор без една огромна галерия",
        intro:
          "Визуалните сигнали за мястото са разпределени през сайта, така че туристическата страница да остане по-лека и по-фокусирана.",
        gardenLabel: "Градина",
        interiorLabel: "Интериор"
      }
    : {
        eyebrow: "Atmosphere",
        title: "Garden setting and warm interior without one oversized gallery",
        intro:
          "The venue photos are spread through the site so the tourist page stays lighter and more focused.",
        gardenLabel: "Garden",
        interiorLabel: "Interior"
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
        images={[
          ...gardenGalleryImages.map((image) => ({
            ...image,
            label: venueSection.gardenLabel
          })),
          ...interiorGalleryImages.map((image) => ({
            ...image,
            label: venueSection.interiorLabel
          }))
        ]}
      />

      <section className="page-grid page-grid-three">
        <article className="page-card">
          <p className="page-card-label">{isBg ? "Discovery intent" : "Discovery intent"}</p>
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

      <FoodShowcaseStrip locale={locale} />

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
