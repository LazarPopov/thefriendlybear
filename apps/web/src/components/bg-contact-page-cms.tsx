import Image from "next/image";
import { ActionLink } from "@/components/action-link";
import {
  getBgPrimaryActions,
  getBusinessProfileData,
  getPhoneHref,
  getOpeningHoursRows
} from "@/lib/business-profile-module";
import { contactFaqItems } from "@/lib/contact-faq";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import { buildActionTracking } from "@/lib/tracking";

const contactHighlights = [
  {
    title: "Място с история в центъра",
    text: "Намираме се близо до хотел „Радисън“, на 2 минути пеша от Народния театър."
  },
  {
    title: "Звъннете ни за резервация",
    text: "В момента резервациите минават по телефон, за да ви помогнем с място в градината, в отопляемата зона за пушачи или вътре в някоя от залите."
  },
  {
    title: "Лесно посещение",
    text: "Карти, кеш, кучета, английски език и работно време - най-важното е ясно още преди да тръгнете."
  }
] as const;

const socialLinks = [
  {
    label: "Instagram: @friendlybear.bg",
    href: "https://www.instagram.com/friendlybear.bg/"
  },
  {
    label: "Facebook: The Friendly Bear Sofia",
    href: "https://www.facebook.com/friendlybear.bg/"
  }
] as const;

export async function BulgarianContactPageCms() {
  const [businessProfile, toggles] = await Promise.all([
    getBusinessProfileData(),
    getModuleTogglesData()
  ]);

  const primaryActions = filterActionsByModuleToggles(getBgPrimaryActions(businessProfile), toggles);
  const openingHoursRows = getOpeningHoursRows("bg", businessProfile);
  const phoneHref = getPhoneHref(businessProfile);

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Контакти и посещение</p>
        <h1>Контакт, упътвания и малките важни неща преди посещение</h1>
        <p className="page-lead">
          Скрити на ул. Славянска 23, нашата бърлога от 1923 г. ви очаква. Тук ще намерите
          упътвания, работно време и отговори на най-честите въпроси.
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
          <p className="page-card-label">Контакт и социални мрежи</p>
          <h2>Свържете се с нас</h2>
          <div className="contact-link-list" aria-label="Контакт и социални профили">
            {phoneHref ? (
              <ActionLink
                href={phoneHref}
                label={`📞 Резервирайте маса: ${businessProfile.phoneDisplay ?? "+359 87 612 2114"}`}
                className="contact-direct-link"
                tracking={buildActionTracking({
                  kind: "phone",
                  locale: "bg",
                  location: "contact_connect_card",
                  label: "Резервирайте маса",
                  target: phoneHref,
                  external: false
                })}
              />
            ) : null}
            {socialLinks.map((link) => (
              <a key={link.href} className="contact-direct-link" href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
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
          <p className="page-card-label">Ski Secret</p>
          <h2>Ски-вратите</h2>
          <Image
            src="/images/skis.jpg"
            alt="Уникални плъзгащи се врати от стари ски в The Friendly Bear София"
            width={720}
            height={480}
            className="contact-secret-image"
            sizes="(max-width: 768px) 100vw, 46vw"
            priority
          />
          <p className="page-note">Малък визуален жокер от нашата къща от 1923-та, преди да дойдете.</p>
        </article>
      </section>

      <section className="home-section contact-faq" aria-labelledby="contact-faq-title">
        <div className="home-section-heading">
          <p className="eyebrow">FAQ</p>
          <h2 id="contact-faq-title">Полезно преди да дойдете</h2>
          <p>Кратки отговори за адрес, плащане, паркиране, кучета и тоалетната със ски вратите.</p>
        </div>

        <div className="contact-faq-grid">
          {contactFaqItems.bg.map((item, index) => (
            <details key={item.question} className={`contact-faq-item ${index === 0 ? "contact-faq-featured" : ""}`}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
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
