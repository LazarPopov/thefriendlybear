import { ReservationPopup, type ReservationPopupAction } from "@/components/reservation-popup";
import { getBusinessProfileData } from "@/lib/business-profile-module";
import { getModuleTogglesData } from "@/lib/module-toggle-module";
import {
  getReservationPrimaryActions,
  getReservationSettingsData,
  isReservationFlowEnabled
} from "@/lib/reservation-setting-module";
import type { SiteLocale } from "@/lib/site";

function normalizePhone(input: string) {
  return input.replace(/[^\d+]/g, "");
}

function getPhoneHref(phoneNumber: string | null) {
  return phoneNumber ? `tel:${normalizePhone(phoneNumber)}` : null;
}

function normalizeActionLabel(locale: SiteLocale, action: ReturnType<typeof getReservationPrimaryActions>[number]) {
  if (action.kind !== "phone") {
    return action.label;
  }

  return locale === "bg" ? "Обади се за резервация" : "Call to reserve";
}

function buildPopupAction(
  locale: SiteLocale,
  action: ReturnType<typeof getReservationPrimaryActions>[number] | undefined
): ReservationPopupAction | null {
  if (!action) {
    return null;
  }

  return {
    href: action.href,
    label: normalizeActionLabel(locale, action),
    external: action.external
  };
}

export async function ReservationPopupShell() {
  const [profile, settings, toggles] = await Promise.all([
    getBusinessProfileData(),
    getReservationSettingsData(),
    getModuleTogglesData()
  ]);

  if (!isReservationFlowEnabled(settings, toggles)) {
    return null;
  }

  const actions = {
    bg: buildPopupAction("bg", getReservationPrimaryActions("bg", profile, settings, toggles)[0]),
    en: buildPopupAction("en", getReservationPrimaryActions("en", profile, settings, toggles)[0])
  };

  if (!actions.bg && !actions.en) {
    return null;
  }

  const phoneNumber = settings.phoneNumber ?? profile.phoneNumber;
  const phoneDisplay = settings.phoneNumber ?? profile.phoneDisplay ?? phoneNumber;

  return (
    <ReservationPopup
      actions={actions}
      phoneDisplay={phoneDisplay}
      phoneHref={getPhoneHref(phoneNumber)}
    />
  );
}
