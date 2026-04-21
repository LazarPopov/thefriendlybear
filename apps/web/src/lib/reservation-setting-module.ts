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
          title: "Резервационният модул е временно изключен",
          description:
            "Owner-ът е изключил резервациите от CMS. Менюто, контактите и упътванията остават активни, докато модулът не бъде включен отново.",
          statusTag: "Резервациите са изключени"
        }
      : {
          title: "The reservations module is temporarily disabled",
          description:
            "The owner has disabled reservations from the CMS. Menu, contact, and directions remain active until the module is enabled again.",
          statusTag: "Reservations are disabled"
        };
  }

  if (!settings.isEnabled) {
    return locale === "bg"
      ? {
          title: "Резервационният канал е поставен на пауза",
          description:
            "Модулът е активен в сайта, но текущият booking канал е спрян от CMS, докато operational режимът не бъде променен отново.",
          statusTag: "Каналът е на пауза"
        }
      : {
          title: "The reservation channel is currently paused",
          description:
            "The module is live on the site, but the current booking channel has been paused from the CMS until the operational mode changes again.",
          statusTag: "Channel paused"
        };
  }

  if (settings.mode === "pending") {
    return locale === "bg"
      ? {
          title: "Резервационният път ще бъде потвърден скоро",
          description:
            "CMS already controls the reservation state, but the active booking channel is still marked as pending. Menu, contact, and directions stay available in the meantime.",
          statusTag: "Очаква потвърждение"
        }
      : {
          title: "The reservation path will be confirmed soon",
          description:
            "The CMS already controls the reservation state, but the active booking channel is still marked as pending. Menu, contact, and directions stay available in the meantime.",
          statusTag: "Pending confirmation"
        };
  }

  const localizedContent = {
    call_only: {
      bg: {
        title: "Обади се за резервация",
        description:
          "В момента най-бързият резервационен път е телефонът. Този режим се управлява директно от CMS и може да се смени по-късно без code changes.",
        statusTag: "Активен телефонен режим"
      },
      en: {
        title: "Call for reservation",
        description:
          "Right now the fastest reservation path is by phone. This mode is controlled directly from the CMS and can change later without code changes.",
        statusTag: "Phone mode active"
      }
    },
    call_whatsapp: {
      bg: {
        title: "Избери между телефон и WhatsApp",
        description:
          "Резервационният слой е настроен да показва и двата канала, така че гостът да избере най-удобния път според ситуацията.",
        statusTag: "Телефон и WhatsApp"
      },
      en: {
        title: "Choose between phone and WhatsApp",
        description:
          "The reservation layer is currently configured to surface both channels so visitors can choose the easiest path.",
        statusTag: "Phone and WhatsApp"
      }
    },
    external_booking: {
      bg: {
        title: "Използвай активния booking линк",
        description:
          "Текущият operational режим подава външен booking канал отпред. Телефонът и контактите могат да останат като backup path.",
        statusTag: "Външен booking режим"
      },
      en: {
        title: "Use the active booking link",
        description:
          "The current operational mode surfaces an external booking channel first. Phone and contact can still stay as backup paths.",
        statusTag: "External booking mode"
      }
    },
    hybrid: {
      bg: {
        title: "Избери най-удобния резервационен път",
        description:
          "Хибридният режим позволява сайтът да покаже повече от един активен booking канал едновременно, без да променя frontend логиката.",
        statusTag: "Хибриден режим"
      },
      en: {
        title: "Choose the most convenient reservation path",
        description:
          "Hybrid mode lets the site surface more than one active booking channel at the same time without changing the frontend logic.",
        statusTag: "Hybrid mode"
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
      { label: "Резервационен модул", status: enabled ? "Активен" : "Изключен" },
      { label: "Активен режим", status: getReservationModeLabel(locale, settings.mode) },
      {
        label: "Телефонен канал",
        status:
          phoneNumber && enabled && ["call_only", "call_whatsapp", "hybrid"].includes(settings.mode)
            ? "Активен"
            : phoneNumber
              ? "Наличен"
              : "Не е зададен"
      },
      {
        label: "WhatsApp канал",
        status:
          whatsappNumber && enabled && ["call_whatsapp", "hybrid"].includes(settings.mode)
            ? "Активен"
            : whatsappNumber
              ? "Наличен"
              : "Не се използва"
      },
      {
        label: "Външен booking",
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
    { label: "Reservations module", status: enabled ? "Active" : "Disabled" },
    { label: "Active mode", status: getReservationModeLabel(locale, settings.mode) },
    {
      label: "Phone channel",
      status:
        phoneNumber && enabled && ["call_only", "call_whatsapp", "hybrid"].includes(settings.mode)
          ? "Active"
          : phoneNumber
            ? "Available"
            : "Not set"
    },
    {
      label: "WhatsApp channel",
      status:
        whatsappNumber && enabled && ["call_whatsapp", "hybrid"].includes(settings.mode)
          ? "Active"
          : whatsappNumber
            ? "Available"
            : "Not used"
    },
    {
      label: "External booking",
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
