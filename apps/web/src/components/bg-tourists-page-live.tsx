import { ActionLink } from "@/components/action-link";
import { getBgPrimaryActions, getBusinessProfileData } from "@/lib/business-profile-module";
import { buildActionTracking } from "@/lib/tracking";

const touristCards = [
  {
    slug: "italian",
    title: "Италиански посетители",
    text: "Фокус върху любезно обслужване, сезонни ястия и удобен път към меню и резервации."
  },
  {
    slug: "spanish",
    title: "Испански посетители",
    text: "Подредено за бързо restaurant discovery около центъра, с вегетарианско уверение и ясни следващи действия."
  },
  {
    slug: "greek",
    title: "Гръцки посетители",
    text: "Акцент върху централна локация, приветливо обслужване и лесен достъп до меню, контакт и booking път."
  }
] as const;

const sharedSignals = [
  "Бърз път към менюто",
  "Централна локация в София",
  "Вегетарианско уверение",
  "Приятелски тон на обслужване"
] as const;

export async function BulgarianTouristsPageLive() {
  const businessProfile = await getBusinessProfileData();
  const primaryActions = getBgPrimaryActions(businessProfile);

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Страници за туристи</p>
        <h1>Landing pages за международни посетители в София</h1>
        <p className="page-lead">
          Тези страници са направени за discovery intent от международни посетители, които искат бърз отговор: къде да
          хапнат, как да стигнат, дали мястото е welcoming и колко лесно могат да отворят менюто.
        </p>

        <div className="page-tags" aria-label="Сигнали за туристически страници">
          <span>{businessProfile.address.bg}</span>
          <span>{businessProfile.area.bg}</span>
          <span>International-friendly flow</span>
        </div>

        <div className="actions">
          <ActionLink
            href="/bg/menu"
            label="Меню"
            tracking={buildActionTracking({
              kind: "menu",
              locale: "bg",
              location: "tourists_index_hero",
              label: "Меню",
              target: "/bg/menu"
            })}
          />
          <ActionLink
            href="/bg/reservations"
            label="Резервации"
            tracking={buildActionTracking({
              kind: "reservations",
              locale: "bg",
              location: "tourists_index_hero",
              label: "Резервации",
              target: "/bg/reservations"
            })}
          />
          <ActionLink
            href={businessProfile.mapUrl}
            label="Как да стигнете"
            external
            tracking={buildActionTracking({
              kind: "directions",
              locale: "bg",
              location: "tourists_index_hero",
              label: "Как да стигнете",
              target: businessProfile.mapUrl,
              external: true
            })}
          />
        </div>
      </section>

      <section className="page-grid page-grid-three">
        {touristCards.map((item) => (
          <article key={item.slug} className="page-card">
            <p className="page-card-label">{item.title}</p>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
            <ActionLink
              href={`/bg/tourists/${item.slug}`}
              label={`Отвори страницата за ${item.title.toLowerCase()}`}
              className="page-inline-link"
              tracking={buildActionTracking({
                kind: "contact",
                locale: "bg",
                location: "tourists_index_grid",
                label: `Отвори страницата за ${item.title.toLowerCase()}`,
                target: `/bg/tourists/${item.slug}`
              })}
            />
          </article>
        ))}
      </section>

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Общи conversion цели</p>
          <h2>Какво трябва да улеснява всяка туристическа страница</h2>
          <ul className="page-list">
            {sharedSignals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="page-card">
          <p className="page-card-label">Защо това има значение</p>
          <h2>Discovery страниците работят най-добре, когато останат леки</h2>
          <p>
            Целта не е да товарим посетителя. Целта е да му дадем достатъчно увереност за локацията, обслужването и
            опциите в менюто, за да стигне бързо до меню, контакт или резервация.
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
