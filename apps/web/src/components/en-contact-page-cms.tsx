import { ActionLink } from "@/components/action-link";
import { VenueSnapshotSection } from "@/components/venue-snapshot-section";
import {
  getBusinessProfileData,
  getEnContactStatusRows,
  getEnPrimaryActions,
  getOpeningHoursRows
} from "@/lib/business-profile-module";
import { contactFaqItems } from "@/lib/contact-faq";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import { buildActionTracking } from "@/lib/tracking";

const contactHighlights = [
  {
    title: "A Heritage Spot in the Center",
    text: "We are located just behind the InterContinental (former Radisson), a 2-minute walk from the National Theatre."
  },
  {
    title: "Call to reserve",
    text: "Reservations are currently handled by phone, so we can help you choose the garden, the fireplace room, or the best table available."
  },
  {
    title: "Easy visit",
    text: "Cards, cash, pet-friendly seating, English-speaking staff, and clear opening hours are all covered before you arrive."
  }
] as const;

export async function EnglishContactPageCms() {
  const [businessProfile, toggles] = await Promise.all([
    getBusinessProfileData(),
    getModuleTogglesData()
  ]);

  const primaryActions = filterActionsByModuleToggles(getEnPrimaryActions(businessProfile), toggles);
  const contactStatusRows = getEnContactStatusRows(businessProfile);
  const openingHoursRows = getOpeningHoursRows("en", businessProfile);

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Contact and visit</p>
        <h1>Contact, directions, and the little things before you arrive</h1>
        <p className="page-lead">
          Tucked away at Slavyanska 23, our 1923 cabin is ready to welcome you. Below you'll find
          directions, our hours, and answers to the most common guest questions.
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
        title="A few details to recognize when you arrive"
        intro="Look for the garden, the warm wooden interior, and yes - the sliding ski doors by the bathroom."
        images={[
          {
            src: "/images/garden_2.jpg",
            alt: "Garden seating at The Friendly Bear Sofia",
            label: "Venue details",
            caption: "Garden seating before dinner."
          },
          {
            src: "/images/interior_5.jpg",
            alt: "Interior atmosphere at The Friendly Bear Sofia",
            label: "Venue details",
            caption: "A warm cabin corner."
          },
          {
            src: "/images/skis.jpg",
            alt: "Unique sliding doors made of vintage skis at The Friendly Bear Sofia",
            label: "Venue details",
            caption: "The secret sliding ski doors."
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

      <section className="home-section contact-faq" aria-labelledby="contact-faq-title">
        <div className="home-section-heading">
          <p className="eyebrow">FAQ</p>
          <h2 id="contact-faq-title">Good things to know before you visit</h2>
          <p>Practical answers for finding us, paying, parking, bringing a dog, and locating the ski-door bathroom.</p>
        </div>

        <div className="contact-faq-grid">
          {contactFaqItems.en.map((item, index) => (
            <details key={item.question} className={`contact-faq-item ${index === 0 ? "contact-faq-featured" : ""}`}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
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
