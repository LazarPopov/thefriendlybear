import Image from "next/image";
import type { SiteLocale } from "@/lib/site";

const foodImages = [
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

const marqueeImages = [...foodImages, ...foodImages];

type BrandShowcasePanelProps = {
  locale?: SiteLocale;
};

export function BrandShowcasePanel({ locale = "bg" }: BrandShowcasePanelProps) {
  return (
    <section
      className="brand-showcase brand-showcase-food-only"
      aria-label={locale === "bg" ? "Акценти от кухнята" : "Food highlights"}
    >
      <div className="brand-marquee">
        <div className="brand-marquee-track">
          {marqueeImages.map((image, index) => (
            <article key={`${image.src}-${index}`} className="food-card" aria-hidden={index >= foodImages.length}>
              <Image
                src={image.src}
                alt={index < foodImages.length ? image.alt : ""}
                width={420}
                height={315}
                className="food-card-image"
                sizes="(max-width: 640px) 220px, 300px"
                priority={index === 0}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
