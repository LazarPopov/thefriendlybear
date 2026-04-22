"use client";

import { useEffect, useState } from "react";
import { AnalyticsEvents } from "@/components/analytics-events";
import { GoogleAnalytics } from "@/components/google-analytics";
import { GoogleTagManager } from "@/components/google-tag-manager";

type AnalyticsConsentProps = {
  gtmId?: string;
  gaMeasurementId?: string;
};

type ConsentStatus = "unknown" | "granted" | "denied";

type ConsentRecord = {
  version: number;
  analytics: boolean;
  updatedAt: string;
};

const consentVersion = 1;
const consentStorageKey = "friendlybear_cookie_consent";
const consentCookieName = "friendlybear_cookie_consent";
const analyticsCookiePrefixes = ["_ga", "_gid", "_gat"];

function getLocaleFromPath(pathname: string) {
  return pathname.startsWith("/bg") ? "bg" : "en";
}

function getCopy(locale: "bg" | "en") {
  if (locale === "bg") {
    return {
      title: "\u0411\u0438\u0441\u043a\u0432\u0438\u0442\u043a\u0438 \u0437\u0430 \u0430\u043d\u0430\u043b\u0438\u0442\u0438\u043a\u0430",
      body:
        "\u0418\u0437\u043f\u043e\u043b\u0437\u0432\u0430\u043c\u0435 Google Analytics \u0441\u0430\u043c\u043e \u0430\u043a\u043e \u043d\u0438 \u0440\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u0435, \u0437\u0430 \u0434\u0430 \u0440\u0430\u0437\u0431\u0435\u0440\u0435\u043c \u043a\u043e\u0438 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0438 \u0438 \u0431\u0443\u0442\u043e\u043d\u0438 \u043f\u043e\u043c\u0430\u0433\u0430\u0442 \u043d\u0430 \u0433\u043e\u0441\u0442\u0438\u0442\u0435 \u0434\u0430 \u0440\u0435\u0437\u0435\u0440\u0432\u0438\u0440\u0430\u0442 \u043f\u043e-\u043b\u0435\u0441\u043d\u043e.",
      accept: "\u041f\u0440\u0438\u0435\u043c\u0430\u043c",
      reject: "\u041e\u0442\u043a\u0430\u0437\u0432\u0430\u043c",
      settings: "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u0437\u0430 \u0431\u0438\u0441\u043a\u0432\u0438\u0442\u043a\u0438",
      statusGranted: "\u0410\u043d\u0430\u043b\u0438\u0442\u0438\u043a\u0430\u0442\u0430 \u0435 \u0432\u043a\u043b\u044e\u0447\u0435\u043d\u0430.",
      statusDenied: "\u0410\u043d\u0430\u043b\u0438\u0442\u0438\u043a\u0430\u0442\u0430 \u0435 \u0438\u0437\u043a\u043b\u044e\u0447\u0435\u043d\u0430."
    };
  }

  return {
    title: "Analytics cookies",
    body:
      "We use Google Analytics only if you allow it, so we can understand which pages and actions help guests reserve more easily.",
    accept: "Accept",
    reject: "Reject",
    settings: "Cookie settings",
    statusGranted: "Analytics is on.",
    statusDenied: "Analytics is off."
  };
}

function readCookieConsent(): ConsentStatus {
  try {
    const consentCookie = document.cookie
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(`${consentCookieName}=`));

    if (!consentCookie) {
      return "unknown";
    }

    const cookieValue = decodeURIComponent(consentCookie.split("=").slice(1).join("="));

    if (!cookieValue.includes(`v:${consentVersion}`)) {
      return "unknown";
    }

    if (cookieValue.includes("analytics:granted")) {
      return "granted";
    }

    if (cookieValue.includes("analytics:denied")) {
      return "denied";
    }
  } catch {
    return "unknown";
  }

  return "unknown";
}

function readConsent(): ConsentStatus {
  try {
    const storedConsent = window.localStorage.getItem(consentStorageKey);

    if (!storedConsent) {
      return readCookieConsent();
    }

    const parsedConsent = JSON.parse(storedConsent) as Partial<ConsentRecord>;

    if (parsedConsent.version !== consentVersion || typeof parsedConsent.analytics !== "boolean") {
      return "unknown";
    }

    return parsedConsent.analytics ? "granted" : "denied";
  } catch {
    return readCookieConsent();
  }
}

function writeConsent(analytics: boolean) {
  const consentRecord: ConsentRecord = {
    version: consentVersion,
    analytics,
    updatedAt: new Date().toISOString()
  };
  const cookieValue = `analytics:${analytics ? "granted" : "denied"};v:${consentVersion}`;
  const secureAttribute = window.location.protocol === "https:" ? "; Secure" : "";

  try {
    window.localStorage.setItem(consentStorageKey, JSON.stringify(consentRecord));
  } catch {
    // The cookie fallback below keeps consent durable if storage is blocked.
  }

  document.cookie = `${consentCookieName}=${encodeURIComponent(cookieValue)}; Max-Age=15552000; Path=/; SameSite=Lax${secureAttribute}`;
}

function expireCookie(name: string, domain?: string) {
  const secureAttribute = window.location.protocol === "https:" ? "; Secure" : "";
  const domainAttribute = domain ? `; Domain=${domain}` : "";

  document.cookie = `${name}=; Max-Age=0; Path=/${domainAttribute}; SameSite=Lax${secureAttribute}`;
}

function removeAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim())
    .filter(Boolean);
  const hostParts = window.location.hostname.split(".");
  const rootDomain = hostParts.length > 1 ? `.${hostParts.slice(-2).join(".")}` : undefined;

  cookieNames.forEach((cookieName) => {
    if (!analyticsCookiePrefixes.some((prefix) => cookieName.startsWith(prefix))) {
      return;
    }

    expireCookie(cookieName);
    expireCookie(cookieName, window.location.hostname);

    if (rootDomain) {
      expireCookie(cookieName, rootDomain);
    }
  });
}

export function AnalyticsConsent({ gtmId, gaMeasurementId }: AnalyticsConsentProps) {
  const directGaMeasurementId = gtmId ? undefined : gaMeasurementId;
  const hasAnalyticsProvider = Boolean(gtmId || directGaMeasurementId);
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>("unknown");
  const [showPanel, setShowPanel] = useState(false);
  const [locale, setLocale] = useState<"bg" | "en">("en");
  const copy = getCopy(locale);
  const analyticsEnabled = hasAnalyticsProvider && consentStatus === "granted";

  useEffect(() => {
    const savedConsentStatus = readConsent();

    setLocale(getLocaleFromPath(window.location.pathname));
    setConsentStatus(savedConsentStatus);
    setShowPanel(hasAnalyticsProvider && savedConsentStatus === "unknown");
  }, [hasAnalyticsProvider]);

  if (!hasAnalyticsProvider) {
    return null;
  }

  function acceptAnalytics() {
    writeConsent(true);
    setConsentStatus("granted");
    setShowPanel(false);
  }

  function rejectAnalytics() {
    const wasGranted = consentStatus === "granted";

    writeConsent(false);
    removeAnalyticsCookies();
    setConsentStatus("denied");
    setShowPanel(false);

    if (wasGranted) {
      window.location.reload();
    }
  }

  return (
    <>
      {analyticsEnabled ? (
        <>
          <GoogleTagManager gtmId={gtmId} />
          <GoogleAnalytics measurementId={directGaMeasurementId} />
          <AnalyticsEvents enabled />
        </>
      ) : null}

      {showPanel ? (
        <section className="cookie-consent-panel" aria-live="polite" aria-label={copy.title}>
          <div>
            <p className="cookie-consent-title">{copy.title}</p>
            <p className="cookie-consent-body">{copy.body}</p>
            {consentStatus !== "unknown" ? (
              <p className="cookie-consent-status">
                {consentStatus === "granted" ? copy.statusGranted : copy.statusDenied}
              </p>
            ) : null}
          </div>
          <div className="cookie-consent-actions">
            <button type="button" className="cookie-consent-secondary" onClick={rejectAnalytics}>
              {copy.reject}
            </button>
            <button type="button" className="cookie-consent-primary" onClick={acceptAnalytics}>
              {copy.accept}
            </button>
          </div>
        </section>
      ) : null}

      {consentStatus !== "unknown" ? (
        <button type="button" className="cookie-consent-settings" onClick={() => setShowPanel(true)}>
          {copy.settings}
        </button>
      ) : null}
    </>
  );
}
