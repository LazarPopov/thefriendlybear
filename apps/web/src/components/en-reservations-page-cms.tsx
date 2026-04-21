import { ActionLink } from "@/components/action-link";
import { getBusinessProfileData } from "@/lib/business-profile-module";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import {
  getReservationConfirmationMessage,
  getReservationDisplayedActions,
  getReservationHeroContent,
  getReservationModeLabel,
  getReservationQuickbarActions,
  getReservationSettingsData,
  getReservationStatusRows,
  isReservationFlowEnabled
} from "@/lib/reservation-setting-module";
import { buildActionTracking } from "@/lib/tracking";

export async function EnglishReservationsPageCms() {
  const [businessProfile, toggles, reservationSettings] = await Promise.all([
    getBusinessProfileData(),
    getModuleTogglesData(),
    getReservationSettingsData()
  ]);

  const reservationActions = getReservationDisplayedActions("en", businessProfile, reservationSettings, toggles);
  const displayedActions = filterActionsByModuleToggles(reservationActions, toggles);
  const quickbarActions = getReservationQuickbarActions("en", businessProfile, reservationSettings, toggles);
  const reservationStates = getReservationStatusRows("en", businessProfile, reservationSettings, toggles);
  const reservationsEnabled = isReservationFlowEnabled(reservationSettings, toggles);
  const heroContent = getReservationHeroContent("en", reservationSettings, toggles);
  const reservationMessage = getReservationConfirmationMessage("en", reservationSettings, businessProfile);

  const bookingModes = [
    {
      title: "Active mode",
      text: `The CMS is currently set to “${getReservationModeLabel("en", reservationSettings.mode)}”.`
    },
    {
      title: "Sticky actions",
      text: reservationSettings.stickyCallEnabled
        ? "The phone shortcut is allowed in the mobile quickbar."
        : "The phone shortcut is disabled from reservation settings."
    },
    {
      title: "Tracking ready",
      text: "All booking actions are already prepared for GTM and GA4 so the real conversions can be measured cleanly."
    }
  ] as const;

  const reservationSteps = [
    "Review the menu first if you want to see the seasonal dishes.",
    "Open directions to Slavyanska 23 if you are planning a visit.",
    reservationMessage
  ] as const;

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Reservations</p>
        <h1>{heroContent.title}</h1>
        <p className="page-lead">{heroContent.description}</p>

        <div className="page-tags" aria-label="Reservation status">
          <span>{heroContent.statusTag}</span>
          <span>{businessProfile.address.en}</span>
          <span>{businessProfile.area.en}</span>
        </div>

        <div className="actions">
          {displayedActions.slice(0, 3).map((action) => (
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

      {reservationsEnabled ? (
        <>
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
              <p className="page-note">{reservationMessage}</p>
            </article>

            <article className="page-card">
              <p className="page-card-label">Best current path</p>
              <h2>While the live channels are enabled</h2>
              <ol className="page-list page-list-numbered">
                {reservationSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
          </section>
        </>
      ) : (
        <section className="page-grid page-grid-two">
          <article className="page-card">
            <p className="page-card-label">Current status</p>
            <h2>{heroContent.title}</h2>
            <p>{heroContent.description}</p>
          </article>

          <article className="page-card">
            <p className="page-card-label">Still active</p>
            <h2>What the visitor can do right now</h2>
            <ul className="page-list">
              <li>Open the HTML menu and review the seasonal dishes.</li>
              <li>See the Slavyanska 23 address and directions to the venue.</li>
              <li>Use the contact page for general information.</li>
            </ul>
          </article>
        </section>
      )}

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
