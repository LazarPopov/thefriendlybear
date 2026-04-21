import { ActionLink } from "@/components/action-link";
import { BrandShowcasePanel } from "@/components/brand-showcase-panel";
import { getBusinessProfileData, getEnPrimaryActions } from "@/lib/business-profile-module";
import { buildActionTracking } from "@/lib/tracking";

const localAnswers = [
  {
    question: "Where can I eat lamb in central Sofia?",
    answer:
      "The Friendly Bear Sofia already highlights slow roasted lamb on the spring menu and gives visitors a direct path to the full menu and reservations."
  },
  {
    question: "Where is a cozy restaurant near Slavyanska 23?",
    answer:
      "The homepage leads with the exact address, the central Sofia context, and quick directions so visitors understand the location immediately."
  },
  {
    question: "Where can I find vegetarian options in central Sofia?",
    answer:
      "We surface vegetarian-friendly dishes such as the vegetarian drob sarma and the quinoa salad directly from the homepage."
  }
] as const;

export async function EnglishHomePageLive() {
  const businessProfile = await getBusinessProfileData();
  const primaryActions = getEnPrimaryActions(businessProfile);

  return (
    <main className="home-page">
      <section className="home-hero-panel">
        <div className="home-copy">
          <h1>A cozy 1923 urban cabin on Slavyanska 23</h1>
          <BrandShowcasePanel locale="en" />
          <p className="home-lead">
            Step into our secret garden or sit by the fireplace for slow-roasted meats, craft beer, and an atmosphere
            that feels like home.
          </p>

          <div className="home-tags" aria-label="Key highlights">
            <span>{businessProfile.address.en}</span>
            <span>{businessProfile.area.en}</span>
            <span>Spring menu</span>
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
