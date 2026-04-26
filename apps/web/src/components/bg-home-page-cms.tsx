import { ActionLink } from "@/components/action-link";
import { BrandShowcasePanel } from "@/components/brand-showcase-panel";
import { CopyAddressButton } from "@/components/copy-address-button";
import { DeferredMapEmbed } from "@/components/deferred-map-embed";
import { HomeVenueGallery } from "@/components/home-venue-gallery";
import { getBusinessProfileData, getPhoneHref } from "@/lib/business-profile-module";
import { buildActionTracking, type BusinessActionKind } from "@/lib/tracking";

type HomeAction = {
  href: string;
  label: string;
  kind: BusinessActionKind;
  external?: boolean;
};

const localStories = [
  {
    title: "Най-доброто бавно печено агнешко и свински уши в центъра на София",
    text:
      "Елате за бавно печени меса от български качествени производители, 20 вида ракии, богато меню с напитки с 0% алкохол и сезонни предложения, които се сменят всяка седмица."
  },
  {
    title: "Тиха пауза в сърцето на София за дълги разговори",
    text:
      "Независимо дали сте в градината, или в някоя от залите - всяко кътче ви дава възможност да забавите темпото след дълъг ден, да се видите с приятели и да останете за малко по-дълго."
  },
  {
    title: "Ясно структурирано меню за всеки вкус",
    text:
      "Менюто ни е разделено по категории, така че всеки на масата да избере спокойно това, което обича."
  }
] as const;

const trustPillars = [
  {
    label: "В сърцето на София",
    text: "Тихо бягство на ул. Славянска 23, само на няколко крачки от градския ритъм."
  },
  {
    label: "Винаги свежо",
    text: "Разгледайте сезонното ни меню, обновявано редовно с локални продукти и характерни вкусове."
  },
  {
    label: "Лесно посещение",
    text: "Обаждане с едно докосване за резервация и екип, готов да ви посрещне с усмивка."
  }
] as const;

function getMobileQuickbarActions(mapUrl: string, phoneHref: string | null): HomeAction[] {
  return [
    { href: "/bg/menu", label: "Меню", kind: "menu" },
    ...(phoneHref ? [{ href: phoneHref, label: "Резервация", kind: "phone" as const }] : []),
    { href: mapUrl, label: "Упътвания", kind: "directions", external: true }
  ];
}

export async function BulgarianHomePageCms() {
  const businessProfile = await getBusinessProfileData();

  const phoneHref = getPhoneHref(businessProfile);
  const quickbarActions = getMobileQuickbarActions(businessProfile.mapUrl, phoneHref);
  const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(businessProfile.mapsLabel.bg)}&output=embed`;

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
            <span>📍 Славянска 23, София</span>
            <span>Градина</span>
            <span>Отопляема зона за пушачи</span>
            <span>Бавно готвени меса</span>
            <span>Вегетариански избор</span>
            <span>Pet friendly</span>
          </div>

          <blockquote className="home-social-proof">
            “Мечка с две сърца... барът с най-добрата енергия, в който сме влизали от години.”
            <br />
            <strong>— Списание Програмата</strong>
          </blockquote>
        </div>
      </section>

      <section className="home-info-grid" aria-label="Защо да посетите The Friendly Bear">
        {trustPillars.map((item) => (
          <article key={item.label} className="home-info-card">
            <p className="home-card-label">{item.label}</p>
            <p className="home-card-text">{item.text}</p>
          </article>
        ))}
      </section>

      <HomeVenueGallery locale="bg" />

      <section className="home-section home-discovery-section">
        <div className="home-section-heading">
          <p className="eyebrow">The Friendly Bear Experience</p>
          <h2>Защо да изберете The Friendly Bear?</h2>
          <p>Независимо дали сте от квартала, или просто се разхождате из София, при нас винаги има място за вас.</p>
        </div>

        <div className="home-answer-grid">
          {localStories.map((item) => (
            <article key={item.title} className="home-answer-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-visit-panel">
        <div className="home-visit-copy">
          <p className="eyebrow">Посетете ни</p>
          <h2>{businessProfile.address.bg}</h2>
          <p>Запазете адреса, отворете упътванията или се обадете. Ние сме на Славянска 23, в центъра на София.</p>
          <CopyAddressButton address={businessProfile.address.bg} label="Копирай адреса" copiedLabel="Копирано" />
        </div>

        <div className="home-visit-actions">
          {quickbarActions.map((action) => (
            <ActionLink
              key={action.href}
              href={action.href}
              label={action.label}
              className="home-visit-link"
              external={Boolean(action.external)}
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

        <div className="home-visit-map-card" aria-label="Карта до The Friendly Bear Sofia">
          <DeferredMapEmbed
            src={mapEmbedSrc}
            title="The Friendly Bear Sofia map"
            loadLabel={"\u0417\u0430\u0440\u0435\u0434\u0438 \u043a\u0430\u0440\u0442\u0430\u0442\u0430"}
          />
        </div>
      </section>

      <nav className="mobile-quickbar" aria-label="Бързи действия">
        {quickbarActions.map((action) => (
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
