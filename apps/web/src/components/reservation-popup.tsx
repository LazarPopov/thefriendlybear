"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { BusinessActionKind } from "@/lib/tracking";

type Locale = "bg" | "en" | "it" | "es" | "el";
type ActionLocale = "bg" | "en";
type PopupState = "pending" | "expanded" | "minimized";

export type ReservationPopupAction = {
  href: string;
  label: string;
  kind: BusinessActionKind;
  external?: boolean;
};

type ReservationPopupProps = {
  actions: Record<ActionLocale, ReservationPopupAction | null>;
  phoneDisplay: string | null;
  phoneHref: string | null;
};

const copy = {
  bg: {
    aria: "Резервации",
    kicker: "Резервации",
    title: "Обади се за резервация",
    body:
      "Запазете маса в The Friendly Bear Sofia на ул. Славянска 23. Обадете се и ще ви помогнем с място в градината, до камината или за вечеря с приятели.",
    phoneLabel: "Телефон",
    minimize: "Минимизирай",
    expand: "Резервация",
    phoneActionLabel: "Обади се за резервация"
  },
  en: {
    aria: "Reservations",
    kicker: "Reservations",
    title: "Call to reserve",
    body:
      "Reserve a table at The Friendly Bear Sofia on Slavyanska 23. Call us and we will help with garden seats, fireplace tables, or dinner with friends.",
    phoneLabel: "Phone",
    minimize: "Minimize",
    expand: "Reserve",
    phoneActionLabel: "Call to reserve"
  },
  it: {
    aria: "Prenotazioni",
    kicker: "Prenotazioni",
    title: "Chiama per prenotare",
    body:
      "Per prenotare un tavolo al The Friendly Bear Sofia, chiamaci in inglese. Il nostro staff parla inglese e ti aiutera con giardino, camino o cena con amici.",
    phoneLabel: "Telefono",
    minimize: "Minimizza",
    expand: "Prenota",
    phoneActionLabel: "Chiama per prenotare in inglese"
  },
  es: {
    aria: "Reservas",
    kicker: "Reservas",
    title: "Llama para reservar",
    body:
      "Para reservar una mesa en The Friendly Bear Sofia, llamanos en ingles. Nuestro equipo habla ingles y te ayudara con una mesa en el jardin, junto a la chimenea o para cenar con amigos.",
    phoneLabel: "Telefono",
    minimize: "Minimizar",
    expand: "Reservar",
    phoneActionLabel: "Llamar para reservar en ingles"
  },
  el: {
    aria: "Κρατήσεις",
    kicker: "Κρατήσεις",
    title: "Καλέστε για κράτηση",
    body:
      "Για κράτηση στο The Friendly Bear Sofia, καλέστε μας στα αγγλικά. Το προσωπικό μας μιλάει αγγλικά και θα σας βοηθήσει με τραπέζι στον κήπο, κοντά στο τζάκι ή για δείπνο με φίλους.",
    phoneLabel: "Τηλέφωνο",
    minimize: "Ελαχιστοποίηση",
    expand: "Κράτηση",
    phoneActionLabel: "Καλέστε για κράτηση στα αγγλικά"
  }
} as const;

const minimizedStorageKey = "friendly-bear-reservation-popup-minimized";

function getLocaleFromPath(pathname: string): Locale {
  if (pathname.startsWith("/it")) return "it";
  if (pathname.startsWith("/es")) return "es";
  if (pathname.startsWith("/el")) return "el";
  if (pathname.startsWith("/en")) return "en";
  return "bg";
}

function isTouristReservationPath(pathname: string) {
  return (
    pathname.startsWith("/it") ||
    pathname.startsWith("/es") ||
    pathname.startsWith("/el") ||
    pathname.startsWith("/en/tourists")
  );
}

function getReservationText(locale: Locale, pathname: string) {
  const text = copy[locale];

  if (locale === "en" && isTouristReservationPath(pathname)) {
    return {
      ...text,
      body:
        "Visiting Sofia? Call us in English to reserve a table at The Friendly Bear Sofia on Slavyanska 23. We will help with garden seats, fireplace tables, or dinner with friends.",
      phoneActionLabel: "Call to reserve in English"
    };
  }

  return text;
}

function getActionLocale(locale: Locale): ActionLocale {
  return locale === "bg" ? "bg" : "en";
}

function getInitialPopupState(): PopupState {
  if (typeof window === "undefined") {
    return "pending";
  }

  try {
    return window.localStorage.getItem(minimizedStorageKey) === "true" ? "minimized" : "expanded";
  } catch {
    return "expanded";
  }
}

function setMinimizedPreference(isMinimized: boolean) {
  try {
    if (isMinimized) {
      window.localStorage.setItem(minimizedStorageKey, "true");
    } else {
      window.localStorage.removeItem(minimizedStorageKey);
    }
  } catch {
    // Keep the widget usable even if storage is blocked by the browser.
  }
}

export function ReservationPopup({ actions, phoneDisplay, phoneHref }: ReservationPopupProps) {
  const pathname = usePathname() || "/bg";
  const locale = getLocaleFromPath(pathname);
  const text = getReservationText(locale, pathname);
  const action = actions[getActionLocale(locale)] ?? actions.bg ?? actions.en;
  const [popupState, setPopupState] = useState<PopupState>(getInitialPopupState);
  const isExpanded = popupState === "expanded";

  useEffect(() => {
    setPopupState(getInitialPopupState());
  }, []);

  if (!action) {
    return null;
  }

  function setExpanded(nextExpanded: boolean) {
    setMinimizedPreference(!nextExpanded);
    setPopupState(nextExpanded ? "expanded" : "minimized");
  }

  if (popupState === "pending") {
    return null;
  }

  if (!isExpanded) {
    return (
      <button
        type="button"
        className="reservation-popup reservation-popup-minimized"
        onClick={() => setExpanded(true)}
        aria-label={text.aria}
      >
        <span>{text.expand}</span>
      </button>
    );
  }

  return (
    <aside className="reservation-popup reservation-popup-card" aria-label={text.aria}>
      <div className="reservation-popup-topline">
        <p>{text.kicker}</p>
        <button type="button" onClick={() => setExpanded(false)} aria-label={text.minimize}>
          <span aria-hidden="true">−</span>
        </button>
      </div>

      <h2>{text.title}</h2>
      <p className="reservation-popup-body">{text.body}</p>

      {phoneDisplay ? (
        <a className="reservation-popup-phone" href={phoneHref ?? action.href}>
          <span>{text.phoneLabel}</span>
          <strong>{phoneDisplay}</strong>
        </a>
      ) : null}

      <a
        className="reservation-popup-cta"
        href={action.href}
        target={action.external ? "_blank" : undefined}
        rel={action.external ? "noreferrer" : undefined}
      >
        {action.kind === "phone" ? text.phoneActionLabel : action.label}
      </a>
    </aside>
  );
}
