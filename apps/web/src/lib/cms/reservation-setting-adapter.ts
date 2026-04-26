import { businessProfileSource, type BookingMode, type LocalizedText } from "@/lib/business-profile-source";

type BookingProvider = "rezzo" | "opentable" | "other";

export type FrontendReservationSettings = {
  isEnabled: boolean;
  mode: BookingMode;
  stickyCallEnabled: boolean;
  stickyWhatsappEnabled: boolean;
  phoneNumber: string | null;
  whatsappNumber: string | null;
  externalBookingUrl: string | null;
  externalBookingProvider: BookingProvider | null;
  externalBookingDomain: string | null;
  ctaLabel: LocalizedText;
  confirmationMessage: LocalizedText;
};

export const reservationSettingsFallback: FrontendReservationSettings = {
  isEnabled: true,
  mode: businessProfileSource.reservations.bookingMode,
  stickyCallEnabled: true,
  stickyWhatsappEnabled: false,
  phoneNumber: businessProfileSource.contact.phoneNumber,
  whatsappNumber: businessProfileSource.contact.whatsappNumber,
  externalBookingUrl: businessProfileSource.reservations.externalBookingUrl,
  externalBookingProvider: null,
  externalBookingDomain: null,
  ctaLabel: {
    bg: "Звъннете ни за резервация",
    en: "Call for reservation"
  },
  confirmationMessage: {
    bg: "Най-бързият текущ път за резервация е по телефон.",
    en: "The fastest current reservation path is by phone."
  }
};

export function normalizeReservationSettingEntry(
  entry: Partial<FrontendReservationSettings> | null | undefined
): FrontendReservationSettings {
  return {
    ...reservationSettingsFallback,
    ...entry,
    ctaLabel: entry?.ctaLabel ?? reservationSettingsFallback.ctaLabel,
    confirmationMessage: entry?.confirmationMessage ?? reservationSettingsFallback.confirmationMessage
  };
}
