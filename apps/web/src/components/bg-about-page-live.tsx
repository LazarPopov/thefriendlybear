import { ActionLink } from "@/components/action-link";
import { getBgPrimaryActions, getBusinessProfileData } from "@/lib/business-profile-module";
import { springMenuContent } from "@/lib/spring-menu-content";
import { buildActionTracking } from "@/lib/tracking";

const aboutHighlights = [
  {
    title: "История на Славянска 23",
    text: "Къщата от 1923 г. пази усещането за стара София, но посреща гостите с градина, топли вътрешни зали и уют като в горска хижа."
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
  "Отопляемата закрита част на градината е удобна за пушачите през зимата.",
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
        <h1>Градски уют в 100-годишна къща на ул. „Славянска“ 23</h1>
        <p className="page-lead">
          Спасен от събаряне и възстановен на ръка, нашият дом от 1923 г. е проект, създаден с много любов и внимание
          към детайла. The Friendly Bear е мястото, където историята на стара София среща уюта на горската хижа.
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
          <h2>Скрита градина и уют като в горска хижа</h2>
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
            Ще ни откриете в центъра на София, близо до хотел „Радисън“ и Народния театър. Ние сме част от градския
            ритъм, но достатъчно скрити, за да усетите спокойствие още щом прекрачите прага на мечешката ни бърлога.
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
          const meta = [item.serving, item.priceEuro, item.priceBgn].filter(Boolean).join(" / ");

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
