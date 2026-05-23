import type { SiteLocale } from "@/lib/site";

const menuFiles: Record<SiteLocale, string> = {
  bg: "the-friendly-bear-menu-bg.pdf",
  en: "the-friendly-bear-menu-en.pdf"
};

function getMenuLocale(value: string | null): SiteLocale {
  return value === "bg" ? "bg" : "en";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = getMenuLocale(url.searchParams.get("locale"));
  const filename = menuFiles[locale];

  return Response.redirect(new URL(`/files/${filename}`, request.url), 303);
}
