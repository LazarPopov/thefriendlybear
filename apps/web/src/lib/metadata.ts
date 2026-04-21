import type { Metadata } from "next";
import { siteConfig, type SiteLocale } from "@/lib/site";

export const routeMap = {
  home: {
    bg: "/bg",
    en: "/en"
  },
  menu: {
    bg: "/bg/menu",
    en: "/en/menu"
  },
  about: {
    bg: "/bg/about",
    en: "/en/about"
  },
  contact: {
    bg: "/bg/contact",
    en: "/en/contact"
  },
  reservations: {
    bg: "/bg/reservations",
    en: "/en/reservations"
  },
  promotions: {
    bg: "/bg/promotions",
    en: "/en/promotions"
  },
  reviews: {
    bg: "/bg/reviews",
    en: "/en/reviews"
  },
  tourists: {
    bg: "/bg/tourists",
    en: "/en/tourists"
  }
} as const;

export type SiteRouteKey = keyof typeof routeMap;

const openGraphLocaleMap: Record<SiteLocale, string> = {
  bg: "bg_BG",
  en: "en_GB"
};

export function getLocalizedPath(locale: SiteLocale, routeKey: SiteRouteKey) {
  return routeMap[routeKey][locale];
}

export function getLanguageAlternates(routeKey: SiteRouteKey) {
  return {
    bg: new URL(routeMap[routeKey].bg, siteConfig.siteUrl).toString(),
    en: new URL(routeMap[routeKey].en, siteConfig.siteUrl).toString(),
    "bg-BG": new URL(routeMap[routeKey].bg, siteConfig.siteUrl).toString(),
    "en-GB": new URL(routeMap[routeKey].en, siteConfig.siteUrl).toString(),
    "x-default": new URL(routeMap[routeKey][siteConfig.defaultLocale], siteConfig.siteUrl).toString()
  };
}

type BuildPageMetadataInput = {
  locale: SiteLocale;
  routeKey: SiteRouteKey;
  title: string;
  description: string;
  robots?: Metadata["robots"];
};

export function buildPageMetadata({
  locale,
  routeKey,
  title,
  description,
  robots
}: BuildPageMetadataInput): Metadata {
  const canonical = new URL(getLocalizedPath(locale, routeKey), siteConfig.siteUrl).toString();
  const socialImage = {
    url: new URL("/icons/friendly_bear_logo.jpg", siteConfig.siteUrl).toString(),
    width: 320,
    height: 320,
    alt: "The Friendly Bear Sofia logo"
  };

  return {
    title,
    description,
    robots,
    alternates: {
      canonical,
      languages: getLanguageAlternates(routeKey)
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: openGraphLocaleMap[locale],
      type: "website",
      images: [socialImage]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage.url]
    }
  };
}
