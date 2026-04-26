import Link from "next/link";
import { ActionLink } from "@/components/action-link";
import { ReviewSnippetsShowcase } from "@/components/review-snippets-showcase";
import { getBgPrimaryActions, getBusinessProfileData } from "@/lib/business-profile-module";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import { buildActionTracking } from "@/lib/tracking";

const keywordThemes = ["висока оценка", "бавно готвени меса", "крафт бира", "уютна бърлога", "център на София"] as const;
const writeReviewUrl = "https://search.google.com/local/writereview?placeid=ChIJ1_FHY3SFqkAR2aUhguBOwqQ";

export async function BulgarianReviewsPageCms() {
  const [businessProfile, toggles] = await Promise.all([
    getBusinessProfileData(),
    getModuleTogglesData()
  ]);

  const primaryActions = filterActionsByModuleToggles(getBgPrimaryActions(businessProfile), toggles);

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Отзиви и оценки</p>
        <h1>Какво казват нашите гости</h1>
        <p className="page-lead">
          В основата на всичко, което правим, е преживяването на нашите гости. От топлината на
          градината до първата хапка от нашите бавно готвени меса - ето реалните истории на хората, които посещават
          нашата бърлога.
        </p>

        <div className="page-tags" aria-label="Теми в отзивите">
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
          <p className="page-card-label">Преживяване</p>
          <h2>Защо гостите се връщат</h2>
          <p>
            Гордеем се с оценката си 4.5/5. Тя отразява вниманието ни към свежи продукти, локална
            крафт бира и приветлива атмосфера на ул. Славянска 23.
          </p>
          <a className="page-inline-link" href={businessProfile.mapUrl} target="_blank" rel="noreferrer">
            Вижте профила ни в Google
          </a>
        </article>

        <article className="page-card">
          <p className="page-card-label">Атмосфера</p>
          <h2>Място за истории</h2>
          <p>
            Независимо дали е първа среща в градината или семейна вечеря в някоя от залите, гостите често
            споменават добрата енергия, която прави The Friendly Bear различен.
          </p>
          <Link className="page-inline-link" href="/bg/contact">
            Открийте нашите интериорни детайли, като плъзгащите се ски-врати, в страницата Контакти.
          </Link>
        </article>
      </section>

      <ReviewSnippetsShowcase locale="bg" />

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Помогнете на следващия гост</p>
          <h2>Споделете своя Friendly Bear момент</h2>
          <p>
            Ако градината, уютът или бавно готвените меса са направили вечерта ви по-хубава,
            кратък Google отзив помага повече хора да ни открият.
          </p>
          <a className="page-inline-link" href={writeReviewUrl} target="_blank" rel="noreferrer">
            Напишете отзив в Google
          </a>
        </article>

        <article className="page-card">
          <p className="page-card-label">Оценка от гости</p>
          <h2>4.5/5 от 1361 Google отзива</h2>
          <p>
            Числото е важно, но историите са още по-важни: топло обслужване, добра храна и уютно
            софийско място, което хората помнят.
          </p>
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
