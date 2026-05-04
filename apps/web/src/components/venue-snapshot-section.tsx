import {
  getBusinessProfileData,
  getPhoneHref
} from "@/lib/business-profile-module";
import type { SiteLocale } from "@/lib/site";
import {
  VenueProgressGallery,
  type VenueGalleryGroup,
  type VenueGalleryImage,
  type VenueGalleryReviewEntry
} from "@/components/venue-progress-gallery";
import { getReviewSnippetsData } from "@/lib/review-snippets";

type GalleryLocale = SiteLocale | "it" | "es" | "el" | "de" | "ro" | "en-gb";

type VenueSnapshotImage = VenueGalleryImage & {
  label: string;
};

type VenueSnapshotSectionProps = {
  locale: GalleryLocale;
  eyebrow: string;
  title: string;
  intro: string;
  images: VenueSnapshotImage[];
  maxImagesBeforeCta?: number;
};

function reviewLocale(locale: GalleryLocale): SiteLocale {
  return locale === "bg" ? "bg" : "en";
}

async function getVenueGalleryReviews(locale: GalleryLocale): Promise<VenueGalleryReviewEntry[]> {
  const reviews = await getReviewSnippetsData(reviewLocale(locale));

  return reviews.map((review) => ({
    eyebrow: reviewLocale(locale) === "bg" ? `Отзив от ${review.source || "Google"}` : `Review from ${review.source || "Google"}`,
    quote: review.reviewText,
    author: review.author,
    meta: [review.rating ? `${review.rating}/5` : "", review.relativeDate].filter(Boolean).join(" · "),
    rating: review.rating
  }));
}

export async function VenueSnapshotSection({
  locale,
  eyebrow,
  title,
  intro,
  images,
  maxImagesBeforeCta
}: VenueSnapshotSectionProps) {
  const [businessProfile, reviews] = await Promise.all([getBusinessProfileData(), getVenueGalleryReviews(locale)]);
  const groups = images.reduce<VenueGalleryGroup[]>((allGroups, image) => {
    const existingGroup = allGroups.find((group) => group.label === image.label);

    if (existingGroup) {
      existingGroup.images.push({ src: image.src, alt: image.alt, caption: image.caption });
      return allGroups;
    }

    allGroups.push({
      id: `group-${allGroups.length + 1}`,
      label: image.label,
      images: [{ src: image.src, alt: image.alt, caption: image.caption }]
    });

    return allGroups;
  }, []);

  return (
    <VenueProgressGallery
      locale={locale}
      eyebrow={eyebrow}
      title={title}
      intro={intro}
      groups={groups}
      directionsHref={businessProfile.mapUrl}
      callHref={getPhoneHref(businessProfile)}
      reviews={reviews}
      maxImagesBeforeCta={maxImagesBeforeCta}
    />
  );
}
