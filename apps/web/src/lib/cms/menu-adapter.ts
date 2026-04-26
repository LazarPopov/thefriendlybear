import type { SiteLocale } from "@/lib/site";

type LocalizedText = Record<SiteLocale, string>;

export type CmsMenuCategoryEntry = {
  key: string;
  slug: LocalizedText;
  name: LocalizedText;
  description?: LocalizedText;
  sortOrder: number;
  isActive: boolean;
};

export type CmsMenuItemEntry = {
  key: string;
  categoryKey: string;
  slug: LocalizedText;
  name: LocalizedText;
  description?: LocalizedText;
  allergens?: LocalizedText;
  servingLabel?: LocalizedText;
  price: number;
  currency: "BGN" | "EUR";
  priceDisplayBgn?: string;
  priceDisplayEur?: string;
  sortOrder?: number;
  dietaryTags?: string[];
  isVegetarian?: boolean;
  isFeatured?: boolean;
};

export type FrontendMenuItem = {
  name: string;
  description?: string[];
  allergens?: string;
  serving?: string;
  priceEuro?: string;
  priceBgn?: string;
  isVegetarian?: boolean;
};

export type FrontendMenuSection = {
  title: string;
  items: FrontendMenuItem[];
};

export type FrontendSeasonalMenu = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: FrontendMenuSection[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getLocalizedValue(value: unknown, locale: SiteLocale) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!isRecord(value)) {
    return "";
  }

  const localizedValue = value[locale];
  return typeof localizedValue === "string" ? localizedValue.trim() : "";
}

function splitLines(value?: string) {
  if (!value) {
    return undefined;
  }

  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length > 0 ? lines : undefined;
}

export function normalizeMenuSections(
  locale: SiteLocale,
  categories: CmsMenuCategoryEntry[],
  items: CmsMenuItemEntry[]
): FrontendMenuSection[] {
  const activeCategories = categories
    .filter((category) => category.isActive && category.key)
    .sort((left, right) => left.sortOrder - right.sortOrder);

  return activeCategories.flatMap((category) => {
      const title = getLocalizedValue(category.name, locale);
      if (!title) {
        return [];
      }

      const sectionItems: FrontendMenuItem[] = items
        .filter((item) => item.categoryKey === category.key)
        .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
        .flatMap((item) => {
          const name = getLocalizedValue(item.name, locale);

          if (!name) {
            return [];
          }

          const description = getLocalizedValue(item.description, locale);
          const allergens = getLocalizedValue(item.allergens, locale);
          const serving = getLocalizedValue(item.servingLabel, locale);

          return [{
            name,
            description: splitLines(description),
            allergens: allergens || undefined,
            serving: serving || undefined,
            priceEuro: item.priceDisplayEur,
            priceBgn: item.priceDisplayBgn,
            isVegetarian: item.isVegetarian ?? false
          }];
        });

      if (sectionItems.length === 0) {
        return [];
      }

      return [{
        title,
        items: sectionItems
      }];
    });
}
