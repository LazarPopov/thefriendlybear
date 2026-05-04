"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ReviewSnippetsSection } from "@/components/review-snippets-section";
import { AdminClientError, adminFetch, adminLoginPath } from "@/lib/admin/content-client";
import type { FrontendReviewSnippet } from "@/lib/cms/review-snippet-adapter";
import type { ContentAdminContext, SiteReviewRecord } from "@/lib/content-types";
import type { SiteLocale } from "@/lib/site";

type ReviewsApiResponse = {
  context: ContentAdminContext;
  reviews: SiteReviewRecord[];
};

type ReviewPageCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  tags: string[];
  primaryActions: Array<{ href: string; label: string }>;
  experienceLabel: string;
  experienceTitle: string;
  experienceText: string;
  atmosphereLabel: string;
  atmosphereTitle: string;
  atmosphereText: string;
  shareLabel: string;
  shareTitle: string;
  shareText: string;
  ratingLabel: string;
  ratingTitle: string;
  ratingText: string;
};

const locales: SiteLocale[] = ["bg", "en"];
const localeLabels: Record<SiteLocale, string> = {
  bg: "Bulgarian",
  en: "English"
};

const reviewPageCopy: Record<SiteLocale, ReviewPageCopy> = {
  bg: {
    eyebrow: "Отзиви и оценки",
    title: "Какво казват нашите гости",
    lead:
      "В основата на всичко, което правим, е преживяването на нашите гости. От топлината на градината до първата хапка от нашите бавно готвени меса - ето реалните истории на хората, които посещават нашата бърлога.",
    tags: ["висока оценка", "бавно готвени меса", "крафт бира", "уютна бърлога", "център на София"],
    primaryActions: [
      { href: "/bg/reservations", label: "Резервации" },
      { href: "/bg/menu", label: "Меню" },
      { href: "/bg/contact", label: "Контакти" }
    ],
    experienceLabel: "Преживяване",
    experienceTitle: "Защо гостите се връщат",
    experienceText:
      "Гордеем се с оценката си 4.5/5. Тя отразява вниманието ни към свежи продукти, локална крафт бира и приветлива атмосфера на ул. Славянска 23.",
    atmosphereLabel: "Атмосфера",
    atmosphereTitle: "Място за истории",
    atmosphereText:
      "Независимо дали е първа среща в градината или семейна вечеря в някоя от залите, гостите често споменават добрата енергия, която прави The Friendly Bear различен.",
    shareLabel: "Помогнете на следващия гост",
    shareTitle: "Споделете своя Friendly Bear момент",
    shareText:
      "Ако градината, уютът или бавно готвените меса са направили вечерта ви по-хубава, кратък Google отзив помага повече хора да ни открият.",
    ratingLabel: "Оценка от гости",
    ratingTitle: "4.5/5 от 1361 Google отзива",
    ratingText:
      "Числото е важно, но историите са още по-важни: топло обслужване, добра храна и уютно софийско място, което хората помнят."
  },
  en: {
    eyebrow: "Reviews and ratings",
    title: "What Our Guests Say",
    lead:
      "At the heart of everything we do is the experience of our guests. From the warmth of the garden to the first bite of our slow-cooked meats, here are real stories from the people who visit our 1923 cabin.",
    tags: ["best rated", "slow-cooked meats", "craft beer", "cozy cabin", "Sofia Center"],
    primaryActions: [
      { href: "/en/reservations", label: "Reservations" },
      { href: "/en/menu", label: "Menu" },
      { href: "/en/contact", label: "Contact" }
    ],
    experienceLabel: "Experience",
    experienceTitle: "Why Guests Return",
    experienceText:
      "We are proud of our 4.5/5 rating. It reflects our commitment to fresh ingredients, local craft beer, and a welcoming atmosphere on Slavyanska 23.",
    atmosphereLabel: "Atmosphere",
    atmosphereTitle: "A Place for Stories",
    atmosphereText:
      "Whether it's a first date in the garden or a family dinner in one of the dining rooms, our guests often mention the good energy that makes The Friendly Bear unique.",
    shareLabel: "Help the next guest",
    shareTitle: "Share your Friendly Bear moment",
    shareText:
      "If the garden, the cozy atmosphere, or the slow-cooked meats made your evening better, a short Google review helps more people find us.",
    ratingLabel: "Guest Rating",
    ratingTitle: "4.5/5 from 1361 Google reviews",
    ratingText:
      "The number matters, but the stories matter more: warm service, good food, and a cozy Sofia hideaway people remember."
  }
};

function reviewToSnippet(review: SiteReviewRecord): FrontendReviewSnippet {
  return {
    id: review.id,
    author: review.author_name,
    source: review.source || "Google",
    rating: review.rating,
    relativeDate: review.relative_date_label || review.review_date || "",
    reviewText: review.review_text,
    tags: review.keyword_tags ?? []
  };
}

function ReviewsWebsitePreview({ locale, reviews }: { locale: SiteLocale; reviews: FrontendReviewSnippet[] }) {
  const copy = reviewPageCopy[locale];

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className="page-lead">{copy.lead}</p>

        <div className="page-tags" aria-label={locale === "bg" ? "Теми в отзивите" : "Review themes"}>
          {copy.tags.map((theme) => (
            <span key={theme}>{theme}</span>
          ))}
        </div>

        <div className="actions">
          {copy.primaryActions.map((action) => (
            <Link key={action.href} href={action.href}>
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">{copy.experienceLabel}</p>
          <h2>{copy.experienceTitle}</h2>
          <p>{copy.experienceText}</p>
        </article>

        <article className="page-card">
          <p className="page-card-label">{copy.atmosphereLabel}</p>
          <h2>{copy.atmosphereTitle}</h2>
          <p>{copy.atmosphereText}</p>
        </article>
      </section>

      {reviews.length > 0 ? (
        <ReviewSnippetsSection locale={locale} reviews={reviews} />
      ) : (
        <section className="page-grid">
          <article className="page-card">
            <p className="page-card-label">{locale === "bg" ? "Отзиви" : "Reviews"}</p>
            <h2>{locale === "bg" ? "Няма избрани отзиви" : "No featured reviews"}</h2>
            <p>
              {locale === "bg"
                ? "Маркирайте поне един активен отзив като Featured, за да се показва на публичната страница."
                : "Mark at least one active review as Featured so it appears on the public page."}
            </p>
          </article>
        </section>
      )}

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">{copy.shareLabel}</p>
          <h2>{copy.shareTitle}</h2>
          <p>{copy.shareText}</p>
        </article>

        <article className="page-card">
          <p className="page-card-label">{copy.ratingLabel}</p>
          <h2>{copy.ratingTitle}</h2>
          <p>{copy.ratingText}</p>
        </article>
      </section>
    </main>
  );
}

export function AdminReviewsPreviewClient() {
  const router = useRouter();
  const [context, setContext] = useState<ContentAdminContext | null>(null);
  const [reviews, setReviews] = useState<SiteReviewRecord[]>([]);
  const [locale, setLocale] = useState<SiteLocale>("en");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const visibleReviews = useMemo(
    () =>
      reviews
        .filter((review) => review.language === locale && review.is_active && review.is_featured)
        .map(reviewToSnippet),
    [locale, reviews]
  );

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const payload = await adminFetch<ReviewsApiResponse>("/api/admin/reviews");

        if (!isMounted) {
          return;
        }

        setContext(payload.context);
        setReviews(payload.reviews);
      } catch (loadError) {
        if (loadError instanceof AdminClientError && loadError.status === 401) {
          router.replace(adminLoginPath("/admin/reviews/preview"));
          return;
        }

        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load reviews preview.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isLoading) {
    return (
      <main className="booking-shell booking-safe-screen">
        <section className="booking-safe-panel">
          <h1>Loading reviews preview...</h1>
        </section>
      </main>
    );
  }

  if (error || !context) {
    return (
      <main className="booking-shell booking-safe-screen">
        <section className="booking-safe-panel">
          <p className="booking-kicker">No access</p>
          <h1>Reviews preview unavailable</h1>
          {error ? <p className="booking-form-error">{error}</p> : null}
          <Link href="/admin/reviews">Back to reviews editor</Link>
        </section>
      </main>
    );
  }

  return (
    <>
      <div className="content-preview-toolbar">
        <div className="content-preview-toolbar-main">
          <div>
            <p className="booking-kicker">{context.restaurant.name} preview</p>
            <h1>{localeLabels[locale]} reviews page</h1>
          </div>
          <nav className="booking-nav" aria-label="Reviews preview navigation">
            <Link href="/admin">Admin</Link>
            <Link href="/admin/reviews">Editor</Link>
            <Link href="/admin/menu/preview">Menu preview</Link>
            <Link href={`/${locale}/reviews`} target="_blank">
              Live page
            </Link>
          </nav>
        </div>

        <div className="booking-nav content-preview-language-switch" role="group" aria-label="Preview language">
          {locales.map((item) => (
            <button
              key={item}
              type="button"
              className={item === locale ? "content-admin-tab-active" : undefined}
              onClick={() => setLocale(item)}
            >
              {localeLabels[item]}
            </button>
          ))}
        </div>
      </div>

      <ReviewsWebsitePreview locale={locale} reviews={visibleReviews} />
    </>
  );
}
