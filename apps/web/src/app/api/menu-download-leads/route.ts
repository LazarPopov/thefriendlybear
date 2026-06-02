import { NextResponse } from "next/server";

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const allowedLocales = new Set(["bg", "en", "it", "es", "el", "de", "ro", "nl", "en-gb"]);
const allowedMenuLocales = new Set(["bg", "en"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type MenuLocale = "bg" | "en";

type MenuDownloadLead = {
  name: string;
  email: string;
  locale: string;
  menuLocale: MenuLocale;
  menuRequested: boolean;
  extrasRequested: boolean;
  source: string;
};

class MenuDownloadLeadError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, maxLength) : "";
}

function isMenuLocale(value: string): value is MenuLocale {
  return allowedMenuLocales.has(value);
}

function isConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function validateMenuDownloadLead(payload: unknown): MenuDownloadLead {
  if (!isRecord(payload)) {
    throw new MenuDownloadLeadError(400, "Please enter your name and email.");
  }

  const name = cleanText(payload.name, 120);
  const email = cleanText(payload.email, 254).toLowerCase();
  const locale = cleanText(payload.locale, 12);
  const menuLocale = cleanText(payload.menuLocale ?? payload.menu_locale, 8);
  const menuRequested = payload.menuRequested === true || payload.menu_requested === true;
  const extrasRequested = payload.extrasRequested === true || payload.extras_requested === true;
  const source = cleanText(payload.source, 80) || "menu_download_form";

  if (name.length < 2) {
    throw new MenuDownloadLeadError(400, "Please enter your name.");
  }

  if (!emailPattern.test(email)) {
    throw new MenuDownloadLeadError(400, "Please enter a valid email.");
  }

  if (!allowedLocales.has(locale)) {
    throw new MenuDownloadLeadError(400, "Unsupported page language.");
  }

  if (!isMenuLocale(menuLocale)) {
    throw new MenuDownloadLeadError(400, "Unsupported menu language.");
  }

  if (!menuRequested) {
    throw new MenuDownloadLeadError(400, "Please choose the menu download option.");
  }

  return {
    name,
    email,
    locale,
    menuLocale,
    menuRequested,
    extrasRequested,
    source
  };
}

async function insertMenuDownloadLead(lead: MenuDownloadLead, request: Request) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/menu_download_leads`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      name: lead.name,
      email: lead.email,
      locale: lead.locale,
      menu_locale: lead.menuLocale,
      menu_requested: lead.menuRequested,
      extras_requested: lead.extrasRequested,
      source: lead.source,
      user_agent: cleanText(request.headers.get("user-agent"), 500) || null,
      referrer: cleanText(request.headers.get("referer"), 500) || null
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new MenuDownloadLeadError(502, detail || "Could not save menu request.");
  }
}

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json({ error: "Menu download capture is not configured." }, { status: 503 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Please enter your name and email." }, { status: 400 });
  }

  try {
    const lead = validateMenuDownloadLead(payload);
    await insertMenuDownloadLead(lead, request);

    return NextResponse.json({
      ok: true,
      downloadUrl: `/api/menu-download?locale=${lead.menuLocale}`
    });
  } catch (error) {
    if (error instanceof MenuDownloadLeadError) {
      const message = error.status === 502 ? "Could not save menu request." : error.message;
      return NextResponse.json({ error: message }, { status: error.status });
    }

    return NextResponse.json({ error: "Could not save menu request." }, { status: 500 });
  }
}
