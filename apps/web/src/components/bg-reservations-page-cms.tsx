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

export async function BulgarianReservationsPageCms() {
  const [businessProfile, toggles, reservationSettings] = await Promise.all([
    getBusinessProfileData(),
    getModuleTogglesData(),
    getReservationSettingsData()
  ]);

  const reservationActions = getReservationDisplayedActions("bg", businessProfile, reservationSettings, toggles);
  const displayedActions = filterActionsByModuleToggles(reservationActions, toggles);
  const quickbarActions = getReservationQuickbarActions("bg", businessProfile, reservationSettings, toggles);
  const reservationStates = getReservationStatusRows("bg", businessProfile, reservationSettings, toggles);
  const reservationsEnabled = isReservationFlowEnabled(reservationSettings, toggles);
  const heroContent = getReservationHeroContent("bg", reservationSettings, toggles);
  const reservationMessage = getReservationConfirmationMessage("bg", reservationSettings, businessProfile);

  const bookingModes = [
    {
      title: "Активен режим",
      text: `В момента CMS е настроен на режим „${getReservationModeLabel("bg", reservationSettings.mode)}“.`
    },
    {
      title: "Sticky действия",
      text: reservationSettings.stickyCallEnabled
        ? "Телефонният shortcut е позволен в mobile quickbar-а."
        : "Телефонният shortcut е изключен от reservation settings."
    },
    {
      title: "Проследяване",
      text: "Всички booking действия вече са подготвени за GTM и GA4, така че реалните конверсии да се измерват чисто."
    }
  ] as const;

  const reservationSteps = [
    "Прегледайте менюто, за да видите сезонните предложения.",
    "Отворете упътванията до Славянска 23, ако планирате посещение.",
    reservationMessage
  ] as const;

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Резервации</p>
        <h1>{heroContent.title}</h1>
        <p className="page-lead">{heroContent.description}</p>

        <div className="page-tags" aria-label="Резервационен статус">
          <span>{heroContent.statusTag}</span>
          <span>{businessProfile.address.bg}</span>
          <span>{businessProfile.area.bg}</span>
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
                locale: "bg",
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
              <p className="page-card-label">Какво работи в момента</p>
              <h2>Статус на booking потока</h2>
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
              <p className="page-card-label">Най-добър път за потребителя</p>
              <h2>Докато live каналите са активни</h2>
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
            <p className="page-card-label">Текущ статус</p>
            <h2>{heroContent.title}</h2>
            <p>{heroContent.description}</p>
          </article>

          <article className="page-card">
            <p className="page-card-label">Все още активни</p>
            <h2>Какво може да направи посетителят сега</h2>
            <ul className="page-list">
              <li>Да отвори HTML менюто и да прегледа сезонните предложения.</li>
              <li>Да види адреса на Славянска 23 и упътванията до ресторанта.</li>
              <li>Да използва контактната страница за обща информация.</li>
            </ul>
          </article>
        </section>
      )}

      <nav className="mobile-quickbar" aria-label="Бързи действия">
        {quickbarActions.map((action) => (
          <ActionLink
            key={action.href}
            href={action.href}
            label={action.label}
            className="mobile-quickbar-link"
            external={Boolean(action.external)}
            tracking={buildActionTracking({
              kind: action.kind,
              locale: "bg",
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
