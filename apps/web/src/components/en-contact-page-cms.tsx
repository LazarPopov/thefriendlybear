import { ActionLink } from "@/components/action-link";
import { VenueSnapshotSection } from "@/components/venue-snapshot-section";
import {
  getBusinessProfileData,
  getEnContactStatusRows,
  getEnPrimaryActions,
  getOpeningHoursRows
} from "@/lib/business-profile-module";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import { getPageContentData } from "@/lib/page-module";
import { buildActionTracking } from "@/lib/tracking";

const contactHighlights = [
  {
    title: "Address",
    text: "The Friendly Bear Sofia is on Slavyanska 23 in central Sofia."
  },
  {
    title: "Service options",
    text: "Outdoor seating, a fireplace, and great cocktails help visitors understand the venue faster."
  },
  {
    title: "Conversion ready",
    text: "Click-to-call is already live, opening hours are published, and more booking channels can be added later."
  }
] as const;

export async function EnglishContactPageCms() {
  const [businessProfile, page, toggles] = await Promise.all([
    getBusinessProfileData(),
    getPageContentData("contact", "en"),
    getModuleTogglesData()
  ]);

  const primaryActions = filterActionsByModuleToggles(getEnPrimaryActions(businessProfile), toggles);
  const contactStatusRows = getEnContactStatusRows(businessProfile);
  const openingHoursRows = getOpeningHoursRows("en", businessProfile);

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Contact and visit</p>
        <h1>{page?.title ?? "How to get to The Friendly Bear Sofia"}</h1>
        <p className="page-lead">
          {page?.intro ??
            "We bring the address, map, and key actions forward so visitors can reach the restaurant quickly and move straight to the menu or reservation path."}
        </p>

        <div className="page-tags" aria-label="Key information">
          <span>{businessProfile.address.en}</span>
          <span>{businessProfile.area.en}</span>
          {businessProfile.serviceOptions.en.slice(0, 3).map((option) => (
            <span key={option}>{option}</span>
          ))}
        </div>

        <div className="actions">
          {primaryActions.slice(0, 3).map((action) => (
            <ActionLink
              key={action.href}
              href={action.href}
              label={action.label}
              external={Boolean(action.external)}
              tracking={buildActionTracking({
                kind: action.kind,
                locale: "en",
                location: "contact_hero",
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

      <section className="page-grid page-grid-three">
        {contactHighlights.map((item) => (
          <article key={item.title} className="page-card">
            <p className="page-card-label">{item.title}</p>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <VenueSnapshotSection
        locale="en"
        eyebrow="On site"
        title="Garden and interior cues before the visit"
        intro="The contact page is a natural place to show the venue itself, because this is where visitors already check the map, the address, and whether the atmosphere fits."
        images={[
          {
            src: "/images/garden_2.jpg",
            alt: "Garden seating at The Friendly Bear Sofia",
            label: "Garden"
          },
          {
            src: "/images/interior_5.jpg",
            alt: "Interior atmosphere at The Friendly Bear Sofia",
            label: "Interior"
          }
        ]}
      />

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Address and map</p>
          <h2>{businessProfile.address.en}</h2>
          <p>{businessProfile.mapsLabel.en}</p>
          <ul className="page-list">
            {businessProfile.arrivalTips.en.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <ActionLink
            href={businessProfile.mapUrl}
            label="Open in Google Maps"
            className="page-inline-link"
            external
            tracking={buildActionTracking({
              kind: "directions",
              locale: "en",
              location: "contact_map_card",
              label: "Open in Google Maps",
              target: businessProfile.mapUrl,
              external: true
            })}
          />
        </article>

        <article className="page-card">
          <p className="page-card-label">Contact channels</p>
          <h2>What is active right now</h2>
          <ul className="status-list">
            {contactStatusRows.map((channel) => (
              <li key={channel.label} className="status-row">
                <span>{channel.label}</span>
                <strong>{channel.status}</strong>
              </li>
            ))}
          </ul>
          <p className="page-note">{businessProfile.statusMessages.en}</p>
        </article>
      </section>

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Opening hours</p>
          <h2>Hours status</h2>
          <ul className="status-list">
            {openingHoursRows.map((row) => (
              <li key={row.label} className="status-row">
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="page-card">
          <p className="page-card-label">On site</p>
          <h2>What we already make easy for visitors</h2>
          <ul className="page-list">
            {businessProfile.visitNotes.en.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
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
