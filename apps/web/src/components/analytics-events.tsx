"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | IArguments>;
    gtag?: (command: "event", eventName: string, params: Record<string, unknown>) => void;
  }
}

type AnalyticsEventsProps = {
  enabled: boolean;
};

type TrackingPayload = {
  action_type: string;
  location: string;
  label: string;
  locale: string;
  target: string;
  is_external: boolean;
};

const trackingSelector = "[data-track-event]";

function pushDataLayerEvent(eventName: string, payload: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...payload
  });
}

function readTrackingPayload(element: HTMLElement): { eventName: string; payload: TrackingPayload } | null {
  const eventName = element.dataset.trackEvent;

  if (!eventName) {
    return null;
  }

  return {
    eventName,
    payload: {
      action_type: element.dataset.trackActionType ?? "",
      location: element.dataset.trackLocation ?? "",
      label: element.dataset.trackLabel ?? element.textContent?.trim() ?? "",
      locale: element.dataset.trackLocale ?? "",
      target: element.dataset.trackTarget ?? element.getAttribute("href") ?? "",
      is_external: element.dataset.trackExternal === "true"
    }
  };
}

export function AnalyticsEvents({ enabled }: AnalyticsEventsProps) {
  const pathname = usePathname() || "/";

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const pagePath = `${pathname}${window.location.search}`;
    const payload = {
      page_location: window.location.href,
      page_path: pagePath,
      page_title: document.title
    };

    pushDataLayerEvent("virtual_page_view", payload);
    window.gtag?.("event", "page_view", payload);
  }, [enabled, pathname]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handleTrackedClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const trackedElement = target.closest(trackingSelector);

      if (!(trackedElement instanceof HTMLElement)) {
        return;
      }

      const tracking = readTrackingPayload(trackedElement);

      if (!tracking) {
        return;
      }

      const payload = {
        ...tracking.payload,
        link_url: tracking.payload.target,
        link_text: tracking.payload.label
      };

      pushDataLayerEvent(tracking.eventName, payload);
      window.gtag?.("event", tracking.eventName, payload);
    }

    document.addEventListener("click", handleTrackedClick, true);

    return () => document.removeEventListener("click", handleTrackedClick, true);
  }, [enabled]);

  return null;
}
