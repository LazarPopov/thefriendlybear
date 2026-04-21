import Image from "next/image";
import Link from "next/link";
import { businessProfileSource } from "@/lib/business-profile-source";
import type { SiteLocale } from "@/lib/site";

const instagramUrl = "https://www.instagram.com/friendlybear.bg/";
const facebookUrl = "https://www.facebook.com/friendlybear.bg/";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M7.8 2.8h8.4a5 5 0 0 1 5 5v8.4a5 5 0 0 1-5 5H7.8a5 5 0 0 1-5-5V7.8a5 5 0 0 1 5-5Zm0 1.9a3.1 3.1 0 0 0-3.1 3.1v8.4a3.1 3.1 0 0 0 3.1 3.1h8.4a3.1 3.1 0 0 0 3.1-3.1V7.8a3.1 3.1 0 0 0-3.1-3.1H7.8Zm4.2 3.2a4.1 4.1 0 1 1 0 8.2 4.1 4.1 0 0 1 0-8.2Zm0 1.9a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4Zm4.35-2.35a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M13.35 21.2v-8.36h2.82l.42-3.26h-3.24V7.5c0-.94.26-1.58 1.62-1.58h1.72V3a23 23 0 0 0-2.5-.13c-2.48 0-4.18 1.51-4.18 4.28v2.43H7.2v3.26h2.81v8.36h3.34Z"
        fill="currentColor"
      />
    </svg>
  );
}

const foodImages = [
  {
    src: "/images/food_1.jpg",
    alt: "Signature slow-roasted lamb with baby potatoes at The Friendly Bear Sofia"
  },
  {
    src: "/images/food_2.jpg",
    alt: "Fresh seasonal salad from The Friendly Bear Sofia spring menu"
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

const showcaseCopy: Record<
  SiteLocale,
  {
    label: string;
    tagline: string;
    ratingLabel: string;
    ratingText: string;
    reviewsText: string;
  }
> = {
  bg: {
    label: "Slavyanska 23 · Sofia",
    tagline: "Бърлогата на добрия вкус - влез, отпусни се, наслади се",
    ratingLabel: "Оценка 4.5 от 5 в Google, 1361 отзива",
    ratingText: "4.5 / 5",
    reviewsText: "1361 отзива"
  },
  en: {
    label: "Slavyanska 23 · Sofia",
    tagline: "The den of the good taste - come in, relax and enjoy",
    ratingLabel: "Google rating 4.5 out of 5, 1361 reviews",
    ratingText: "4.5 / 5",
    reviewsText: "1361 reviews"
  }
};

function normalizePhone(input: string) {
  return input.replace(/[^\d+]/g, "");
}

export function BrandShowcasePanel({ locale = "bg" }: BrandShowcasePanelProps) {
  const copy = showcaseCopy[locale];
  const logoAlt = locale === "bg" ? "Лого на The Friendly Bear Sofia" : "The Friendly Bear Sofia logo";
  const phoneNumber = businessProfileSource.contact.phoneNumber;
  const phoneHref = phoneNumber ? `tel:${normalizePhone(phoneNumber)}` : null;
  const otherLocale = locale === "bg" ? "en" : "bg";
  const actions =
    locale === "bg"
      ? {
          call: "Обади се за резервация",
          directions: "Как да стигнете",
          menu: "Меню",
          about: "За нас",
          language: "🇬🇧 English"
        }
      : {
          call: "Call to reserve",
          directions: "How to get there",
          menu: "Menu",
          about: "About",
          language: "🇧🇬 Bulgarian"
        };

  return (
    <section className="brand-showcase" aria-label="Restaurant highlights">
      <div className="brand-banner">
        <div className="brand-logo-wrap">
          <div className="brand-logo-frame">
            <Image
              src="/icons/friendly_bear_logo.jpg"
              alt={logoAlt}
              width={320}
              height={320}
              className="brand-logo"
              priority
            />
          </div>

          <div className="brand-copy">
            <p className="brand-copy-label">{copy.label}</p>
            <p className="brand-tagline">{copy.tagline}</p>
            <div className="brand-rating-badge" aria-label={copy.ratingLabel}>
              <span className="brand-rating-stars" aria-hidden="true">
                <span className="brand-rating-stars-base">★★★★★</span>
                <span className="brand-rating-stars-fill">★★★★★</span>
              </span>
              <span className="brand-rating-score">{copy.ratingText}</span>
              <span className="brand-rating-reviews">{copy.reviewsText}</span>
            </div>
            <div className="brand-action-row" aria-label={locale === "bg" ? "Бързи връзки" : "Quick links"}>
              {phoneHref ? <a className="brand-action-primary" href={phoneHref}>{actions.call}</a> : null}
              <a href={businessProfileSource.identity.mapUrl} target="_blank" rel="noreferrer">
                {actions.directions}
              </a>
              <Link href={`/${locale}/menu`}>{actions.menu}</Link>
              <Link href={`/${locale}/about`}>{actions.about}</Link>
              <a
                href={instagramUrl}
                className="brand-action-social"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={facebookUrl}
                className="brand-action-social"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Facebook"
              >
                <FacebookIcon />
              </a>
              <Link href={`/${otherLocale}`}>{actions.language}</Link>
            </div>
          </div>
        </div>

        <Link
          href={`/${locale}/menu`}
          className="brand-marquee brand-marquee-link"
          aria-label={locale === "bg" ? "Вижте менюто" : "View the menu"}
        >
          <div className="brand-marquee-track">
            {marqueeImages.map((image, index) => (
              <article key={`${image.src}-${index}`} className="food-card" aria-hidden={index >= foodImages.length}>
                <Image
                  src={image.src}
                  alt={index < foodImages.length ? image.alt : ""}
                  width={420}
                  height={315}
                  className="food-card-image"
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 40vw, 300px"
                  priority={index < 3}
                />
              </article>
            ))}
          </div>
        </Link>
      </div>
    </section>
  );
}
