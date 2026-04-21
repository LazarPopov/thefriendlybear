import Image from "next/image";
import { ActionLink } from "@/components/action-link";
import { VenueSnapshotSection } from "@/components/venue-snapshot-section";
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
        <h1>A 100-Year-Old Story on Slavyanska 23</h1>
        <p className="page-lead">
          Saved from demolition and restored by hand, our 1923 urban cabin is a labor of love. The Friendly Bear is
          where Sofia's history meets the warmth of a mountain lodge.
        </p>

        <div className="page-tags" aria-label="About highlights">
          <span>{businessProfile.address.en}</span>
          <span>Secret garden</span>
          <span>Indoor fireplace</span>
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
            Jana, the culinary mind behind the Mish-Mash Recipes blog, and Georgi, the interior designer from
            Ainterior, spent months uncovering the beauty of this house. We wanted to create a place that feels like
            home for everyone, locals, travelers, and their pets.
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

      <VenueSnapshotSection
        locale="en"
        eyebrow="Atmosphere"
        title="A Secret Garden & A Winter Fireplace"
        intro="Our hidden garden is an urban escape for summer nights, while our indoor fireplace offers a warm sanctuary during the Sofia winter. Whatever the season, our English-speaking staff is here to make your visit easy."
        images={[
          {
            src: "/images/garden_1.jpg",
            alt: "Secret garden at The Friendly Bear Sofia",
            label: "Atmosphere"
          },
          {
            src: "/images/interior_1.jpg",
            alt: "Fireplace interior at The Friendly Bear Sofia",
            label: "Atmosphere"
          },
          {
            src: "/images/garden_3.jpg",
            alt: "Summer garden atmosphere at The Friendly Bear Sofia",
            label: "Atmosphere"
          },
          {
            src: "/images/interior_4.jpg",
            alt: "Warm indoor atmosphere at The Friendly Bear Sofia",
            label: "Atmosphere"
          }
        ]}
      />

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Visit</p>
          <h2>{businessProfile.address.en}</h2>
          <p>
            Find us in Sofia Center, close to the National Theatre and the city rhythm, but tucked away enough to feel
            calm once you step inside.
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
            Come for the garden, stay for the fireplace, and ask the team if you need help choosing dishes, directions,
            or a table for the evening.
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
