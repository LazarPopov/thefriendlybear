"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { businessProfileSource } from "@/lib/business-profile-source";
import type { BusinessHoursEntry } from "@/lib/business-profile-source";
import { buildActionTracking, getActionTrackingAttributes, type BusinessActionKind } from "@/lib/tracking";

const instagramUrl = "https://www.instagram.com/friendlybear.bg/";
const facebookUrl = "https://www.facebook.com/friendlybear.bg/";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M7.8 2.8h8.4a5 5 0 0 1 5 5v8.4a5 5 0 0 1-5 5H7.8a5 5 0 0 1-5-5V7.8a5 5 0 0 1 5-5Zm0 1.9a3.1 3.1 0 0 0-3.1 3.1v8.4a3.1 3.1 0 0 0 3.1 3.1h8.4a3.1 3.1 0 0 0 3.1-3.1V7.8a3.1 3.1 0 0 0-3.1-3.1H7.8Zm4.2 3.2a4.1 4.1 0 1 1 0 8.2 4.1 4.1 0 0 1 0-8.2Zm0 1.9a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4Zm4.35-2.35a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M13.35 21.2v-8.36h2.82l.42-3.26h-3.24V7.5c0-.94.26-1.58 1.62-1.58h1.72V3a23 23 0 0 0-2.5-.13c-2.48 0-4.18 1.51-4.18 4.28v2.43H7.2v3.26h2.81v8.36h3.34Z"
        fill="currentColor"
      />
    </svg>
  );
}

function normalizePhone(input: string) {
  return input.replace(/[^\d+]/g, "");
}

function getLocaleFromPath(pathname: string) {
  if (pathname.startsWith("/en") || getTouristMarketAudienceFromPath(pathname)) {
    return "en";
  }

  return "bg";
}

function getOppositeLocale(locale: "bg" | "en") {
  return locale === "bg" ? "en" : "bg";
}

function getRootLocalePath(locale: "bg" | "en") {
  const targetLocale = getOppositeLocale(locale);

  return `/${targetLocale}`;
}

function getLanguageSwitchPath(pathname: string, locale: "bg" | "en", touristMarketAudience: string | null) {
  if (touristMarketAudience) {
    return `/en/tourists/${touristMarketAudience}`;
  }

  const targetLocale = locale === "bg" ? "en" : "bg";

  if (pathname === "/" || pathname === `/${locale}`) {
    return `/${targetLocale}`;
  }

  if (pathname.startsWith(`/${locale}/`)) {
    return pathname.replace(`/${locale}`, `/${targetLocale}`);
  }

  return getRootLocalePath(locale);
}

function getTouristMarketAudienceFromPath(pathname: string) {
  if (pathname === "/it" || pathname.startsWith("/it/")) {
    return "italian";
  }

  if (pathname === "/es" || pathname.startsWith("/es/")) {
    return "spanish";
  }

  if (pathname === "/el" || pathname.startsWith("/el/")) {
    return "greek";
  }

  if (pathname === "/de" || pathname.startsWith("/de/")) {
    return "german";
  }

  if (pathname === "/ro" || pathname.startsWith("/ro/")) {
    return "romanian";
  }

  if (pathname === "/en-gb" || pathname.startsWith("/en-gb/")) {
    return "uk";
  }

  return null;
}

const dayLabels: Record<"bg" | "en", Record<BusinessHoursEntry["dayOfWeek"], string>> = {
  bg: {
    Monday: "Понеделник",
    Tuesday: "Вторник",
    Wednesday: "Сряда",
    Thursday: "Четвъртък",
    Friday: "Петък",
    Saturday: "Събота",
    Sunday: "Неделя"
  },
  en: {
    Monday: "Monday",
    Tuesday: "Tuesday",
    Wednesday: "Wednesday",
    Thursday: "Thursday",
    Friday: "Friday",
    Saturday: "Saturday",
    Sunday: "Sunday"
  }
};

function formatOpeningHours(entry: BusinessHoursEntry, closedLabel: string) {
  if (entry.closed || !entry.opens || !entry.closes) {
    return closedLabel;
  }

  return `${entry.opens} - ${entry.closes}`;
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/bg";

  if (pathname.startsWith("/admin/bookings")) {
    return <>{children}</>;
  }

  const touristMarketAudience = getTouristMarketAudienceFromPath(pathname);
  const locale = getLocaleFromPath(pathname);
  const languagePath = getLanguageSwitchPath(pathname, locale, touristMarketAudience);
  const isHomeRoute = pathname === "/" || pathname === "/bg" || pathname === "/en";
  const currentYear = new Date().getFullYear();
  const homePath = `/${locale}`;
  const menuPath = `/${locale}/menu`;
  const aboutPath = `/${locale}/about`;
  const contactPath = `/${locale}/contact`;
  const touristsPath = `/${locale}/tourists`;
  const reviewsPath = `/${locale}/reviews`;
  const phoneNumber = businessProfileSource.contact.phoneNumber;
  const phoneDisplay = businessProfileSource.contact.phoneDisplay ?? phoneNumber;
  const phoneHref = phoneNumber ? `tel:${normalizePhone(phoneNumber)}` : null;
  const showHeader = true;
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const copy =
    locale === "bg"
      ? {
          home: "Начало",
          menu: "Меню",
          about: "За нас",
          tourists: "За туристи",
          reviews: "Отзиви",
          contact: "Контакти",
          language: "🇬🇧 English",
          mobileLanguage: "EN",
          directions: "Как да стигнете",
          call: "Звъннете ни за резервация",
          phoneLabel: "Телефон за връзка",
          mobileCall: "📞 Резерв.",
          mobileMenu: "📖 Меню",
          shortSlogan: "Бърлогата на добрия вкус",
          footerNote: "Бърлогата на добрия вкус - влез, отпусни се, наслади се",
          footerSeo:
            "The Friendly Bear Sofia е уютен ресторант в центъра на София, на ул. „Славянска“ 23 - с градина, отопляема зона за пушачи, сезонно меню, бавно готвени меса и вегетариански опции.",
          navigationLabel: "Основна навигация",
          footerNavLabel: "Полезни връзки",
          footerMainLabel: "Ресторантът",
          footerGuestLabel: "За гости",
          footerSocialLabel: "Социални мрежи",
          footerHoursLabel: "Работно време",
          closedLabel: "Затворено",
          rights: "Всички права запазени.",
          ratingLabel: "Оценка 4.5 от 5 в Google, 1361 отзива",
          ratingText: "4.5 · 1361"
        }
      : {
          home: "Home",
          menu: "Menu",
          about: "About",
          tourists: "For tourists",
          reviews: "Reviews",
          contact: "Contact",
          language: "🇧🇬 Bulgarian",
          mobileLanguage: "BG",
          directions: "How to get there",
          call: "Call to reserve",
          phoneLabel: "Phone",
          mobileCall: "📞 Reserve",
          mobileMenu: "📖 Menu",
          shortSlogan: "The den of good taste",
          footerNote: "The den of the good taste - come in, relax and enjoy",
          footerSeo:
            "The Friendly Bear Sofia is a cozy restaurant in central Sofia on Slavyanska 23 with a garden, heated smoking area, weekly menu, slow-cooked meats, and vegetarian options.",
          navigationLabel: "Main navigation",
          footerNavLabel: "Useful links",
          footerMainLabel: "Restaurant",
          footerGuestLabel: "For guests",
          footerSocialLabel: "Social",
          footerHoursLabel: "Opening hours",
          closedLabel: "Closed",
          rights: "All rights reserved.",
          ratingLabel: "Google rating 4.5 out of 5, 1361 reviews",
          ratingText: "4.5 · 1361"
        };
  const languageLabel = touristMarketAudience ? "🇬🇧 English" : copy.language;
  const mobileLanguageLabel = touristMarketAudience ? "EN" : copy.mobileLanguage;
  const tracking = (
    kind: BusinessActionKind,
    location: string,
    label: string,
    target: string,
    external = false
  ) =>
    getActionTrackingAttributes(
      buildActionTracking({
        kind,
        locale,
        location,
        label,
        target,
        external
      })
    );

  useEffect(() => {
    function handleScroll() {
      setIsHeaderCompact(window.scrollY > 56);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <>
      <header
        className={`site-header-shell ${isHomeRoute ? "site-header-shell-home" : ""} ${
          showHeader ? "site-header-shell-visible" : "site-header-shell-hidden"
        } ${isHeaderCompact ? "site-header-shell-compact" : "site-header-shell-expanded"}`}
      >
        <div className="site-header">
          <Link href={homePath} className="site-brand" aria-label="The Friendly Bear Sofia home">
            <Image
              src="/icons/friendly_bear_logo.jpg"
              alt="The Friendly Bear Sofia logo"
              width={52}
              height={52}
              className="site-brand-logo"
              priority
            />
            <span>
              <strong>The Friendly Bear</strong>
              <small>{isHeaderCompact ? copy.shortSlogan : copy.footerNote}</small>
            </span>
          </Link>

          <div className="site-rating-mini" aria-label={copy.ratingLabel}>
            <span className="site-rating-mini-stars" aria-hidden="true">
              ★★★★★
            </span>
            <span>{copy.ratingText}</span>
          </div>

          <nav className="site-nav" aria-label={copy.navigationLabel}>
            {phoneHref ? (
              <a className="site-nav-primary" href={phoneHref} {...tracking("phone", "header_call", copy.call, phoneHref)}>
                <span className="site-nav-label-desktop">{copy.call}</span>
                <span className="site-nav-label-mobile">{copy.mobileCall}</span>
              </a>
            ) : null}
            <a
              href={businessProfileSource.identity.mapUrl}
              className="site-nav-secondary site-nav-directions"
              target="_blank"
              rel="noreferrer"
              aria-label={copy.directions}
              title={copy.directions}
              {...tracking("directions", "header_directions", copy.directions, businessProfileSource.identity.mapUrl, true)}
            >
              <span className="site-nav-label-desktop">{copy.directions}</span>
              <span className="site-nav-label-mobile site-nav-map-label">
                <img src="/icons/google-maps-icon.svg" alt="" className="site-nav-map-icon" />
                <span className="site-nav-map-text">{locale === "bg" ? "Карта" : "Map"}</span>
              </span>
            </a>
            <Link href={menuPath} className="site-nav-essential site-nav-menu" {...tracking("menu", "header_menu", copy.menu, menuPath)}>
              <span className="site-nav-label-desktop">{copy.menu}</span>
              <span className="site-nav-label-mobile">{copy.mobileMenu}</span>
            </Link>
            <Link href={aboutPath} className="site-nav-secondary" {...tracking("about", "header_about", copy.about, aboutPath)}>
              {copy.about}
            </Link>
            <span className="site-nav-social-pill" aria-label="Social links">
              <a
                href={facebookUrl}
                className="site-nav-social site-nav-facebook"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Facebook"
                {...tracking("facebook", "header_social", "Facebook", facebookUrl, true)}
              >
                <FacebookIcon />
              </a>
              <a
                href={instagramUrl}
                className="site-nav-social site-nav-instagram"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram"
                {...tracking("instagram", "header_social", "Instagram", instagramUrl, true)}
              >
                <InstagramIcon />
              </a>
            </span>
            <Link
              href={languagePath}
              className="site-nav-essential site-nav-language"
              {...tracking("language", "header_language", languageLabel, languagePath)}
            >
              <span className="site-nav-label-desktop">{languageLabel}</span>
              <span className="site-nav-label-mobile">{mobileLanguageLabel}</span>
            </Link>
          </nav>
        </div>
      </header>

      {children}

      <footer className="site-footer-shell">
        <div className="site-footer">
          <div className="site-footer-main">
            <Link href={homePath} className="site-footer-brand-row" aria-label="The Friendly Bear Sofia home">
              <Image
                src="/icons/friendly_bear_logo.jpg"
                alt="The Friendly Bear Sofia logo"
                width={70}
                height={70}
                className="site-footer-logo"
              />
              <span>
                <strong>The Friendly Bear Sofia</strong>
                <small>{copy.footerNote}</small>
              </span>
            </Link>
            <p className="site-footer-seo">{copy.footerSeo}</p>
            <address className="site-footer-contact">
              <span>{businessProfileSource.identity.address[locale]}</span>
              {phoneHref && phoneDisplay ? (
                <a href={phoneHref}>
                  {copy.phoneLabel}: {phoneDisplay}
                </a>
              ) : null}
            </address>
            <p className="site-footer-rights">
              © {currentYear} The Friendly Bear Sofia. {copy.rights}
            </p>
          </div>

          <nav className="site-footer-nav" aria-label={copy.footerNavLabel}>
            <div className="site-footer-column">
              <p>{copy.footerMainLabel}</p>
              <Link href={homePath}>{copy.home}</Link>
              <Link href={menuPath} {...tracking("menu", "footer_menu", copy.menu, menuPath)}>
                {copy.menu}
              </Link>
              <Link href={aboutPath} {...tracking("about", "footer_about", copy.about, aboutPath)}>
                {copy.about}
              </Link>
              <Link href={contactPath}>{copy.contact}</Link>
              <Link href={reviewsPath}>{copy.reviews}</Link>
            </div>

            <div className="site-footer-column">
              <p>{copy.footerGuestLabel}</p>
              {phoneHref ? (
                <a href={phoneHref} {...tracking("phone", "footer_call", copy.call, phoneHref)}>
                  {copy.call}
                </a>
              ) : null}
              <a
                href={businessProfileSource.identity.mapUrl}
                target="_blank"
                rel="noreferrer"
                {...tracking("directions", "footer_directions", copy.directions, businessProfileSource.identity.mapUrl, true)}
              >
                {copy.directions}
              </a>
              <Link href={touristsPath}>{copy.tourists}</Link>
              <Link href={languagePath} {...tracking("language", "footer_language", languageLabel, languagePath)}>
                {languageLabel}
              </Link>
            </div>

            <div className="site-footer-column">
              <p>{copy.footerSocialLabel}</p>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                {...tracking("instagram", "footer_social", "Instagram", instagramUrl, true)}
              >
                Instagram
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                {...tracking("facebook", "footer_social", "Facebook", facebookUrl, true)}
              >
                Facebook
              </a>
            </div>

            <div className="site-footer-column site-footer-hours">
              <p>{copy.footerHoursLabel}</p>
              <ul className="site-footer-hours-list">
                {businessProfileSource.venue.openingHours.map((entry) => (
                  <li key={entry.dayOfWeek}>
                    <span>{dayLabels[locale][entry.dayOfWeek]}</span>
                    <strong>{formatOpeningHours(entry, copy.closedLabel)}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </footer>
    </>
  );
}
