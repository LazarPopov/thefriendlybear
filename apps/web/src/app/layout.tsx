import type { Metadata } from "next";
import { headers } from "next/headers";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { GoogleAnalytics } from "@/components/google-analytics";
import { ReservationPopupShell } from "@/components/reservation-popup-shell";
import { SiteChrome } from "@/components/site-chrome";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const defaultGaMeasurementId = "G-4EBJBB4BND";

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
  }
};

const supportedHtmlLanguages = new Set(["bg", "en", "it", "es", "el"]);

async function getHtmlLanguage() {
  const requestHeaders = await headers();
  const routeLanguage = requestHeaders.get("x-friendlybear-html-lang");

  if (routeLanguage && supportedHtmlLanguages.has(routeLanguage)) {
    return routeLanguage;
  }

  return siteConfig.defaultLocale;
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() || undefined;
  const gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || defaultGaMeasurementId;
  const directGaMeasurementId = gtmId ? undefined : gaMeasurementId;
  const htmlLanguage = await getHtmlLanguage();

  return (
    <html lang={htmlLanguage}>
      <body>
        <GoogleAnalytics measurementId={directGaMeasurementId} />
        <AnalyticsConsent gtmId={gtmId} gaMeasurementId={directGaMeasurementId} />
        <SiteChrome>
          {children}
          <ReservationPopupShell />
        </SiteChrome>
      </body>
    </html>
  );
}
