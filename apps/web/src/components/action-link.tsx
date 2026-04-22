import Link from "next/link";
import { getActionTrackingAttributes, type ActionTrackingData } from "@/lib/tracking";

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
  const trackingProps = tracking ? getActionTrackingAttributes(tracking) : undefined;

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
