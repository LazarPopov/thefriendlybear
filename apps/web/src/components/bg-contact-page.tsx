import { ActionLink } from "@/components/action-link";
import {
  businessProfile,
  getBgContactStatusRows,
  getBgPrimaryActions
} from "@/lib/business-profile";

const contactHighlights = [
  {
    title: "Адрес",
    text: "The Friendly Bear Sofia е на ул. Славянска 23, в центъра на София."
  },
  {
    title: "Локация",
    text: "Страницата е подредена така, че човек да стигне до адреса, менюто и резервациите с минимален брой тапвания."
  },
  {
    title: "Готовност",
    text: "Директните click-to-call и WhatsApp действия са предвидени и чакат единствено финалните данни."
  }
] as const;

const liveChannels = [
  { label: "Адрес и упътвания", status: "Активни сега" },
  { label: "HTML меню", status: "Активно сега" },
  { label: "Телефон", status: "Очаква потвърждение" },
  { label: "WhatsApp", status: "Очаква потвърждение" }
] as const;

export function BulgarianContactPage() {
  const primaryActions = getBgPrimaryActions();
  const contactStatusRows = getBgContactStatusRows();

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Контакти и посещение</p>
        <h1>Как да стигнете до The Friendly Bear Sofia</h1>
        <p className="page-lead">
          Изведохме адреса, картите и най-важните действия отпред, така че посетителят да може
          веднага да ви намери и да премине към меню или резервация.
        </p>

        <div className="page-tags" aria-label="Ключова информация">
          <span>{businessProfile.address.bg}</span>
          <span>{businessProfile.area.bg}</span>
          <span>Бърз достъп от мобилен</span>
        </div>

        <div className="actions">
          <ActionLink href={venueInfo.mapUrl} label="Отвори упътвания" external />
          <ActionLink href="/bg/menu" label="Меню" />
          <ActionLink href="/bg/reservations" label="Резервации" />
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
          <p className="page-card-label">Адрес и карта</p>
          <h2>{venueInfo.address.bg}</h2>
          <p>{venueInfo.mapsLabel.bg}</p>
          <ul className="page-list">
            {venueInfo.arrivalTips.bg.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <ActionLink
            href={venueInfo.mapUrl}
            label="Отвори в Google Maps"
            className="page-inline-link"
            external
          />
        </article>

        <article className="page-card">
          <p className="page-card-label">Контактни канали</p>
          <h2>Кои действия са активни сега</h2>
          <ul className="status-list">
            {liveChannels.map((channel) => (
              <li key={channel.label} className="status-row">
                <span>{channel.label}</span>
                <strong>{channel.status}</strong>
              </li>
            ))}
          </ul>
          <p className="page-note">{venueInfo.reservationStatus.bg}</p>
        </article>
      </section>

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Преди посещение</p>
          <h2>Полезен маршрут за госта</h2>
          <ol className="page-list page-list-numbered">
            <li>Вижте пролетното меню и сезонните ястия.</li>
            <li>Отворете упътванията за Slavyanska 23.</li>
            <li>Проверете страницата за резервации за най-актуалния booking канал.</li>
          </ol>
        </article>

        <article className="page-card">
          <p className="page-card-label">На място</p>
          <h2>Какво подчертаваме още отсега</h2>
          <ul className="page-list">
            {venueInfo.visitNotes.bg.map((note) => (
              <li key={note}>{note}</li>
            ))}
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
