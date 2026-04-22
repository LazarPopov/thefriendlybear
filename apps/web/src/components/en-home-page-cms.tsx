import { ActionLink } from "@/components/action-link";
import { BrandShowcasePanel } from "@/components/brand-showcase-panel";
import { CopyAddressButton } from "@/components/copy-address-button";
import { DeferredMapEmbed } from "@/components/deferred-map-embed";
import { HomeVenueGallery } from "@/components/home-venue-gallery";
import { getBusinessProfileData, getPhoneHref } from "@/lib/business-profile-module";
import { buildActionTracking, type BusinessActionKind } from "@/lib/tracking";

type HomeAction = {
  href: string;
  label: string;
  kind: BusinessActionKind;
  external?: boolean;
};

const localStories = [
  {
    title: "Best slow-roasted lamb and BBQ in Sofia Center",
    text:
      "Come for slow-roasted lamb, BBQ plates, craft beer, and seasonal dishes made for relaxed evenings in the center."
  },
  {
    title: "A quiet pause near Slavyanska 23 for conversations",
    text:
      "The garden and fireplace give you space to slow down after a walk, meet friends, and stay longer than planned."
  },
  {
    title: "Clear vegetarian options and fresh salads for everyone",
    text:
      "Vegetarian-friendly dishes and fresh salads are easy to find, so everyone at the table can choose with confidence."
  }
] as const;

const trustPillars = [
  {
    label: "In the Heart of Sofia",
    text: "A quiet escape on Slavyanska 23, just steps away from the city rhythm."
  },
  {
    label: "Always Fresh",
    text: "Explore our seasonal menu, updated weekly with local ingredients and artisan flavors."
  },
  {
    label: "Easy to Visit",
    text: "One-touch calling for reservations and English-speaking staff ready to welcome you."
  }
] as const;

function getMobileQuickbarActions(mapUrl: string, phoneHref: string | null): HomeAction[] {
  return [
    { href: "/en/menu", label: "Menu", kind: "menu" },
    ...(phoneHref ? [{ href: phoneHref, label: "Reserve", kind: "phone" as const }] : []),
    { href: mapUrl, label: "Directions", kind: "directions", external: true }
  ];
}

export async function EnglishHomePageCms() {
  const businessProfile = await getBusinessProfileData();

  const phoneHref = getPhoneHref(businessProfile);
  const quickbarActions = getMobileQuickbarActions(businessProfile.mapUrl, phoneHref);
  const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(businessProfile.mapsLabel.en)}&output=embed`;

  return (
    <main className="home-page">
      <section className="home-hero-panel">
        <div className="home-copy">
          <h1>A Cozy 1923 Urban Cabin in the Heart of Sofia</h1>
          <BrandShowcasePanel locale="en" />
          <p className="home-lead">
            Tucked away near the National Theatre, The Friendly Bear is a labor of love built by hand. Step into our
            secret garden for slow-roasted meats and craft beer, or warm up by the fireplace in an atmosphere that
            feels like home.
          </p>

          <div className="home-tags" aria-label="Key highlights">
            <span>📍 Slavyanska St 23, Sofia</span>
            <span>Garden & Fireplace</span>
            <span>Slow-Roasted BBQ</span>
            <span>Vegetarian Friendly</span>
            <span>Pet Friendly</span>
          </div>

          <blockquote className="home-social-proof">
            “A bear with two hearts... the bar with the best energy we've walked into in years.”
            <br />
            <strong>— Programata Magazine</strong>
          </blockquote>
        </div>
      </section>

      <section className="home-info-grid" aria-label="Trust signals">
        {trustPillars.map((item) => (
          <article key={item.label} className="home-info-card">
            <p className="home-card-label">{item.label}</p>
            <p className="home-card-text">{item.text}</p>
          </article>
        ))}
      </section>

      <HomeVenueGallery locale="en" />

      <section className="home-section home-discovery-section">
        <div className="home-section-heading">
          <p className="eyebrow">The Friendly Bear Experience</p>
          <h2>Why choose The Friendly Bear?</h2>
          <p>Whether you live nearby or you are discovering Sofia on foot, there is always a place for you here.</p>
        </div>

        <div className="home-answer-grid">
          {localStories.map((item) => (
            <article key={item.title} className="home-answer-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-visit-panel">
        <div className="home-visit-copy">
          <p className="eyebrow">Visit us</p>
          <h2>{businessProfile.address.en}</h2>
          <p>Save the address, open directions, or call us. We are on Slavyanska 23, in central Sofia.</p>
          <CopyAddressButton address={businessProfile.address.en} label="Copy address" copiedLabel="Copied" />
        </div>

        <div className="home-visit-actions">
          {quickbarActions.map((action) => (
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

        <div className="home-visit-map-card" aria-label="Map to The Friendly Bear Sofia">
          <DeferredMapEmbed src={mapEmbedSrc} title="The Friendly Bear Sofia map" loadLabel="Load map" />
        </div>
      </section>

      <nav className="mobile-quickbar" aria-label="Quick actions">
        {quickbarActions.map((action) => (
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
