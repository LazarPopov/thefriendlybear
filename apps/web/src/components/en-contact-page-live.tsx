import { ActionLink } from "@/components/action-link";
import {
  getBusinessProfileData,
  getEnContactStatusRows,
  getEnPrimaryActions,
  getOpeningHoursRows
} from "@/lib/business-profile-module";
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
    text: "Click-to-call is already live, opening hours are published, and WhatsApp or external booking can be added once confirmed."
  }
] as const;

export async function EnglishContactPageLive() {
  const businessProfile = await getBusinessProfileData();
  const primaryActions = getEnPrimaryActions(businessProfile);
  const contactStatusRows = getEnContactStatusRows(businessProfile);
  const openingHoursRows = getOpeningHoursRows("en", businessProfile);

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Contact and visit</p>
        <h1>How to get to The Friendly Bear Sofia</h1>
        <p className="page-lead">
          We bring the address, directions, and high-intent actions to the front so international visitors can move
          quickly from discovery to menu review or reservation planning.
        </p>

        <div className="page-tags" aria-label="Key information">
          <span>{businessProfile.address.en}</span>
          <span>{businessProfile.area.en}</span>
          <span>{businessProfile.serviceOptions.en[0]}</span>
          <span>{businessProfile.serviceOptions.en[1]}</span>
          <span>{businessProfile.serviceOptions.en[2]}</span>
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

      <section className="page-grid page-grid-three">
        {contactHighlights.map((item) => (
          <article key={item.title} className="page-card">
            <p className="page-card-label">{item.title}</p>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

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
