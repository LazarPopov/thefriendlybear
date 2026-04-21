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
    alt: "мечата градина at The Friendly Bear Sofia",
    captions: {
      bg: "мечата градина",
      en: "The Bear Garden"
    }
  },
  {
    src: "/images/interior_1.jpg",
    alt: "cozy бърлога at The Friendly Bear Sofia",
    captions: {
      bg: "cozy бърлога",
      en: "Cozy Den"
    }
  },
  {
    src: "/images/garden_2.jpg",
    alt: "мечата тераса at The Friendly Bear Sofia",
    captions: {
      bg: "мечата тераса",
      en: "The Bear Terrace"
    }
  },
  {
    src: "/images/interior_2.jpg",
    alt: "маса за дълги разговори at The Friendly Bear Sofia",
    captions: {
      bg: "маса за дълги разговори",
      en: "Table for Long Talks"
    }
  },
  {
    src: "/images/garden_3.jpg",
    alt: "гледка от бърлогата at The Friendly Bear Sofia",
    captions: {
      bg: "гледка от бърлогата",
      en: "View from the Den"
    }
  },
  {
    src: "/images/interior_3.jpg",
    alt: "цветният коридор at The Friendly Bear Sofia",
    captions: {
      bg: "цветният коридор",
      en: "The Colorful Corridor"
    }
  },
  {
    src: "/images/garden_4.jpg",
    alt: "мечшки зимен сън at The Friendly Bear Sofia",
    captions: {
      bg: "мечшки зимен сън",
      en: "Bear Winter Sleep"
    }
  },
  {
    src: "/images/interior_4.jpg",
    alt: "мечо at The Friendly Bear Sofia",
    captions: {
      bg: "мечо",
      en: "Bear Buddy"
    }
  },
  {
    src: "/images/interior_5.jpg",
    alt: "Уютна вечер at The Friendly Bear Sofia",
    captions: {
      bg: "Уютна вечер",
      en: "Cozy Evening"
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
