import { FoodMarquee, type FoodMarqueeImage } from "@/components/food-marquee";
import type { SiteLocale } from "@/lib/site";

const foodImages: FoodMarqueeImage[] = [
  {
    src: "/images/food_1.jpg",
    alt: "Signature slow-roasted lamb with baby potatoes at The Friendly Bear Sofia"
  },
  {
    src: "/images/food_2.jpg",
    alt: "Fresh seasonal salad from The Friendly Bear Sofia special menu"
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

type BrandShowcasePanelProps = {
  locale?: SiteLocale;
};

export function BrandShowcasePanel({ locale = "bg" }: BrandShowcasePanelProps) {
  return (
    <section
      className="brand-showcase brand-showcase-food-only"
      aria-label={locale === "bg" ? "Акценти от кухнята" : "Food highlights"}
    >
      <FoodMarquee
        images={foodImages}
        ariaLabel="Next food photo"
        sizes="(max-width: 640px) 70vw, 300px"
        priorityFirst
      />
    </section>
  );
}
