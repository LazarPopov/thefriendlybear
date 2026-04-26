import { ActionLink } from "@/components/action-link";
import { BrandShowcasePanel } from "@/components/brand-showcase-panel";
import { getBusinessProfileData, getEnPrimaryActions } from "@/lib/business-profile-module";
import { buildActionTracking } from "@/lib/tracking";

const localAnswers = [
  {
    question: "Where can I find slow-roasted lamb and slow-cooked meats in central Sofia?",
    answer:
      "The Friendly Bear Sofia serves slow-cooked meats from quality Bulgarian producers, weekly seasonal specials, and a direct path to the full menu and reservations."
  },
  {
    question: "Where is a cozy restaurant near Slavyanska 23?",
    answer:
      "The homepage leads with the exact address, the central Sofia context, and quick directions so visitors understand the location immediately."
  },
  {
    question: "Where can I find a clearly structured menu in central Sofia?",
    answer:
      "Our menu is organized by category, with vegetarian dishes, fresh salads, slow-cooked meats, and classic desserts easy to find."
  }
] as const;

export async function EnglishHomePageLive() {
  const businessProfile = await getBusinessProfileData();
  const primaryActions = getEnPrimaryActions(businessProfile);

  return (
    <main className="home-page">
      <section className="home-hero-panel">
        <div className="home-copy">
          <h1>A Cozy Urban Den in a 1923 House</h1>
          <BrandShowcasePanel locale="en" />
          <p className="home-lead">
            Hidden behind the Radisson hotel, The Friendly Bear is a place made almost entirely by hand. For nearly
            seven months we built our dining areas, lamps, bar, decorations, and details, giving old objects a new life.
          </p>

          <div className="home-tags" aria-label="Key highlights">
            <span>{businessProfile.address.en}</span>
            <span>{businessProfile.area.en}</span>
            <span>Slow-Cooked Meats</span>
            <span>Heated Smoking Area</span>
            <span>Vegetarian options</span>
            <span>Pet Friendly</span>
          </div>

          <blockquote className="home-social-proof">
            “A bear with two hearts... the bar with the best energy we've walked into in years.”
            <br />
            <strong>— Programata Magazine</strong>
          </blockquote>
        </div>
      </section>

      <section className="home-section home-discovery-section">
        <div className="home-section-heading">
          <p className="eyebrow">The Friendly Bear Experience</p>
          <h2>Why choose The Friendly Bear?</h2>
          <p>Whether you live nearby or you are discovering Sofia on foot, there is always a place for you here.</p>
        </div>

        <div className="home-answer-grid">
          {localAnswers.map((item) => (
            <article key={item.question} className="home-answer-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-visit-panel">
        <div className="home-visit-copy">
          <p className="eyebrow">Visit us</p>
          <h2>{businessProfile.address.en}</h2>
          <p>Save the address, open directions, or call us. We are on Slavyanska 23, in central Sofia.</p>
        </div>

        <div className="home-visit-actions">
          {primaryActions.map((action) => (
            <ActionLink
              key={action.href}
              href={action.href}
              label={action.label}
              className="home-visit-link"
              external={Boolean(action.external)}
              tracking={buildActionTracking({
                kind: action.kind,
                locale: "en",
                location: "home_visit_panel",
                label: action.label,
                target: action.href,
                external: Boolean(action.external)
              })}
            />
          ))}
        </div>
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
