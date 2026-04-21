import Link from "next/link";
import { ActionLink } from "@/components/action-link";
import { ReviewSnippetsShowcase } from "@/components/review-snippets-showcase";
import { getBusinessProfileData, getEnPrimaryActions } from "@/lib/business-profile-module";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import { buildActionTracking } from "@/lib/tracking";

const keywordThemes = ["best rated", "slow-roasted BBQ", "craft beer", "cozy cabin", "Sofia Center"] as const;
const writeReviewUrl = "https://search.google.com/local/writereview?placeid=ChIJ1_FHY3SFqkAR2aUhguBOwqQ";

export async function EnglishReviewsPageCms() {
  const [businessProfile, toggles] = await Promise.all([
    getBusinessProfileData(),
    getModuleTogglesData()
  ]);

  const primaryActions = filterActionsByModuleToggles(getEnPrimaryActions(businessProfile), toggles);

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Reviews and ratings</p>
        <h1>What Our Guests Say</h1>
        <p className="page-lead">
          At the heart of everything we do is the experience of our guests. From the warmth of the
          fireplace to the first bite of our slow-roasted BBQ, here are real stories from the people
          who visit our 1923 cabin.
        </p>

        <div className="page-tags" aria-label="Review themes">
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

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Experience</p>
          <h2>Why Guests Return</h2>
          <p>
            We are proud of our 4.5/5 rating. It reflects our commitment to fresh ingredients, local
            craft beer, and a welcoming atmosphere on Slavyanska 23.
          </p>
          <a className="page-inline-link" href={businessProfile.mapUrl} target="_blank" rel="noreferrer">
            See our Google profile
          </a>
        </article>

        <article className="page-card">
          <p className="page-card-label">Atmosphere</p>
          <h2>A Place for Stories</h2>
          <p>
            Whether it's a first date in the garden or a family dinner by the fireplace, our guests
            often mention the good energy that makes The Friendly Bear unique.
          </p>
          <Link className="page-inline-link" href="/en/contact">
            Discover our unique interior details, like the sliding ski doors, on our Contact Page.
          </Link>
        </article>
      </section>

      <ReviewSnippetsShowcase locale="en" />

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Help the next guest</p>
          <h2>Share your Friendly Bear moment</h2>
          <p>
            If the garden, the fireplace, or the slow-roasted BBQ made your evening better, a short
            Google review helps more people find us.
          </p>
          <a className="page-inline-link" href={writeReviewUrl} target="_blank" rel="noreferrer">
            Write a review on Google
          </a>
        </article>

        <article className="page-card">
          <p className="page-card-label">Guest Rating</p>
          <h2>4.5/5 from 1361 Google reviews</h2>
          <p>
            The number matters, but the stories matter more: warm service, good food, and a cozy
            Sofia hideaway people remember.
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
