import { ActionLink } from "@/components/action-link";
import { getEnPrimaryActions } from "@/lib/business-profile-live";
import { buildActionTracking } from "@/lib/tracking";

const decisionSignals = [
  {
    title: "Cozy atmosphere",
    text: "Guests often remember the calm atmosphere, the fireplace, and the feeling of a place where you can stay longer."
  },
  {
    title: "Craft beer and drinks",
    text: "Craft beer, cocktails, and seasonal drinks are part of the experience, especially for an easy evening with friends."
  },
  {
    title: "Vegetarian-friendly options",
    text: "International visitors often want reassurance that the menu includes lighter or vegetarian-friendly choices."
  }
] as const;

const keywordThemes = ["cozy", "craft beer", "friendly service", "vegetarian options", "central Sofia"] as const;

export function EnglishReviewsPageLive() {
  const primaryActions = getEnPrimaryActions();

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Guest reviews</p>
        <h1>What guests say about The Friendly Bear Sofia</h1>
        <p className="page-lead">
          Guests often remember the fireplace warmth, the relaxed garden, the craft beer, and the feeling that they
          found a friendly place in the middle of Sofia.
        </p>

        <div className="page-tags" aria-label="Review signals">
          {keywordThemes.map((theme) => (
            <span key={theme}>{theme}</span>
          ))}
        </div>

        <div className="actions">
          {primaryActions.filter((action) => action.kind !== "directions").slice(0, 3).map((action) => (
            <ActionLink
              key={action.href}
              href={action.href}
              label={action.label}
              external={Boolean(action.external)}
              tracking={buildActionTracking({
                kind: action.kind,
                locale: "en",
                location: "reviews_hero",
                label: action.label,
                target: action.href,
                external: Boolean(action.external)
              })}
            />
          ))}
        </div>
      </section>

      <section className="page-grid page-grid-three">
        {decisionSignals.map((item) => (
          <article key={item.title} className="page-card">
            <p className="page-card-label">{item.title}</p>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Guest love</p>
          <h2>Why people recommend us</h2>
          <p>
            Visitors mention the cozy energy, attentive service, and easygoing dinners that turn a quick stop into a
            longer evening.
          </p>
        </article>

        <article className="page-card">
          <p className="page-card-label">Before you visit</p>
          <h2>Good signs for a real dinner decision</h2>
          <ul className="page-list">
            <li>Comfort and atmosphere are a big part of the guest experience.</li>
            <li>Craft beer, vegetarian options, and slow-roasted dishes are easy to ask about.</li>
            <li>Menu, contact, and reservations stay close when you are ready to visit.</li>
          </ul>
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
