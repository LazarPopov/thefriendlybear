"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadPendingMutations, savePendingMutation } from "@/lib/bookings/local-db";
import {
  fallbackContext,
  fetchBookingContext,
  fetchSyncConflicts,
  getActiveSession,
  isDemoSession,
  isSupabaseConfigured,
  resolveRemoteConflict
} from "@/lib/bookings/supabase";
import type { BookingContext, BookingSession, PendingMutation, SyncConflict } from "@/lib/bookings/types";

export function BookingConflictsClient() {
  const router = useRouter();
  const [session, setSession] = useState<BookingSession | null>(null);
  const [context, setContext] = useState<BookingContext | null>(null);
  const [localConflicts, setLocalConflicts] = useState<PendingMutation[]>([]);
  const [remoteConflicts, setRemoteConflicts] = useState<SyncConflict[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    const activeSession = await getActiveSession();

    if (!activeSession) {
      router.replace("/admin/bookings/login");
      return;
    }

    setSession(activeSession);
    let bookingContext = fallbackContext();

    if (isSupabaseConfigured() && !isDemoSession(activeSession) && navigator.onLine) {
      const remoteContext = await fetchBookingContext(activeSession);

      if (remoteContext) {
        bookingContext = remoteContext;
      }
    }

    setContext(bookingContext);
    const mutations = await loadPendingMutations();
    setLocalConflicts(mutations.filter((mutation) => mutation.sync_state === "conflict"));

    if (isSupabaseConfigured() && !isDemoSession(activeSession) && navigator.onLine) {
      setRemoteConflicts(await fetchSyncConflicts(activeSession, bookingContext.restaurant.id));
    }

    setIsLoading(false);
  }

  useEffect(() => {
    load().catch((error) => {
      setMessage(error instanceof Error ? error.message : "Unable to load conflicts.");
      setIsLoading(false);
    });
  }, []);

  async function discardLocal(mutation: PendingMutation) {
    await savePendingMutation({ ...mutation, sync_state: "synced" });
    await load();
  }

  async function resolve(conflict: SyncConflict, resolution: "keep_server" | "keep_local" | "discard_local") {
    if (!session) {
      return;
    }

    await resolveRemoteConflict(session, conflict.id, resolution);
    await load();
  }

  if (isLoading || !context) {
    return (
      <main className="booking-shell booking-safe-screen">
        <section className="booking-safe-panel">
          <h1>Loading conflicts...</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="booking-shell booking-settings-shell">
      <header className="booking-subpage-header">
        <div>
          <p className="booking-kicker">{context.restaurant.name}</p>
          <h1>Sync conflicts</h1>
        </div>
        <nav className="booking-nav" aria-label="Admin navigation">
          <Link href="/admin">Admin</Link>
          <Link href="/admin/bookings">Back to book</Link>
        </nav>
      </header>

      {message ? <p className="booking-status booking-status-warning">{message}</p> : null}

      {!localConflicts.length && !remoteConflicts.length ? (
        <section className="booking-settings-section">
          <h2>No conflicts</h2>
          <p className="booking-muted">Overlapping reservations are allowed. Only stale edits to the same reservation appear here.</p>
        </section>
      ) : null}

      {remoteConflicts.length ? (
        <section className="booking-settings-section">
          <h2>Server conflicts</h2>
          <div className="booking-conflict-list">
            {remoteConflicts.map((conflict) => (
              <article key={conflict.id} className="booking-conflict-card">
                <p className="booking-kicker">Base version {conflict.base_version ?? "unknown"}</p>
                <div className="booking-conflict-columns">
                  <pre>{JSON.stringify(conflict.server_payload, null, 2)}</pre>
                  <pre>{JSON.stringify(conflict.local_payload, null, 2)}</pre>
                </div>
                <div className="booking-conflict-actions">
                  <button type="button" onClick={() => resolve(conflict, "keep_server")}>
                    Keep server
                  </button>
                  <button type="button" onClick={() => resolve(conflict, "keep_local")}>
                    Keep local
                  </button>
                  <button type="button" onClick={() => resolve(conflict, "discard_local")}>
                    Discard local
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {localConflicts.length ? (
        <section className="booking-settings-section">
          <h2>Local conflicts</h2>
          <div className="booking-conflict-list">
            {localConflicts.map((mutation) => (
              <article key={mutation.mutation_id} className="booking-conflict-card">
                <p className="booking-kicker">{mutation.operation}</p>
                <pre>{JSON.stringify(mutation.payload, null, 2)}</pre>
                <button type="button" onClick={() => discardLocal(mutation)}>
                  Mark local copy reviewed
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
