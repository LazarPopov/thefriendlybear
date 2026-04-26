import Image from "next/image";
import { ActionLink } from "@/components/action-link";
import { HomeVenueGallery } from "@/components/home-venue-gallery";
import { getBusinessProfileData, getEnPrimaryActions } from "@/lib/business-profile-module";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import { buildActionTracking } from "@/lib/tracking";

export async function EnglishAboutPageCms() {
  const [businessProfile, toggles] = await Promise.all([
    getBusinessProfileData(),
    getModuleTogglesData()
  ]);

  const primaryActions = filterActionsByModuleToggles(getEnPrimaryActions(businessProfile), toggles);

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">About</p>
        <h1>Urban Comfort in a 100-Year-Old House on Slavyanska 23</h1>
        <p className="page-lead">
          Saved from demolition and restored by hand, our 1923 home is a project created with love and attention to
          detail. The Friendly Bear is where old Sofia history meets the comfort of a forest lodge.
        </p>

        <div className="page-tags" aria-label="About highlights">
          <span>{businessProfile.address.en}</span>
          <span>Secret garden</span>
          <span>Heated smoking area</span>
          <span>Pet friendly</span>
        </div>

        <div className="actions">
          {primaryActions.slice(0, 4).map((action) => (
            <ActionLink
              key={action.href}
              href={action.href}
              label={action.label}
              external={Boolean(action.external)}
              tracking={buildActionTracking({
                kind: action.kind,
                locale: "en",
                location: "about_hero",
                label: action.label,
                target: action.href,
                external: Boolean(action.external)
              })}
            />
          ))}
        </div>
      </section>

      <section className="page-grid page-grid-two about-founder-section">
        <article className="page-card about-founder-copy">
          <p className="page-card-label">Founders</p>
          <h2>The Hearts Behind the Bear</h2>
          <p>
            Jana, the culinary mind behind the{" "}
            <a href="https://www.mish-mash.recipes/" target="_blank" rel="noreferrer">
              Mish-Mash Recipes blog
            </a>
            , and Georgi, the interior designer from Ainterior, spent months uncovering the beauty of this house. "We
            wanted to create a place that feels like home for everyone - neighbors, travelers, and their pets," they
            say.
          </p>
        </article>

        <figure className="about-founder-frame">
          <Image
            src="/images/founders.jpg"
            alt="Founders Jana and Georgi at The Friendly Bear restaurant Sofia"
            width={900}
            height={680}
            className="about-founder-image"
            priority
          />
        </figure>
      </section>

      <HomeVenueGallery locale="en" maxImagesBeforeCta={9} />

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Visit</p>
          <h2>{businessProfile.address.en}</h2>
          <p>
            Find us in central Sofia, close to the Radisson hotel and the National Theatre. We are part of the city
            rhythm, but tucked away enough for you to feel calm as soon as you step into our den.
          </p>
          <ActionLink
            href={businessProfile.mapUrl}
            label="Open directions"
            className="page-inline-link"
            external
            tracking={buildActionTracking({
              kind: "directions",
              locale: "en",
              location: "about_location_card",
              label: "Open directions",
              target: businessProfile.mapUrl,
              external: true
            })}
          />
        </article>

        <article className="page-card">
          <p className="page-card-label">Welcome</p>
          <h2>Built for locals, travelers, and pets</h2>
          <p>
            Come for an escape from the city noise, stay for the comfort and good food. You can always count on us if
            you need directions, a table reservation, or help choosing dishes.
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
