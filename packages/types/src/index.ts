export type SiteLocale = "bg" | "en";
export type TouristMarketLocale = "it" | "es" | "el" | "de" | "ro" | "en-gb";

export type LocalizedString = Record<SiteLocale, string>;
export type LocalizedStringList = Record<SiteLocale, string[]>;
export type MarketLocalizedString = Partial<Record<TouristMarketLocale, string>> & {
  enGb?: string;
};

export type ContentStatus = "draft" | "published" | "archived";
export type ReviewSource = "google" | "tripadvisor" | "manual";
export type ReservationMode = "pending" | "call_only" | "call_whatsapp" | "external_booking" | "hybrid";
export type BookingProvider = "rezzo" | "opentable" | "other";
export type TouristAudience = "italian" | "spanish" | "greek" | "german" | "romanian" | "uk";
export type BusinessProfileSourceMode = "manual";
export type BusinessProfileFutureConnector = "google_business_profile";

export type ExternalSourceRefs = {
  googleBusinessProfileId?: string;
  metaCatalogId?: string;
  externalId?: string;
  lastSyncedAt?: string;
};

export type BusinessHoursEntry = {
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  opens?: string;
  closes?: string;
  closed?: boolean;
};

export type SeoSchemaFlags = {
  restaurant?: boolean;
  localBusiness?: boolean;
  menu?: boolean;
  aggregateRating?: boolean;
  faq?: boolean;
  speakable?: boolean;
};

export type SeoMetadata = {
  title: LocalizedString;
  description: LocalizedString;
  canonicalPath: LocalizedString;
  keywords?: LocalizedStringList;
  noindex?: boolean;
  schema?: SeoSchemaFlags;
};

export type BaseContentEntity = {
  id: string;
  status: ContentStatus;
  seo: SeoMetadata;
  createdAt: string;
  updatedAt: string;
};

export type BusinessProfile = {
  id: "primary";
  sourceMode: BusinessProfileSourceMode;
  futureConnector: BusinessProfileFutureConnector;
  syncReady: boolean;
  lastBusinessUpdateNote: LocalizedString;
  address: LocalizedString;
  area: LocalizedString;
  mapUrl: string;
  mapsLabel: LocalizedString;
  phoneNumber?: string;
  phoneDisplay?: string;
  whatsappNumber?: string;
  whatsappPrefill: LocalizedString;
  bookingMode: ReservationMode;
  externalBookingUrl?: string;
  externalBookingLabel: LocalizedString;
  serviceOptions: LocalizedStringList;
  openingHours: BusinessHoursEntry[];
  statusMessages: LocalizedString;
  visitNotes: LocalizedStringList;
  arrivalTips: LocalizedStringList;
  seo?: SeoMetadata;
};

export type Page = BaseContentEntity & {
  key: string;
  slug: LocalizedString;
  title: LocalizedString;
  intro: LocalizedString;
  body: LocalizedString;
};

export type MenuCategory = BaseContentEntity & {
  key: string;
  slug: LocalizedString;
  name: LocalizedString;
  description?: LocalizedString;
  sortOrder: number;
  isActive: boolean;
};

export type MenuItem = BaseContentEntity & {
  key: string;
  categoryKey: string;
  slug: LocalizedString;
  name: LocalizedString;
  description?: LocalizedString;
  allergens?: LocalizedString;
  servingLabel?: LocalizedString;
  price: number;
  currency: "BGN" | "EUR";
  priceDisplayBgn?: string;
  priceDisplayEur?: string;
  sortOrder?: number;
  dietaryTags?: string[];
  isVegetarian?: boolean;
  isFeatured?: boolean;
  imageUrl?: string;
  sourceRefs?: ExternalSourceRefs;
};

export type Promotion = BaseContentEntity & {
  slug: LocalizedString;
  title: LocalizedString;
  summary: LocalizedString;
  body?: LocalizedString;
  ctaLabel?: LocalizedString;
  ctaUrl?: LocalizedString;
  startsAt?: string;
  endsAt?: string;
  isEnabled: boolean;
};

export type ReviewSnippet = BaseContentEntity & {
  source: ReviewSource;
  authorName: string;
  rating: number;
  reviewText: LocalizedString;
  reviewDate?: string;
  relativeDateLabel?: LocalizedString;
  sourceUrl?: string;
  keywordTags?: LocalizedStringList;
  isFeatured: boolean;
};

export type ReservationSettings = {
  id: "primary";
  isEnabled: boolean;
  mode: ReservationMode;
  stickyCallEnabled: boolean;
  stickyWhatsappEnabled: boolean;
  phoneNumber?: string;
  whatsappNumber?: string;
  externalBookingUrl?: string;
  externalBookingProvider?: BookingProvider;
  externalBookingDomain?: string;
  ctaLabel: LocalizedString;
  confirmationMessage?: LocalizedString;
};

export type TouristLandingPage = BaseContentEntity & {
  audience: TouristAudience;
  slug: LocalizedString;
  marketSlug?: MarketLocalizedString;
  title: LocalizedString;
  marketTitle?: MarketLocalizedString;
  intro: LocalizedString;
  marketIntro?: MarketLocalizedString;
  vegetarianMessage: LocalizedString;
  marketVegetarianMessage?: MarketLocalizedString;
  serviceMessage: LocalizedString;
  marketServiceMessage?: MarketLocalizedString;
  primaryCtaLabel: LocalizedString;
  marketPrimaryCtaLabel?: MarketLocalizedString;
  primaryCtaUrl: LocalizedString;
  marketPrimaryCtaUrl?: MarketLocalizedString;
};

export type ModuleToggles = {
  promotionsEnabled: boolean;
  reservationsEnabled: boolean;
  reviewsEnabled: boolean;
  socialFeedEnabled: boolean;
};

export type CmsContentSnapshot = {
  businessProfile: BusinessProfile;
  pages: Page[];
  menuCategories: MenuCategory[];
  menuItems: MenuItem[];
  promotions: Promotion[];
  reviewSnippets: ReviewSnippet[];
  reservationSettings: ReservationSettings;
  touristLandingPages: TouristLandingPage[];
  moduleToggles: ModuleToggles;
};
