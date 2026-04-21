import { ActionLink } from "@/components/action-link";
import type { FrontendPromotion } from "@/lib/cms/promotion-adapter";
import type { SiteLocale } from "@/lib/site";
import { buildActionTracking, type BusinessActionKind } from "@/lib/tracking";

type PromotionCardsProps = {
  locale: SiteLocale;
  promotions: FrontendPromotion[];
  location: string;
};

function getPromotionActionKind(href: string, external: boolean): BusinessActionKind {
  if (href.includes("/menu")) {
    return "menu";
  }

  if (href.includes("/reservations")) {
    return "reservations";
  }

  if (href.includes("/contact")) {
    return "contact";
  }

  if (href.includes("google.com/maps") || href.includes("maps.app.goo.gl")) {
    return "directions";
  }

  return external ? "external_booking" : "contact";
}

function formatPromotionWindow(locale: SiteLocale, startsAt?: string, endsAt?: string) {
  if (!startsAt && !endsAt) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat(locale === "bg" ? "bg-BG" : "en-US", {
    day: "numeric",
    month: "long"
  });

  if (startsAt && endsAt) {
    return `${formatter.format(new Date(startsAt))} - ${formatter.format(new Date(endsAt))}`;
  }

  if (startsAt) {
    return locale === "bg"
      ? `Активно от ${formatter.format(new Date(startsAt))}`
      : `Active from ${formatter.format(new Date(startsAt))}`;
  }

  return locale === "bg"
    ? `До ${formatter.format(new Date(endsAt as string))}`
    : `Until ${formatter.format(new Date(endsAt as string))}`;
}

export function PromotionCards({ locale, promotions, location }: PromotionCardsProps) {
  return (
    <div className="page-grid page-grid-two">
      {promotions.map((promotion) => {
        const external = Boolean(promotion.ctaUrl && /^https?:\/\//.test(promotion.ctaUrl));
        const actionKind = promotion.ctaUrl
          ? getPromotionActionKind(promotion.ctaUrl, external)
          : null;
        const promotionWindow = formatPromotionWindow(locale, promotion.startsAt, promotion.endsAt);

        return (
          <article key={promotion.id} className="page-card">
            <p className="page-card-label">
              {locale === "bg" ? "Активна оферта" : "Active offer"}
            </p>
            <h2>{promotion.title}</h2>
            <p>{promotion.summary}</p>
            {promotionWindow ? <p className="page-note">{promotionWindow}</p> : null}
            {promotion.bodyHtml ? (
              <div className="cms-richtext" dangerouslySetInnerHTML={{ __html: promotion.bodyHtml }} />
            ) : null}
            {promotion.ctaLabel && promotion.ctaUrl && actionKind ? (
              <ActionLink
                href={promotion.ctaUrl}
                label={promotion.ctaLabel}
                className="page-inline-link"
                external={external}
                tracking={buildActionTracking({
                  kind: actionKind,
                  locale,
                  location,
                  label: promotion.ctaLabel,
                  target: promotion.ctaUrl,
                  external
                })}
              />
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
