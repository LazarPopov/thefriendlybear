import { NextResponse } from "next/server";
import { AdminContentError, adminErrorResponse, serviceFetch } from "@/lib/admin/content-server";

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

type PasswordPayload = {
  currentPassword?: unknown;
  newPassword?: unknown;
  confirmPassword?: unknown;
};

type SupabaseAuthUser = {
  id: string;
  email?: string;
};

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function getBearerToken(request: Request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

async function fetchAuthUser(token: string): Promise<SupabaseAuthUser> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new AdminContentError(503, "Supabase service role is not configured.");
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new AdminContentError(401, "Sign in to continue.");
  }

  return (await response.json()) as SupabaseAuthUser;
}

async function verifyCurrentPassword(email: string, password: string) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new AdminContentError(401, "Current password is incorrect.");
  }
}

export async function POST(request: Request) {
  try {
    const token = getBearerToken(request);

    if (!token || token === "demo-local-session") {
      throw new AdminContentError(401, "Sign in to change your password.");
    }

    const user = await fetchAuthUser(token);

    if (!user.email) {
      throw new AdminContentError(400, "This account has no email and cannot change its password here.");
    }

    const body = (await request.json()) as PasswordPayload;
    const currentPassword = asString(body.currentPassword);
    const newPassword = asString(body.newPassword);
    const confirmPassword = asString(body.confirmPassword);

    if (!currentPassword) {
      return NextResponse.json({ error: "Enter your current password." }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "New password and confirmation do not match." }, { status: 400 });
    }

    if (newPassword === currentPassword) {
      return NextResponse.json({ error: "New password must be different from the current one." }, { status: 400 });
    }

    await verifyCurrentPassword(user.email, currentPassword);

    await serviceFetch<null>(`/auth/v1/admin/users/${encodeURIComponent(user.id)}`, {
      method: "PUT",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ password: newPassword })
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
