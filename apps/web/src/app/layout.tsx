import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { ReservationPopupShell } from "@/components/reservation-popup-shell";
import { SiteChrome } from "@/components/site-chrome";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_ID?.trim() || undefined;
const gaDebugMode =
  process.env.NEXT_PUBLIC_GA_DEBUG_MODE?.trim().toLowerCase() === "true" || process.env.NODE_ENV === "development";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.name,
    template: "%s"
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  icons: {
    icon: [{ url: "/icons/friendly_bear_logo.jpg", type: "image/jpeg" }],
    shortcut: [{ url: "/icons/friendly_bear_logo.jpg", type: "image/jpeg" }],
    apple: [{ url: "/icons/friendly_bear_logo.jpg", type: "image/jpeg" }]
  },
  alternates: {
    languages: {
      bg: "/bg",
      en: "/en",
      "bg-BG": "/bg",
      "en-GB": "/en",
      "x-default": "/bg"
    }
  },
  robots: {
    index: false,
    follow: false
  }
};

const supportedHtmlLanguages = new Set(["bg", "en", "it", "es", "el", "de", "ro", "en-GB"]);

async function getHtmlLanguage() {
  const requestHeaders = await headers();
  const routeLanguage = requestHeaders.get("x-friendlybear-html-lang");

  if (routeLanguage && supportedHtmlLanguages.has(routeLanguage)) {
    return routeLanguage;
  }

  return siteConfig.defaultLocale;
}

async function getRequestPathname() {
  const requestHeaders = await headers();
  return requestHeaders.get("x-friendlybear-pathname") ?? "";
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() || undefined;
  const directGaMeasurementId = gtmId ? undefined : gaMeasurementId;
  const directGaConfig = JSON.stringify({
    send_page_view: false,
    ...(gaDebugMode ? { debug_mode: true } : {})
  });
  const htmlLanguage = await getHtmlLanguage();
  const pathname = await getRequestPathname();
  const isBookingRoute = pathname.startsWith("/admin/bookings");

  return (
    <html lang={htmlLanguage}>
      <body>
        {directGaMeasurementId ? (
          <>
            <Script
              id="ga4-script"
              src={`https://www.googletagmanager.com/gtag/js?id=${directGaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga4-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied'
});
gtag('js', new Date());
gtag('config', '${directGaMeasurementId}', ${directGaConfig});
`
              }}
            />
          </>
        ) : null}
        <AnalyticsConsent gtmId={gtmId} gaMeasurementId={directGaMeasurementId} />
        <SiteChrome>
          {children}
          {isBookingRoute ? null : <ReservationPopupShell />}
        </SiteChrome>
      </body>
    </html>
  );
}
