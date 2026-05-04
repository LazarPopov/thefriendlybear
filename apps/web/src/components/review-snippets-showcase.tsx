import { ReviewSnippetsSection } from "@/components/review-snippets-section";
import { getReviewSnippetsData } from "@/lib/review-snippets";
import type { SiteLocale } from "@/lib/site";

type ReviewSnippetsShowcaseProps = {
  locale: SiteLocale;
};

export async function ReviewSnippetsShowcase({ locale }: ReviewSnippetsShowcaseProps) {
  const reviews = await getReviewSnippetsData(locale);

  return <ReviewSnippetsSection locale={locale} reviews={reviews} />;
}
