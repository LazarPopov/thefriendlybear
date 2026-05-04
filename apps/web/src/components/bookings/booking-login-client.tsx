"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { getActiveSession, isSupabaseConfigured, signInWithPassword } from "@/lib/bookings/supabase";

export function BookingLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    getActiveSession().then((session) => {
      if (session) {
        router.replace("/admin/bookings");
      }
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signInWithPassword(email.trim() || "demo@friendlybear.local", password);
      router.replace("/admin/bookings");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="booking-shell booking-login-shell">
      <section className="booking-login-panel">
        <p className="booking-kicker">Staff reservation book</p>
        <h1>The Friendly Bear Bookings</h1>
        <form onSubmit={handleSubmit} className="booking-login-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="owner.bookings@friendlybear.local"
              required={configured}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              required={configured}
            />
          </label>
          {error ? <p className="booking-form-error">{error}</p> : null}
          {!configured ? (
            <p className="booking-login-note">
              Supabase environment variables are not configured, so this opens a local offline demo session.
            </p>
          ) : null}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : configured ? "Sign in" : "Open local demo"}
          </button>
        </form>
        <Link href="/bg" className="booking-subtle-link">
          Back to website
        </Link>
      </section>
    </main>
  );
}
