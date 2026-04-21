import type { Metadata } from "next";
import { headers } from "next/headers";
import { GoogleTagManager } from "@/components/google-tag-manager";
import { ReservationPopupShell } from "@/components/reservation-popup-shell";
import { SiteChrome } from "@/components/site-chrome";
import { siteConfig } from "@/lib/site";
import "./globals.css";

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
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const htmlLanguage = await getHtmlLanguage();

  return (
    <html lang={htmlLanguage}>
      <head>
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" />
      </head>
      <body>
        <GoogleTagManager gtmId={gtmId} />
        <SiteChrome>
          {children}
          <ReservationPopupShell />
        </SiteChrome>
      </body>
    </html>
  );
}
