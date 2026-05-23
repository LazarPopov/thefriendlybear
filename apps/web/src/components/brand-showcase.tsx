import Image from "next/image";
import { FoodMarquee, type FoodMarqueeImage } from "@/components/food-marquee";
import type { SiteLocale } from "@/lib/site";

const foodImages: FoodMarqueeImage[] = [
  {
    src: "/images/food_1.jpg",
    alt: "Signature slow-roasted lamb with baby potatoes at The Friendly Bear Sofia"
  },
  {
    src: "/images/food_2.jpg",
    alt: "Fresh seasonal salad from The Friendly Bear Sofia weekly menu"
  },
  {
    src: "/images/food_3.jpg",
    alt: "Crispy onion rings with sauce at The Friendly Bear Sofia"
  },
  {
    src: "/images/food_4.jpg",
    alt: "Bulgarian seasonal dish served at The Friendly Bear Sofia"
  },
  {
    src: "/images/food_5.jpg",
    alt: "Vegetarian-friendly plate at The Friendly Bear Sofia"
  },
  {
    src: "/images/food_6.jpg",
    alt: "Craft beer and food pairing at The Friendly Bear Sofia"
  },
  {
    src: "/images/food_7.jpg",
    alt: "Seasonal dessert or house plate at The Friendly Bear Sofia"
  }
];

type BrandShowcaseProps = {
  locale?: SiteLocale;
};

const showcaseCopy: Record<SiteLocale, { label: string }> = {
  bg: {
    label: "Slavyanska 23, Sofia"
  },
  en: {
    label: "Slavyanska 23, Sofia"
  }
};

export function BrandShowcase({ locale = "en" }: BrandShowcaseProps) {
  const copy = showcaseCopy[locale];

  return (
    <section className="brand-showcase" aria-label="Restaurant highlights">
      <div className="brand-banner">
        <div className="brand-logo-wrap">
          <div className="brand-logo-frame">
            <Image
              src="/icons/friendly_bear_logo.jpg"
              alt="The Friendly Bear Sofia logo"
              width={320}
              height={320}
              className="brand-logo"
              priority
            />
          </div>

          <div className="brand-copy">
            <p className="brand-copy-label">Slavyanska 23 • Sofia</p>
            <p className="brand-copy-label">{copy.label}</p>
          </div>
        </div>

        <FoodMarquee
          images={foodImages}
          ariaLabel="Next food photo"
          imageWidth={320}
          imageHeight={240}
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 34vw, 240px"
        />
      </div>
    </section>
  );
}
