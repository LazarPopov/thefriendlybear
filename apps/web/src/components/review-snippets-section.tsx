import type { FrontendReviewSnippet } from "@/lib/cms/review-snippet-adapter";
import type { SiteLocale } from "@/lib/site";

type ReviewSnippetsSectionProps = {
  locale: SiteLocale;
  reviews: FrontendReviewSnippet[];
};

function getReviewSummary(locale: SiteLocale) {
  return locale === "bg"
    ? {
        eyebrow: "Отзиви от Google",
        title: "Подбрани отзиви от Google",
        description:
          "Реални впечатления от гости, които споменават топлото обслужване, уютната атмосфера и храната, заради която хората се връщат.",
        stats: ["4.5/5 Google оценка", "1361 отзива", "силен фокус върху обслужване, атмосфера и храна"]
      }
    : {
        eyebrow: "Google reviews",
        title: "Selected guest reviews",
        description:
          "Real guest impressions that highlight warm service, cozy atmosphere, and the kind of food people come back for.",
        stats: ["4.5/5 Google rating", "1361 reviews", "strong signals around service, atmosphere, and food"]
      };
}

export function ReviewSnippetsSection({ locale, reviews }: ReviewSnippetsSectionProps) {
  const summary = getReviewSummary(locale);

  return (
    <section className="page-grid" data-track-section="reviews_showcase" data-track-section-label={summary.title}>
      <article className="page-card">
        <p className="page-card-label">{summary.eyebrow}</p>
        <h2>{summary.title}</h2>
        <p>{summary.description}</p>
        <ul className="page-list">
          {summary.stats.map((stat) => (
            <li key={stat}>{stat}</li>
          ))}
        </ul>
      </article>

      <div className="page-grid page-grid-two">
        {reviews.map((review) => (
          <article key={review.id} className="page-card review-card">
            <p className="page-card-label">
              {review.source} / {review.rating}/5
            </p>
            <p className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
              {"★".repeat(Math.max(0, Math.min(5, review.rating)))}
            </p>
            <h2>{review.author}</h2>
            <p className="page-note">{review.relativeDate}</p>
            <p>{review.reviewText}</p>
            <div className="page-tags" aria-label={locale === "bg" ? "Ключови теми" : "Key themes"}>
              {review.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
