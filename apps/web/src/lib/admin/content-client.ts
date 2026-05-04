"use client";

import { getActiveSession } from "@/lib/bookings/supabase";

export class AdminClientError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function adminLoginPath(nextPath: string) {
  return `/admin/bookings/login?next=${encodeURIComponent(nextPath)}`;
}

export async function adminFetch<T>(path: string, options: RequestInit = {}) {
  const session = await getActiveSession();

  if (!session) {
    throw new AdminClientError(401, "Sign in to continue.");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${session.access_token}`);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...options,
    headers
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new AdminClientError(response.status, payload?.error || `Request failed with ${response.status}.`);
  }

  return payload as T;
}
