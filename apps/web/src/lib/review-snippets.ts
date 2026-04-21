import type { SiteLocale } from "@/lib/site";
import {
  createReviewSnippetFallbackEntries,
  normalizeReviewSnippetEntries,
  type ReviewSnippetSeed
} from "@/lib/cms/review-snippet-adapter";
import { fetchStrapiCollection } from "@/lib/cms/strapi";

type LocalizedText = Record<SiteLocale, string>;
type TouristReviewAudience = "italian" | "spanish" | "greek";

export type ReviewSnippet = {
  id: string;
  author: string;
  source: "Google";
  rating: 5;
  relativeDate: LocalizedText;
  reviewText: LocalizedText;
  tags: Record<SiteLocale, string[]>;
};

const reviewSnippetSeeds: ReviewSnippetSeed[] = [
  {
    id: "lazar-popov-google",
    author: "Lazar Popov",
    source: "Google",
    rating: 5,
    relativeDate: {
      bg: "преди година",
      en: "a year ago"
    },
    reviewText: {
      bg: "Един от по-добрите ресторанти в София.",
      en: "One of the better restaurants in Sofia."
    },
    tags: {
      bg: ["София", "качество", "добро впечатление"],
      en: ["Sofia", "quality", "good impression"]
    }
  },
  {
    id: "j-moreno-google",
    author: "J Moreno",
    source: "Google",
    rating: 5,
    relativeDate: {
      bg: "преди месец",
      en: "a month ago"
    },
    reviewText: {
      bg: "The Friendly Bear в София е чудесно място, ако търсите топла атмосфера и приветливо обслужване.",
      en: "The Friendly Bear in Sofia is a great place to visit if you're looking for a warm atmosphere and welcoming service."
    },
    tags: {
      bg: ["уютно", "обслужване", "атмосфера"],
      en: ["cozy", "service", "atmosphere"]
    }
  },
  {
    id: "vilte-cepulyte-google",
    author: "Viltė Čepulytė",
    source: "Google",
    rating: 5,
    relativeDate: {
      bg: "преди 2 месеца",
      en: "2 months ago"
    },
    reviewText: {
      bg: "Перфектно място с невероятно обслужване и страхотна храна. България ни изненада по много начини, но The Friendly Bear го направи по най-добрия възможен начин.",
      en: "Perfect place with amazing service and great food. Bulgaria surprised us in many ways, but The Friendly Bear did it in the best way possible."
    },
    tags: {
      bg: ["обслужване", "храна", "преживяване"],
      en: ["service", "food", "experience"]
    }
  },
  {
    id: "alice-t-google",
    author: "Alice T",
    source: "Google",
    rating: 5,
    relativeDate: {
      bg: "преди 2 месеца",
      en: "2 months ago"
    },
    reviewText: {
      bg: "Влязохме без резервация, сервитьорът ни помогна да седнем на чудесна маса и ни даде отличен съвет какво да изберем.",
      en: "We walked in without a reservation, the waiter helped us sit at a great table. Gave us excellent advice on what to choose."
    },
    tags: {
      bg: ["без резервация", "обслужване", "гостоприемство"],
      en: ["walk-in", "service", "hospitality"]
    }
  }
];

const reviewSnippetEntries = createReviewSnippetFallbackEntries(reviewSnippetSeeds);

const touristReviewAudienceMap: Record<string, TouristReviewAudience[]> = {
  "j-moreno-google": ["spanish"]
};

export function getReviewSnippets(locale: SiteLocale) {
  return normalizeReviewSnippetEntries(reviewSnippetEntries, locale);
}

export async function getReviewSnippetsData(locale: SiteLocale) {
  const entries = await fetchStrapiCollection<(typeof reviewSnippetEntries)[number]>(
    "/api/review-snippets?populate=*&filters[isFeatured][$eq]=true&sort[0]=publishedAt:desc&pagination[pageSize]=6"
  );

  return normalizeReviewSnippetEntries(entries.length > 0 ? entries : reviewSnippetEntries, locale);
}

export async function getTouristReviewSnippetsData(locale: SiteLocale, audience: TouristReviewAudience) {
  const reviews = await getReviewSnippetsData(locale);

  return reviews.filter((review) => touristReviewAudienceMap[review.id]?.includes(audience)).slice(0, 2);
}

export function getReviewSummary(locale: SiteLocale) {
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
