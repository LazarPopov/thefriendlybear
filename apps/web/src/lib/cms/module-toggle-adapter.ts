export type FrontendModuleToggles = {
  promotionsEnabled: boolean;
  reservationsEnabled: boolean;
  reviewsEnabled: boolean;
  socialFeedEnabled: boolean;
};

export const moduleToggleFallback: FrontendModuleToggles = {
  promotionsEnabled: true,
  reservationsEnabled: true,
  reviewsEnabled: true,
  socialFeedEnabled: true
};

export function normalizeModuleToggleEntry(
  entry: Partial<FrontendModuleToggles> | null | undefined
): FrontendModuleToggles {
  return {
    ...moduleToggleFallback,
    ...entry
  };
}
