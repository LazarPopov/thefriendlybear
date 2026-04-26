import { ActionLink } from "@/components/action-link";
import { getBgPrimaryActions, getBusinessProfileData } from "@/lib/business-profile-module";
import { buildActionTracking } from "@/lib/tracking";

type TouristAudience = "italian" | "spanish" | "greek";

const touristConfigs: Record<
  TouristAudience,
  {
    eyebrow: string;
    title: string;
    lead: string;
    highlights: Array<{ title: string; text: string }>;
    checklist: string[];
    reassurance: string[];
  }
> = {
  italian: {
    eyebrow: "Италиански посетители",
    title: "Приветливо място в София за италиански посетители",
    lead:
      "Уютно място в центъра на София за италиански гости, с тайна градина, крафт бира, вегетариански избор и екип, който говори английски.",
    highlights: [
      {
        title: "Централно и лесно за намиране",
        text: "Славянска 23 стои отпред още от първия екран, така че локацията да е ясна веднага."
      },
      {
        title: "Меню на английски",
        text: "Отворете менюто от телефона си и вижте сезонните ястия, алергените и вегетарианските предложения преди поръчка."
      },
      {
        title: "Комфорт и приветливост",
        text: "Градината и топлите вътрешни зали правят ресторанта спокоен след разходка из София."
      }
    ],
    checklist: [
      "Отворете менюто първо, ако искате да видите сезонните предложения.",
      "Проверете резервациите, ако търсите най-бързия текущ booking канал.",
      "Използвайте упътванията за най-точния маршрут до Славянска 23."
    ],
    reassurance: [
      "Вегетарианските опции вече се виждат в менюто.",
      "Страницата е написана така, че да се усеща welcoming за международни посетители.",
      "Най-важните действия остават на един-два тапа разстояние."
    ]
  },
  spanish: {
    eyebrow: "Испански посетители",
    title: "Приветлив ресторант в София за испански посетители",
    lead:
      "Приветлив ресторант близо до центъра на София със скрита градина, бавно готвени меса, вегетариански ястия и екип, който говори английски.",
    highlights: [
      {
        title: "Лесна спирка в центъра",
        text: "Намираме се близо до Народния театър, удобно за вечеря след разходка из града."
      },
      {
        title: "Уверение за менюто",
        text: "HTML менюто прави ястията, алергените и вегетарианските опции по-лесни за преглед от телефон."
      },
      {
        title: "Ясна следваща стъпка",
        text: "Отворете менюто, обадете се за резервация или пуснете упътвания към Славянска 23."
      }
    ],
    checklist: [
      "Прегледайте менюто, ако искате да сравните ястията преди посещение.",
      "Отворете упътванията, когато сте готови да тръгнете към центъра на София.",
      "Използвайте страницата за резервации, за да видите текущия booking setup."
    ],
    reassurance: [
      "Вегетарианските опции не са скрити дълбоко в сайта.",
      "Friendly service е част от тона и conversion пътя.",
      "Централната локация в София остава видима във всяка ключова секция."
    ]
  },
  greek: {
    eyebrow: "Гръцки посетители",
    title: "Централен ресторант в София за гръцки посетители",
    lead:
      "Топъл ресторант в София за гръцки гости, с централна локация, истинско гостоприемство, вегетариански опции и меню на английски.",
    highlights: [
      {
        title: "Ясна локация",
        text: "Страницата свързва бранда директно със Славянска 23, така че ресторантът да се позиционира лесно в София."
      },
      {
        title: "Приветливо обслужване",
        text: "Екипът говори английски и може да помогне с менюто, упътванията или резервацията."
      },
      {
        title: "Полезна от мобилен телефон",
        text: "Посетителят може бързо да премине от discovery към упътвания или резервации от телефон."
      }
    ],
    checklist: [
      "Започнете с менюто, за да видите актуалните сезонни предложения.",
      "Отворете упътванията, когато сте готови за маршрут до ресторанта.",
      "Използвайте страницата за резервации, ако търсите текущата booking опция."
    ],
    reassurance: [
      "Вегетарианските опции вече присъстват в менюто.",
      "Страницата е умишлено проста и welcoming.",
      "Най-важните действия остават лесно достъпни на мобилен телефон."
    ]
  }
};

type BulgarianTouristLandingPageProps = {
  audience: TouristAudience;
};

export async function BulgarianTouristLandingPage({ audience }: BulgarianTouristLandingPageProps) {
  const businessProfile = await getBusinessProfileData();
  const config = touristConfigs[audience];
  const primaryActions = getBgPrimaryActions(businessProfile);
  const heroActions = [
    { href: "/bg/menu", label: "Меню", kind: "menu" as const, external: false },
    { href: "/bg/reservations", label: "Резервации", kind: "reservations" as const, external: false },
    { href: businessProfile.mapUrl, label: "Как да стигнете", kind: "directions" as const, external: true }
  ];

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">{config.eyebrow}</p>
        <h1>{config.title}</h1>
        <p className="page-lead">{config.lead}</p>

        <div className="page-tags" aria-label="Основни сигнали">
          <span>{businessProfile.address.bg}</span>
          <span>{businessProfile.area.bg}</span>
          <span>Вегетариански опции</span>
          <span>Любезно обслужване</span>
        </div>

        <div className="actions">
          {heroActions.map((action) => (
            <ActionLink
              key={action.href}
              href={action.href}
              label={action.label}
              external={action.external}
              tracking={buildActionTracking({
                kind: action.kind,
                locale: "bg",
                location: "tourist_page_hero",
                label: action.label,
                target: action.href,
                external: action.external
              })}
            />
          ))}
        </div>
      </section>

      <section className="page-grid page-grid-three">
        {config.highlights.map((item) => (
          <article key={item.title} className="page-card">
            <p className="page-card-label">{item.title}</p>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Полезни първи стъпки</p>
          <h2>Какво може да направи посетителят веднага</h2>
          <ol className="page-list page-list-numbered">
            {config.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>

        <article className="page-card">
          <p className="page-card-label">Уверение</p>
          <h2>Защо страницата е подредена така</h2>
          <ul className="page-list">
            {config.reassurance.map((item) => (
              <li key={item}>{item}</li>
            ))}
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
