import {
  getBusinessProfileData,
  getPhoneHref
} from "@/lib/business-profile-module";
import { VenueProgressGallery, type VenueGalleryGroup, type VenueGalleryImage } from "@/components/venue-progress-gallery";
import type { SiteLocale } from "@/lib/site";

type HomeVenueGalleryProps = {
  locale: SiteLocale;
};

type HomeGalleryImageSource = {
  src: string;
  alt: string;
  captions: Record<SiteLocale, string>;
};

const galleryCopy: Record<
  SiteLocale,
  {
    eyebrow: string;
    title: string;
    intro: string;
    groupLabel: string;
  }
> = {
  bg: {
    eyebrow: "Градина и интериор",
    title: "От лампичките в градината до топлината вътре",
    intro:
      "Една галерия, две настроения: зелено спокойствие за топлите вечери и вътрешен уют за дълги разговори.",
    groupLabel: "Градина и интериор"
  },
  en: {
    eyebrow: "Garden and interior",
    title: "From garden lights to the warmth inside",
    intro:
      "One gallery, two moods: green calm for warm evenings and indoor comfort for long conversations.",
    groupLabel: "Garden and interior"
  }
};

const alternatingGalleryImages: HomeGalleryImageSource[] = [
  {
    src: "/images/garden_1.jpg",
    alt: "Garden seating at The Friendly Bear Sofia",
    captions: {
      bg: "Първо: тайна градина",
      en: "First: the secret garden"
    }
  },
  {
    src: "/images/interior_1.jpg",
    alt: "Interior room at The Friendly Bear Sofia",
    captions: {
      bg: "После: вътрешният уют",
      en: "Then: the cozy inside"
    }
  },
  {
    src: "/images/garden_2.jpg",
    alt: "Outdoor garden atmosphere at The Friendly Bear Sofia",
    captions: {
      bg: "Лампички и тиха вечер",
      en: "Lights and a quiet evening"
    }
  },
  {
    src: "/images/interior_2.jpg",
    alt: "Warm interior at The Friendly Bear Sofia",
    captions: {
      bg: "Маса за дълъг разговор",
      en: "A table for a long talk"
    }
  },
  {
    src: "/images/garden_3.jpg",
    alt: "Garden setting at The Friendly Bear Sofia",
    captions: {
      bg: "Скрито зад Radisson",
      en: "Hidden behind the Radisson"
    }
  },
  {
    src: "/images/interior_3.jpg",
    alt: "Cozy interior atmosphere at The Friendly Bear Sofia",
    captions: {
      bg: "Топло, спокойно, мечешко",
      en: "Warm, calm, bear-approved"
    }
  },
  {
    src: "/images/garden_4.jpg",
    alt: "Garden view at The Friendly Bear Sofia",
    captions: {
      bg: "Още една глътка навън",
      en: "One more sip outside"
    }
  },
  {
    src: "/images/interior_4.jpg",
    alt: "Cozy fireplace-like interior mood at The Friendly Bear Sofia",
    captions: {
      bg: "До камината след работа",
      en: "By the fireplace after work"
    }
  },
  {
    src: "/images/interior_5.jpg",
    alt: "Interior dining atmosphere at The Friendly Bear Sofia",
    captions: {
      bg: "Уютът си има адрес",
      en: "Cozy has an address"
    }
  }
];

function getLocalizedImages(locale: SiteLocale): VenueGalleryImage[] {
  return alternatingGalleryImages.map((image) => ({
    src: image.src,
    alt: image.alt,
    caption: image.captions[locale]
  }));
}

export async function HomeVenueGallery({ locale }: HomeVenueGalleryProps) {
  const copy = galleryCopy[locale];
  const businessProfile = await getBusinessProfileData();
  const groups: VenueGalleryGroup[] = [
    {
      id: "atmosphere",
      label: copy.groupLabel,
      images: getLocalizedImages(locale)
    }
  ];

  return (
    <VenueProgressGallery
      locale={locale}
      eyebrow={copy.eyebrow}
      title={copy.title}
      intro={copy.intro}
      groups={groups}
      directionsHref={businessProfile.mapUrl}
      callHref={getPhoneHref(businessProfile)}
    />
  );
}
