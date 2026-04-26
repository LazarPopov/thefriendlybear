import { ActionLink } from "@/components/action-link";
import { getBgPrimaryActions } from "@/lib/business-profile-live";
import { buildActionTracking } from "@/lib/tracking";

const decisionSignals = [
  {
    title: "Уютна атмосфера",
    text: "Гостите най-често запомнят спокойната атмосфера, градината и усещането за място, в което можеш да останеш по-дълго."
  },
  {
    title: "Крафт бира и напитки",
    text: "Крафт бирата, коктейлите и сезонните напитки са част от преживяването, особено за вечер с приятели."
  },
  {
    title: "Вегетариански опции",
    text: "Международните и локалните посетители често търсят уверение, че менюто има по-леки или вегетариански избори."
  }
] as const;

const keywordThemes = ["уютно", "craft beer", "любезно обслужване", "вегетариански опции", "център на София"] as const;

export function BulgarianReviewsPageLive() {
  const primaryActions = getBgPrimaryActions();

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Отзиви на гости</p>
        <h1>Какво казват гостите за The Friendly Bear Sofia</h1>
        <p className="page-lead">
          Гостите често запомнят спокойната градина, уютните зали, крафт бирата и усещането, че са намерили
          приветливо място в центъра на София.
        </p>

        <div className="page-tags" aria-label="Review сигнали">
          {keywordThemes.map((theme) => (
            <span key={theme}>{theme}</span>
          ))}
        </div>

        <div className="actions">
          {primaryActions.filter((action) => action.kind !== "directions").slice(0, 3).map((action) => (
            <ActionLink
              key={action.href}
              href={action.href}
              label={action.label}
              external={Boolean(action.external)}
              tracking={buildActionTracking({
                kind: action.kind,
                locale: "bg",
                location: "reviews_hero",
                label: action.label,
                target: action.href,
                external: Boolean(action.external)
              })}
            />
          ))}
        </div>
      </section>

      <section className="page-grid page-grid-three">
        {decisionSignals.map((item) => (
          <article key={item.title} className="page-card">
            <p className="page-card-label">{item.title}</p>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Любими моменти</p>
          <h2>Защо хората ни препоръчват</h2>
          <p>
            Посетителите често споменават добрата енергия, внимателното обслужване и спокойните вечери, които започват
            с кратко сядане и продължават по-дълго от планираното.
          </p>
        </article>

        <article className="page-card">
          <p className="page-card-label">Преди да дойдете</p>
          <h2>Добри знаци за реален избор на ресторант</h2>
          <ul className="page-list">
            <li>Уютът и атмосферата са важна част от преживяването на гостите.</li>
            <li>Крафт бирата, вегетарианските опции и бавно печените ястия са лесни за откриване.</li>
            <li>Менюто, контактите и резервациите остават близо, когато сте готови да дойдете.</li>
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
