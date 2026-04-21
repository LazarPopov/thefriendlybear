import { ActionLink } from "@/components/action-link";
import { ReviewSnippetsShowcase } from "@/components/review-snippets-showcase";
import { getBgPrimaryActions, getBusinessProfileData } from "@/lib/business-profile-module";
import { buildActionTracking } from "@/lib/tracking";

const keywordThemes = ["уютно", "обслужване", "храна", "без резервация", "център на София"] as const;

export async function BulgarianReviewsPageCurated() {
  const businessProfile = await getBusinessProfileData();
  const primaryActions = getBgPrimaryActions(businessProfile);

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Отзиви на гости</p>
        <h1>Истории от гости на The Friendly Bear Sofia</h1>
        <p className="page-lead">
          Прочетете реални впечатления от гости, които са дошли за храна, обслужване и атмосфера, а са открили място,
          което искат да препоръчат.
        </p>

        <div className="page-tags" aria-label="Review сигнали">
          {keywordThemes.map((theme) => (
            <span key={theme}>{theme}</span>
          ))}
        </div>

        <div className="actions">
          {primaryActions
            .filter((action) => action.kind !== "directions")
            .slice(0, 3)
            .map((action) => (
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

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Любими моменти</p>
          <h2>Защо хората ни препоръчват</h2>
          <p>
            Гостите често споменават топлата атмосфера, искреното обслужване и храната, която превръща случайното
            посещение в добро откритие.
          </p>
        </article>

        <article className="page-card">
          <p className="page-card-label">Какво показват откъсите</p>
          <h2>Сигнали, които помагат на реалния избор</h2>
          <ul className="page-list">
            <li>Топла атмосфера и любезно обслужване.</li>
            <li>Силна оценка за храната и цялостното преживяване.</li>
            <li>Положителен сигнал и за гости без предварителна резервация.</li>
          </ul>
        </article>
      </section>

      <ReviewSnippetsShowcase locale="bg" />

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
