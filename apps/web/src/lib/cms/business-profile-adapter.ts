import type {
  BookingMode,
  BusinessHoursEntry,
  BusinessProfileSource,
  LocalizedText,
  LocalizedTextList
} from "@/lib/business-profile-source";

export type CmsBusinessProfileEntry = {
  sourceMode: "manual";
  futureConnector: "google_business_profile";
  syncReady: boolean;
  lastBusinessUpdateNote: LocalizedText;
  address: LocalizedText;
  area: LocalizedText;
  mapUrl: string;
  mapsLabel: LocalizedText;
  phoneNumber: string | null;
  phoneDisplay: string | null;
  whatsappNumber: string | null;
  whatsappPrefill: LocalizedText;
  bookingMode: BookingMode;
  externalBookingUrl: string | null;
  externalBookingLabel: LocalizedText;
  serviceOptions: LocalizedTextList;
  openingHours: BusinessHoursEntry[];
  statusMessages: LocalizedText;
  visitNotes: LocalizedTextList;
  arrivalTips: LocalizedTextList;
};

export type FrontendBusinessProfile = {
  address: LocalizedText;
  area: LocalizedText;
  mapUrl: string;
  mapsLabel: LocalizedText;
  phoneNumber: string | null;
  phoneDisplay: string | null;
  whatsappNumber: string | null;
  whatsappPrefill: LocalizedText;
  bookingMode: BookingMode;
  externalBookingUrl: string | null;
  externalBookingLabel: LocalizedText;
  serviceOptions: LocalizedTextList;
  openingHours: BusinessHoursEntry[];
  statusMessages: LocalizedText;
  visitNotes: LocalizedTextList;
  arrivalTips: LocalizedTextList;
  sourceMeta: {
    mode: "manual";
    futureConnector: "google_business_profile";
    syncReady: boolean;
    lastBusinessUpdateNote: LocalizedText;
  };
};

export function createBusinessProfileFallbackEntry(source: BusinessProfileSource): CmsBusinessProfileEntry {
  return {
    sourceMode: source.source.mode,
    futureConnector: source.source.futureConnector,
    syncReady: source.source.syncReady,
    lastBusinessUpdateNote: source.source.lastBusinessUpdateNote,
    address: source.identity.address,
    area: source.identity.area,
    mapUrl: source.identity.mapUrl,
    mapsLabel: source.identity.mapsLabel,
    phoneNumber: source.contact.phoneNumber,
    phoneDisplay: source.contact.phoneDisplay,
    whatsappNumber: source.contact.whatsappNumber,
    whatsappPrefill: source.contact.whatsappPrefill,
    bookingMode: source.reservations.bookingMode,
    externalBookingUrl: source.reservations.externalBookingUrl,
    externalBookingLabel: source.reservations.externalBookingLabel,
    serviceOptions: source.venue.serviceOptions,
    openingHours: source.venue.openingHours,
    statusMessages: source.messaging.statusMessages,
    visitNotes: source.messaging.visitNotes,
    arrivalTips: source.messaging.arrivalTips
  };
}

export function normalizeBusinessProfileEntry(entry: CmsBusinessProfileEntry): FrontendBusinessProfile {
  return {
    address: entry.address,
    area: entry.area,
    mapUrl: entry.mapUrl,
    mapsLabel: entry.mapsLabel,
    phoneNumber: entry.phoneNumber,
    phoneDisplay: entry.phoneDisplay,
    whatsappNumber: entry.whatsappNumber,
    whatsappPrefill: entry.whatsappPrefill,
    bookingMode: entry.bookingMode,
    externalBookingUrl: entry.externalBookingUrl,
    externalBookingLabel: entry.externalBookingLabel,
    serviceOptions: entry.serviceOptions,
    openingHours: entry.openingHours,
    statusMessages: entry.statusMessages,
    visitNotes: entry.visitNotes,
    arrivalTips: entry.arrivalTips,
    sourceMeta: {
      mode: entry.sourceMode,
      futureConnector: entry.futureConnector,
      syncReady: entry.syncReady,
      lastBusinessUpdateNote: entry.lastBusinessUpdateNote
    }
  };
}
