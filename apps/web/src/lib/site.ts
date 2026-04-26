export const siteConfig = {
  name: "The Friendly Bear Sofia",
  shortName: "Friendly Bear",
  description:
    "The Friendly Bear Sofia is a cozy restaurant and garden on Slavyanska 23 with slow-cooked meats, a weekly menu, vegetarian options, and pet-friendly hospitality.",
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "https://friendlybear.bg",
  defaultLocale: "bg" as const,
  locales: ["bg", "en"] as const,
  streetAddress: "Slavyanska 23",
  city: "Sofia",
  country: "Bulgaria",
  countryCode: "BG"
};

export type SiteLocale = (typeof siteConfig.locales)[number];
