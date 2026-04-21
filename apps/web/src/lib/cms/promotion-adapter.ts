import type { SiteLocale } from "@/lib/site";

type LocalizedText = Record<SiteLocale, string>;

export type CmsPromotionEntry = {
  id?: string | number;
  documentId?: string;
  slug: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  body?: LocalizedText;
  ctaLabel?: LocalizedText;
  ctaUrl?: LocalizedText;
  startsAt?: string;
  endsAt?: string;
  isEnabled?: boolean;
};

export type FrontendPromotion = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
  startsAt?: string;
  endsAt?: string;
  isEnabled: boolean;
};

export function normalizePromotionEntry(
  entry: CmsPromotionEntry,
  locale: SiteLocale
): FrontendPromotion {
  return {
    id: String(entry.documentId ?? entry.id ?? entry.slug.en ?? entry.slug.bg),
    slug: entry.slug[locale],
    title: entry.title[locale],
    summary: entry.summary[locale],
    bodyHtml: entry.body?.[locale] ?? "",
    ctaLabel: entry.ctaLabel?.[locale],
    ctaUrl: entry.ctaUrl?.[locale],
    startsAt: entry.startsAt,
    endsAt: entry.endsAt,
    isEnabled: entry.isEnabled ?? true
  };
}
