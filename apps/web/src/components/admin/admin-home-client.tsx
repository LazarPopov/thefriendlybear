"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AdminClientError, adminFetch, adminLoginPath } from "@/lib/admin/content-client";
import type { BookingRole } from "@/lib/bookings/types";
import type { ContentAdminContext } from "@/lib/content-types";

type AdminMeResponse = {
  context: ContentAdminContext;
};

type AdminTool = {
  href: string;
  label: string;
  description: string;
  section: "Reservations" | "Content" | "Access";
};

function hasRole(role: BookingRole, allowed: BookingRole[]) {
  return allowed.includes(role);
}

function canManageBookingSettings(context: ContentAdminContext) {
  return (
    hasRole(context.membership.role, ["owner", "admin"]) ||
    hasRole(context.staffProfile.role, ["owner", "admin"])
  );
}

function canReviewBookingOperations(context: ContentAdminContext) {
  return (
    hasRole(context.membership.role, ["owner", "admin", "manager"]) ||
    hasRole(context.staffProfile.role, ["owner", "admin", "manager"])
  );
}

function getAdminTools(context: ContentAdminContext): AdminTool[] {
  const tools: AdminTool[] = [
    {
      href: "/admin/bookings",
      label: "Reservation book",
      description: "Create, edit, group, and sync reservations.",
      section: "Reservations"
    }
  ];

  if (canManageBookingSettings(context)) {
    tools.push(
      {
        href: "/admin/bookings/settings",
        label: "Booking settings",
        description: "Manage opening hours, table rows, durations, and booking behavior.",
        section: "Reservations"
      },
      {
        href: "/admin/bookings/integrations",
        label: "Booking integrations",
        description: "Review external reservation sources and phone adapter status.",
        section: "Reservations"
      }
    );
  }

  if (canReviewBookingOperations(context)) {
    tools.push({
      href: "/admin/bookings/conflicts",
      label: "Sync conflicts",
      description: "Inspect and resolve reservation sync conflicts.",
      section: "Reservations"
    });
  }

  if (context.permissions.canEditMenu) {
    tools.push(
      {
        href: "/admin/menu",
        label: "Seasonal menu editor",
        description: "Edit and publish the Bulgarian and English weekly menu.",
        section: "Content"
      },
      {
        href: "/admin/menu/preview",
        label: "Menu preview",
        description: "Preview the edited menu exactly in the public page layout.",
        section: "Content"
      }
    );
  }

  if (context.permissions.canEditReviews) {
    tools.push(
      {
        href: "/admin/reviews",
        label: "Reviews editor",
        description: "Add, edit, feature, and sort public guest reviews.",
        section: "Content"
      },
      {
        href: "/admin/reviews/preview",
        label: "Reviews preview",
        description: "Preview featured reviews in the public reviews page layout.",
        section: "Content"
      }
    );
  }

  if (context.permissions.canManageContentPermissions) {
    tools.push({
      href: "/admin/content-access",
      label: "Content access",
      description: "Grant menu, review, and content-permission rights to staff.",
      section: "Access"
    });
  }

  return tools;
}

export function AdminHomeClient() {
  const router = useRouter();
  const [context, setContext] = useState<ContentAdminContext | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const groupedTools = useMemo(() => {
    if (!context) {
      return [];
    }

    const tools = getAdminTools(context);
    const sections: AdminTool["section"][] = ["Reservations", "Content", "Access"];

    return sections
      .map((section) => ({
        section,
        tools: tools.filter((tool) => tool.section === section)
      }))
      .filter((group) => group.tools.length > 0);
  }, [context]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const payload = await adminFetch<AdminMeResponse>("/api/admin/me");

        if (isMounted) {
          setContext(payload.context);
        }
      } catch (loadError) {
        if (loadError instanceof AdminClientError && loadError.status === 401) {
          router.replace(adminLoginPath("/admin"));
          return;
        }

        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load admin dashboard.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isLoading) {
    return (
      <main className="booking-shell booking-safe-screen">
        <section className="booking-safe-panel">
          <h1>Loading admin...</h1>
        </section>
      </main>
    );
  }

  if (error || !context) {
    return (
      <main className="booking-shell booking-safe-screen">
        <section className="booking-safe-panel">
          <p className="booking-kicker">No access</p>
          <h1>Admin unavailable</h1>
          {error ? <p className="booking-form-error">{error}</p> : null}
          <Link href="/admin/bookings/login?next=%2Fadmin">Sign in</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="booking-shell booking-settings-shell">
      <header className="booking-subpage-header">
        <div>
          <p className="booking-kicker">{context.restaurant.name}</p>
          <h1>Admin</h1>
        </div>
        <nav className="booking-nav" aria-label="Admin navigation">
          <Link href="/admin/bookings">Bookings</Link>
          {context.permissions.canEditMenu ? <Link href="/admin/menu">Menu</Link> : null}
          {context.permissions.canEditReviews ? <Link href="/admin/reviews">Reviews</Link> : null}
          {context.permissions.canManageContentPermissions ? <Link href="/admin/content-access">Access</Link> : null}
        </nav>
      </header>

      <section className="booking-settings-form admin-home">
        <div className="booking-settings-section admin-home-intro">
          <div>
            <p className="booking-kicker">
              {context.staffProfile.display_name} / {context.membership.role}
            </p>
            <h2>Your admin tools</h2>
          </div>
          <p className="booking-muted">This page only shows tools your account can access.</p>
        </div>

        {groupedTools.map((group) => (
          <section key={group.section} className="booking-settings-section">
            <h2>{group.section}</h2>
            <div className="admin-home-grid">
              {group.tools.map((tool) => (
                <Link key={tool.href} className="admin-home-card" href={tool.href}>
                  <span className="booking-kicker">{tool.section}</span>
                  <strong>{tool.label}</strong>
                  <span>{tool.description}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}
