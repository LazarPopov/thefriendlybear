"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AdminClientError, adminFetch, adminLoginPath } from "@/lib/admin/content-client";
import { getActiveSession } from "@/lib/bookings/supabase";
import type { BookingSession } from "@/lib/bookings/types";

export function AdminAccountClient() {
  const router = useRouter();
  const [session, setSession] = useState<BookingSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getActiveSession()
      .then((active) => {
        if (!isMounted) {
          return;
        }

        if (!active || active.access_token === "demo-local-session") {
          router.replace(adminLoginPath("/admin/account"));
          return;
        }

        setSession(active);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setMessage(null);

    if (!currentPassword) {
      setSubmitError("Enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setSubmitError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSubmitError("New password and confirmation do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setSubmitError("New password must be different from the current one.");
      return;
    }

    setIsSubmitting(true);

    try {
      await adminFetch("/api/admin/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });
      setMessage("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (
        error instanceof AdminClientError &&
        error.status === 401 &&
        !error.message.toLowerCase().includes("current password")
      ) {
        router.replace(adminLoginPath("/admin/account"));
        return;
      }

      setSubmitError(error instanceof Error ? error.message : "Unable to update password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="booking-shell booking-safe-screen">
        <section className="booking-safe-panel">
          <h1>Loading account...</h1>
        </section>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="booking-shell booking-settings-shell">
      <header className="booking-subpage-header">
        <div>
          <p className="booking-kicker">Account</p>
          <h1>Change password</h1>
        </div>
        <nav className="booking-nav" aria-label="Admin navigation">
          <Link href="/admin">Admin</Link>
          <Link href="/admin/bookings">Bookings</Link>
        </nav>
      </header>

      <section className="booking-settings-form">
        <div className="booking-settings-section">
          <div>
            <h2>Change password</h2>
            {session.user.email ? <p className="booking-muted">Signed in as {session.user.email}.</p> : null}
          </div>

          <form onSubmit={handleSubmit} className="booking-login-form">
            <label>
              Current password
              <input
                type="password"
                value={currentPassword}
                autoComplete="current-password"
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
              />
            </label>
            <label>
              New password
              <input
                type="password"
                value={newPassword}
                autoComplete="new-password"
                minLength={8}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
            </label>
            <label>
              Confirm new password
              <input
                type="password"
                value={confirmPassword}
                autoComplete="new-password"
                minLength={8}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </label>

            {submitError ? <p className="booking-form-error">{submitError}</p> : null}
            {message ? <p className="booking-status booking-status-sync">{message}</p> : null}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
