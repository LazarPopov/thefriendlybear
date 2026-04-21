import { ActionLink } from "@/components/action-link";
import {
  getBusinessProfileData,
  getBgContactStatusRows,
  getBgPrimaryActions,
  getOpeningHoursRows
} from "@/lib/business-profile-module";
import { buildActionTracking } from "@/lib/tracking";

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

export async function BulgarianContactPageLive() {
  const businessProfile = await getBusinessProfileData();
  const primaryActions = getBgPrimaryActions(businessProfile);
  const contactStatusRows = getBgContactStatusRows(businessProfile);
  const openingHoursRows = getOpeningHoursRows("bg", businessProfile);

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
          {primaryActions.slice(0, 3).map((action) => (
            <ActionLink
              key={action.href}
              href={action.href}
              label={action.label}
              external={"external" in action && action.external}
              tracking={buildActionTracking({
                kind: action.kind,
                locale: "bg",
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
          <p className="page-card-label">Адрес и карта</p>
          <h2>{businessProfile.address.bg}</h2>
          <p>{businessProfile.mapsLabel.bg}</p>
          <ul className="page-list">
            {businessProfile.arrivalTips.bg.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <ActionLink
            href={businessProfile.mapUrl}
            label="Отвори в Google Maps"
            className="page-inline-link"
            external
            tracking={buildActionTracking({
              kind: "directions",
              locale: "bg",
              location: "contact_map_card",
              label: "Отвори в Google Maps",
              target: businessProfile.mapUrl,
              external: true
            })}
          />
        </article>

        <article className="page-card">
          <p className="page-card-label">Контактни канали</p>
          <h2>Кои действия са активни сега</h2>
          <ul className="status-list">
            {contactStatusRows.map((channel) => (
              <li key={channel.label} className="status-row">
                <span>{channel.label}</span>
                <strong>{channel.status}</strong>
              </li>
            ))}
          </ul>
          <p className="page-note">{businessProfile.statusMessages.bg}</p>
        </article>
      </section>

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Работно време</p>
          <h2>Статус на часовете</h2>
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
          <p className="page-card-label">На място</p>
          <h2>Какво подчертаваме още отсега</h2>
          <ul className="page-list">
            {businessProfile.visitNotes.bg.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </article>
      </section>

      <nav className="mobile-quickbar" aria-label="Бързи действия">
        {primaryActions.map((action) => (
          <ActionLink
            key={action.href}
            href={action.href}
            label={action.label}
            className="mobile-quickbar-link"
            external={"external" in action && action.external}
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
