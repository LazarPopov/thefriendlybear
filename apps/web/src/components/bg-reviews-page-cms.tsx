import { ActionLink } from "@/components/action-link";
import { ReviewSnippetsShowcase } from "@/components/review-snippets-showcase";
import { getBgPrimaryActions, getBusinessProfileData } from "@/lib/business-profile-module";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import { getPageContentData } from "@/lib/page-module";
import { buildActionTracking } from "@/lib/tracking";

const connectorStatus = [
  { label: "Google review snippets", status: "Активни сега" },
  { label: "TripAdvisor откъси", status: "Чака одобрен източник" },
  { label: "Meta social feed", status: "Чака одобрен API достъп" },
  { label: "Keyword тагове", status: "Активни сега" },
  { label: "HTML меню и контакти", status: "Активни сега" }
] as const;

const keywordThemes = ["уютно", "обслужване", "храна", "без резервация", "център на София"] as const;

export async function BulgarianReviewsPageCms() {
  const [businessProfile, page, toggles] = await Promise.all([
    getBusinessProfileData(),
    getPageContentData("reviews", "bg"),
    getModuleTogglesData()
  ]);

  const primaryActions = filterActionsByModuleToggles(getBgPrimaryActions(businessProfile), toggles);

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Отзиви и социално доказателство</p>
        <h1>{page?.title ?? "Google review snippets за The Friendly Bear Sofia"}</h1>
        <p className="page-lead">
          {page?.intro ??
            "Страницата вече показва подбрани откъси от реални Google отзиви и подготвя място за одобрен бъдещ review source."}
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

      {page?.bodyHtml ? (
        <section className="page-grid">
          <article className="page-card cms-richtext" dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
        </section>
      ) : null}

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Текущ статус</p>
          <h2>Какво review слоят публикува сега</h2>
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



