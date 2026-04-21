import type { FrontendReviewSnippet } from "@/lib/cms/review-snippet-adapter";

type TouristReviewSnippetsProps = {
  eyebrow: string;
  title: string;
  intro: string;
  tagsLabel: string;
  reviews: FrontendReviewSnippet[];
};

export function TouristReviewSnippets({
  eyebrow,
  title,
  intro,
  tagsLabel,
  reviews
}: TouristReviewSnippetsProps) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="page-grid">
      <article className="page-card">
        <p className="page-card-label">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{intro}</p>
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
            <div className="page-tags" aria-label={tagsLabel}>
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
