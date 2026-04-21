import Link from "next/link";
import type { ActionTrackingData } from "@/lib/tracking";

type ActionLinkProps = {
  href: string;
  label: string;
  className?: string;
  external?: boolean;
  tracking?: ActionTrackingData;
};

export function ActionLink({
  href,
  label,
  className,
  external = false,
  tracking
}: ActionLinkProps) {
  const trackingProps = tracking
    ? {
        "data-track-event": tracking.event,
        "data-track-action-type": tracking.actionType,
        "data-track-location": tracking.location,
        "data-track-label": tracking.label,
        "data-track-locale": tracking.locale,
        "data-track-target": tracking.target,
        "data-track-external": String(tracking.external)
      }
    : undefined;

  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noreferrer"
        {...trackingProps}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className} {...trackingProps}>
      {label}
    </Link>
  );
}
