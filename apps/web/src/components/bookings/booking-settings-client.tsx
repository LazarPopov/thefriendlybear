"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { createId, DEFAULT_BOOKING_SETTINGS, makeDefaultTables } from "@/lib/bookings/defaults";
import { loadSettings, loadTables, saveSettings, saveTables } from "@/lib/bookings/local-db";
import {
  fallbackContext,
  fetchBookingContext,
  fetchBookingSettings,
  fetchTables,
  getActiveSession,
  isDemoSession,
  isSupabaseConfigured,
  updateRemoteSettings,
  upsertRemoteTables
} from "@/lib/bookings/supabase";
import type { BookingContext, BookingSession, BookingSettings, RestaurantTable } from "@/lib/bookings/types";

function canManageSettings(context: BookingContext | null) {
  return context?.membership.role === "owner" || context?.membership.role === "admin" || context?.staffProfile.role === "owner";
}

function settingsForRestaurant(settings: BookingSettings | null, restaurantId: string): BookingSettings {
  const resolved = {
    ...DEFAULT_BOOKING_SETTINGS,
    ...settings,
    id: settings?.id ?? `local-settings-${restaurantId}`,
    restaurant_id: restaurantId
  };

  if (
    resolved.opening_start_time === "12:00" &&
    resolved.last_bookable_start_time === "22:00" &&
    resolved.visible_end_time === "22:00"
  ) {
    return {
      ...resolved,
      visible_end_time: "00:00"
    };
  }

  return resolved;
}

export function BookingSettingsClient() {
  const router = useRouter();
  const [session, setSession] = useState<BookingSession | null>(null);
  const [context, setContext] = useState<BookingContext | null>(null);
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      const restaurantId = bookingContext.restaurant.id;
      let nextSettings = await loadSettings(restaurantId);
      let nextTables = await loadTables(restaurantId);

      if (isSupabaseConfigured() && !isDemoSession(activeSession) && navigator.onLine) {
        nextSettings = await fetchBookingSettings(activeSession, restaurantId);
        nextTables = await fetchTables(activeSession, restaurantId);
      }

      if (!nextTables.length) {
        nextTables = makeDefaultTables(restaurantId);
      }

      setSettings(settingsForRestaurant(nextSettings, restaurantId));
      setTables(nextTables);
      setIsLoading(false);
    }

    load().catch((error) => {
      setMessage(error instanceof Error ? error.message : "Unable to load settings.");
      setIsLoading(false);
    });
  }, [router]);

  function updateTable(id: string, patch: Partial<RestaurantTable>) {
    setTables((current) => current.map((table) => (table.id === id ? { ...table, ...patch } : table)));
  }

  function addTable() {
    if (!context) {
      return;
    }

    setTables((current) => [
      ...current,
      {
        id: createId("table"),
        restaurant_id: context.restaurant.id,
        table_number: "",
        display_label: "",
        area: null,
        capacity_min: null,
        capacity_max: null,
        sort_order: current.length + 1,
        is_active: true,
        notes: null
      }
    ]);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!settings || !context) {
      return;
    }

    const normalizedTables = tables.map((table, index) => ({
      ...table,
      table_number: table.table_number.trim(),
      display_label: (table.display_label || table.table_number).trim(),
      sort_order: index + 1
    }));

    await saveSettings(settings);
    await saveTables(normalizedTables);

    if (session && isSupabaseConfigured() && !isDemoSession(session) && navigator.onLine) {
      try {
        const remoteSettings = await updateRemoteSettings(session, settings);
        const remoteTables = await upsertRemoteTables(session, normalizedTables);
        setSettings(remoteSettings);
        setTables(remoteTables);
        await saveSettings(remoteSettings);
        await saveTables(remoteTables);
        setMessage("Settings saved.");
        return;
      } catch {
        setMessage("Server unavailable. Settings are saved locally and can be applied again later.");
        return;
      }
    }

    setMessage("Settings saved locally.");
  }

  if (isLoading || !settings || !context) {
    return (
      <main className="booking-shell booking-safe-screen">
        <section className="booking-safe-panel">
          <h1>Loading settings...</h1>
        </section>
      </main>
    );
  }

  const editable = canManageSettings(context);

  return (
    <main className="booking-shell booking-settings-shell">
      <header className="booking-subpage-header">
        <div>
          <p className="booking-kicker">{context.restaurant.name}</p>
          <h1>Booking settings</h1>
        </div>
        <Link href="/admin/bookings">Back to book</Link>
      </header>

      {!editable ? <p className="booking-status booking-status-warning">Only owner and admin accounts can change settings.</p> : null}
      {message ? <p className="booking-status booking-status-sync">{message}</p> : null}

      <form className="booking-settings-form" onSubmit={handleSave}>
        <section className="booking-settings-section">
          <h2>Times</h2>
          <div className="booking-settings-grid">
            <label>
              Opening start
              <input
                type="time"
                value={settings.opening_start_time}
                disabled={!editable}
                onChange={(event) => setSettings({ ...settings, opening_start_time: event.target.value })}
              />
            </label>
            <label>
              Last bookable start
              <input
                type="time"
                value={settings.last_bookable_start_time}
                disabled={!editable}
                onChange={(event) => setSettings({ ...settings, last_bookable_start_time: event.target.value })}
              />
            </label>
            <label>
              Visible end
              <input
                type="time"
                value={settings.visible_end_time}
                disabled={!editable}
                onChange={(event) => setSettings({ ...settings, visible_end_time: event.target.value })}
              />
            </label>
            <label>
              Default duration minutes
              <input
                type="number"
                min="15"
                step="15"
                value={settings.default_duration_minutes}
                disabled={!editable}
                onChange={(event) => setSettings({ ...settings, default_duration_minutes: Number(event.target.value) })}
              />
            </label>
            <label>
              Slot step minutes
              <input
                type="number"
                min="5"
                step="5"
                value={settings.slot_step_minutes}
                disabled={!editable}
                onChange={(event) => setSettings({ ...settings, slot_step_minutes: Number(event.target.value) })}
              />
            </label>
            <label>
              Prepare popup minutes
              <input
                type="number"
                min="0"
                step="5"
                value={settings.prepare_popup_minutes_before}
                disabled={!editable}
                onChange={(event) => setSettings({ ...settings, prepare_popup_minutes_before: Number(event.target.value) })}
              />
            </label>
          </div>
          <label className="booking-settings-check">
            <input
              type="checkbox"
              checked={settings.auto_group_connected_tables}
              disabled={!editable}
              onChange={(event) => setSettings({ ...settings, auto_group_connected_tables: event.target.checked })}
            />
            Auto group connected table rows
          </label>
          <label className="booking-settings-check">
            <input
              type="checkbox"
              checked={settings.allow_connected_table_reservations}
              disabled={!editable}
              onChange={(event) => setSettings({ ...settings, allow_connected_table_reservations: event.target.checked })}
            />
            Allow connected table reservations
          </label>
          <label>
            Next reservation warning
            <select
              value={settings.next_reservation_warning_mode}
              disabled={!editable}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  next_reservation_warning_mode: event.target.value as BookingSettings["next_reservation_warning_mode"]
                })
              }
            >
              <option value="from_start_time">From start time</option>
              <option value="from_end_time">From end time</option>
            </select>
          </label>
        </section>

        <section className="booking-settings-section">
          <div className="booking-section-heading-row">
            <h2>Tables</h2>
            <button type="button" onClick={addTable} disabled={!editable}>
              Add table
            </button>
          </div>
          <div className="booking-table-settings-list">
            {tables.map((table) => (
              <div key={table.id} className="booking-table-settings-row">
                <input
                  aria-label="Table number"
                  value={table.table_number}
                  disabled={!editable}
                  onChange={(event) => updateTable(table.id, { table_number: event.target.value })}
                  placeholder="54"
                />
                <input
                  aria-label="Display label"
                  value={table.display_label ?? ""}
                  disabled={!editable}
                  onChange={(event) => updateTable(table.id, { display_label: event.target.value })}
                  placeholder="Terrace 1"
                />
                <label>
                  <input
                    type="checkbox"
                    checked={table.is_active}
                    disabled={!editable}
                    onChange={(event) => updateTable(table.id, { is_active: event.target.checked })}
                  />
                  Active
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className="booking-settings-section">
          <h2>Staff accounts</h2>
          <p className="booking-muted">
            The five premade accounts are seeded with <code>npm run seed:booking-staff</code>. Password resets should be issued through
            Supabase Auth admin controls or a secure server route using the service role key.
          </p>
        </section>

        <button type="submit" className="booking-save-settings" disabled={!editable}>
          Save settings
        </button>
      </form>
    </main>
  );
}
