import Image from "next/image";
import { ActionLink } from "@/components/action-link";
import { VenueSnapshotSection } from "@/components/venue-snapshot-section";
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
        <h1>История на 100 години на ул. Славянска 23</h1>
        <p className="page-lead">
          Спасен от събаряне и възстановен на ръка, нашият дом от 1923 г. е проект, създаден с любов. The Friendly
          Bear е мястото, където историята на София среща уюта на горската хижа.
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
            месеци в разкриване на красотата на тази къща. Искахме да създадем място, което се усеща като дом за всеки
            - съседи, пътешественици и техните домашни любимци.
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

      <VenueSnapshotSection
        locale="bg"
        eyebrow="Атмосфера"
        title="Тайна градина и зимна камина"
        intro="Нашата скрита градина е градско бягство за летните вечери, а камината ни предлага топло убежище през софийската зима. Независимо от сезона, нашият екип е тук, за да се почувствате добре дошли."
        images={[
          {
            src: "/images/garden_1.jpg",
            alt: "мечата градина в The Friendly Bear София",
            label: "мечата градина"
          },
          {
            src: "/images/interior_1.jpg",
            alt: "cozy бърлога в The Friendly Bear София",
            label: "cozy бърлога"
          },
          {
            src: "/images/garden_3.jpg",
            alt: "гледка от бърлогата в The Friendly Bear София",
            label: "гледка от бърлогата"
          },
          {
            src: "/images/interior_4.jpg",
            alt: "мечо в The Friendly Bear София",
            label: "мечо"
          }
        ]}
      />

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Посетете ни</p>
          <h2>{businessProfile.address.bg}</h2>
          <p>
            Ще ни откриете в центъра на София, близо до Народния театър и градския ритъм, но достатъчно скрити, за да
            усетите спокойствие още щом прекрачите прага.
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
            Елате за градината, останете за камината и попитайте екипа, ако имате нужда от помощ с избора на ястия,
            упътвания или маса за вечерта.
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
