import { ActionLink } from "@/components/action-link";
import { PromotionCards } from "@/components/promotion-cards";
import { getBusinessProfileData, getEnPrimaryActions } from "@/lib/business-profile-module";
import { filterActionsByModuleToggles, getModuleTogglesData } from "@/lib/module-toggle-module";
import { getPageContentData } from "@/lib/page-module";
import { getPromotionsData } from "@/lib/promotion-module";
import { buildActionTracking } from "@/lib/tracking";

export async function EnglishPromotionsPageCms() {
  const [businessProfile, page, toggles, promotions] = await Promise.all([
    getBusinessProfileData(),
    getPageContentData("promotions", "en"),
    getModuleTogglesData(),
    getPromotionsData("en")
  ]);

  const primaryActions = filterActionsByModuleToggles(getEnPrimaryActions(businessProfile), toggles);
  const promotionsEnabled = toggles.promotionsEnabled;
  const hasPromotions = promotions.length > 0;

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">Promotions</p>
        <h1>{page?.title ?? "Promotions and seasonal offers"}</h1>
        <p className="page-lead">
          {page?.intro ??
            "Here you can find seasonal offers, special dishes, and good reasons to come back to the den."}
        </p>

        <div className="page-tags" aria-label="Promotions status">
          <span>{promotionsEnabled ? "Seasonal offers are open" : "Seasonal offers are paused"}</span>
          <span>{hasPromotions ? "Active offers are available" : "No active offers right now"}</span>
          <span>{businessProfile.address.en}</span>
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
                locale: "en",
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
        <PromotionCards locale="en" promotions={promotions} location="promotions_cards" />
      ) : (
        <section className="page-grid">
          <article className="page-card">
            <p className="page-card-label">Current status</p>
            <h2>{promotionsEnabled ? "There are no active offers right now" : "Seasonal offers are paused"}</h2>
            <p>
              {promotionsEnabled
                ? "Check back for new seasonal offers, holiday menus, and special evenings on Slavyanska 23."
                : "There are no active seasonal offers right now, but the menu and main dishes are still waiting for you."}
            </p>
          </article>
        </section>
      )}

      <nav className="mobile-quickbar" aria-label="Quick actions">
        {primaryActions.map((action) => (
          <ActionLink
            key={action.href}
            href={action.href}
            label={action.label}
            className="mobile-quickbar-link"
            external={Boolean(action.external)}
            tracking={buildActionTracking({
              kind: action.kind,
              locale: "en",
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
