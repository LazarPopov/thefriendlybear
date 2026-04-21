import { getReviewSnippetsData, getReviewSummary } from "@/lib/review-snippets";
import type { SiteLocale } from "@/lib/site";

type ReviewSnippetsShowcaseProps = {
  locale: SiteLocale;
};

export async function ReviewSnippetsShowcase({ locale }: ReviewSnippetsShowcaseProps) {
  const summary = getReviewSummary(locale);
  const reviews = await getReviewSnippetsData(locale);

  return (
    <section className="page-grid">
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
          <article key={review.id} className="page-card">
            <p className="page-card-label">
              {review.source} / {review.rating}/5
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
