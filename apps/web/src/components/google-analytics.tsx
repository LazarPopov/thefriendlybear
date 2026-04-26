"use client";

import { useEffect } from "react";
import Script from "next/script";

type GoogleAnalyticsProps = {
  measurementId?: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | IArguments>;
    gtag?: (...args: unknown[]) => void;
  }
}

function ensureGoogleTag() {
  window.dataLayer = window.dataLayer || [];

  if (!window.gtag) {
    window.gtag = function gtag() {
      window.dataLayer?.push(arguments);
    };
  }
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  useEffect(() => {
    if (!measurementId) {
      return;
    }

    ensureGoogleTag();
    window.gtag?.("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied"
    });
  }, [measurementId]);

  if (!measurementId) {
    return null;
  }

  return (
    <Script
      id="ga4-script"
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      strategy="afterInteractive"
      onReady={() => {
        ensureGoogleTag();
        window.gtag?.("js", new Date());
        window.gtag?.("config", measurementId, { send_page_view: false });
      }}
    />
  );
}
