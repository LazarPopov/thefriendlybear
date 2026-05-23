import type { SiteLocale } from "@/lib/site";

export const runtime = "nodejs";

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

type RegularMenuFileRow = {
  filename: string;
  content_type: string | null;
  content_base64: string;
  byte_size: number | null;
  sha256: string | null;
};

function getMenuLocale(value: string | null): SiteLocale {
  return value === "bg" ? "bg" : "en";
}

function isConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

async function fetchMenuFile(locale: SiteLocale) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/regular_menu_files?locale=eq.${locale}&is_active=eq.true&select=filename,content_type,content_base64,byte_size,sha256&limit=1`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Accept: "application/json"
      },
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const rows = (await response.json()) as RegularMenuFileRow[];
  return rows[0] ?? null;
}

export async function GET(request: Request) {
  if (!isConfigured()) {
    return Response.json({ error: "Menu download is not configured." }, { status: 503 });
  }

  const url = new URL(request.url);
  const locale = getMenuLocale(url.searchParams.get("locale"));

  try {
    const menuFile = await fetchMenuFile(locale);

    if (!menuFile) {
      return Response.json({ error: "Menu file was not found." }, { status: 404 });
    }

    const pdf = Buffer.from(menuFile.content_base64, "base64");

    return new Response(pdf, {
      headers: {
        "Content-Type": menuFile.content_type || "application/pdf",
        "Content-Disposition": `attachment; filename="${menuFile.filename}"`,
        "Content-Length": String(menuFile.byte_size || pdf.byteLength),
        "Cache-Control": "no-store",
        "X-Menu-Sha256": menuFile.sha256 || ""
      }
    });
  } catch {
    return Response.json({ error: "Could not load menu file." }, { status: 502 });
  }
}
