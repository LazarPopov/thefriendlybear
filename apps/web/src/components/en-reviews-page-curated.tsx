import { ActionLink } from "@/components/action-link";
import { ReviewSnippetsShowcase } from "@/components/review-snippets-showcase";
import { getBusinessProfileData, getEnPrimaryActions } from "@/lib/business-profile-module";
import { buildActionTracking } from "@/lib/tracking";

const keywordThemes = ["cozy", "service", "food", "walk-in", "central Sofia"] as const;

export async function EnglishReviewsPageCurated() {
  const businessProfile = await getBusinessProfileData();
  const primaryActions = getEnPrimaryActions(businessProfile);

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Guest reviews</p>
        <h1>Guest stories from The Friendly Bear Sofia</h1>
        <p className="page-lead">
          Read real impressions from guests who came for food, service, and atmosphere, then found a place they wanted
          to recommend.
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
          <p className="page-card-label">Guest love</p>
          <h2>Why people recommend us</h2>
          <p>
            Guests often mention the warm atmosphere, genuinely welcoming service, and food that makes a walk-in visit
            feel like a lucky discovery.
          </p>
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
