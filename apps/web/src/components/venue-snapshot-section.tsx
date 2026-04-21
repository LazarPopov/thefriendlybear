import {
  getBusinessProfileData,
  getPhoneHref
} from "@/lib/business-profile-module";
import type { SiteLocale } from "@/lib/site";
import { VenueProgressGallery, type VenueGalleryGroup, type VenueGalleryImage } from "@/components/venue-progress-gallery";

type GalleryLocale = SiteLocale | "it" | "es" | "el";

type VenueSnapshotImage = VenueGalleryImage & {
  label: string;
};

type VenueSnapshotSectionProps = {
  locale: GalleryLocale;
  eyebrow: string;
  title: string;
  intro: string;
  images: VenueSnapshotImage[];
};

export async function VenueSnapshotSection({
  locale,
  eyebrow,
  title,
  intro,
  images
}: VenueSnapshotSectionProps) {
  const businessProfile = await getBusinessProfileData();
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
    />
  );
}
