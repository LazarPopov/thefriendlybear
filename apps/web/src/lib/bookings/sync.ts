import { createId, DEFAULT_RESTAURANT_ID, getDeviceId } from "./defaults";
import {
  loadActivePendingMutations,
  loadPendingMutations,
  savePendingMutation,
  savePendingMutations,
  saveReservation
} from "./local-db";
import { applyRemoteMutation, isDemoSession, isSupabaseConfigured, mapRemoteReservation } from "./supabase";
import type { BookingSession, MutationOperation, PendingMutation, Reservation, StaffProfile } from "./types";

export function reservationPayload(reservation: Reservation) {
  return {
    id: reservation.id,
    restaurant_id: reservation.restaurant_id,
    reservation_date: reservation.reservation_date,
    table_ids: reservation.tableIds,
    start_time: reservation.start_time,
    duration_minutes: reservation.duration_minutes,
    end_time: reservation.end_time,
    party_size: reservation.party_size,
    customer_name: reservation.customer_name,
    customer_phone: reservation.customer_phone,
    note: reservation.note,
    source: reservation.source
  };
}

export function makeReservationMutation(
  operation: MutationOperation,
  reservation: Reservation,
  staffProfile: StaffProfile | null,
  payload: Record<string, unknown> = reservationPayload(reservation),
  baseVersion: number | null = reservation.version
): PendingMutation {
  return {
    mutation_id: createId("mutation"),
    restaurant_id: reservation.restaurant_id,
    device_id: getDeviceId(),
    staff_profile_id: staffProfile?.id ?? null,
    operation,
    entity_type: "reservation",
    entity_id: reservation.id,
    base_version: baseVersion,
    payload,
    created_at: new Date().toISOString(),
    sync_attempts: 0,
    last_sync_attempt_at: null,
    sync_state: "pending"
  };
}

export async function queueReservationMutation(mutation: PendingMutation) {
  await savePendingMutation(mutation);
}

function isLocalFallbackMutation(mutation: PendingMutation) {
  const payloadRestaurantId = typeof mutation.payload.restaurant_id === "string" ? mutation.payload.restaurant_id : null;
  const tableIds = Array.isArray(mutation.payload.table_ids) ? mutation.payload.table_ids : [];

  return (
    mutation.restaurant_id === DEFAULT_RESTAURANT_ID ||
    payloadRestaurantId === DEFAULT_RESTAURANT_ID ||
    tableIds.some((id) => typeof id === "string" && id.startsWith("local-table-"))
  );
}

export async function syncPendingMutations(session: BookingSession | null) {
  if (!session || isDemoSession(session) || !isSupabaseConfigured() || typeof navigator !== "undefined" && !navigator.onLine) {
    return {
      synced: 0,
      failed: 0,
      conflicts: 0,
      lastError: null as string | null
    };
  }

  const activeMutations = await loadActivePendingMutations();
  let synced = 0;
  let failed = 0;
  let conflicts = 0;
  let lastError: string | null = null;

  for (const mutation of activeMutations) {
    if (isLocalFallbackMutation(mutation)) {
      await savePendingMutation({
        ...mutation,
        sync_state: "conflict",
        last_sync_attempt_at: new Date().toISOString()
      });
      conflicts += 1;
      lastError = "This local change was created before the real Supabase restaurant loaded, so it cannot be synced automatically.";
      continue;
    }

    const syncingMutation: PendingMutation = {
      ...mutation,
      sync_state: "syncing",
      sync_attempts: mutation.sync_attempts + 1,
      last_sync_attempt_at: new Date().toISOString()
    };

    await savePendingMutation(syncingMutation);

    try {
      const result = await applyRemoteMutation(session, syncingMutation);

      if (result.status === "conflict") {
        await savePendingMutation({
          ...syncingMutation,
          sync_state: "conflict"
        });
        conflicts += 1;
      } else {
        if (result.reservation) {
          await saveReservation({
            ...mapRemoteReservation(result.reservation),
            sync_state: "synced"
          });
        }

        await savePendingMutation({
          ...syncingMutation,
          sync_state: "synced"
        });
        synced += 1;
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Unknown sync error";
      await savePendingMutation({
        ...syncingMutation,
        sync_state: "failed"
      });
      failed += 1;
    }
  }

  return { synced, failed, conflicts, lastError };
}

export async function countUnresolvedLocalMutations() {
  const mutations = await loadPendingMutations();
  return mutations.filter((mutation) => mutation.sync_state === "pending" || mutation.sync_state === "failed").length;
}

export async function markReservationConflict(mutationId: string) {
  const mutations = await loadPendingMutations();
  await savePendingMutations(
    mutations.map((mutation) =>
      mutation.mutation_id === mutationId
        ? {
            ...mutation,
            sync_state: "conflict"
          }
        : mutation
    )
  );
}
