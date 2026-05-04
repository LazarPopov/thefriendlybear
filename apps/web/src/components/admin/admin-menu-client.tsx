"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminClientError, adminFetch, adminLoginPath } from "@/lib/admin/content-client";
import type { ContentAdminContext, SeasonalMenuPayload } from "@/lib/content-types";
import type { FrontendMenuItem, FrontendMenuSection } from "@/lib/cms/menu-adapter";
import type { SiteLocale } from "@/lib/site";

type MenuApiResponse = {
  context: ContentAdminContext;
  menu: SeasonalMenuPayload;
};

const locales: SiteLocale[] = ["bg", "en"];
const localeLabels: Record<SiteLocale, string> = {
  bg: "Bulgarian",
  en: "English"
};

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function emptyItem(): FrontendMenuItem {
  return {
    name: "",
    description: [],
    serving: "",
    allergens: "",
    priceBgn: "",
    priceEuro: "",
    isVegetarian: false
  };
}

function emptySection(locale: SiteLocale): FrontendMenuSection {
  return {
    title: locale === "bg" ? "Нова секция" : "New section",
    items: [emptyItem()]
  };
}

export function AdminMenuClient() {
  const router = useRouter();
  const [context, setContext] = useState<ContentAdminContext | null>(null);
  const [menu, setMenu] = useState<SeasonalMenuPayload | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function load() {
    setIsLoading(true);
    setError(null);

    try {
      const payload = await adminFetch<MenuApiResponse>("/api/admin/menu");
      setContext(payload.context);
      setMenu(payload.menu);
    } catch (loadError) {
      if (loadError instanceof AdminClientError && loadError.status === 401) {
        router.replace(adminLoginPath("/admin/menu"));
        return;
      }

      setError(loadError instanceof Error ? loadError.message : "Unable to load menu editor.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function updateLocale(locale: SiteLocale, patch: Partial<SeasonalMenuPayload[SiteLocale]>) {
    setMenu((current) => (current ? { ...current, [locale]: { ...current[locale], ...patch } } : current));
  }

  function updateSection(locale: SiteLocale, sectionIndex: number, patch: Partial<FrontendMenuSection>) {
    setMenu((current) => {
      if (!current) {
        return current;
      }

      const sections = current[locale].sections.map((section, index) =>
        index === sectionIndex ? { ...section, ...patch } : section
      );
      return { ...current, [locale]: { ...current[locale], sections } };
    });
  }

  function updateItem(locale: SiteLocale, sectionIndex: number, itemIndex: number, patch: Partial<FrontendMenuItem>) {
    setMenu((current) => {
      if (!current) {
        return current;
      }

      const sections = current[locale].sections.map((section, index) => {
        if (index !== sectionIndex) {
          return section;
        }

        const items = section.items.map((item, nestedIndex) => (nestedIndex === itemIndex ? { ...item, ...patch } : item));
        return { ...section, items };
      });

      return { ...current, [locale]: { ...current[locale], sections } };
    });
  }

  function addSection(locale: SiteLocale) {
    setMenu((current) =>
      current
        ? {
            ...current,
            [locale]: {
              ...current[locale],
              sections: [...current[locale].sections, emptySection(locale)]
            }
          }
        : current
    );
  }

  function removeSection(locale: SiteLocale, sectionIndex: number) {
    setMenu((current) =>
      current
        ? {
            ...current,
            [locale]: {
              ...current[locale],
              sections: current[locale].sections.filter((_section, index) => index !== sectionIndex)
            }
          }
        : current
    );
  }

  function addItem(locale: SiteLocale, sectionIndex: number) {
    setMenu((current) => {
      if (!current) {
        return current;
      }

      const sections = current[locale].sections.map((section, index) =>
        index === sectionIndex ? { ...section, items: [...section.items, emptyItem()] } : section
      );
      return { ...current, [locale]: { ...current[locale], sections } };
    });
  }

  function removeItem(locale: SiteLocale, sectionIndex: number, itemIndex: number) {
    setMenu((current) => {
      if (!current) {
        return current;
      }

      const sections = current[locale].sections.map((section, index) =>
        index === sectionIndex ? { ...section, items: section.items.filter((_item, nestedIndex) => nestedIndex !== itemIndex) } : section
      );
      return { ...current, [locale]: { ...current[locale], sections } };
    });
  }

  async function save(action: "save_draft" | "publish") {
    if (!menu) {
      return;
    }

    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const payload = await adminFetch<MenuApiResponse>("/api/admin/menu", {
        method: "POST",
        body: JSON.stringify({ action, menu })
      });
      setContext(payload.context);
      setMenu(payload.menu);
      setMessage(action === "publish" ? "Menu published." : "Draft saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save menu.");
    } finally {
      setIsSaving(false);
    }
  }

  function renderLocaleEditor(locale: SiteLocale) {
    if (!menu) {
      return null;
    }

    const currentMenu = menu[locale];

    return (
      <div key={locale} className="content-admin-locale-column">
        <section className="booking-settings-section">
          <div className="booking-section-heading-row">
            <div>
              <p className="booking-kicker">{locale.toUpperCase()}</p>
              <h2>{localeLabels[locale]} menu page</h2>
            </div>
          </div>

          <div className="booking-settings-grid">
            <label>
              Eyebrow
              <input value={currentMenu.eyebrow} onChange={(event) => updateLocale(locale, { eyebrow: event.target.value })} />
            </label>
            <label>
              Title
              <input value={currentMenu.title} onChange={(event) => updateLocale(locale, { title: event.target.value })} />
            </label>
            <label className="content-admin-wide-field">
              Intro
              <textarea value={currentMenu.intro} onChange={(event) => updateLocale(locale, { intro: event.target.value })} />
            </label>
          </div>
        </section>

        {currentMenu.sections.map((section, sectionIndex) => (
          <section key={`${locale}-${sectionIndex}`} className="booking-settings-section content-admin-section">
            <div className="booking-section-heading-row">
              <label className="content-admin-section-title">
                Section title
                <input value={section.title} onChange={(event) => updateSection(locale, sectionIndex, { title: event.target.value })} />
              </label>
              <button type="button" className="booking-danger-button" onClick={() => removeSection(locale, sectionIndex)}>
                Remove section
              </button>
            </div>

            <div className="content-admin-item-list">
              {section.items.map((item, itemIndex) => (
                <article key={`${locale}-${sectionIndex}-${itemIndex}`} className="content-admin-item">
                  <div className="booking-section-heading-row">
                    <h2>Item {itemIndex + 1}</h2>
                    <button type="button" className="booking-danger-button" onClick={() => removeItem(locale, sectionIndex, itemIndex)}>
                      Remove item
                    </button>
                  </div>
                  <div className="booking-settings-grid">
                    <label className="content-admin-wide-field">
                      Name
                      <input value={item.name} onChange={(event) => updateItem(locale, sectionIndex, itemIndex, { name: event.target.value })} />
                    </label>
                    <label>
                      Serving
                      <input value={item.serving ?? ""} onChange={(event) => updateItem(locale, sectionIndex, itemIndex, { serving: event.target.value })} />
                    </label>
                    <label>
                      BGN price
                      <input value={item.priceBgn ?? ""} onChange={(event) => updateItem(locale, sectionIndex, itemIndex, { priceBgn: event.target.value })} />
                    </label>
                    <label>
                      EUR price
                      <input value={item.priceEuro ?? ""} onChange={(event) => updateItem(locale, sectionIndex, itemIndex, { priceEuro: event.target.value })} />
                    </label>
                    <label className="content-admin-wide-field">
                      Description
                      <textarea
                        value={(item.description ?? []).join("\n")}
                        onChange={(event) => updateItem(locale, sectionIndex, itemIndex, { description: splitLines(event.target.value) })}
                      />
                    </label>
                    <label className="content-admin-wide-field">
                      Allergens
                      <input value={item.allergens ?? ""} onChange={(event) => updateItem(locale, sectionIndex, itemIndex, { allergens: event.target.value })} />
                    </label>
                    <label className="booking-settings-check">
                      <input
                        type="checkbox"
                        checked={item.isVegetarian ?? false}
                        onChange={(event) => updateItem(locale, sectionIndex, itemIndex, { isVegetarian: event.target.checked })}
                      />
                      Vegetarian
                    </label>
                  </div>
                </article>
              ))}
            </div>

            <button type="button" onClick={() => addItem(locale, sectionIndex)}>
              Add item
            </button>
          </section>
        ))}

        <section className="booking-settings-section">
          <button type="button" onClick={() => addSection(locale)}>
            Add section
          </button>
        </section>
      </div>
    );
  }

  if (isLoading) {
    return (
      <main className="booking-shell booking-safe-screen">
        <section className="booking-safe-panel">
          <h1>Loading menu editor...</h1>
        </section>
      </main>
    );
  }

  if (error && !menu) {
    return (
      <main className="booking-shell booking-safe-screen">
        <section className="booking-safe-panel">
          <p className="booking-kicker">No access</p>
          <h1>Menu editor unavailable</h1>
          <p className="booking-form-error">{error}</p>
          <Link href="/admin/bookings">Back to bookings</Link>
        </section>
      </main>
    );
  }

  if (!menu || !context) {
    return null;
  }

  return (
    <main className="booking-shell booking-settings-shell">
      <header className="booking-subpage-header">
        <div>
          <p className="booking-kicker">{context.restaurant.name}</p>
          <h1>Seasonal menu</h1>
        </div>
        <nav className="booking-nav" aria-label="Admin navigation">
          <Link href="/admin">Admin</Link>
          <Link href="/admin/bookings">Bookings</Link>
          <Link href="/admin/menu/preview">Preview</Link>
          <Link href="/admin/reviews">Reviews</Link>
          <Link href="/admin/content-access">Access</Link>
        </nav>
      </header>

      {message ? <p className="booking-status booking-status-sync">{message}</p> : null}
      {error ? <p className="booking-status booking-status-warning">{error}</p> : null}

      <form className="booking-settings-form content-admin-form content-admin-form-wide" onSubmit={(event) => event.preventDefault()}>
        <section className="booking-settings-section">
          <div className="booking-section-heading-row">
            <h2>Edit both public menu pages</h2>
            <div className="content-admin-actions">
              <Link href="/admin/menu/preview" className="content-admin-action-link">
                Preview
              </Link>
              <button type="button" onClick={() => save("save_draft")} disabled={isSaving}>
                Save draft
              </button>
              <button type="button" className="booking-save-settings" onClick={() => save("publish")} disabled={isSaving}>
                Publish menu
              </button>
            </div>
          </div>
        </section>

        <div className="content-admin-locale-grid">{locales.map((locale) => renderLocaleEditor(locale))}</div>
      </form>
    </main>
  );
}
