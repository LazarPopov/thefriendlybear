import Image from "next/image";
import { ActionLink } from "@/components/action-link";
import {
  getBusinessProfileData,
  getEnPrimaryActions,
  getPhoneHref,
  getOpeningHoursRows
} from "@/lib/business-profile-module";
import { contactFaqItems } from "@/lib/contact-faq";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import { buildActionTracking } from "@/lib/tracking";

const contactHighlights = [
  {
    title: "A Heritage Spot in the Center",
    text: "We are located close to the Radisson hotel, a 2-minute walk from the National Theatre."
  },
  {
    title: "Call to reserve",
    text: "Reservations are currently handled by phone, so we can help you choose a place in the garden, in the heated smoking area, or inside one of the dining rooms."
  },
  {
    title: "Easy visit",
    text: "Cards, cash, pet-friendly seating, English-speaking staff, and clear opening hours are all covered before you arrive."
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

export async function EnglishContactPageCms() {
  const [businessProfile, toggles] = await Promise.all([
    getBusinessProfileData(),
    getModuleTogglesData()
  ]);

  const primaryActions = filterActionsByModuleToggles(getEnPrimaryActions(businessProfile), toggles);
  const openingHoursRows = getOpeningHoursRows("en", businessProfile);
  const phoneHref = getPhoneHref(businessProfile);

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
          <p className="page-card-label">Connect & Social</p>
          <h2>Connect with the Bear</h2>
          <div className="contact-link-list" aria-label="Contact and social links">
            {phoneHref ? (
              <ActionLink
                href={phoneHref}
                label={`📞 Call for a table: ${businessProfile.phoneDisplay ?? "+359 87 612 2114"}`}
                className="contact-direct-link"
                tracking={buildActionTracking({
                  kind: "phone",
                  locale: "en",
                  location: "contact_connect_card",
                  label: "Call for a table",
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
          <p className="page-card-label">Ski Secret</p>
          <h2>Vintage ski doors</h2>
          <Image
            src="/images/skis.jpg"
            alt="Unique sliding doors made of vintage skis at The Friendly Bear Sofia"
            width={720}
            height={480}
            className="contact-secret-image"
            sizes="(max-width: 768px) 100vw, 46vw"
            priority
          />
          <p className="page-note">A playful 1923 cabin detail, kept here as a visual clue before you arrive.</p>
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
