import { ActionLink } from "@/components/action-link";
import { ReviewSnippetsShowcase } from "@/components/review-snippets-showcase";
import { getBusinessProfileData, getEnPrimaryActions } from "@/lib/business-profile-module";
import { buildActionTracking } from "@/lib/tracking";

const connectorStatus = [
  { label: "Google review snippets", status: "Live now" },
  { label: "TripAdvisor snippet layer", status: "Waiting for approved source" },
  { label: "Meta social feed", status: "Waiting for approved API access" },
  { label: "Keyword tags", status: "Live now" },
  { label: "HTML menu and contact paths", status: "Live now" }
] as const;

const keywordThemes = ["cozy", "service", "food", "walk-in", "central Sofia"] as const;

export async function EnglishReviewsPageCurated() {
  const businessProfile = await getBusinessProfileData();
  const primaryActions = getEnPrimaryActions(businessProfile);

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Reviews and social proof</p>
        <h1>Google review snippets for The Friendly Bear Sofia</h1>
        <p className="page-lead">
          The page now shows curated snippets from real Google reviews. That gives the site a working social-proof layer
          today, while keeping the structure ready for an approved automated review source later on.
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

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Current status</p>
          <h2>What the review layer publishes now</h2>
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
          <p className="page-card-label">What the snippets already show</p>
          <h2>Signals that help with a real restaurant decision</h2>
          <ul className="page-list">
            <li>Warm atmosphere and genuinely welcoming service.</li>
            <li>Strong praise for both food quality and the overall experience.</li>
            <li>A positive signal for walk-in guests, not only pre-booked visits.</li>
          </ul>
        </article>
      </section>

      <ReviewSnippetsShowcase locale="en" />

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
