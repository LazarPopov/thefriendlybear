import Link from "next/link";
import { BrandShowcasePanel } from "@/components/brand-showcase-panel";
import { businessProfile, getBgPrimaryActions } from "@/lib/business-profile";

const localAnswers = [
  {
    question: "Най-доброто бавно печено агнешко и свински уши в центъра на София",
    answer:
      "Елате за бавно печени меса от български качествени производители, 20 вида ракии, богато меню с напитки с 0% алкохол и сезонни предложения, които се сменят всяка седмица."
  },
  {
    question: "Тиха пауза в сърцето на София за дълги разговори",
    answer:
      "Независимо дали сте в градината, или в някоя от залите - всяко кътче ви дава възможност да забавите темпото след дълъг ден, да се видите с приятели и да останете за малко по-дълго."
  },
  {
    question: "Ясно структурирано меню за всеки вкус",
    answer:
      "Менюто ни е разделено по категории, така че всеки на масата да избере спокойно това, което обича."
  }
] as const;

function renderAction(
  action: { href: string; label: string; external?: boolean },
  className?: string
) {
  if ("external" in action && action.external) {
    return (
      <a
        key={action.href}
        href={action.href}
        className={className}
        target="_blank"
        rel="noreferrer"
      >
        {action.label}
      </a>
    );
  }

  return (
    <Link key={action.href} href={action.href} className={className}>
      {action.label}
    </Link>
  );
}

export function BulgarianHomePage() {
  const primaryActions = getBgPrimaryActions();

  return (
    <main className="home-page">
      <section className="home-hero-panel">
        <div className="home-copy">
          <h1>Уютна градска бърлога в къща от 1923 г.</h1>
          <BrandShowcasePanel locale="bg" />
          <p className="home-lead">
            Скрит зад хотел „Радисън“, ресторант „The Friendly Bear“ е кътче, направено почти изцяло на ръка. Близо 7
            месеца създавахме нашите места за хранене, лампи, бар, декорации... Дадохме живот на стари предмети, за да
            ги превърнем в място, което се усеща като дом.
          </p>

          <div className="home-tags" aria-label="Основни акценти">
            <span>Славянска 23</span>
            <span>Център на София</span>
            <span>Бавно готвени меса</span>
            <span>Отопляема зона за пушачи</span>
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
          <p>Независимо дали сте от квартала, или просто се разхождате из София, при нас винаги има място за вас.</p>
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
          <h2>Slavyanska 23 / ул. Славянска 23</h2>
          <p>Запазете адреса, отворете упътванията или се обадете. Ние сме на Славянска 23, в центъра на София.</p>
        </div>

        <div className="home-visit-actions">
          {primaryActions.map((action) => renderAction(action, "home-visit-link"))}
        </div>
      </section>

      <nav className="mobile-quickbar" aria-label="Бързи действия">
        {primaryActions.map((action) => renderAction(action, "mobile-quickbar-link"))}
      </nav>
    </main>
  );
}
