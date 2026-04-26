import { NextResponse, type NextRequest } from "next/server";

const htmlLanguageByRoutePrefix: Record<string, string> = {
  bg: "bg",
  en: "en",
  it: "it",
  es: "es",
  el: "el",
  de: "de",
  ro: "ro",
  "en-gb": "en-GB"
};

function getHtmlLanguage(pathname: string) {
  const routePrefix = pathname.split("/").filter(Boolean)[0];

  if (routePrefix && htmlLanguageByRoutePrefix[routePrefix]) {
    return htmlLanguageByRoutePrefix[routePrefix];
  }

  return "bg";
}

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    "x-friendlybear-html-lang",
    getHtmlLanguage(request.nextUrl.pathname)
  );

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icons|images|robots.txt|sitemap.xml).*)"
  ]
};
