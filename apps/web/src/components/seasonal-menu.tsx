import type { FrontendSeasonalMenu } from "@/lib/cms/menu-adapter";
import type { SiteLocale } from "@/lib/site";
import { ActionLink } from "@/components/action-link";
import { buildActionTracking } from "@/lib/tracking";

type SeasonalMenuProps = {
  locale: SiteLocale;
  menu: FrontendSeasonalMenu;
};

function getSignatureNote(locale: SiteLocale, itemName: string) {
  const normalizedName = itemName.toLocaleLowerCase();
  const isSlowRoastedLamb =
    normalizedName.includes("slow roasted lamb") || normalizedName.includes("бавно печено агнешко");
  const isVegetarianDrobSarma =
    normalizedName.includes("vegetarian drob sarma") || normalizedName.includes("вегетарианска дроб сарма");

  if (isSlowRoastedLamb) {
    return {
      label: locale === "bg" ? "Избор на кухнята" : "Chef's Choice",
      text:
        locale === "bg"
          ? "Нашият best-seller. Крехко месо, готвено 6+ часа."
          : "Our best-seller. Tender meat cooked for 6+ hours."
    };
  }

  if (isVegetarianDrobSarma) {
    return {
      label: locale === "bg" ? "Signature" : "Signature",
      text:
        locale === "bg"
          ? "Уникален вегетариански прочит на българска класика с микс от горски гъби."
          : "A unique plant-based twist on a Bulgarian classic, using a mix of forest mushrooms."
    };
  }

  return null;
}

function getDinerNote(locale: SiteLocale) {
  return locale === "bg"
    ? {
        title: "Бележка за гостите",
        text:
          "Всички цени са в лева с включен ДДС. Приемаме плащания с карти и в брой. Ако имате нужда от препоръка, нашият екип е на разположение!"
      }
    : {
        title: "Diner's Note",
        text:
          "All prices include VAT. We accept cards & cash. Tipping is customary (10%). Need a recommendation? Just ask our English-speaking staff!"
      };
}

export function SeasonalMenu({ locale, menu }: SeasonalMenuProps) {
  const dinerNote = getDinerNote(locale);

  return (
    <main className="menu-shell">
      <section className="menu-hero" data-track-section="menu_hero" data-track-section-label={menu.title}>
        <p className="eyebrow">{menu.eyebrow}</p>
        <h1>{menu.title}</h1>
        <p className="menu-intro">{menu.intro}</p>

        <div className="actions menu-category-actions">
          {menu.sections.map((section, index) => {
            const sectionHref = `#menu-section-${locale}-${index + 1}`;

            return (
              <ActionLink
                key={sectionHref}
                href={sectionHref}
                label={section.title}
                tracking={buildActionTracking({
                  kind: "menu_category",
                  locale,
                  location: "menu_category_nav",
                  label: section.title,
                  target: sectionHref
                })}
              />
            );
          })}
        </div>
      </section>

      <div className="menu-sections">
        {menu.sections.map((section, index) => (
          <section
            key={section.title}
            id={`menu-section-${locale}-${index + 1}`}
            className="menu-section-card"
            data-track-section={`menu_category_${index + 1}`}
            data-track-section-label={section.title}
          >
            <header className="menu-section-header">
              <p className="menu-section-label">{section.title}</p>
            </header>

            <ul className="menu-item-list">
              {section.items.map((item) => {
                const details = [item.serving, item.calories].filter(Boolean).join(" / ");
                const signature = getSignatureNote(locale, item.name);

                return (
                  <li key={`${section.title}-${item.name}`} className="menu-item-card">
                    <div className="menu-item-head">
                      <div className="menu-item-name-wrap">
                        <h2 className="menu-item-title">{item.name}</h2>
                        {signature ? <span className="menu-item-badge">{signature.label}</span> : null}
                      </div>
                      <div className="menu-item-meta">
                        {details ? <span>{details}</span> : null}
                        {item.priceEuro || item.priceBgn ? (
                          <span className="menu-item-price" aria-label={locale === "bg" ? "Цена" : "Price"}>
                            {item.priceEuro ? <span>{item.priceEuro}</span> : null}
                            {item.priceEuro && item.priceBgn ? <span aria-hidden="true">/</span> : null}
                            {item.priceBgn ? <span>{item.priceBgn}</span> : null}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {item.description?.map((line) => (
                      <p key={line} className="menu-item-description">
                        {line}
                      </p>
                    ))}

                    {signature ? <p className="menu-item-signature-note">{signature.text}</p> : null}

                    {item.allergens ? (
                      <p className="menu-item-allergens">{item.allergens}</p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <aside className="menu-diner-note" aria-label={dinerNote.title}>
        <p className="menu-diner-note-label">{dinerNote.title}</p>
        <p>{dinerNote.text}</p>
      </aside>
    </main>
  );
}
