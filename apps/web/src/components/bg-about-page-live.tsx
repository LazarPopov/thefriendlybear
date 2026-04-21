import { ActionLink } from "@/components/action-link";
import { getBgPrimaryActions, getBusinessProfileData } from "@/lib/business-profile-module";
import { springMenuContent } from "@/lib/spring-menu-content";
import { buildActionTracking } from "@/lib/tracking";

const aboutHighlights = [
  {
    title: "История на Славянска 23",
    text: "Къщата от 1923 г. пази усещането за стара София, но посреща гостите с градина, камина и топла бърложна атмосфера."
  },
  {
    title: "Сезонно меню",
    text: "Менюто събира бавно печени специалитети, свежи салати, вегетариански избор и ясни цени за спокойна вечеря."
  },
  {
    title: "Уютно и лесно за ползване",
    text: "Тонът и структурата са направени така, че човек бързо да разбере къде сте, какво предлагате и как да стигне до вас."
  }
] as const;

const storyPoints = [
  "Градината е спокойна за дълги вечери през топлите месеци.",
  "Камината и интериорът правят мястото уютно и през зимата.",
  "Екипът помага с препоръки за ястия, упътвания и резервации."
] as const;

export async function BulgarianAboutPageLive() {
  const businessProfile = await getBusinessProfileData();
  const primaryActions = getBgPrimaryActions(businessProfile);
  const menu = springMenuContent.bg;
  const featuredItems = [
    { section: menu.sections[2].title, item: menu.sections[2].items[0] },
    { section: menu.sections[1].title, item: menu.sections[1].items[0] },
    { section: menu.sections[2].title, item: menu.sections[2].items[2] }
  ];

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">За нас</p>
        <h1>За The Friendly Bear Sofia</h1>
        <p className="page-lead">
          Спасена от събаряне и възстановена на ръка, нашата къща от 1923 г. е място за градина, камина,
          бавно печена храна и спокойни срещи в центъра на София.
        </p>

        <div className="page-tags" aria-label="Основни акценти">
          <span>{businessProfile.address.bg}</span>
          <span>{businessProfile.area.bg}</span>
          <span>Сезонно меню</span>
          <span>Уютна атмосфера</span>
        </div>

        <div className="actions">
          {primaryActions.slice(0, 4).map((action) => (
            <ActionLink
              key={action.href}
              href={action.href}
              label={action.label}
              external={Boolean(action.external)}
              tracking={buildActionTracking({
                kind: action.kind,
                locale: "bg",
                location: "about_hero",
                label: action.label,
                target: action.href,
                external: Boolean(action.external)
              })}
            />
          ))}
        </div>
      </section>

      <section className="page-grid page-grid-three">
        {aboutHighlights.map((item) => (
          <article key={item.title} className="page-card">
            <p className="page-card-label">{item.title}</p>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Защо хората се връщат</p>
          <h2>Уют, сезонна кухня и лесно посрещане</h2>
          <ul className="page-list">
            {storyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>

        <article className="page-card">
          <p className="page-card-label">Контекст на локацията</p>
          <h2>{businessProfile.address.bg}</h2>
          <p>
            Намираме се на Славянска 23, близо до Народния театър, но достатъчно скрити, за да усетите спокойствие
            още щом прекрачите прага.
          </p>
          <ActionLink
            href={businessProfile.mapUrl}
            label="Отвори упътвания"
            className="page-inline-link"
            external
            tracking={buildActionTracking({
              kind: "directions",
              locale: "bg",
              location: "about_location_card",
              label: "Отвори упътвания",
              target: businessProfile.mapUrl,
              external: true
            })}
          />
        </article>
      </section>

      <section className="page-grid page-grid-three">
        {featuredItems.map(({ section, item }) => {
          const meta = [item.serving, item.calories, item.priceEuro, item.priceBgn].filter(Boolean).join(" / ");

          return (
            <article key={`${section}-${item.name}`} className="page-card">
              <p className="page-card-label">{section}</p>
              <h2>{item.name}</h2>
              {item.description?.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {item.allergens ? <p className="page-note">{item.allergens}</p> : null}
              {meta ? <p className="page-note">{meta}</p> : null}
            </article>
          );
        })}
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
