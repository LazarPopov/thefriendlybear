import { ActionLink } from "@/components/action-link";
import { businessProfile, getBgPrimaryActions } from "@/lib/business-profile-live";
import { buildActionTracking } from "@/lib/tracking";

const decisionSignals = [
  {
    title: "Уютна атмосфера",
    text: "Гостите най-често запомнят спокойната атмосфера, камината и усещането за място, в което можеш да останеш по-дълго."
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

const connectorStatus = [
  { label: "Google review модул", status: "Чака одобрен достъп" },
  { label: "TripAdvisor откъси", status: "Чака одобрен източник" },
  { label: "Meta social feed", status: "Чака одобрен API достъп" },
  { label: "Keyword филтриране", status: "Готово във frontend структурата" },
  { label: "HTML меню и контакти", status: "Активни сега" }
] as const;

const keywordThemes = ["уютно", "craft beer", "любезно обслужване", "вегетариански опции", "център на София"] as const;

export function BulgarianReviewsPageLive() {
  const primaryActions = getBgPrimaryActions();

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Отзиви и социално доказателство</p>
        <h1>Review-ready сигнали за The Friendly Bear Sofia</h1>
        <p className="page-lead">
          Тази страница е подготвена за одобрени Google отзиви, TripAdvisor откъси и лек Meta social поток. Докато live
          конекторите още не са активни, държим страницата честна и се фокусираме върху сигналите, които реално движат
          решението за посещение.
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
          <p className="page-card-label">Текущ статус</p>
          <h2>Какво review слоят може да публикува днес</h2>
          <ul className="status-list">
            {connectorStatus.map((item) => (
              <li key={item.label} className="status-row">
                <span>{item.label}</span>
                <strong>{item.status}</strong>
              </li>
            ))}
          </ul>
          <p className="page-note">{businessProfile.statusMessages.bg}</p>
        </article>

        <article className="page-card">
          <p className="page-card-label">За какво служи тази страница</p>
          <h2>Полезна и за търсене, и за реален избор на ресторант</h2>
          <ul className="page-list">
            <li>Да показва най-силните сигнали за атмосфера и комфорт, когато review източниците са свързани.</li>
            <li>Да поддържа keyword филтри като уютно, craft beer и вегетариански опции.</li>
            <li>Да дава бърз път от социално доказателство към меню, контакт и резервации.</li>
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
