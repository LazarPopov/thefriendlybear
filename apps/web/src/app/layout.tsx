import type { Metadata } from "next";
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
  alternates: {
    languages: {
      bg: "/bg",
      en: "/en",
      "x-default": "/bg"
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang={siteConfig.defaultLocale}>
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
