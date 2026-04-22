"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackAnalyticsEvent } from "@/components/analytics-events";

function getLocaleFromPath(pathname: string) {
  if (pathname.startsWith("/en")) return "en";
  if (pathname.startsWith("/it")) return "it";
  if (pathname.startsWith("/es")) return "es";
  if (pathname.startsWith("/el")) return "el";
  return "bg";
}

export function NotFoundTracker() {
  const pathname = usePathname() || "/";

  useEffect(() => {
    trackAnalyticsEvent("dead_end_404", {
      action_type: "error",
      location: "not_found_page",
      label: "404",
      locale: getLocaleFromPath(pathname),
      target: pathname,
      is_external: false,
      missing_path: pathname
    });
  }, [pathname]);

  return null;
}
