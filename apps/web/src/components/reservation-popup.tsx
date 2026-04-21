"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Locale = "bg" | "en";

export type ReservationPopupAction = {
  href: string;
  label: string;
  external?: boolean;
};

type ReservationPopupProps = {
  actions: Record<Locale, ReservationPopupAction | null>;
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
    expand: "Резервация"
  },
  en: {
    aria: "Reservations",
    kicker: "Reservations",
    title: "Call to reserve",
    body:
      "Reserve a table at The Friendly Bear Sofia on Slavyanska 23. Call us and we will help with garden seats, fireplace tables, or dinner with friends.",
    phoneLabel: "Phone",
    minimize: "Minimize",
    expand: "Reserve"
  }
} as const;

function getLocaleFromPath(pathname: string): Locale {
  return pathname.startsWith("/en") ? "en" : "bg";
}

export function ReservationPopup({ actions, phoneDisplay, phoneHref }: ReservationPopupProps) {
  const pathname = usePathname() || "/bg";
  const locale = getLocaleFromPath(pathname);
  const text = copy[locale];
  const action = actions[locale] ?? actions.bg ?? actions.en;
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    setIsExpanded(true);
  }, [pathname]);

  if (!action) {
    return null;
  }

  function setExpanded(nextExpanded: boolean) {
    setIsExpanded(nextExpanded);
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
        {action.label}
      </a>
    </aside>
  );
}
