import Image from "next/image";
import { ActionLink } from "@/components/action-link";
import {
  getBgPrimaryActions,
  getBusinessProfileData,
  getEnPrimaryActions
} from "@/lib/business-profile-module";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import type { SiteLocale } from "@/lib/site";
import { buildActionTracking } from "@/lib/tracking";

type TouristsPageCmsProps = {
  locale: SiteLocale;
};

const languageGuides = [
  {
    id: "italian",
    href: "/it/ristorante-sofia-centro",
    title: "Per i nostri amici italiani",
    text:
      "Un angolo accogliente con giardino segreto e cucina autentica. Parliamo inglese e il nostro menù è pronto per voi."
  },
  {
    id: "spanish",
    href: "/es/restaurante-centro-sofia",
    title: "Para nuestros visitantes españoles",
    text:
      "Un restaurante acogedor en el centro de Sofía, con carnes cocinadas lentamente, ensaladas frescas y opciones vegetarianas."
  },
  {
    id: "greek",
    href: "/el/estiatorio-sofia-kentro",
    title: "Για τους Έλληνες επισκέπτες μας",
    text:
      "Ένα κεντρικό εστιατόριο στη Σόφια με υπέροχο κήπο, παραδοσιακές γεύσεις και φιλικό προσωπικό που μιλάει αγγλικά."
  }
] as const;

const travelerTips = {
  en: [
    {
      icon: "card",
      title: "Payments",
      text: "We accept all major credit cards and Revolut."
    },
    {
      icon: "paw",
      title: "Pets",
      text: "We are 100% pet friendly. Bring your furry travel companion!"
    },
    {
      icon: "tip",
      title: "Etiquette",
      text: "Tipping is customary, approximately 10%. Smoking is permitted in the garden only."
    },
    {
      icon: "parking",
      title: "Parking",
      text: "Located in the Green Zone with paid SMS/App parking. Free parking on Sundays."
    }
  ],
  bg: [
    {
      icon: "card",
      title: "Плащания",
      text: "Приемаме основни кредитни карти и Revolut."
    },
    {
      icon: "paw",
      title: "Домашни любимци",
      text: "Ние сме 100% pet friendly. Доведете и своя пухкав спътник!"
    },
    {
      icon: "tip",
      title: "Етикет",
      text: "Бакшишът е обичаен, около 10%. Пушенето е разрешено само в градината."
    },
    {
      icon: "parking",
      title: "Паркиране",
      text: "Намираме се в Зелена зона с платено SMS/App паркиране. В неделя паркирането е безплатно."
    }
  ]
} as const;

function getTipIcon(icon: string) {
  switch (icon) {
    case "card":
      return "💳";
    case "paw":
      return "🐾";
    case "tip":
      return "🤝";
    case "parking":
      return "🅿️";
    default:
      return "•";
  }
}

export async function TouristsPageCms({ locale }: TouristsPageCmsProps) {
  const [businessProfile, toggles] = await Promise.all([
    getBusinessProfileData(),
    getModuleTogglesData()
  ]);

  const isBg = locale === "bg";
  const primaryActions = filterActionsByModuleToggles(
    isBg ? getBgPrimaryActions(businessProfile) : getEnPrimaryActions(businessProfile),
    toggles
  );

  return (
    <main className="page-shell">
      <section className="page-hero tourists-hero">
        <div className="tourists-hero-copy">
          <p className="eyebrow">{isBg ? "Наръчник за туристи" : "Sofia visitor guide"}</p>
          <h1>
            {isBg
              ? "Добре дошли в София: вашият дом в центъра"
              : "Welcome to Sofia: Your Home in the City Center"}
          </h1>
          <p className="page-lead">
            {isBg
              ? "Посещението на нов град може да бъде объркващо. В The Friendly Bear го правим лесно. Намираме се в историческа къща от 1923 г. близо до хотел „Радисън“ и Народния театър, с топло посрещане, екип с английски език и меню с бавно готвени меса, вегетариански предложения и свежи салати."
              : "Visiting a new city can be overwhelming. At The Friendly Bear, we make it easy. Located in a historic 1923 house near the Radisson hotel and the National Theatre, we offer a warm welcome, English-speaking staff, and a menu with slow-cooked meats, vegetarian dishes, and fresh salads."}
          </p>

          <div className="page-tags" aria-label={isBg ? "Полезни сигнали за гости" : "Helpful visitor signals"}>
            <span>{isBg ? businessProfile.address.bg : businessProfile.address.en}</span>
            <span>{isBg ? "Екип с английски език" : "English-speaking staff"}</span>
            <span>{isBg ? "Скрита градина" : "Hidden garden"}</span>
            <span>Pet friendly</span>
          </div>

        </div>

        <figure className="tourists-hero-image-frame">
          <Image
            src="/images/garden_1.jpg"
            alt="Dine with locals at The Friendly Bear Sofia"
            width={900}
            height={680}
            className="tourists-hero-image"
            sizes="(max-width: 760px) 100vw, 42vw"
            priority
          />
        </figure>
      </section>

      <section className="page-grid page-grid-three" aria-label={isBg ? "Международни гидове" : "International dining guides"}>
        {languageGuides.map((guide, index) => (
          <article key={guide.id} className="page-card">
            <p className="page-card-label">
              {isBg ? `Гид ${index + 1}` : `Guide ${index + 1}`}
            </p>
            <h2>{guide.title}</h2>
            <p>{guide.text}</p>
            <ActionLink
              href={guide.href}
              label={isBg ? "Отвори гида" : "Open guide"}
              className="page-inline-link"
              tracking={buildActionTracking({
                kind: "contact",
                locale,
                location: "tourists_language_hub",
                label: guide.title,
                target: guide.href
              })}
            />
          </article>
        ))}
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <p className="eyebrow">{isBg ? "Съвети за пътуващи" : "Tips for Travelers"}</p>
          <h2>{isBg ? "Практични неща, които е добре да знаете" : "A few practical things to know before you arrive"}</h2>
          <p>
            {isBg
              ? "Искаме посещението ви да бъде спокойно още преди да прекрачите прага."
              : "We want your visit to feel easy before you even walk through the door."}
          </p>
        </div>

        <div className="page-grid page-grid-two traveler-tips-grid">
          {travelerTips[locale].map((tip) => (
            <article key={tip.title} className="page-card traveler-tip-card">
              <span className="traveler-tip-icon" aria-hidden="true">
                {getTipIcon(tip.icon)}
              </span>
              <div>
                <p className="page-card-label">{tip.title}</p>
                <p>{tip.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <nav className="mobile-quickbar" aria-label={isBg ? "Бързи действия" : "Quick actions"}>
        {primaryActions.map((action) => (
          <ActionLink
            key={action.href}
            href={action.href}
            label={action.label}
            className="mobile-quickbar-link"
            external={Boolean(action.external)}
            tracking={buildActionTracking({
              kind: action.kind,
              locale,
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
