import { ActionLink } from "@/components/action-link";
import { PromotionCards } from "@/components/promotion-cards";
import { getBgPrimaryActions, getBusinessProfileData } from "@/lib/business-profile-module";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import { getPageContentData } from "@/lib/page-module";
import { getPromotionsData } from "@/lib/promotion-module";
import { buildActionTracking } from "@/lib/tracking";

export async function BulgarianPromotionsPageCms() {
  const [businessProfile, page, toggles, promotions] = await Promise.all([
    getBusinessProfileData(),
    getPageContentData("promotions", "bg"),
    getModuleTogglesData(),
    getPromotionsData("bg")
  ]);

  const primaryActions = filterActionsByModuleToggles(getBgPrimaryActions(businessProfile), toggles);
  const promotionsEnabled = toggles.promotionsEnabled;
  const hasPromotions = promotions.length > 0;

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Промоции</p>
        <h1>{page?.title ?? "Промоции и сезонни предложения"}</h1>
        <p className="page-lead">
          {page?.intro ??
            "Тук ще откривате сезонни предложения, специални ястия и поводи да се върнете в бърлогата."}
        </p>

        <div className="page-tags" aria-label="Промоционален статус">
          <span>{promotionsEnabled ? "Сезонните предложения са активни" : "Сезонните предложения са на пауза"}</span>
          <span>{hasPromotions ? "Има активни предложения" : "Няма активни предложения"}</span>
          <span>{businessProfile.address.bg}</span>
        </div>

        <div className="actions">
          {primaryActions.slice(0, 3).map((action) => (
            <ActionLink
              key={action.href}
              href={action.href}
              label={action.label}
              external={Boolean(action.external)}
              tracking={buildActionTracking({
                kind: action.kind,
                locale: "bg",
                location: "promotions_hero",
                label: action.label,
                target: action.href,
                external: Boolean(action.external)
              })}
            />
          ))}
        </div>
      </section>

      {page?.bodyHtml ? (
        <section className="page-grid">
          <article className="page-card cms-richtext" dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
        </section>
      ) : null}

      {promotionsEnabled && hasPromotions ? (
        <PromotionCards locale="bg" promotions={promotions} location="promotions_cards" />
      ) : (
        <section className="page-grid">
          <article className="page-card">
            <p className="page-card-label">Текущ статус</p>
            <h2>{promotionsEnabled ? "В момента няма активни оферти" : "Сезонните предложения са на пауза"}</h2>
            <p>
              {promotionsEnabled
                ? "Следете страницата за нови сезонни предложения, празнични менюта и специални вечери на Славянска 23."
                : "В момента няма активни сезонни оферти, но менюто и основните предложения остават на разположение."}
            </p>
          </article>
        </section>
      )}

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
