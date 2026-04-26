import Image from "next/image";
import { ActionLink } from "@/components/action-link";
import { HomeVenueGallery } from "@/components/home-venue-gallery";
import { getBgPrimaryActions, getBusinessProfileData } from "@/lib/business-profile-module";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import { buildActionTracking } from "@/lib/tracking";

export async function BulgarianAboutPageCms() {
  const [businessProfile, toggles] = await Promise.all([
    getBusinessProfileData(),
    getModuleTogglesData()
  ]);

  const primaryActions = filterActionsByModuleToggles(getBgPrimaryActions(businessProfile), toggles);

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
          <span>Тайна градина</span>
          <span>Камина</span>
          <span>Pet friendly</span>
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

      <section className="page-grid page-grid-two about-founder-section">
        <article className="page-card about-founder-copy">
          <p className="page-card-label">Основатели</p>
          <h2>Сърцата зад "Мечката"</h2>
          <p>
            Жана, кулинарният ум зад блога Mish-Mash Recipes, и Георги, интериорен дизайнер от Ainterior, прекараха
            месеци в разкриване на красотата на тази къща. „Искахме да създадем място, което се усеща като дом за
            всеки - съседи, пътешественици и техните домашни любимци“, споделят те.
          </p>
        </article>

        <figure className="about-founder-frame">
          <Image
            src="/images/founders.jpg"
            alt="Основателите Жана и Георги в ресторант The Friendly Bear София"
            width={900}
            height={680}
            className="about-founder-image"
            priority
          />
        </figure>
      </section>

      <HomeVenueGallery locale="bg" maxImagesBeforeCta={9} />

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Посетете ни</p>
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

        <article className="page-card">
          <p className="page-card-label">Добре дошли</p>
          <h2>Създадено за съседи, пътешественици и домашни любимци</h2>
          <p>
            Елате за бягство от градския шум, останете за уюта и вкусната храна. Разчитайте винаги на нас ако имате
            нужда от упътване, запазване на маса или помощ с избора на ястия.
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
