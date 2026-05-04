import { NextResponse } from "next/server";
import {
  AdminContentError,
  adminErrorResponse,
  getContentAdminContext,
  listReviewRows,
  requireReviewEditor,
  serviceFetch
} from "@/lib/admin/content-server";
import type { SiteReviewRecord } from "@/lib/content-types";
import type { SiteLocale } from "@/lib/site";

type ReviewPayload = {
  id?: string;
  author_name?: string;
  rating?: number;
  language?: SiteLocale;
  review_text?: string;
  source?: string;
  review_date?: string | null;
  relative_date_label?: string | null;
  source_url?: string | null;
  keyword_tags?: string[];
  is_featured?: boolean;
  sort_order?: number;
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOptionalText(value: unknown) {
  const text = cleanText(value);
  return text || null;
}

function cleanTags(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(cleanText).filter(Boolean);
}

function cleanReviewPayload(payload: ReviewPayload, staffProfileId: string, isUpdate: boolean) {
  const authorName = cleanText(payload.author_name);
  const reviewText = cleanText(payload.review_text);
  const rating = Number(payload.rating);
  const language = payload.language === "en" ? "en" : "bg";

  if (!authorName || !reviewText) {
    throw new AdminContentError(400, "Author and review text are required.");
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new AdminContentError(400, "Rating must be a number from 1 to 5.");
  }

  return {
    author_name: authorName,
    rating,
    language,
    review_text: reviewText,
    source: cleanText(payload.source) || "Google",
    review_date: cleanOptionalText(payload.review_date),
    relative_date_label: cleanOptionalText(payload.relative_date_label),
    source_url: cleanOptionalText(payload.source_url),
    keyword_tags: cleanTags(payload.keyword_tags),
    is_featured: payload.is_featured !== false,
    sort_order: Number.isFinite(Number(payload.sort_order)) ? Number(payload.sort_order) : 0,
    updated_by: staffProfileId,
    ...(isUpdate ? {} : { created_by: staffProfileId })
  };
}

export async function GET(request: Request) {
  try {
    const context = await getContentAdminContext(request);
    requireReviewEditor(context);
    const reviews = await listReviewRows();

    return NextResponse.json({ context, reviews });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const context = await getContentAdminContext(request);
    requireReviewEditor(context);
    const body = (await request.json()) as ReviewPayload;
    const cleaned = cleanReviewPayload(body, context.staffProfile.id, false);
    const rows = await serviceFetch<SiteReviewRecord[]>("/rest/v1/site_reviews?select=*", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(cleaned)
    });

    return NextResponse.json({ context, review: rows[0], reviews: await listReviewRows() });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const context = await getContentAdminContext(request);
    requireReviewEditor(context);
    const body = (await request.json()) as ReviewPayload;

    if (!body.id) {
      return NextResponse.json({ error: "Review id is required." }, { status: 400 });
    }

    const cleaned = cleanReviewPayload(body, context.staffProfile.id, true);
    const rows = await serviceFetch<SiteReviewRecord[]>(`/rest/v1/site_reviews?id=eq.${encodeURIComponent(body.id)}&select=*`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(cleaned)
    });

    return NextResponse.json({ context, review: rows[0], reviews: await listReviewRows() });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const context = await getContentAdminContext(request);
    requireReviewEditor(context);
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Review id is required." }, { status: 400 });
    }

    await serviceFetch<SiteReviewRecord[]>(`/rest/v1/site_reviews?id=eq.${encodeURIComponent(id)}&select=*`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        is_active: false,
        updated_by: context.staffProfile.id
      })
    });

    return NextResponse.json({ context, reviews: await listReviewRows() });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
