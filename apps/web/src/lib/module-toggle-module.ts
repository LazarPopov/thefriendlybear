import { fetchStrapiSingle } from "@/lib/cms/strapi";
import {
  normalizeModuleToggleEntry,
  type FrontendModuleToggles
} from "@/lib/cms/module-toggle-adapter";

type ActionWithKind = {
  kind: string;
};

export async function getModuleTogglesData(): Promise<FrontendModuleToggles> {
  const entry = await fetchStrapiSingle<Partial<FrontendModuleToggles>>("/api/module-toggle");

  return normalizeModuleToggleEntry(entry);
}

export function filterActionsByModuleToggles<T extends ActionWithKind>(
  actions: T[],
  toggles: FrontendModuleToggles
) {
  return actions.filter((action) => {
    if (!toggles.reservationsEnabled) {
      return action.kind !== "reservations" && action.kind !== "external_booking";
    }

    return true;
  });
}
