"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | IArguments>;
    friendlyBearAnalyticsEnabled?: boolean;
    gtag?: (...args: unknown[]) => void;
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
const sectionViewSelector = [
  "[data-track-section]",
  "main > section",
  "main > aside",
  ".home-section",
  ".menu-section-card",
  ".venue-progress-gallery"
].join(",");
const scrollDepthThresholds = [50, 75, 90] as const;

function pushDataLayerEvent(eventName: string, payload: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...payload
  });
}

function getPageContext() {
  return {
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}`,
    page_title: document.title
  };
}

function getRouteContext(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] ?? "";
  const locale = ["bg", "en", "it", "es", "el"].includes(firstSegment) ? firstSegment : "bg";
  const routeKey = locale === "it" || locale === "es" || locale === "el" ? "tourist_market" : segments[1] ?? "home";
  const touristAudience =
    locale === "it"
      ? "italian"
      : locale === "es"
        ? "spanish"
        : locale === "el"
          ? "greek"
          : segments[1] === "tourists"
            ? segments[2] ?? "index"
            : "";

  return {
    locale,
    route_key: routeKey,
    tourist_audience: touristAudience
  };
}

function getDocumentScrollPercent() {
  const documentElement = document.documentElement;
  const maxScroll = documentElement.scrollHeight - window.innerHeight;

  if (maxScroll <= 0) {
    return 100;
  }

  return Math.min(100, Math.max(0, Math.round((window.scrollY / maxScroll) * 100)));
}

function getElementLabel(element: Element) {
  const explicitLabel = element.getAttribute("data-track-section-label") || element.getAttribute("aria-label");

  if (explicitLabel) {
    return explicitLabel.trim();
  }

  const heading = element.querySelector("h1, h2, h3, .page-card-label, .eyebrow");

  if (heading?.textContent?.trim()) {
    return heading.textContent.trim();
  }

  if (element.id) {
    return element.id;
  }

  return element.className.toString().split(" ").filter(Boolean)[0] || element.tagName.toLowerCase();
}

function getSectionPayload(element: Element, index: number) {
  const routeContext = getRouteContext(window.location.pathname);
  const label = getElementLabel(element);
  const sectionId = element.id || element.getAttribute("data-track-section") || "";
  const sectionClass = element.className.toString();
  const target = sectionId || label;

  return {
    action_type: "section",
    location: "section_observer",
    label,
    target,
    is_external: false,
    section_index: index + 1,
    section_id: sectionId,
    section_class: sectionClass,
    section_label: label,
    ...routeContext
  };
}

export function trackAnalyticsEvent(eventName: string, payload: Record<string, unknown>) {
  if (!window.friendlyBearAnalyticsEnabled) {
    return;
  }

  const eventPayload = {
    ...getPageContext(),
    ...payload
  };

  pushDataLayerEvent(eventName, eventPayload);
  window.gtag?.("event", eventName, eventPayload);
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
    window.friendlyBearAnalyticsEnabled = enabled;

    return () => {
      window.friendlyBearAnalyticsEnabled = false;
    };
  }, [enabled]);

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
        link_text: tracking.payload.label,
        ...getPageContext()
      };

      pushDataLayerEvent(tracking.eventName, payload);
      window.gtag?.("event", tracking.eventName, payload);

      if (trackedElement.closest(".mobile-quickbar")) {
        const quickbarPayload = {
          ...payload,
          original_event: tracking.eventName
        };

        pushDataLayerEvent("quickbar_click", quickbarPayload);
        window.gtag?.("event", "quickbar_click", quickbarPayload);
      }

      if (tracking.eventName === "directions_click") {
        const mapPayload = {
          ...payload,
          original_event: tracking.eventName
        };

        pushDataLayerEvent("external_map_open", mapPayload);
        window.gtag?.("event", "external_map_open", mapPayload);
      }

      if (tracking.eventName === "menu_cta_click" || tracking.eventName === "menu_category_click") {
        const menuPayload = {
          ...payload,
          original_event: tracking.eventName,
          intent_source: tracking.payload.location
        };

        pushDataLayerEvent("menu_view_intent", menuPayload);
        window.gtag?.("event", "menu_view_intent", menuPayload);
      }
    }

    document.addEventListener("click", handleTrackedClick, true);

    return () => document.removeEventListener("click", handleTrackedClick, true);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const routeContext = getRouteContext(pathname);

    if (routeContext.route_key === "menu") {
      trackAnalyticsEvent("menu_view_intent", {
        action_type: "menu",
        location: "page_load",
        label: "Menu page view",
        target: pathname,
        is_external: false,
        intent_source: "page_load",
        ...routeContext
      });
    }

    if (routeContext.route_key === "reviews") {
      trackAnalyticsEvent("review_interaction", {
        action_type: "reviews",
        location: "reviews_page",
        label: "Reviews page view",
        target: pathname,
        is_external: false,
        review_action: "page_view",
        ...routeContext
      });
    }

    if (routeContext.route_key === "tourists" || routeContext.route_key === "tourist_market") {
      trackAnalyticsEvent("tourist_language_page_engagement", {
        action_type: "tourist_page",
        location: "page_load",
        label: routeContext.tourist_audience || "tourist page",
        target: pathname,
        is_external: false,
        engagement_action: "page_view",
        ...routeContext
      });
    }
  }, [enabled, pathname]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const routeContext = getRouteContext(pathname);
    const reachedThresholds = new Set<number>();

    function emitScrollDepth() {
      const scrollPercent = getDocumentScrollPercent();

      scrollDepthThresholds.forEach((threshold) => {
        if (scrollPercent < threshold || reachedThresholds.has(threshold)) {
          return;
        }

        reachedThresholds.add(threshold);
        trackAnalyticsEvent("scroll_depth", {
          action_type: "scroll",
          location: "page_scroll",
          label: `${threshold}%`,
          target: pathname,
          is_external: false,
          scroll_depth: threshold,
          scroll_percent: scrollPercent,
          ...routeContext
        });

        if (threshold >= 50 && (routeContext.route_key === "tourists" || routeContext.route_key === "tourist_market")) {
          trackAnalyticsEvent("tourist_language_page_engagement", {
            action_type: "tourist_page",
            location: "page_scroll",
            label: `${threshold}% scroll`,
            target: pathname,
            is_external: false,
            engagement_action: "scroll_depth",
            scroll_depth: threshold,
            ...routeContext
          });
        }
      });
    }

    emitScrollDepth();
    window.addEventListener("scroll", emitScrollDepth, { passive: true });
    window.addEventListener("resize", emitScrollDepth);

    return () => {
      window.removeEventListener("scroll", emitScrollDepth);
      window.removeEventListener("resize", emitScrollDepth);
    };
  }, [enabled, pathname]);

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") {
      return;
    }

    const seenSections = new Set<Element>();
    const elements = Array.from(document.querySelectorAll(sectionViewSelector));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || seenSections.has(entry.target)) {
            return;
          }

          seenSections.add(entry.target);
          const sectionIndex = elements.indexOf(entry.target);
          const payload = getSectionPayload(entry.target, sectionIndex);

          trackAnalyticsEvent("section_view", payload);

          if (entry.target.classList.contains("menu-section-card")) {
            trackAnalyticsEvent("menu_category_view", {
              ...payload,
              action_type: "menu_category",
              location: "menu_category_section",
              menu_category: payload.section_label
            });
          }

          if (
            entry.target.classList.contains("venue-gallery-review") ||
            entry.target.querySelector(".review-card, .venue-gallery-review")
          ) {
            trackAnalyticsEvent("review_interaction", {
              ...payload,
              action_type: "reviews",
              location: "review_section",
              review_action: "section_view"
            });
          }
        });
      },
      {
        rootMargin: "0px 0px -20% 0px",
        threshold: 0.4
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [enabled, pathname]);

  return null;
}
