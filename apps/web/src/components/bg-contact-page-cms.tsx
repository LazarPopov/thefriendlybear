import { ActionLink } from "@/components/action-link";
import { VenueSnapshotSection } from "@/components/venue-snapshot-section";
import {
  getBgContactStatusRows,
  getBgPrimaryActions,
  getBusinessProfileData,
  getOpeningHoursRows
} from "@/lib/business-profile-module";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import { getPageContentData } from "@/lib/page-module";
import { buildActionTracking } from "@/lib/tracking";

const contactHighlights = [
  {
    title: "Адрес",
    text: "The Friendly Bear Sofia е на ул. Славянска 23, в центъра на София."
  },
  {
    title: "Service options",
    text: "Места на открито, камина и страхотни коктейли помагат човек да разбере мястото още от първия екран."
  },
  {
    title: "Conversion ready",
    text: "Click-to-call вече е активен, работното време е публикувано, а допълнителни booking канали могат да се добавят по-късно."
  }
] as const;

export async function BulgarianContactPageCms() {
  const [businessProfile, page, toggles] = await Promise.all([
    getBusinessProfileData(),
    getPageContentData("contact", "bg"),
    getModuleTogglesData()
  ]);

  const primaryActions = filterActionsByModuleToggles(getBgPrimaryActions(businessProfile), toggles);
  const contactStatusRows = getBgContactStatusRows(businessProfile);
  const openingHoursRows = getOpeningHoursRows("bg", businessProfile);

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Контакти и посещение</p>
        <h1>{page?.title ?? "Как да стигнете до The Friendly Bear Sofia"}</h1>
        <p className="page-lead">
          {page?.intro ??
            "Извеждаме адреса, картата и най-важните действия отпред, за да може човек веднага да ви намери и да премине към меню или резервация."}
        </p>

        <div className="page-tags" aria-label="Ключова информация">
          <span>{businessProfile.address.bg}</span>
          <span>{businessProfile.area.bg}</span>
          {businessProfile.serviceOptions.bg.slice(0, 3).map((option) => (
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
        locale="bg"
        eyebrow="На място"
        title="Градина и интериор още преди да тръгнете"
        intro="Контактната страница е естествено място да покажем реалната атмосфера, защото тук човек вече проверява карта, адрес и дали мястото му пасва."
        images={[
          {
            src: "/images/garden_2.jpg",
            alt: "Градината на The Friendly Bear Sofia",
            label: "Градина"
          },
          {
            src: "/images/interior_5.jpg",
            alt: "Интериорна атмосфера в The Friendly Bear Sofia",
            label: "Интериор"
          }
        ]}
      />

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
