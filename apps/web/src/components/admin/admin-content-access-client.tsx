"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminClientError, adminFetch, adminLoginPath } from "@/lib/admin/content-client";
import type { ContentAdminContext, StaffAccessRecord } from "@/lib/content-types";

type AccessApiResponse = {
  context: ContentAdminContext;
  staff: StaffAccessRecord[];
};

export function AdminContentAccessClient() {
  const router = useRouter();
  const [context, setContext] = useState<ContentAdminContext | null>(null);
  const [staff, setStaff] = useState<StaffAccessRecord[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savingStaffProfileId, setSavingStaffProfileId] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setError(null);

    try {
      const payload = await adminFetch<AccessApiResponse>("/api/admin/content-access");
      setContext(payload.context);
      setStaff(payload.staff);
    } catch (loadError) {
      if (loadError instanceof AdminClientError && loadError.status === 401) {
        router.replace(adminLoginPath("/admin/content-access"));
        return;
      }

      setError(loadError instanceof Error ? loadError.message : "Unable to load content access.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function updateLocal(staffProfileId: string, key: "can_edit_menu" | "can_edit_reviews" | "can_manage_content_permissions", value: boolean) {
    setStaff((current) =>
      current.map((item) =>
        item.staffProfileId === staffProfileId
          ? {
              ...item,
              permissions: {
                ...item.permissions,
                [key]: value
              }
            }
          : item
      )
    );
  }

  async function saveAccess(row: StaffAccessRecord) {
    setSavingStaffProfileId(row.staffProfileId);
    setMessage(null);
    setError(null);

    try {
      const payload = await adminFetch<AccessApiResponse>("/api/admin/content-access", {
        method: "POST",
        body: JSON.stringify({
          staffProfileId: row.staffProfileId,
          can_edit_menu: row.permissions.can_edit_menu,
          can_edit_reviews: row.permissions.can_edit_reviews,
          can_manage_content_permissions: row.permissions.can_manage_content_permissions,
          is_active: row.permissions.is_active
        })
      });
      setContext(payload.context);
      setStaff(payload.staff);
      setMessage("Access saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save access.");
    } finally {
      setSavingStaffProfileId(null);
    }
  }

  if (isLoading) {
    return (
      <main className="booking-shell booking-safe-screen">
        <section className="booking-safe-panel">
          <h1>Loading access...</h1>
        </section>
      </main>
    );
  }

  if (error && !context) {
    return (
      <main className="booking-shell booking-safe-screen">
        <section className="booking-safe-panel">
          <p className="booking-kicker">No access</p>
          <h1>Content access unavailable</h1>
          <p className="booking-form-error">{error}</p>
          <Link href="/admin/bookings">Back to bookings</Link>
        </section>
      </main>
    );
  }

  if (!context) {
    return null;
  }

  return (
    <main className="booking-shell booking-settings-shell">
      <header className="booking-subpage-header">
        <div>
          <p className="booking-kicker">{context.restaurant.name}</p>
          <h1>Content access</h1>
        </div>
        <nav className="booking-nav" aria-label="Admin navigation">
          <Link href="/admin">Admin</Link>
          <Link href="/admin/bookings">Bookings</Link>
          <Link href="/admin/menu">Menu</Link>
          <Link href="/admin/reviews">Reviews</Link>
        </nav>
      </header>

      {message ? <p className="booking-status booking-status-sync">{message}</p> : null}
      {error ? <p className="booking-status booking-status-warning">{error}</p> : null}

      <section className="booking-settings-form">
        <div className="booking-settings-section">
          <h2>Staff permissions</h2>
          <div className="content-access-list">
            {staff.map((row) => (
              <article key={row.staffProfileId} className="content-access-row">
                <div>
                  <p className="booking-kicker">
                    {row.profileRole} / {row.membershipRole}
                  </p>
                  <h2>{row.displayName}</h2>
                  {row.effective.isOwner ? <p className="booking-muted">Owner accounts always have full content access.</p> : null}
                </div>
                <label className="booking-settings-check">
                  <input
                    type="checkbox"
                    checked={row.permissions.can_edit_menu}
                    onChange={(event) => updateLocal(row.staffProfileId, "can_edit_menu", event.target.checked)}
                  />
                  Menu
                </label>
                <label className="booking-settings-check">
                  <input
                    type="checkbox"
                    checked={row.permissions.can_edit_reviews}
                    onChange={(event) => updateLocal(row.staffProfileId, "can_edit_reviews", event.target.checked)}
                  />
                  Reviews
                </label>
                <label className="booking-settings-check">
                  <input
                    type="checkbox"
                    checked={row.permissions.can_manage_content_permissions}
                    onChange={(event) => updateLocal(row.staffProfileId, "can_manage_content_permissions", event.target.checked)}
                  />
                  Access
                </label>
                <button
                  type="button"
                  onClick={() => saveAccess(row)}
                  disabled={savingStaffProfileId === row.staffProfileId}
                >
                  Save
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
