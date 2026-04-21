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
      bg: "Един от по-добрите ресторанти в София ... Още",
      en: "One of the better restaurants in Sofia ... More"
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
      bg: "The Friendly Bear в София е чудесно място, ако търсите топла атмосфера и приветливо обслужване. Персоналът е искрено любезен и ... Още",
      en: "The Friendly Bear in Sofia is a great place to visit if you're looking for a warm atmosphere and welcoming service. The staff are genuinely friendly and ... More"
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
      bg: "Перфектно място с невероятно обслужване и страхотна храна. България ни изненада по много начини, но The Friendly Bear го направи по най-добрия възможен начин. ... Още",
      en: "Perfect place with amazing service and great food. Bulgaria has surprised us in many ways whilst visiting, but the Friendly Bear has done it in the best way. ... More"
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
      bg: "Влязохме без резервация, сервитьорът ни помогна да седнем на чудесна маса. Докато поръчвахме, ни даде съвет какво би избрал и ... Още",
      en: "We came in without a reservation, the waiter helped us to a great table. While we ordered our food, he gave us some advice about what dish he would pick, and so ... More"
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
        eyebrow: "Google review snippets",
        title: "Подбрани отзиви от Google",
        description:
          "Това са подбрани откъси от реални Google отзиви, добавени ръчно, докато не свържем одобрен автоматизиран review source.",
        stats: ["4 подбрани откъса", "5/5 на всички показани оценки", "силен фокус върху обслужване, атмосфера и храна"]
      }
    : {
        eyebrow: "Google review snippets",
        title: "Selected Google review snippets",
        description:
          "These are curated snippets from real Google reviews, added manually until an approved automated review source is connected.",
        stats: ["4 selected snippets", "5/5 on every displayed rating", "strong signals around service, atmosphere, and food"]
      };
}
