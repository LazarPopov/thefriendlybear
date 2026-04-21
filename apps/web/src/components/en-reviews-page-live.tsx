import { ActionLink } from "@/components/action-link";
import { businessProfile, getEnPrimaryActions } from "@/lib/business-profile-live";
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

const connectorStatus = [
  { label: "Google review module", status: "Waiting for approved access" },
  { label: "TripAdvisor snippet layer", status: "Waiting for approved source" },
  { label: "Meta social feed", status: "Waiting for approved API access" },
  { label: "Review themes", status: "Cozy, craft beer, vegetarian options" },
  { label: "HTML menu and contact paths", status: "Live now" }
] as const;

const keywordThemes = ["cozy", "craft beer", "friendly service", "vegetarian options", "central Sofia"] as const;

export function EnglishReviewsPageLive() {
  const primaryActions = getEnPrimaryActions();

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Reviews and social proof</p>
        <h1>Review-ready signals for The Friendly Bear Sofia</h1>
        <p className="page-lead">
          This page is prepared for approved Google reviews, TripAdvisor snippets, and lightweight Meta social content.
          Until the live connectors are available, we keep the page honest and focus on the decision signals visitors
          actually care about.
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
          <p className="page-card-label">Current status</p>
          <h2>What the review layer can publish today</h2>
          <ul className="status-list">
            {connectorStatus.map((item) => (
              <li key={item.label} className="status-row">
                <span>{item.label}</span>
                <strong>{item.status}</strong>
              </li>
            ))}
          </ul>
          <p className="page-note">{businessProfile.statusMessages.en}</p>
        </article>

        <article className="page-card">
          <p className="page-card-label">What this page is for</p>
          <h2>Useful for search and for real restaurant decisions</h2>
          <ul className="page-list">
            <li>Surface the strongest comfort and atmosphere signals once verified reviews are connected.</li>
            <li>Support keyword filters such as cozy, craft beer, and vegetarian options.</li>
            <li>Give visitors a fast path from social proof to menu, contact, and reservations.</li>
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
