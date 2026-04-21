import { ActionLink } from "@/components/action-link";
import {
  getBusinessProfileData,
  getEnPrimaryActions,
  getEnReservationStatusRows
} from "@/lib/business-profile-module";
import { buildActionTracking } from "@/lib/tracking";

const bookingModes = [
  {
    title: "Call and direct contact",
    text: "The phone channel is already live and can handle the fastest reservation and visit inquiries."
  },
  {
    title: "External booking mode",
    text: "If the restaurant uses a platform such as Rezzo or OpenTable, this page can surface the outgoing booking link cleanly."
  },
  {
    title: "Tracking ready",
    text: "Every booking-related action is already prepared for GTM and GA4 conversion tracking."
  }
] as const;

const reservationSteps = [
  "Review the menu first if you want to see the seasonal dishes before booking.",
  "Open directions to Slavyanska 23 if you are planning a visit in central Sofia.",
  "Use the most current active booking channel as soon as it is confirmed on this page."
] as const;

export async function EnglishReservationsPageLive() {
  const businessProfile = await getBusinessProfileData();
  const primaryActions = getEnPrimaryActions(businessProfile);
  const reservationStates = getEnReservationStatusRows(businessProfile);

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Reservations</p>
        <h1>Reserve through the fastest available path</h1>
        <p className="page-lead">
          The phone route is already live, and this page stays ready for WhatsApp and external booking flows once they
          are confirmed. In the meantime, menu access, contact details, and directions stay easy to reach from one place.
        </p>

        <div className="page-tags" aria-label="Reservation status">
          <span>Phone is live</span>
          <span>Opening hours are published</span>
          <span>WhatsApp and booking link are being finalized</span>
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
                location: "reservations_hero",
                label: action.label,
                target: action.href,
                external: Boolean(action.external)
              })}
            />
          ))}
        </div>
      </section>

      <section className="page-grid page-grid-three">
        {bookingModes.map((mode) => (
          <article key={mode.title} className="page-card">
            <p className="page-card-label">{mode.title}</p>
            <p>{mode.text}</p>
          </article>
        ))}
      </section>

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">What works right now</p>
          <h2>Booking flow status</h2>
          <ul className="status-list">
            {reservationStates.map((item) => (
              <li key={item.label} className="status-row">
                <span>{item.label}</span>
                <strong>{item.status}</strong>
              </li>
            ))}
          </ul>
          <p className="page-note">{businessProfile.statusMessages.en}</p>
        </article>

        <article className="page-card">
          <p className="page-card-label">Best path for the visitor</p>
          <h2>Until the live channels are enabled</h2>
          <ol className="page-list page-list-numbered">
            {reservationSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Useful right away</p>
          <h2>What guests can already see</h2>
          <ul className="page-list">
            <li>Seasonal dishes including lamb, salads, and vegetarian options.</li>
            <li>A clear central Sofia location at Slavyanska 23.</li>
            <li>Fast mobile access to menu, contact, and directions.</li>
          </ul>
        </article>

        <article className="page-card">
          <p className="page-card-label">Next live upgrade</p>
          <h2>What gets enabled after confirmation</h2>
          <ul className="page-list">
            <li>WhatsApp button once the number is confirmed.</li>
            <li>External booking button once a platform is chosen.</li>
            <li>Sticky WhatsApp button.</li>
            <li>Tracked booking actions in GTM and GA4.</li>
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
