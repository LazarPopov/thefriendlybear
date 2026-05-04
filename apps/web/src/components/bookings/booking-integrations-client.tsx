"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  fallbackContext,
  fetchBookingContext,
  fetchExternalSources,
  getActiveSession,
  isDemoSession,
  isSupabaseConfigured
} from "@/lib/bookings/supabase";
import type { BookingContext } from "@/lib/bookings/types";

type ExternalSource = {
  id: string;
  provider_name: string;
  provider_type: string;
  is_enabled: boolean;
  last_sync_at: string | null;
};

export function BookingIntegrationsClient() {
  const router = useRouter();
  const [context, setContext] = useState<BookingContext | null>(null);
  const [sources, setSources] = useState<ExternalSource[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const activeSession = await getActiveSession();

      if (!activeSession) {
        router.replace("/admin/bookings/login");
        return;
      }

      let bookingContext = fallbackContext();

      if (isSupabaseConfigured() && !isDemoSession(activeSession) && navigator.onLine) {
        const remoteContext = await fetchBookingContext(activeSession);

        if (remoteContext) {
          bookingContext = remoteContext;
          setSources(await fetchExternalSources(activeSession, bookingContext.restaurant.id));
        }
      } else {
        setMessage("Remote integrations will appear here after Supabase is configured.");
      }

      setContext(bookingContext);
      setIsLoading(false);
    }

    load().catch((error) => {
      setMessage(error instanceof Error ? error.message : "Unable to load integrations.");
      setIsLoading(false);
    });
  }, [router]);

  if (isLoading || !context) {
    return (
      <main className="booking-shell booking-safe-screen">
        <section className="booking-safe-panel">
          <h1>Loading integrations...</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="booking-shell booking-settings-shell">
      <header className="booking-subpage-header">
        <div>
          <p className="booking-kicker">{context.restaurant.name}</p>
          <h1>Integrations</h1>
        </div>
        <nav className="booking-nav" aria-label="Admin navigation">
          <Link href="/admin">Admin</Link>
          <Link href="/admin/bookings">Back to book</Link>
        </nav>
      </header>

      {message ? <p className="booking-status booking-status-sync">{message}</p> : null}

      <section className="booking-settings-section">
        <h2>External reservation sources</h2>
        {sources.length ? (
          <div className="booking-source-list">
            {sources.map((source) => (
              <article key={source.id} className="booking-source-card">
                <strong>{source.provider_name}</strong>
                <span>{source.provider_type}</span>
                <span>{source.is_enabled ? "Enabled" : "Disabled"}</span>
                <span>{source.last_sync_at ? new Date(source.last_sync_at).toLocaleString() : "Never synced"}</span>
              </article>
            ))}
          </div>
        ) : (
          <p className="booking-muted">Website forms, phone systems, Google reservations, and third-party booking imports use this table.</p>
        )}
      </section>

      <section className="booking-settings-section">
        <h2>Phone adapter</h2>
        <p className="booking-muted">
          Phone suggestions read from <code>phone_call_events</code>. A provider adapter should write active, ended, or missed call events there
          without coupling the reservation form to one phone system.
        </p>
      </section>
    </main>
  );
}
