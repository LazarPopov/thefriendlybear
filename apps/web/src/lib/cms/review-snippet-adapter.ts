import type { SiteLocale } from "@/lib/site";

type LocalizedText = Record<SiteLocale, string>;
type LocalizedTextList = Record<SiteLocale, string[]>;

export type CmsReviewSnippetEntry = {
  id: string;
  authorName: string;
  source: "google" | "tripadvisor" | "manual" | "Google";
  rating: number;
  reviewText: LocalizedText;
  reviewDate?: string;
  relativeDateLabel: LocalizedText;
  sourceUrl?: string;
  keywordTags: LocalizedTextList;
  isFeatured: boolean;
};

export type FrontendReviewSnippet = {
  id: string;
  author: string;
  source: "Google";
  rating: number;
  relativeDate: string;
  reviewText: string;
  tags: string[];
};

export type ReviewSnippetSeed = {
  id: string;
  author: string;
  source: "Google";
  rating: number;
  relativeDate: LocalizedText;
  reviewText: LocalizedText;
  tags: LocalizedTextList;
};

export function createReviewSnippetFallbackEntries(seeds: ReviewSnippetSeed[]): CmsReviewSnippetEntry[] {
  return seeds.map((seed) => ({
    id: seed.id,
    authorName: seed.author,
    source: seed.source,
    rating: seed.rating,
    reviewText: seed.reviewText,
    relativeDateLabel: seed.relativeDate,
    keywordTags: seed.tags,
    isFeatured: true
  }));
}

export function normalizeReviewSnippetEntries(
  entries: CmsReviewSnippetEntry[],
  locale: SiteLocale
): FrontendReviewSnippet[] {
  return entries.map((entry) => ({
    id: entry.id,
    author: entry.authorName,
    source: "Google",
    rating: entry.rating,
    relativeDate: entry.relativeDateLabel[locale],
    reviewText: entry.reviewText[locale],
    tags: entry.keywordTags[locale] ?? []
  }));
}
