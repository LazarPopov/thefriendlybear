import { ActionLink } from "@/components/action-link";
import { getBusinessProfileData, getEnPrimaryActions } from "@/lib/business-profile-module";
import { buildActionTracking } from "@/lib/tracking";

const touristCards = [
  {
    slug: "italian",
    title: "Italian visitors",
    text: "Focused on friendly service, seasonal dishes, and a comfortable discovery path to the menu and reservations."
  },
  {
    slug: "spanish",
    title: "Spanish visitors",
    text: "Built for quick restaurant discovery near the center, with vegetarian reassurance and easy next actions."
  },
  {
    slug: "greek",
    title: "Greek visitors",
    text: "Highlights central Sofia access, welcoming service, and a simple route to menu, contact, and booking."
  }
] as const;

const sharedSignals = [
  "Fast path to the menu",
  "Central Sofia location",
  "Vegetarian reassurance",
  "Friendly service tone"
] as const;

export async function EnglishTouristsPageLive() {
  const businessProfile = await getBusinessProfileData();
  const primaryActions = getEnPrimaryActions(businessProfile);

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Tourist pages</p>
        <h1>Landing pages for international visitors in Sofia</h1>
        <p className="page-lead">
          These pages are designed for discovery intent from international visitors who want a clear answer fast:
          where to eat, how to get there, whether the place feels welcoming, and how quickly they can check the menu.
        </p>

        <div className="page-tags" aria-label="Tourist page signals">
          <span>{businessProfile.address.en}</span>
          <span>{businessProfile.area.en}</span>
          <span>International-friendly flow</span>
        </div>

        <div className="actions">
          <ActionLink
            href="/en/menu"
            label="Menu"
            tracking={buildActionTracking({
              kind: "menu",
              locale: "en",
              location: "tourists_index_hero",
              label: "Menu",
              target: "/en/menu"
            })}
          />
          <ActionLink
            href="/en/reservations"
            label="Reservations"
            tracking={buildActionTracking({
              kind: "reservations",
              locale: "en",
              location: "tourists_index_hero",
              label: "Reservations",
              target: "/en/reservations"
            })}
          />
          <ActionLink
            href={businessProfile.mapUrl}
            label="Directions"
            external
            tracking={buildActionTracking({
              kind: "directions",
              locale: "en",
              location: "tourists_index_hero",
              label: "Directions",
              target: businessProfile.mapUrl,
              external: true
            })}
          />
        </div>
      </section>

      <section className="page-grid page-grid-three">
        {touristCards.map((item) => (
          <article key={item.slug} className="page-card">
            <p className="page-card-label">{item.title}</p>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
            <ActionLink
              href={`/en/tourists/${item.slug}`}
              label={`Open ${item.title.toLowerCase()} page`}
              className="page-inline-link"
              tracking={buildActionTracking({
                kind: "contact",
                locale: "en",
                location: "tourists_index_grid",
                label: `Open ${item.title.toLowerCase()} page`,
                target: `/en/tourists/${item.slug}`
              })}
            />
          </article>
        ))}
      </section>

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Shared conversion goals</p>
          <h2>What every tourist page is trying to make easier</h2>
          <ul className="page-list">
            {sharedSignals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="page-card">
          <p className="page-card-label">Why this matters</p>
          <h2>Discovery pages work best when they stay lightweight</h2>
          <p>
            The goal is not to overload the visitor. It is to give them enough reassurance about location, service,
            and food options so they can move quickly to menu, contact, or reservations.
          </p>
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
