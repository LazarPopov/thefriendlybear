"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SeasonalMenu } from "@/components/seasonal-menu";
import { AdminClientError, adminFetch, adminLoginPath } from "@/lib/admin/content-client";
import type { ContentAdminContext, SeasonalMenuPayload } from "@/lib/content-types";
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

export function AdminMenuPreviewClient() {
  const router = useRouter();
  const [context, setContext] = useState<ContentAdminContext | null>(null);
  const [menu, setMenu] = useState<SeasonalMenuPayload | null>(null);
  const [locale, setLocale] = useState<SiteLocale>("bg");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const payload = await adminFetch<MenuApiResponse>("/api/admin/menu");

        if (!isMounted) {
          return;
        }

        setContext(payload.context);
        setMenu(payload.menu);
      } catch (loadError) {
        if (loadError instanceof AdminClientError && loadError.status === 401) {
          router.replace(adminLoginPath("/admin/menu/preview"));
          return;
        }

        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load menu preview.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isLoading) {
    return (
      <main className="booking-shell booking-safe-screen">
        <section className="booking-safe-panel">
          <h1>Loading menu preview...</h1>
        </section>
      </main>
    );
  }

  if (error || !menu || !context) {
    return (
      <main className="booking-shell booking-safe-screen">
        <section className="booking-safe-panel">
          <p className="booking-kicker">No access</p>
          <h1>Menu preview unavailable</h1>
          {error ? <p className="booking-form-error">{error}</p> : null}
          <Link href="/admin/menu">Back to menu editor</Link>
        </section>
      </main>
    );
  }

  return (
    <>
      <div className="content-preview-toolbar">
        <div className="content-preview-toolbar-main">
          <div>
            <p className="booking-kicker">{context.restaurant.name} preview</p>
            <h1>{localeLabels[locale]} menu page</h1>
          </div>
          <nav className="booking-nav" aria-label="Menu preview navigation">
            <Link href="/admin">Admin</Link>
            <Link href="/admin/menu">Editor</Link>
            <Link href="/admin/reviews/preview">Reviews preview</Link>
            <Link href={`/${locale}/menu`} target="_blank">
              Live page
            </Link>
          </nav>
        </div>

        <div className="booking-nav content-preview-language-switch" role="group" aria-label="Preview language">
          {locales.map((item) => (
            <button
              key={item}
              type="button"
              className={item === locale ? "content-admin-tab-active" : undefined}
              onClick={() => setLocale(item)}
            >
              {localeLabels[item]}
            </button>
          ))}
        </div>
      </div>

      <SeasonalMenu locale={locale} menu={menu[locale]} />
    </>
  );
}
