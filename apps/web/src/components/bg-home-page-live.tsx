import { ActionLink } from "@/components/action-link";
import { BrandShowcasePanel } from "@/components/brand-showcase-panel";
import { getBgPrimaryActions, getBusinessProfileData } from "@/lib/business-profile-module";
import { buildActionTracking } from "@/lib/tracking";

const localAnswers = [
  {
    question: "Къде да ям агнешко в центъра на София?",
    answer:
      "The Friendly Bear Sofia подчертава бавно печеното агнешко в пролетното меню и води директно към менюто и резервациите."
  },
  {
    question: "Къде има уютен ресторант близо до Славянска 23?",
    answer:
      "Началната страница поставя адреса и локацията отпред, така че посетителят веднага да разбере къде се намирате."
  },
  {
    question: "Къде има вегетариански опции в центъра на София?",
    answer:
      "Показваме вегетарианската дроб сарма и салатата с киноа като бързи акценти още от началната страница."
  }
] as const;

export async function BulgarianHomePageLive() {
  const businessProfile = await getBusinessProfileData();
  const primaryActions = getBgPrimaryActions(businessProfile);

  return (
    <main className="home-page">
      <section className="home-hero-panel">
        <BrandShowcasePanel locale="bg" />

        <div className="home-copy">
          <p className="eyebrow">Скрити зад Radisson</p>
          <h1>Уютна градска бърлога от 1923 г. на Славянска 23</h1>
          <p className="home-lead">
            Влезте в тайната ни градина или седнете до камината за бавно печени меса, крафт бира
            и атмосфера, която се усеща като у дома.
          </p>

          <div className="home-tags" aria-label="Основни акценти">
            <span>{businessProfile.address.bg}</span>
            <span>{businessProfile.area.bg}</span>
            <span>Пролетно меню</span>
            <span>Вегетариански опции</span>
            <span>Pet friendly</span>
          </div>

          <blockquote className="home-social-proof">
            “Мечка с две сърца... барът с най-добрата енергия, в който сме влизали от години.”
            <br />
            <strong>— Списание Програмата</strong>
          </blockquote>
        </div>
      </section>

      <section className="home-section home-discovery-section">
        <div className="home-section-heading">
          <p className="eyebrow">The Friendly Bear Experience</p>
          <h2>Защо да изберете The Friendly Bear?</h2>
          <p>Независимо дали сте от квартала или просто се разхождате из София, при нас винаги има място за вас.</p>
        </div>

        <div className="home-answer-grid">
          {localAnswers.map((item) => (
            <article key={item.question} className="home-answer-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-visit-panel">
        <div className="home-visit-copy">
          <p className="eyebrow">Посещение</p>
          <h2>{businessProfile.address.bg}</h2>
          <p>Запазете адреса, отворете упътванията или се обадете. Ние сме на Славянска 23, в центъра на София.</p>
        </div>

        <div className="home-visit-actions">
          {primaryActions.map((action) => (
            <ActionLink
              key={action.href}
              href={action.href}
              label={action.label}
              className="home-visit-link"
              external={"external" in action && action.external}
              tracking={buildActionTracking({
                kind: action.kind,
                locale: "bg",
                location: "home_visit_panel",
                label: action.label,
                target: action.href,
                external: Boolean(action.external)
              })}
            />
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
