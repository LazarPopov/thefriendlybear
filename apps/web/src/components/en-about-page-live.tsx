import { ActionLink } from "@/components/action-link";
import { getBusinessProfileData, getEnPrimaryActions } from "@/lib/business-profile-module";
import { springMenuContent } from "@/lib/spring-menu-content";
import { buildActionTracking } from "@/lib/tracking";

const aboutHighlights = [
  {
    title: "Local identity",
    text: "The brand should stay clearly anchored to Slavyanska 23 and central Sofia across content, metadata, schema, and action flows."
  },
  {
    title: "Seasonal menu first",
    text: "The site puts HTML menu content in front of the visitor so dishes, allergens, and pricing are readable by both people and machines."
  },
  {
    title: "Cozy and approachable",
    text: "The tone is designed to feel warm, easy to navigate, and friendly for both local visitors and international guests."
  }
] as const;

const storyPoints = [
  "The homepage and menu are built around restaurant discovery intent, not just brochure text.",
  "Visitors can move quickly from brand discovery to menu, directions, and reservations on mobile.",
  "The structure supports future reviews, social proof, and booking integrations without rebuilding the content model."
] as const;

export async function EnglishAboutPageLive() {
  const businessProfile = await getBusinessProfileData();
  const primaryActions = getEnPrimaryActions(businessProfile);
  const menu = springMenuContent.en;
  const featuredItems = [
    { section: menu.sections[2].title, item: menu.sections[2].items[0] },
    { section: menu.sections[1].title, item: menu.sections[1].items[0] },
    { section: menu.sections[2].title, item: menu.sections[2].items[2] }
  ];

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">About</p>
        <h1>About The Friendly Bear Sofia</h1>
        <p className="page-lead">
          This page explains the restaurant through the signals visitors actually use to decide: central Sofia
          location, seasonal dishes, mobile-friendly menu access, and a clear path to visit or reserve.
        </p>

        <div className="page-tags" aria-label="About highlights">
          <span>{businessProfile.address.en}</span>
          <span>{businessProfile.area.en}</span>
          <span>Seasonal menu</span>
          <span>Cozy atmosphere</span>
        </div>

        <div className="actions">
          {primaryActions.slice(0, 4).map((action) => (
            <ActionLink
              key={action.href}
              href={action.href}
              label={action.label}
              external={Boolean(action.external)}
              tracking={buildActionTracking({
                kind: action.kind,
                locale: "en",
                location: "about_hero",
                label: action.label,
                target: action.href,
                external: Boolean(action.external)
              })}
            />
          ))}
        </div>
      </section>

      <section className="page-grid page-grid-three">
        {aboutHighlights.map((item) => (
          <article key={item.title} className="page-card">
            <p className="page-card-label">{item.title}</p>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">What the brand stands on</p>
          <h2>Clear restaurant signals instead of vague generic copy</h2>
          <ul className="page-list">
            {storyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>

        <article className="page-card">
          <p className="page-card-label">Location context</p>
          <h2>{businessProfile.address.en}</h2>
          <p>
            The Sofia location should stay visible everywhere because it helps both users and search systems connect
            the brand to the exact place where people want to eat.
          </p>
          <ActionLink
            href={businessProfile.mapUrl}
            label="Open directions"
            className="page-inline-link"
            external
            tracking={buildActionTracking({
              kind: "directions",
              locale: "en",
              location: "about_location_card",
              label: "Open directions",
              target: businessProfile.mapUrl,
              external: true
            })}
          />
        </article>
      </section>

      <section className="page-grid page-grid-three">
        {featuredItems.map(({ section, item }) => {
          const meta = [item.serving, item.calories, item.priceEuro, item.priceBgn].filter(Boolean).join(" / ");

          return (
            <article key={`${section}-${item.name}`} className="page-card">
              <p className="page-card-label">{section}</p>
              <h2>{item.name}</h2>
              {item.description?.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {item.allergens ? <p className="page-note">{item.allergens}</p> : null}
              {meta ? <p className="page-note">{meta}</p> : null}
            </article>
          );
        })}
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
