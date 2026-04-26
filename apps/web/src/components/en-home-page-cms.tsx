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
    title: "Slow-roasted lamb, pork ears, and slow-cooked meats in Sofia Center",
    text:
      "Come for slow-cooked meats from quality Bulgarian producers, 20 kinds of rakia, a rich 0% alcohol drinks menu, and weekly seasonal specials."
  },
  {
    title: "A quiet pause in the heart of Sofia for long conversations",
    text:
      "Whether you sit in the garden or one of the dining rooms, every corner gives you space to slow down after a long day, meet friends, and stay a little longer."
  },
  {
    title: "A clearly structured menu for every taste",
    text:
      "Our menu is organized by category, so everyone at the table can calmly choose what they love."
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
          <h1>A Cozy Urban Den in a 1923 House</h1>
          <BrandShowcasePanel locale="en" />
          <p className="home-lead">
            Hidden behind the Radisson hotel, The Friendly Bear is a place made almost entirely by hand. For nearly
            seven months we built our dining areas, lamps, bar, decorations, and details, giving old objects a new life
            and turning them into a place that feels like home.
          </p>

          <div className="home-tags" aria-label="Key highlights">
            <span>📍 Slavyanska St 23, Sofia</span>
            <span>Garden</span>
            <span>Heated Smoking Area</span>
            <span>Slow-Cooked Meats</span>
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
