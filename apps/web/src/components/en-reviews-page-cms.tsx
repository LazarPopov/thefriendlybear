import { ActionLink } from "@/components/action-link";
import { ReviewSnippetsShowcase } from "@/components/review-snippets-showcase";
import { getBusinessProfileData, getEnPrimaryActions } from "@/lib/business-profile-module";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import { getPageContentData } from "@/lib/page-module";
import { buildActionTracking } from "@/lib/tracking";

const connectorStatus = [
  { label: "Google review snippets", status: "Live now" },
  { label: "TripAdvisor snippet layer", status: "Waiting for approved source" },
  { label: "Meta social feed", status: "Waiting for approved API access" },
  { label: "Keyword tags", status: "Live now" },
  { label: "HTML menu and contact paths", status: "Live now" }
] as const;

const keywordThemes = ["cozy", "service", "food", "walk-in", "central Sofia"] as const;

export async function EnglishReviewsPageCms() {
  const [businessProfile, page, toggles] = await Promise.all([
    getBusinessProfileData(),
    getPageContentData("reviews", "en"),
    getModuleTogglesData()
  ]);

  const primaryActions = filterActionsByModuleToggles(getEnPrimaryActions(businessProfile), toggles);

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Reviews and social proof</p>
        <h1>{page?.title ?? "Google review snippets for The Friendly Bear Sofia"}</h1>
        <p className="page-lead">
          {page?.intro ??
            "The page already shows curated snippets from real Google reviews and keeps the structure ready for an approved future review source."}
        </p>

        <div className="page-tags" aria-label="Review signals">
          {keywordThemes.map((theme) => (
            <span key={theme}>{theme}</span>
          ))}
        </div>

        <div className="actions">
          {primaryActions
            .filter((action) => action.kind !== "directions")
            .slice(0, 3)
            .map((action) => (
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

      {page?.bodyHtml ? (
        <section className="page-grid">
          <article className="page-card cms-richtext" dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
        </section>
      ) : null}

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



