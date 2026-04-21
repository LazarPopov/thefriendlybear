export const siteConfig = {
  name: "The Friendly Bear Sofia",
  shortName: "Friendly Bear",
  description:
    "The Friendly Bear Sofia at Slavyanska 23 in Sofia. Бърлогата на добрия вкус - влез, отпусни се, наслади се.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://friendlybear.bg",
  defaultLocale: "bg" as const,
  locales: ["bg", "en"] as const,
  streetAddress: "Slavyanska 23",
  city: "Sofia",
  country: "Bulgaria",
  countryCode: "BG"
};

export type SiteLocale = (typeof siteConfig.locales)[number];
