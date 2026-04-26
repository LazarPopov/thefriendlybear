import { ActionLink } from "@/components/action-link";
import { getBusinessProfileData, getEnPrimaryActions } from "@/lib/business-profile-module";
import { springMenuContent } from "@/lib/spring-menu-content";
import { buildActionTracking } from "@/lib/tracking";

const aboutHighlights = [
  {
    title: "A Slavyanska 23 story",
    text: "The 1923 house keeps a piece of old Sofia alive while welcoming guests with a garden, warm dining rooms, and the comfort of a forest lodge."
  },
  {
    title: "Seasonal menu",
    text: "Expect slow-roasted specialties, fresh salads, vegetarian choices, and clear prices for a relaxed dinner."
  },
  {
    title: "Cozy and approachable",
    text: "The tone is designed to feel warm, easy to navigate, and friendly for both local visitors and international guests."
  }
] as const;

const storyPoints = [
  "The garden is calm and easy for long warm-weather evenings.",
  "The heated enclosed part of the garden is a comfortable winter option for smokers.",
  "The team can help with dish recommendations, directions, and reservations."
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
        <h1>Urban Comfort in a 100-Year-Old House on Slavyanska 23</h1>
        <p className="page-lead">
          Saved from demolition and restored by hand, our 1923 home is a project created with love and attention to
          detail. The Friendly Bear is where old Sofia history meets the comfort of a forest lodge.
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
          <p className="page-card-label">Why guests return</p>
          <h2>A hidden garden and the comfort of a forest lodge</h2>
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
            Find us in central Sofia, close to the Radisson hotel and the National Theatre. We are part of the city
            rhythm, but tucked away enough for you to feel calm as soon as you step into our den.
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
          const meta = [item.serving, item.priceEuro, item.priceBgn].filter(Boolean).join(" / ");

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
