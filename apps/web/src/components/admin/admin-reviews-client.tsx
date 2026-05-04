"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AdminClientError, adminFetch, adminLoginPath } from "@/lib/admin/content-client";
import type { ContentAdminContext, SiteReviewRecord } from "@/lib/content-types";
import type { SiteLocale } from "@/lib/site";

type ReviewsApiResponse = {
  context: ContentAdminContext;
  reviews: SiteReviewRecord[];
};

type ReviewDraft = {
  id?: string;
  author_name: string;
  rating: number;
  language: SiteLocale;
  review_text: string;
  source: string;
  review_date: string;
  relative_date_label: string;
  source_url: string;
  keyword_tags: string;
  is_featured: boolean;
  sort_order: number;
};

const emptyDraft: ReviewDraft = {
  author_name: "",
  rating: 5,
  language: "en",
  review_text: "",
  source: "Google",
  review_date: "",
  relative_date_label: "",
  source_url: "",
  keyword_tags: "",
  is_featured: true,
  sort_order: 0
};

function draftFromReview(review: SiteReviewRecord): ReviewDraft {
  return {
    id: review.id,
    author_name: review.author_name,
    rating: review.rating,
    language: review.language,
    review_text: review.review_text,
    source: review.source,
    review_date: review.review_date ?? "",
    relative_date_label: review.relative_date_label ?? "",
    source_url: review.source_url ?? "",
    keyword_tags: review.keyword_tags.join(", "),
    is_featured: review.is_featured,
    sort_order: review.sort_order
  };
}

function payloadFromDraft(draft: ReviewDraft) {
  return {
    ...draft,
    review_date: draft.review_date || null,
    relative_date_label: draft.relative_date_label || null,
    source_url: draft.source_url || null,
    keyword_tags: draft.keyword_tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
  };
}

export function AdminReviewsClient() {
  const router = useRouter();
  const [context, setContext] = useState<ContentAdminContext | null>(null);
  const [reviews, setReviews] = useState<SiteReviewRecord[]>([]);
  const [draft, setDraft] = useState<ReviewDraft>(emptyDraft);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const groupedReviews = useMemo(
    () => ({
      bg: reviews.filter((review) => review.language === "bg"),
      en: reviews.filter((review) => review.language === "en")
    }),
    [reviews]
  );

  async function load() {
    setIsLoading(true);
    setError(null);

    try {
      const payload = await adminFetch<ReviewsApiResponse>("/api/admin/reviews");
      setContext(payload.context);
      setReviews(payload.reviews);
    } catch (loadError) {
      if (loadError instanceof AdminClientError && loadError.status === 401) {
        router.replace(adminLoginPath("/admin/reviews"));
        return;
      }

      setError(loadError instanceof Error ? loadError.message : "Unable to load reviews.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const payload = await adminFetch<ReviewsApiResponse>("/api/admin/reviews", {
        method: draft.id ? "PATCH" : "POST",
        body: JSON.stringify(payloadFromDraft(draft))
      });
      setContext(payload.context);
      setReviews(payload.reviews);
      setDraft(emptyDraft);
      setMessage("Review saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save review.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteReview(id: string) {
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const payload = await adminFetch<ReviewsApiResponse>(`/api/admin/reviews?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
      setContext(payload.context);
      setReviews(payload.reviews);
      setDraft((current) => (current.id === id ? emptyDraft : current));
      setMessage("Review removed.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to remove review.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <main className="booking-shell booking-safe-screen">
        <section className="booking-safe-panel">
          <h1>Loading reviews...</h1>
        </section>
      </main>
    );
  }

  if (error && !context) {
    return (
      <main className="booking-shell booking-safe-screen">
        <section className="booking-safe-panel">
          <p className="booking-kicker">No access</p>
          <h1>Reviews editor unavailable</h1>
          <p className="booking-form-error">{error}</p>
          <Link href="/admin/bookings">Back to bookings</Link>
        </section>
      </main>
    );
  }

  if (!context) {
    return null;
  }

  return (
    <main className="booking-shell booking-settings-shell">
      <header className="booking-subpage-header">
        <div>
          <p className="booking-kicker">{context.restaurant.name}</p>
          <h1>Reviews</h1>
        </div>
        <nav className="booking-nav" aria-label="Admin navigation">
          <Link href="/admin">Admin</Link>
          <Link href="/admin/bookings">Bookings</Link>
          <Link href="/admin/menu">Menu</Link>
          <Link href="/admin/reviews/preview">Preview</Link>
          <Link href="/admin/content-access">Access</Link>
        </nav>
      </header>

      {message ? <p className="booking-status booking-status-sync">{message}</p> : null}
      {error ? <p className="booking-status booking-status-warning">{error}</p> : null}

      <form className="booking-settings-form content-admin-form" onSubmit={saveReview}>
        <section className="booking-settings-section">
          <div className="booking-section-heading-row">
            <h2>{draft.id ? "Edit review" : "Add review"}</h2>
            {draft.id ? (
              <button type="button" onClick={() => setDraft(emptyDraft)}>
                New review
              </button>
            ) : null}
          </div>

          <div className="booking-settings-grid">
            <label>
              Author
              <input value={draft.author_name} onChange={(event) => setDraft({ ...draft, author_name: event.target.value })} required />
            </label>
            <label>
              Stars
              <select value={draft.rating} onChange={(event) => setDraft({ ...draft, rating: Number(event.target.value) })}>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Language
              <select value={draft.language} onChange={(event) => setDraft({ ...draft, language: event.target.value as SiteLocale })}>
                <option value="en">English</option>
                <option value="bg">Bulgarian</option>
              </select>
            </label>
            <label>
              Source
              <input value={draft.source} onChange={(event) => setDraft({ ...draft, source: event.target.value })} />
            </label>
            <label>
              Review date
              <input type="date" value={draft.review_date} onChange={(event) => setDraft({ ...draft, review_date: event.target.value })} />
            </label>
            <label>
              Relative date
              <input
                value={draft.relative_date_label}
                onChange={(event) => setDraft({ ...draft, relative_date_label: event.target.value })}
              />
            </label>
            <label>
              Sort order
              <input
                type="number"
                value={draft.sort_order}
                onChange={(event) => setDraft({ ...draft, sort_order: Number(event.target.value) })}
              />
            </label>
            <label className="content-admin-wide-field">
              Source URL
              <input value={draft.source_url} onChange={(event) => setDraft({ ...draft, source_url: event.target.value })} />
            </label>
            <label className="content-admin-wide-field">
              Review text
              <textarea value={draft.review_text} onChange={(event) => setDraft({ ...draft, review_text: event.target.value })} required />
            </label>
            <label className="content-admin-wide-field">
              Tags
              <input value={draft.keyword_tags} onChange={(event) => setDraft({ ...draft, keyword_tags: event.target.value })} />
            </label>
            <label className="booking-settings-check">
              <input
                type="checkbox"
                checked={draft.is_featured}
                onChange={(event) => setDraft({ ...draft, is_featured: event.target.checked })}
              />
              Featured
            </label>
          </div>

          <button type="submit" className="booking-save-settings" disabled={isSaving}>
            Save review
          </button>
        </section>

        {(["en", "bg"] as SiteLocale[]).map((locale) => (
          <section key={locale} className="booking-settings-section">
            <h2>{locale === "en" ? "English reviews" : "Bulgarian reviews"}</h2>
            <div className="content-admin-review-list">
              {groupedReviews[locale].map((review) => (
                <article key={review.id} className="content-admin-review-row">
                  <div>
                    <p className="booking-kicker">
                      {review.source} / {review.rating}/5
                    </p>
                    <h2>{review.author_name}</h2>
                    <p>{review.review_text}</p>
                  </div>
                  <div className="content-admin-row-actions">
                    <button type="button" onClick={() => setDraft(draftFromReview(review))}>
                      Edit
                    </button>
                    <button type="button" className="booking-danger-button" onClick={() => deleteReview(review.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
              {groupedReviews[locale].length === 0 ? <p className="booking-muted">No reviews yet.</p> : null}
            </div>
          </section>
        ))}
      </form>
    </main>
  );
}
