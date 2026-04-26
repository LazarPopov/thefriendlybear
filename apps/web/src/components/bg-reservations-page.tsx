import { ActionLink } from "@/components/action-link";
import { bgCoreActions, venueInfo } from "@/lib/venue";

const bookingModes = [
  {
    title: "Обаждане и WhatsApp",
    text: "Страницата е подготвена за sticky бутони, които ще активираме веднага щом финализираме номерата."
  },
  {
    title: "Външен booking линк",
    text: "Ако използваме платформа като Rezzo или OpenTable, тук ще добавим директен изходящ бутон."
  },
  {
    title: "Проследяване",
    text: "Всяко booking действие е предвидено за GTM и GA4 tracking, за да мерим реални конверсии."
  }
] as const;

const reservationSteps = [
  "Прегледайте менюто, за да видите сезонните предложения.",
  "Отворете упътванията до Slavyanska 23, ако планирате посещение.",
  "Използвайте най-актуалния активен канал веднага щом бъде потвърден на тази страница."
] as const;

const reservationStates = [
  { label: "Меню и адрес", status: "Готови" },
  { label: "Страница за резервации", status: "Готова" },
  { label: "Call now", status: "Чака номер" },
  { label: "WhatsApp", status: "Чака номер" },
  { label: "External booking", status: "По избор" }
] as const;

export function BulgarianReservationsPage() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Резервации</p>
        <h1>Резервирайте с най-бързия наличен път</h1>
        <p className="page-lead">
          Подготвяме тази страница да поеме call, WhatsApp и външен booking поток. Докато
          финализираме live каналите, държим менюто, контактите и упътванията на едно място.
        </p>

        <div className="page-tags" aria-label="Резервационен статус">
          <span>Менюто е активно</span>
          <span>Адресът е активен</span>
          <span>Booking каналите се финализират</span>
        </div>

        <div className="actions">
          <ActionLink href="/bg/contact" label="Контакти" />
          <ActionLink href="/bg/menu" label="Меню" />
          <ActionLink href={venueInfo.mapUrl} label="Как да стигнете" external />
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
          <p className="page-note">{venueInfo.reservationStatus.bg}</p>
        </article>

        <article className="page-card">
          <p className="page-card-label">Най-добър път за потребителя</p>
          <h2>Докато каналите станат live</h2>
          <ol className="page-list page-list-numbered">
            {reservationSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Полезно за гостите</p>
          <h2>Какво могат да видят още сега</h2>
          <ul className="page-list">
            <li>Седмично меню с бавно печени меса, салати и вегетариански опции.</li>
            <li>Ясна локация на ул. Славянска 23 в центъра на София.</li>
            <li>Бърз мобилен достъп до меню, контакти и карти.</li>
          </ul>
        </article>

        <article className="page-card">
          <p className="page-card-label">Следващ live upgrade</p>
          <h2>Какво ще включим веднага след потвърждение</h2>
          <ul className="page-list">
            <li>Sticky Call Now бутон.</li>
            <li>Sticky WhatsApp бутон.</li>
            <li>Проследяване на booking действия през GTM и GA4.</li>
          </ul>
        </article>
      </section>

      <nav className="mobile-quickbar" aria-label="Бързи действия">
        {bgCoreActions.map((action) => (
          <ActionLink
            key={action.href}
            href={action.href}
            label={action.label}
            className="mobile-quickbar-link"
            external={"external" in action && action.external}
          />
        ))}
      </nav>
    </main>
  );
}
