import type { SiteLocale } from "@/lib/site";

type LocalizedText = Record<SiteLocale, string>;

export type CmsPageEntry = {
  key: string;
  slug: LocalizedText;
  title: LocalizedText;
  intro: LocalizedText;
  body?: LocalizedText;
};

export type FrontendPageContent = {
  key: string;
  slug: string;
  title: string;
  intro: string;
  bodyHtml: string;
};

export function normalizePageEntry(entry: CmsPageEntry, locale: SiteLocale): FrontendPageContent {
  return {
    key: entry.key,
    slug: entry.slug[locale],
    title: entry.title[locale],
    intro: entry.intro[locale],
    bodyHtml: entry.body?.[locale] ?? ""
  };
}
