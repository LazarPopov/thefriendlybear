import { ActionLink } from "@/components/action-link";
import { BrandShowcasePanel } from "@/components/brand-showcase-panel";
import { CopyAddressButton } from "@/components/copy-address-button";
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
    title: "Най-доброто бавно печено агнешко и BBQ в центъра на София",
    text:
      "Елате за бавно печено агнешко, BBQ ястия, крафт бира и сезонни предложения, създадени за спокойни вечери в центъра."
  },
  {
    title: "Тиха пауза близо до Славянска 23 за дълги разговори",
    text:
      "Градината и камината ви дават място да забавите темпото след разходка, да се видите с приятели и да останете малко по-дълго."
  },
  {
    title: "Ясни вегетариански опции и свежи салати за всички",
    text:
      "Вегетарианските ястия и свежите салати са лесни за откриване, така че всеки на масата да избере спокойно."
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
          <h1>Уютна градска бърлога от 1923 г. в сърцето на София</h1>
          <BrandShowcasePanel locale="bg" />
          <p className="home-lead">
            Скрит до Народния театър, The Friendly Bear е кътче, създадено изцяло на ръка. Влезте в тайната ни градина
            за бавно печени меса и крафт бира или се стоплете до камината в атмосфера, която се усеща като у дома.
          </p>

          <div className="home-tags" aria-label="Основни акценти">
            <span>📍 Славянска 23, София</span>
            <span>Градина и камина</span>
            <span>Бавно печено BBQ</span>
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
          <p>Независимо дали сте от квартала или просто се разхождате из София, при нас винаги има място за вас.</p>
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
          <iframe
            className="home-visit-map-frame"
            src={mapEmbedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-same-origin allow-popups"
            title="The Friendly Bear Sofia map"
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
