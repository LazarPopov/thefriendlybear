import type { FrontendBusinessProfile } from "@/lib/cms/business-profile-adapter";
import {
  normalizeReservationSettingEntry,
  type FrontendReservationSettings
} from "@/lib/cms/reservation-setting-adapter";
import type { FrontendModuleToggles } from "@/lib/cms/module-toggle-adapter";
import { fetchStrapiSingle } from "@/lib/cms/strapi";
import type { SiteLocale } from "@/lib/site";
import type { BusinessActionKind } from "@/lib/tracking";

type ReservationAction = {
  href: string;
  label: string;
  kind: BusinessActionKind;
  external?: boolean;
};

type ReservationHeroContent = {
  title: string;
  description: string;
  statusTag: string;
};

function normalizePhone(input: string) {
  return input.replace(/[^\d+]/g, "");
}

function normalizeWhatsapp(input: string) {
  return input.replace(/[^\d]/g, "");
}

function getEffectivePhone(profile: FrontendBusinessProfile, settings: FrontendReservationSettings) {
  return settings.phoneNumber ?? profile.phoneNumber;
}

function getEffectiveWhatsapp(profile: FrontendBusinessProfile, settings: FrontendReservationSettings) {
  return settings.whatsappNumber ?? profile.whatsappNumber;
}

function getEffectiveExternalBooking(profile: FrontendBusinessProfile, settings: FrontendReservationSettings) {
  return settings.externalBookingUrl ?? profile.externalBookingUrl;
}

function dedupeActions(actions: ReservationAction[]) {
  const seen = new Set<string>();

  return actions.filter((action) => {
    const key = `${action.kind}:${action.href}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export async function getReservationSettingsData(): Promise<FrontendReservationSettings> {
  const entry = await fetchStrapiSingle<Partial<FrontendReservationSettings>>(
    "/api/reservation-setting?populate=*"
  );

  return normalizeReservationSettingEntry(entry);
}

export function isReservationFlowEnabled(
  settings: FrontendReservationSettings,
  toggles: FrontendModuleToggles
) {
  return toggles.reservationsEnabled && settings.isEnabled;
}

export function getReservationModeLabel(locale: SiteLocale, mode: FrontendReservationSettings["mode"]) {
  const labels = {
    pending: {
      bg: "Очаква потвърждение",
      en: "Pending confirmation"
    },
    call_only: {
      bg: "Само по телефон",
      en: "Call only"
    },
    call_whatsapp: {
      bg: "Телефон и WhatsApp",
      en: "Call and WhatsApp"
    },
    external_booking: {
      bg: "Външен booking линк",
      en: "External booking link"
    },
    hybrid: {
      bg: "Хибриден режим",
      en: "Hybrid mode"
    }
  } as const;

  return labels[mode][locale];
}

export function getReservationHeroContent(
  locale: SiteLocale,
  settings: FrontendReservationSettings,
  toggles: FrontendModuleToggles
): ReservationHeroContent {
  const enabled = isReservationFlowEnabled(settings, toggles);

  if (!toggles.reservationsEnabled) {
    return locale === "bg"
      ? {
          title: "Резервациите са по телефона",
          description:
            "Обадете ни се директно и ще помогнем с маса в градината, до камината или за вечеря с приятели.",
          statusTag: "Обадете се за маса"
        }
      : {
          title: "Reservations are by phone",
          description:
            "Call us directly and we will help with a garden seat, a fireplace table, or dinner with friends.",
          statusTag: "Call for a table"
        };
  }

  if (!settings.isEnabled) {
    return locale === "bg"
      ? {
          title: "Резервациите са по телефона",
          description:
            "В момента приемаме резервации директно по телефона. Екипът ще ви помогне с най-подходящата маса.",
          statusTag: "Обадете се за маса"
        }
      : {
          title: "Reservations are by phone",
          description:
            "Right now we take reservations directly by phone. The team will help you choose the best available table.",
          statusTag: "Call for a table"
        };
  }

  if (settings.mode === "pending") {
    return locale === "bg"
      ? {
          title: "Резервационният път ще бъде потвърден скоро",
          description:
            "Скоро ще добавим още възможности за резервация. Дотогава най-сигурният начин е да ни се обадите директно.",
          statusTag: "Очаква потвърждение"
        }
      : {
          title: "The reservation path will be confirmed soon",
          description:
            "We will add more reservation options soon. For now, the safest way to book is to call us directly.",
          statusTag: "Pending confirmation"
        };
  }

  const localizedContent = {
    call_only: {
      bg: {
        title: "Обади се за резервация",
        description:
          "В момента най-бързият начин за резервация е телефонът. Обадете се и ще ви помогнем с най-подходящата маса.",
        statusTag: "Резервации по телефона"
      },
      en: {
        title: "Call for reservation",
        description:
          "Right now the fastest way to reserve is by phone. Call us and we will help with the best available table.",
        statusTag: "Phone reservations"
      }
    },
    call_whatsapp: {
      bg: {
        title: "Избери между телефон и WhatsApp",
        description:
          "Можете да се свържете по телефона или през WhatsApp и да изберете най-удобния начин за резервация.",
        statusTag: "Телефон и WhatsApp"
      },
      en: {
        title: "Choose between phone and WhatsApp",
        description:
          "You can reach us by phone or WhatsApp and choose the easiest way to reserve.",
        statusTag: "Phone and WhatsApp"
      }
    },
    external_booking: {
      bg: {
        title: "Използвай активния booking линк",
        description:
          "Отворете активния линк за резервации. Ако имате въпрос, телефонът остава най-бързият начин за връзка.",
        statusTag: "Активен booking линк"
      },
      en: {
        title: "Use the active booking link",
        description:
          "Open the active booking link. If you have a question, the phone remains the fastest way to reach us.",
        statusTag: "Active booking link"
      }
    },
    hybrid: {
      bg: {
        title: "Избери най-удобния резервационен път",
        description:
          "Изберете най-удобния начин за резервация: телефон, WhatsApp или активния външен линк.",
        statusTag: "Няколко варианта"
      },
      en: {
        title: "Choose the most convenient reservation path",
        description:
          "Choose the easiest reservation option: phone, WhatsApp, or the active external booking link.",
        statusTag: "Multiple options"
      }
    }
  } as const;

  return localizedContent[settings.mode][locale];
}

export function getReservationPrimaryActions(
  locale: SiteLocale,
  profile: FrontendBusinessProfile,
  settings: FrontendReservationSettings,
  toggles: FrontendModuleToggles
): ReservationAction[] {
  if (!isReservationFlowEnabled(settings, toggles) || settings.mode === "pending") {
    return [];
  }

  const phoneNumber = getEffectivePhone(profile, settings);
  const whatsappNumber = getEffectiveWhatsapp(profile, settings);
  const externalBookingUrl = getEffectiveExternalBooking(profile, settings);
  const actions: ReservationAction[] = [];

  const phoneAction = phoneNumber
    ? {
        href: `tel:${normalizePhone(phoneNumber)}`,
        label: settings.ctaLabel[locale],
        kind: "phone" as const
      }
    : null;

  const whatsappAction = whatsappNumber
    ? {
        href: `https://wa.me/${normalizeWhatsapp(whatsappNumber)}?text=${encodeURIComponent(profile.whatsappPrefill[locale])}`,
        label: "WhatsApp",
        kind: "whatsapp" as const,
        external: true
      }
    : null;

  const externalBookingAction = externalBookingUrl
    ? {
        href: externalBookingUrl,
        label: settings.ctaLabel[locale],
        kind: "external_booking" as const,
        external: true
      }
    : null;

  switch (settings.mode) {
    case "call_only":
      if (phoneAction) {
        actions.push(phoneAction);
      }
      break;
    case "call_whatsapp":
      if (phoneAction) {
        actions.push(phoneAction);
      }
      if (whatsappAction) {
        actions.push(whatsappAction);
      }
      break;
    case "external_booking":
      if (externalBookingAction) {
        actions.push(externalBookingAction);
      }
      if (phoneAction) {
        actions.push({
          ...phoneAction,
          label: locale === "bg" ? "Телефон за контакт" : "Phone contact"
        });
      }
      break;
    case "hybrid":
      if (externalBookingAction) {
        actions.push(externalBookingAction);
      }
      if (phoneAction) {
        actions.push(phoneAction);
      }
      if (whatsappAction) {
        actions.push(whatsappAction);
      }
      break;
  }

  return actions;
}

export function getReservationSupportActions(
  locale: SiteLocale,
  profile: FrontendBusinessProfile
): ReservationAction[] {
  if (locale === "bg") {
    return [
      { href: "/bg/menu", label: "Меню", kind: "menu" },
      { href: profile.mapUrl, label: "Как да стигнете", kind: "directions", external: true },
      { href: "/bg/contact", label: "Контакти", kind: "contact" }
    ];
  }

  return [
    { href: "/en/menu", label: "Menu", kind: "menu" },
    { href: profile.mapUrl, label: "Directions", kind: "directions", external: true },
    { href: "/en/contact", label: "Contact", kind: "contact" }
  ];
}

export function getReservationDisplayedActions(
  locale: SiteLocale,
  profile: FrontendBusinessProfile,
  settings: FrontendReservationSettings,
  toggles: FrontendModuleToggles
) {
  return dedupeActions([
    ...getReservationPrimaryActions(locale, profile, settings, toggles),
    ...getReservationSupportActions(locale, profile)
  ]);
}

export function getReservationQuickbarActions(
  locale: SiteLocale,
  profile: FrontendBusinessProfile,
  settings: FrontendReservationSettings,
  toggles: FrontendModuleToggles
) {
  return getReservationDisplayedActions(locale, profile, settings, toggles).filter((action) => {
    if (action.kind === "phone") {
      return settings.stickyCallEnabled;
    }

    if (action.kind === "whatsapp") {
      return settings.stickyWhatsappEnabled;
    }

    return true;
  });
}

export function getReservationStatusRows(
  locale: SiteLocale,
  profile: FrontendBusinessProfile,
  settings: FrontendReservationSettings,
  toggles: FrontendModuleToggles
) {
  const phoneNumber = getEffectivePhone(profile, settings);
  const whatsappNumber = getEffectiveWhatsapp(profile, settings);
  const externalBookingUrl = getEffectiveExternalBooking(profile, settings);
  const enabled = isReservationFlowEnabled(settings, toggles);

  if (locale === "bg") {
    return [
      { label: "Резервации", status: enabled ? "Отворени" : "По телефона" },
      { label: "Начин за връзка", status: getReservationModeLabel(locale, settings.mode) },
      {
        label: "Телефон",
        status:
          phoneNumber && enabled && ["call_only", "call_whatsapp", "hybrid"].includes(settings.mode)
            ? "Активен"
            : phoneNumber
              ? "Наличен"
              : "Не е зададен"
      },
      {
        label: "WhatsApp",
        status:
          whatsappNumber && enabled && ["call_whatsapp", "hybrid"].includes(settings.mode)
            ? "Активен"
            : whatsappNumber
              ? "Наличен"
              : "Не се използва"
      },
      {
        label: "Онлайн резервация",
        status:
          externalBookingUrl && enabled && ["external_booking", "hybrid"].includes(settings.mode)
            ? "Активен"
            : externalBookingUrl
              ? "Наличен"
              : "Не се използва"
      }
    ];
  }

  return [
    { label: "Reservations", status: enabled ? "Open" : "By phone" },
    { label: "Contact option", status: getReservationModeLabel(locale, settings.mode) },
    {
      label: "Phone",
      status:
        phoneNumber && enabled && ["call_only", "call_whatsapp", "hybrid"].includes(settings.mode)
          ? "Active"
          : phoneNumber
            ? "Available"
            : "Not set"
    },
    {
      label: "WhatsApp",
      status:
        whatsappNumber && enabled && ["call_whatsapp", "hybrid"].includes(settings.mode)
          ? "Active"
          : whatsappNumber
            ? "Available"
            : "Not used"
    },
    {
      label: "Online booking",
      status:
        externalBookingUrl && enabled && ["external_booking", "hybrid"].includes(settings.mode)
          ? "Active"
          : externalBookingUrl
            ? "Available"
            : "Not used"
    }
  ];
}

export function getReservationConfirmationMessage(
  locale: SiteLocale,
  settings: FrontendReservationSettings,
  profile: FrontendBusinessProfile
) {
  return settings.confirmationMessage[locale] || profile.statusMessages[locale];
}
