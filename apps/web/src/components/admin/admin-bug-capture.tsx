"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createId } from "@/lib/bookings/defaults";
import { loadPendingMutations, saveBugReport } from "@/lib/bookings/local-db";
import {
  createRemoteBugReport,
  fetchBookingContext,
  getActiveSession,
  isDemoSession,
  isSupabaseConfigured
} from "@/lib/bookings/supabase";
import type { BookingBugReport, BookingContext, BookingSession } from "@/lib/bookings/types";

type ClientErrorEntry = {
  kind: "error" | "unhandledrejection" | "console.error";
  message: string;
  stack?: string;
  created_at: string;
};

const clientErrorLog: ClientErrorEntry[] = [];

function rememberClientError(entry: Omit<ClientErrorEntry, "created_at">) {
  clientErrorLog.push({ ...entry, created_at: new Date().toISOString() });

  if (clientErrorLog.length > 30) {
    clientErrorLog.splice(0, clientErrorLog.length - 30);
  }
}

function errorMessage(value: unknown) {
  if (value instanceof Error) {
    return value.message;
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function errorStack(value: unknown) {
  return value instanceof Error ? value.stack : undefined;
}

function safeJson(value: unknown) {
  return JSON.parse(
    JSON.stringify(value, (_key, nestedValue) => {
      if (nestedValue instanceof Error) {
        return {
          name: nestedValue.name,
          message: nestedValue.message,
          stack: nestedValue.stack
        };
      }

      return nestedValue;
    })
  ) as Record<string, unknown>;
}

function downloadBugReport(report: BookingBugReport) {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `friendlybear-bug-report-${report.created_at.replace(/[:.]/g, "-")}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function resolveBugContext(session: BookingSession | null) {
  if (!session || isDemoSession(session) || !isSupabaseConfigured()) {
    return null;
  }

  return fetchBookingContext(session).catch((error) => {
    rememberClientError({
      kind: "error",
      message: `Could not load staff context for bug report: ${errorMessage(error)}`,
      stack: errorStack(error)
    });
    return null;
  });
}

function getLastSelectedDate() {
  if (typeof localStorage === "undefined") {
    return null;
  }

  const value = localStorage.getItem("friendlybear_booking_last_selected_date");
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function buildBrowserState({
  context,
  session,
  pendingMutations,
  userNote
}: {
  context: BookingContext | null;
  session: BookingSession | null;
  pendingMutations: unknown[];
  userNote: string | null;
}) {
  const storageEstimatePromiseUnavailable = !navigator.storage?.estimate;

  return {
    url: window.location.href,
    pathname: window.location.pathname,
    title: document.title,
    user_agent: navigator.userAgent,
    online: navigator.onLine,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      device_pixel_ratio: window.devicePixelRatio
    },
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      avail_width: window.screen.availWidth,
      avail_height: window.screen.availHeight
    },
    page_scroll: {
      left: window.scrollX,
      top: window.scrollY,
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      client_width: document.documentElement.clientWidth,
      client_height: document.documentElement.clientHeight
    },
    supabase_configured: isSupabaseConfigured(),
    demo_session: session ? isDemoSession(session) : false,
    session_user: session
      ? {
          id: session.user.id,
          email: session.user.email ?? null
        }
      : null,
    restaurant: context?.restaurant ?? null,
    staff_profile: context?.staffProfile ?? null,
    membership: context?.membership ?? null,
    selected_date: getLastSelectedDate(),
    user_note: userNote,
    storage_estimate_unavailable: storageEstimatePromiseUnavailable,
    pending_mutations: pendingMutations,
    recent_errors: clientErrorLog
  };
}

export function AdminBugCapture() {
  const pathname = usePathname();
  const isReservationGrid = pathname === "/admin/bookings";
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const shouldShowButton = useMemo(() => !isReservationGrid, [isReservationGrid]);

  useEffect(() => {
    if (isReservationGrid) {
      return;
    }

    const originalConsoleError = console.error;

    function handleWindowError(event: ErrorEvent) {
      rememberClientError({
        kind: "error",
        message: event.message,
        stack: event.error instanceof Error ? event.error.stack : undefined
      });
    }

    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      rememberClientError({
        kind: "unhandledrejection",
        message: errorMessage(event.reason),
        stack: errorStack(event.reason)
      });
    }

    console.error = (...args: unknown[]) => {
      rememberClientError({
        kind: "console.error",
        message: args.map(errorMessage).join(" "),
        stack: args.map(errorStack).filter(Boolean).join("\n")
      });
      originalConsoleError.apply(console, args);
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      console.error = originalConsoleError;
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [isReservationGrid]);

  async function createBugReport() {
    setIsCreating(true);
    setMessage(null);
    const userNote = note.trim() || null;

    try {
      const session = await getActiveSession();
      const context = await resolveBugContext(session);
      const pendingMutations = await loadPendingMutations().catch((error) => {
        rememberClientError({
          kind: "error",
          message: `Could not load pending mutations for bug report: ${errorMessage(error)}`,
          stack: errorStack(error)
        });
        return [];
      });
      const storageEstimate = navigator.storage?.estimate ? await navigator.storage.estimate().catch(() => null) : null;
      const now = new Date().toISOString();
      const report: BookingBugReport = {
        id: createId("bug-report"),
        created_at: now,
        restaurant_id: context?.restaurant.id ?? null,
        staff_profile_id: context?.staffProfile.id ?? null,
        selected_date: getLastSelectedDate(),
        screenshot_data_url: null,
        screenshot_error: null,
        state: safeJson({
          ...buildBrowserState({
            context,
            session,
            pendingMutations,
            userNote
          }),
          storage_estimate: storageEstimate
        })
      };

      await saveBugReport(report);

      let remoteReportId: string | null = null;
      let remoteError: string | null = null;

      if (session && context && navigator.onLine && isSupabaseConfigured() && !isDemoSession(session)) {
        try {
          remoteReportId = await createRemoteBugReport(session, report);
        } catch (error) {
          remoteError = errorMessage(error);
          rememberClientError({
            kind: "error",
            message: `Could not save bug report to database: ${remoteError}`,
            stack: errorStack(error)
          });
        }
      } else {
        remoteError = "Database submit is unavailable while offline, signed out, or in local demo mode.";
      }

      if (remoteReportId) {
        setMessage(`Bug report saved in the database. ID: ${remoteReportId}`);
      } else {
        downloadBugReport(report);
        setMessage(`Bug report saved on this device and downloaded. ${remoteError ?? ""}`.trim());
      }

      setIsFormOpen(false);
      setNote("");
    } catch (error) {
      setMessage(`Could not save bug report: ${errorMessage(error)}`);
    } finally {
      setIsCreating(false);
    }
  }

  if (!shouldShowButton) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="booking-bug-button admin-bug-capture-button"
        aria-label="Save bug report"
        title="Save bug report"
        disabled={isCreating}
        onClick={() => setIsFormOpen(true)}
      />
      {isFormOpen ? (
        <form
          className="admin-bug-capture-form"
          role="dialog"
          aria-label="Save bug report"
          onSubmit={(event) => {
            event.preventDefault();
            createBugReport();
          }}
        >
          <p className="booking-kicker">Bug report</p>
          <h2>What happened?</h2>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Optional: describe what went wrong."
            aria-label="Bug report note"
          />
          <div className="content-admin-actions">
            <button type="button" onClick={() => setIsFormOpen(false)} disabled={isCreating}>
              Cancel
            </button>
            <button type="submit" className="booking-save-settings" disabled={isCreating}>
              Submit report
            </button>
          </div>
        </form>
      ) : null}
      {message ? (
        <div className="admin-bug-capture-toast" role="status">
          <p>{message}</p>
          <button type="button" onClick={() => setMessage(null)} aria-label="Dismiss bug report message">
            x
          </button>
        </div>
      ) : null}
    </>
  );
}
