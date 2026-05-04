import { cache } from "react";
import { normalizeSeasonalMenuPayload, type SeasonalMenuPayload, type SeasonalMenuRecord, type SiteReviewRecord } from "@/lib/content-types";
import { springMenuContent } from "@/lib/spring-menu-content";
import type { SiteLocale } from "@/lib/site";

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_API_KEY = SUPABASE_PUBLIC_KEY.startsWith("sb_secret_") ? "" : SUPABASE_PUBLIC_KEY;

function isPublicSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_API_KEY);
}

async function parseResponse<T>(response: Response) {
  if (!response.ok) {
    return null;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

const publicFetch = cache(async <T>(path: string): Promise<T | null> => {
  if (!isPublicSupabaseConfigured()) {
    return null;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}${path}`, {
      next: { revalidate: 60 },
      headers: {
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
        Accept: "application/json"
      }
    });

    return parseResponse<T>(response);
  } catch {
    return null;
  }
});

export async function fetchPublishedSeasonalMenuPayload(): Promise<SeasonalMenuPayload | null> {
  const rows = await publicFetch<SeasonalMenuRecord[]>(
    "/rest/v1/seasonal_menus?status=eq.published&select=id,status,payload,valid_from,valid_to,published_at,created_at,updated_at&order=published_at.desc.nullslast,updated_at.desc&limit=1"
  );
  const row = Array.isArray(rows) ? rows[0] : null;

  if (!row?.payload) {
    return null;
  }

  return normalizeSeasonalMenuPayload(row.payload, springMenuContent);
}

export async function fetchFeaturedReviewRows(locale: SiteLocale) {
  const rows = await publicFetch<SiteReviewRecord[]>(
    `/rest/v1/site_reviews?language=eq.${locale}&is_active=eq.true&is_featured=eq.true&select=*&order=sort_order.asc,created_at.desc&limit=6`
  );

  return Array.isArray(rows) ? rows : [];
}
