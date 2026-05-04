"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  addDays,
  addMinutes,
  clamp,
  createId,
  DEFAULT_BOOKING_SETTINGS,
  formatDateDisplay,
  formatReservationText,
  getInitialSelectedDate,
  minutesToTime,
  rememberSelectedDate,
  roundMinutesToStep,
  toMinutes,
  todayDateString
} from "@/lib/bookings/defaults";
import {
  isPopupDismissed,
  loadReservationsForDate,
  loadSettings,
  loadTables,
  rememberDismissedPopup,
  saveReservation,
  saveReservations,
  saveRestaurant,
  saveSettings,
  saveStaffProfile,
  saveTables
} from "@/lib/bookings/local-db";
import {
  countUnresolvedLocalMutations,
  makeReservationMutation,
  queueReservationMutation,
  reservationPayload,
  syncPendingMutations
} from "@/lib/bookings/sync";
import {
  clearStoredSession,
  fallbackContext,
  fetchBookingContext,
  fetchBookingSettings,
  fetchPhoneSuggestion,
  fetchReservationAdminAudit,
  fetchReservations,
  fetchTables,
  getActiveSession,
  isDemoSession,
  isSupabaseConfigured,
  subscribeToBookingChanges
} from "@/lib/bookings/supabase";
import type {
  BookingContext,
  BookingSession,
  BookingSettings,
  Reservation,
  ReservationAdminAudit,
  RestaurantTable
} from "@/lib/bookings/types";

const TABLE_COLUMN_WIDTH = 76;
const MOBILE_TABLE_COLUMN_WIDTH = 54;
const HEADER_HEIGHT = 44;
const ROW_HEIGHT = 72;
const HOUR_WIDTH = 128;
const MINUTE_WIDTH = HOUR_WIDTH / 60;
const TIMELINE_GUTTER_MINUTES = 15;
const TIMELINE_GUTTER_WIDTH = TIMELINE_GUTTER_MINUTES * MINUTE_WIDTH;
const OVERLAP_X_OFFSET = 10;
const LIVE_REFRESH_INTERVAL_MS = 8000;
const PEOPLE_WORD = "\u0434\u0443\u0448\u0438";
const PHONE_PLACEHOLDER = "\u0442\u0435\u043B\u0435\u0444\u043E\u043D";
const COMMENT_PLACEHOLDER = "\u043A\u043E\u043C\u0435\u043D\u0442\u0430\u0440";

type Draft = {
  mode: "create" | "edit";
  reservationId?: string;
  tableId: string;
  tableIds: string[];
  start_time: string;
  party_size: string;
  customer_name: string;
  customer_phone: string;
  note: string;
};

type ConnectPrompt = {
  keep: Reservation;
  merge?: Reservation;
  tableId?: string;
};

type PreparedPopup = {
  id: string;
  reservation: Reservation;
};

type HiddenCounts = {
  left: number;
  right: number;
};

type VerticalHiddenCounts = {
  above: number;
  below: number;
};

type RowHiddenCount = HiddenCounts & {
  tableId: string;
  rowIndex: number;
  visibleStart: number;
  visibleEnd: number;
};

type OverlapLayout = {
  count: number;
  slot: number;
};

function currentLocalMinute() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function settingsForRestaurant(settings: BookingSettings | null, restaurantId: string): BookingSettings {
  const resolved = {
    ...DEFAULT_BOOKING_SETTINGS,
    ...settings,
    id: settings?.id ?? `local-settings-${restaurantId}`,
    restaurant_id: restaurantId
  };

  if (
    resolved.opening_start_time === "12:00" &&
    resolved.last_bookable_start_time === "22:00" &&
    resolved.visible_end_time === "22:00"
  ) {
    return {
      ...resolved,
      visible_end_time: "00:00"
    };
  }

  return resolved;
}

function activeReservations(reservations: Reservation[]) {
  return reservations.filter((reservation) => !reservation.deleted_at);
}

function normalizedPhone(value: string) {
  return value.replace(/\s+/g, "").trim();
}

function isBlankMergeDraft(draft: Draft) {
  return !draft.customer_name.trim() && !draft.customer_phone.trim() && !draft.note.trim();
}

function canReadReservationAudit(context: BookingContext | null) {
  return Boolean(context);
}

function tableLabel(table: RestaurantTable) {
  return table.display_label || table.table_number;
}

function timelineMinuteForTime(time: string, settings: BookingSettings) {
  const openingMinute = toMinutes(settings.opening_start_time);
  const minute = toMinutes(time);
  return minute < openingMinute ? minute + 1440 : minute;
}

function visibleEndMinute(settings: BookingSettings) {
  const openingMinute = toMinutes(settings.opening_start_time);
  const endMinute = toMinutes(settings.visible_end_time);
  return endMinute <= openingMinute ? endMinute + 1440 : endMinute;
}

function lastBookableMinute(settings: BookingSettings) {
  return timelineMinuteForTime(settings.last_bookable_start_time, settings);
}

function isOutsideBookableWindow(time: string, settings: BookingSettings) {
  const minute = toMinutes(time);
  return minute < toMinutes(settings.opening_start_time) || minute > toMinutes(settings.last_bookable_start_time);
}

function reservationX(reservation: Pick<Reservation, "start_time">, settings: BookingSettings) {
  return bookingMinuteToX(timelineMinuteForTime(reservation.start_time, settings), settings);
}

function reservationWidth(reservation: Pick<Reservation, "duration_minutes">) {
  return Math.max(44, reservation.duration_minutes * MINUTE_WIDTH);
}

function timeRangeMinutes(settings: BookingSettings) {
  return Math.max(60, visibleEndMinute(settings) - toMinutes(settings.opening_start_time));
}

function bookingMinuteToX(minute: number, settings: BookingSettings) {
  return TIMELINE_GUTTER_WIDTH + (minute - toMinutes(settings.opening_start_time)) * MINUTE_WIDTH;
}

function reservationDisplayParts(reservation: Reservation) {
  return {
    time: reservation.start_time.slice(0, 5),
    name: reservation.customer_name,
    phone: reservation.customer_phone,
    note: reservation.note,
    partySize: reservation.party_size
  };
}

function buildTimeLabels(settings: BookingSettings) {
  const start = toMinutes(settings.opening_start_time);
  const end = visibleEndMinute(settings);
  const labels = [];

  for (let minute = start; minute <= end; minute += 60) {
    labels.push(minutesToTime(minute));
  }

  return labels;
}

function normalizeDraftTime(value: string, settings: BookingSettings) {
  const start = toMinutes(settings.opening_start_time);
  const end = lastBookableMinute(settings);
  return minutesToTime(clamp(timelineMinuteForTime(value, settings), start, end));
}

function normalizePeople(value: string) {
  const match = value.trim().match(/^(\d+)(?:\s*\S+)?$/);
  return match?.[1] ?? "";
}

function isValidTime(value: string) {
  return /^(?:[01]?\d|2[0-3]):[0-5]\d$/.test(value.trim());
}

function isValidPhone(value: string) {
  return /^[+\d][\d\s().-]{4,}$/.test(value.trim());
}

function parseDateDisplay(value: string) {
  const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (!match) {
    return null;
  }

  const [, rawDay, rawMonth, rawYear] = match;
  const day = Number(rawDay);
  const month = Number(rawMonth);
  const year = Number(rawYear);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return `${rawYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function warningText(minutes: number) {
  {
    const reservationText = "\u0438\u043c\u0430 \u0440\u0435\u0437\u0435\u0440\u0432\u0430\u0446\u0438\u044f";
    const minutesText = "\u043c\u0438\u043d\u0443\u0442\u0438";
    const hourText = "\u0447\u0430\u0441";
    const hoursText = "\u0447\u0430\u0441\u0430";

    if (minutes < 60) {
      return `\u0421\u043b\u0435\u0434 ${minutes} ${minutesText} ${reservationText}.`;
    }

    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;

    if (!rest) {
      return `\u0421\u043b\u0435\u0434 ${hours} ${hours === 1 ? hourText : hoursText} ${reservationText}.`;
    }

    return `\u0421\u043b\u0435\u0434 ${hours} ${hours === 1 ? hourText : hoursText} \u0438 ${rest} ${minutesText} ${reservationText}.`;
  }

  if (minutes < 60) {
    return `След ${minutes} минути има резервация.`;
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (!rest) {
    return `След ${hours} ${hours === 1 ? "час" : "часа"} има резервация.`;
  }

  return `След ${hours} ${hours === 1 ? "час" : "часа"} и ${rest} минути има резервация.`;
}

function nextReservationWarning(
  reservations: Reservation[],
  current: { id?: string; tableIds: string[]; start_time: string; end_time: string },
  settings: BookingSettings
) {
  const compareFrom =
    settings.next_reservation_warning_mode === "from_end_time" ? toMinutes(current.end_time) : toMinutes(current.start_time);
  const next = activeReservations(reservations)
    .filter((reservation) => reservation.id !== current.id)
    .filter((reservation) => reservation.tableIds.some((id) => current.tableIds.includes(id)))
    .map((reservation) => toMinutes(reservation.start_time))
    .filter((start) => start > compareFrom)
    .sort((a, b) => a - b)[0];

  if (!next) {
    return null;
  }

  return warningText(next - compareFrom);
}

function formatAuditActor(displayName: string | null) {
  const name = displayName?.trim();

  if (!name) {
    return "Unknown account";
  }

  return name;
}

function formatAuditTime(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function shouldShowEditedAudit(audit: ReservationAdminAudit) {
  const createdTime = formatAuditTime(audit.created_at);
  const updatedTime = formatAuditTime(audit.updated_at);

  if (!updatedTime || updatedTime === createdTime) {
    return false;
  }

  return audit.updated_by_staff_profile_id !== audit.created_by_staff_profile_id || updatedTime !== createdTime;
}

function syncResultMessage(result: { synced: number; failed: number; conflicts: number; lastError?: string | null }) {
  if (result.synced) {
    return `${result.synced} local change(s) synced.`;
  }

  if (result.conflicts) {
    const detail = result.lastError ? ` ${result.lastError.slice(0, 180)}` : "";
    return `${result.conflicts} local change(s) need conflict review.${detail}`;
  }

  if (result.failed) {
    const detail = result.lastError ? ` ${result.lastError.slice(0, 180)}` : "";
    return `${result.failed} local change(s) could not sync yet.${detail}`;
  }

  return "No local changes needed syncing.";
}

function reservationStartMinute(reservation: Pick<Reservation, "start_time">) {
  return toMinutes(reservation.start_time);
}

function reservationEndMinute(reservation: Pick<Reservation, "end_time" | "start_time">) {
  const start = reservationStartMinute(reservation);
  let end = toMinutes(reservation.end_time);

  if (end <= start) {
    end += 1440;
  }

  return end;
}

function assignOverlapLayout(reservations: Reservation[]) {
  const sorted = [...reservations].sort((a, b) => {
    const byStart = reservationStartMinute(a) - reservationStartMinute(b);

    if (byStart) {
      return byStart;
    }

    return a.id.localeCompare(b.id);
  });
  const map = new Map<string, OverlapLayout>();
  let group: Reservation[] = [];
  let groupEnd = -1;

  const finishGroup = () => {
    if (!group.length) {
      return;
    }

    const slotEnds: number[] = [];
    const assigned = new Map<string, number>();

    for (const reservation of group) {
      const start = reservationStartMinute(reservation);
      const end = reservationEndMinute(reservation);
      let slot = slotEnds.findIndex((slotEnd) => slotEnd <= start);

      if (slot === -1) {
        slot = slotEnds.length;
        slotEnds.push(end);
      } else {
        slotEnds[slot] = end;
      }

      assigned.set(reservation.id, slot);
    }

    const count = Math.max(1, slotEnds.length);

    for (const reservation of group) {
      map.set(reservation.id, { count, slot: assigned.get(reservation.id) ?? 0 });
    }

    group = [];
    groupEnd = -1;
  };

  for (const reservation of sorted) {
    const start = reservationStartMinute(reservation);
    const end = reservationEndMinute(reservation);

    if (group.length && start >= groupEnd) {
      finishGroup();
    }

    group.push(reservation);
    groupEnd = Math.max(groupEnd, end);
  }

  finishGroup();

  return map;
}

function groupedTableOrder(tables: RestaurantTable[], reservations: Reservation[], settings: BookingSettings) {
  if (!settings.auto_group_connected_tables) {
    return { tables, groupedIds: new Set<string>() };
  }

  let ordered = [...tables];
  const groupedIds = new Set<string>();

  for (const reservation of activeReservations(reservations)) {
    if (reservation.tableIds.length < 2) {
      continue;
    }

    const positions = reservation.tableIds
      .map((id) => ordered.findIndex((table) => table.id === id))
      .filter((index) => index >= 0)
      .sort((a, b) => a - b);

    if (positions.length < 2) {
      continue;
    }

    const isAlreadyGrouped = positions[positions.length - 1] - positions[0] + 1 === positions.length;

    if (isAlreadyGrouped) {
      continue;
    }

    const connected = positions.map((index) => ordered[index]);
    const connectedIds = new Set(connected.map((table) => table.id));
    const firstId = connected[0].id;
    const nextOrder: RestaurantTable[] = [];

    for (const table of ordered) {
      if (table.id === firstId) {
        nextOrder.push(...connected);
        connected.forEach((item) => groupedIds.add(item.id));
        continue;
      }

      if (!connectedIds.has(table.id)) {
        nextOrder.push(table);
      }
    }

    ordered = nextOrder;
  }

  return { tables: ordered, groupedIds };
}

export function BookingAppClient() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<HTMLInputElement | null>(null);
  const peopleInputRef = useRef<HTMLInputElement | null>(null);
  const autoScrolledDateRef = useRef<string | null>(null);
  const [session, setSession] = useState<BookingSession | null>(null);
  const [context, setContext] = useState<BookingContext | null>(null);
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayDateString());
  const [dateText, setDateText] = useState(formatDateDisplay(todayDateString()));
  const [draft, setDraft] = useState<Draft | null>(null);
  const [phoneSuggestion, setPhoneSuggestion] = useState<string | null>(null);
  const [connectPrompt, setConnectPrompt] = useState<ConnectPrompt | null>(null);
  const [preparePopup, setPreparePopup] = useState<PreparedPopup | null>(null);
  const [auditByReservation, setAuditByReservation] = useState<Record<string, ReservationAdminAudit | null>>({});
  const [auditLoadingReservationId, setAuditLoadingReservationId] = useState<string | null>(null);
  const [hiddenRows, setHiddenRows] = useState<RowHiddenCount[]>([]);
  const [hiddenVertical, setHiddenVertical] = useState<VerticalHiddenCounts>({ above: 0, below: 0 });
  const [isOnline, setIsOnline] = useState(true);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [currentMinute, setCurrentMinute] = useState(currentLocalMinute);
  const [pendingCount, setPendingCount] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const resolvedSettings = useMemo(
    () => settingsForRestaurant(settings, context?.restaurant.id ?? DEFAULT_BOOKING_SETTINGS.restaurant_id),
    [context?.restaurant.id, settings]
  );
  const tableColumnWidth = isMobileViewport ? MOBILE_TABLE_COLUMN_WIDTH : TABLE_COLUMN_WIDTH;
  const timelineBookableWidth = timeRangeMinutes(resolvedSettings) * MINUTE_WIDTH;
  const timelineWidth = timelineBookableWidth + TIMELINE_GUTTER_WIDTH;
  const timeLabels = buildTimeLabels(resolvedSettings);
  const { tables: visualTables, groupedIds } = useMemo(
    () => groupedTableOrder(tables.filter((table) => table.is_active), reservations, resolvedSettings),
    [tables, reservations, resolvedSettings]
  );
  const tableIndexById = useMemo(() => new Map(visualTables.map((table, index) => [table.id, index])), [visualTables]);
  const activeDayReservations = activeReservations(reservations);
  const dailySummary = useMemo(
    () => ({
      reservations: activeDayReservations.length,
      people: activeDayReservations.reduce((total, reservation) => total + reservation.party_size, 0)
    }),
    [activeDayReservations]
  );
  const isTodaySelected = selectedDate === todayDateString();
  const currentTimeX =
    isTodaySelected &&
    currentMinute >= toMinutes(resolvedSettings.opening_start_time) &&
    currentMinute <= Math.min(1439, visibleEndMinute(resolvedSettings))
      ? bookingMinuteToX(currentMinute, resolvedSettings)
      : null;
  const overlapLayoutByTable = useMemo(() => {
    const layouts = new Map<string, Map<string, OverlapLayout>>();

    for (const table of visualTables) {
      const tableReservations = activeDayReservations.filter(
        (reservation) => reservation.tableIds[0] === table.id || (reservation.tableIds.includes(table.id) && reservation.tableIds.length === 1)
      );
      layouts.set(table.id, assignOverlapLayout(tableReservations));
    }

    return layouts;
  }, [activeDayReservations, visualTables]);

  const refreshPendingCount = useCallback(async () => {
    setPendingCount(await countUnresolvedLocalMutations());
  }, []);

  const loadDayReservations = useCallback(
    async (activeSession: BookingSession, restaurantId: string, dateValue: string) => {
      let nextReservations = await loadReservationsForDate(restaurantId, dateValue);

      if (isSupabaseConfigured() && !isDemoSession(activeSession) && navigator.onLine) {
        try {
          nextReservations = await fetchReservations(activeSession, restaurantId, dateValue);
          await saveReservations(nextReservations);
          setMessage(null);
        } catch {
          setMessage("Server unavailable. Changes are saved on this device and will sync later.");
        }
      }

      setReservations(nextReservations);
    },
    []
  );

  const bootstrap = useCallback(async () => {
    setIsLoading(true);

    try {
      const activeSession = await getActiveSession();

      if (!activeSession) {
        router.replace("/admin/bookings/login");
        return;
      }

      setSession(activeSession);
      const localDate = getInitialSelectedDate();
      setSelectedDate(localDate);
      let bookingContext = fallbackContext();

      if (isSupabaseConfigured() && !isDemoSession(activeSession) && navigator.onLine) {
        try {
          const remoteContext = await fetchBookingContext(activeSession);

          if (remoteContext) {
            bookingContext = remoteContext;
          }
        } catch {
          setMessage("Server unavailable. Changes are saved on this device and will sync later.");
        }
      }

      setContext(bookingContext);
      await saveRestaurant(bookingContext.restaurant);
      await saveStaffProfile(bookingContext.staffProfile);

      const restaurantId = bookingContext.restaurant.id;
      let nextTables = await loadTables(restaurantId);
      let nextSettings = await loadSettings(restaurantId);

      if (isSupabaseConfigured() && !isDemoSession(activeSession) && navigator.onLine) {
        try {
          nextTables = await fetchTables(activeSession, restaurantId);
          nextSettings = await fetchBookingSettings(activeSession, restaurantId);
          await saveTables(nextTables);

          if (nextSettings) {
            await saveSettings(nextSettings);
          }
        } catch {
          setMessage("Server unavailable. Changes are saved on this device and will sync later.");
        }
      }

      if (!nextTables.length) {
        const { makeDefaultTables } = await import("@/lib/bookings/defaults");
        nextTables = makeDefaultTables(restaurantId);
        await saveTables(nextTables);
      }

      const resolved = settingsForRestaurant(nextSettings, restaurantId);
      setTables(nextTables);
      setSettings(resolved);
      await saveSettings(resolved);
      await loadDayReservations(activeSession, restaurantId, localDate);

      if (navigator.onLine) {
        const result = await syncPendingMutations(activeSession);

        if (result.synced || result.conflicts || result.failed) {
          setMessage(syncResultMessage(result));
        }

        await refreshPendingCount();
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadDayReservations, refreshPendingCount, router]);

  useEffect(() => {
    setIsOnline(typeof navigator === "undefined" ? true : navigator.onLine);
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    function handleViewportChange() {
      setIsMobileViewport(mediaQuery.matches);
    }

    handleViewportChange();
    mediaQuery.addEventListener("change", handleViewportChange);
    bootstrap();

    function handleOnline() {
      setIsOnline(true);
      getActiveSession().then((activeSession) => {
        if (activeSession) {
          syncPendingMutations(activeSession).then((result) => {
            if (result.synced || result.conflicts || result.failed) {
              setMessage(syncResultMessage(result));
            }

            refreshPendingCount();
          });
        }
      });
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, [bootstrap, refreshPendingCount]);

  useEffect(() => {
    if (!session || !context) {
      return;
    }

    setDateText(formatDateDisplay(selectedDate));
    rememberSelectedDate(selectedDate);
    loadDayReservations(session, context.restaurant.id, selectedDate);
  }, [context, loadDayReservations, selectedDate, session]);

  useEffect(() => {
    if (!session || !context) {
      return;
    }

    return subscribeToBookingChanges(session, context.restaurant.id, () => {
      loadDayReservations(session, context.restaurant.id, selectedDate);
    });
  }, [context, loadDayReservations, selectedDate, session]);

  useEffect(() => {
    if (!session || !context || isDemoSession(session) || !isSupabaseConfigured()) {
      return;
    }

    const activeSession = session;
    const activeContext = context;
    let isRefreshing = false;

    async function refreshSelectedDay() {
      if (!navigator.onLine || document.visibilityState === "hidden" || isRefreshing) {
        return;
      }

      isRefreshing = true;

      try {
        await loadDayReservations(activeSession, activeContext.restaurant.id, selectedDate);
      } finally {
        isRefreshing = false;
      }
    }

    const timer = window.setInterval(refreshSelectedDay, LIVE_REFRESH_INTERVAL_MS);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        refreshSelectedDay();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [context, loadDayReservations, selectedDate, session]);

  useEffect(() => {
    if (!context || !session || isDemoSession(session) || !isSupabaseConfigured() || !navigator.onLine) {
      return;
    }

    fetchPhoneSuggestion(session, context.restaurant.id)
      .then(setPhoneSuggestion)
      .catch(() => setPhoneSuggestion(null));
  }, [context, session]);

  useEffect(() => {
    refreshPendingCount();
  }, [reservations, refreshPendingCount]);

  useEffect(() => {
    if (draft?.mode !== "create") {
      return;
    }

    window.requestAnimationFrame(() => {
      peopleInputRef.current?.select();
    });
  }, [draft?.mode, draft?.tableId, draft?.start_time]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentMinute(currentLocalMinute());
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isTodaySelected) {
      autoScrolledDateRef.current = null;
      return;
    }

    const scrollElement = scrollRef.current;

    if (!scrollElement || currentTimeX === null || !visualTables.length || autoScrolledDateRef.current === selectedDate) {
      return;
    }

    autoScrolledDateRef.current = selectedDate;
    window.requestAnimationFrame(() => {
      const maxLeft = Math.max(0, scrollElement.scrollWidth - scrollElement.clientWidth);
      const targetLeft = clamp(tableColumnWidth + currentTimeX - scrollElement.clientWidth * 0.35, 0, maxLeft);
      scrollElement.scrollTo({ left: targetLeft, behavior: "auto" });
      updateHiddenRows();
    });
  }, [currentTimeX, isTodaySelected, selectedDate, tableColumnWidth, visualTables.length]);

  useEffect(() => {
    const timer = window.setInterval(async () => {
      if (selectedDate !== todayDateString()) {
        return;
      }

      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      const next = activeDayReservations.find((reservation) => {
        const minutesUntil = toMinutes(reservation.start_time) - nowMinutes;
        return minutesUntil >= 0 && minutesUntil <= resolvedSettings.prepare_popup_minutes_before;
      });

      if (!next) {
        return;
      }

      const popupId = `${next.id}-${selectedDate}`;

      if (!(await isPopupDismissed(popupId))) {
        setPreparePopup({ id: popupId, reservation: next });
      }
    }, 30000);

    return () => window.clearInterval(timer);
  }, [activeDayReservations, resolvedSettings.prepare_popup_minutes_before, selectedDate]);

  function updateHiddenRows() {
    const scrollElement = scrollRef.current;

    if (!scrollElement) {
      return;
    }

    const visibleStart = Math.max(0, scrollElement.scrollLeft - tableColumnWidth);
    const visibleEnd = Math.max(visibleStart, scrollElement.scrollLeft + scrollElement.clientWidth - tableColumnWidth);
    const visibleRowTop = Math.max(0, scrollElement.scrollTop);
    const visibleRowBottom = Math.max(visibleRowTop, scrollElement.scrollTop + scrollElement.clientHeight - HEADER_HEIGHT);
    const nextRows = visualTables.map((table, rowIndex) => {
      let left = 0;
      let right = 0;

      for (const reservation of activeDayReservations) {
        if (!reservation.tableIds.includes(table.id)) {
          continue;
        }

        const x = reservationX(reservation, resolvedSettings);
        const end = x + reservationWidth(reservation);

        if (end < visibleStart) {
          left += 1;
        } else if (x > visibleEnd) {
          right += 1;
        }
      }

      return {
        tableId: table.id,
        rowIndex,
        left,
        right,
        visibleStart,
        visibleEnd
      };
    });

    setHiddenRows(nextRows.filter((row) => row.left || row.right));

    let above = 0;
    let below = 0;

    for (const reservation of activeDayReservations) {
      const positions = reservation.tableIds
        .map((id) => tableIndexById.get(id))
        .filter((index): index is number => typeof index === "number");

      if (!positions.length) {
        continue;
      }

      const reservationTop = Math.min(...positions) * ROW_HEIGHT;
      const reservationBottom = (Math.max(...positions) + 1) * ROW_HEIGHT;

      if (reservationBottom <= visibleRowTop) {
        above += 1;
      } else if (reservationTop >= visibleRowBottom) {
        below += 1;
      }
    }

    setHiddenVertical({ above, below });
  }

  useEffect(() => {
    updateHiddenRows();
  }, [reservations, resolvedSettings, tableColumnWidth, tableIndexById, visualTables]);

  function timeFromClick(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const rawX = clamp(event.clientX - rect.left - TIMELINE_GUTTER_WIDTH, 0, timelineBookableWidth);
    const minutesFromStart = roundMinutesToStep(rawX / MINUTE_WIDTH, resolvedSettings.slot_step_minutes);
    const startMinutes = toMinutes(resolvedSettings.opening_start_time) + minutesFromStart;
    return normalizeDraftTime(minutesToTime(startMinutes), resolvedSettings);
  }

  function openCreateDraftAtTime(tableId: string, startTime: string) {
    setDraft({
      mode: "create",
      tableId,
      tableIds: [tableId],
      start_time: startTime,
      party_size: "4",
      customer_name: "",
      customer_phone: phoneSuggestion ?? "",
      note: ""
    });
  }

  function openCreateDraft(tableId: string, event: MouseEvent<HTMLDivElement>) {
    openCreateDraftAtTime(tableId, timeFromClick(event));
  }

  function openCreateDraftFromTableLabel(tableId: string) {
    const scrollElement = scrollRef.current;
    const visibleStart = scrollElement ? Math.max(0, scrollElement.scrollLeft - tableColumnWidth) : 0;
    const minutesFromStart = roundMinutesToStep(Math.max(0, visibleStart - TIMELINE_GUTTER_WIDTH) / MINUTE_WIDTH, resolvedSettings.slot_step_minutes);
    const startTime = minutesToTime(toMinutes(resolvedSettings.opening_start_time) + minutesFromStart);
    openCreateDraftAtTime(tableId, normalizeDraftTime(startTime, resolvedSettings));
  }

  async function loadReservationAudit(reservation: Reservation) {
    if (
      !session ||
      !context ||
      !canReadReservationAudit(context) ||
      auditByReservation[reservation.id] !== undefined ||
      !isSupabaseConfigured() ||
      isDemoSession(session) ||
      !navigator.onLine
    ) {
      return;
    }

    setAuditLoadingReservationId(reservation.id);

    try {
      const rows = await fetchReservationAdminAudit(session, context.restaurant.id, reservation.reservation_date);

      setAuditByReservation((current) => {
        const next = { ...current };

        for (const row of rows) {
          next[row.reservation_id] = row;
        }

        if (next[reservation.id] === undefined) {
          next[reservation.id] = null;
        }

        return next;
      });
    } catch {
      setAuditByReservation((current) => ({ ...current, [reservation.id]: null }));
    } finally {
      setAuditLoadingReservationId((current) => (current === reservation.id ? null : current));
    }
  }

  function openEditDraft(reservation: Reservation) {
    setDraft({
      mode: "edit",
      reservationId: reservation.id,
      tableId: reservation.tableIds[0],
      tableIds: reservation.tableIds,
      start_time: reservation.start_time.slice(0, 5),
      party_size: String(reservation.party_size),
      customer_name: reservation.customer_name,
      customer_phone: reservation.customer_phone,
      note: reservation.note ?? ""
    });
    void loadReservationAudit(reservation);
  }

  function updateDraft(patch: Partial<Draft>) {
    setDraft((current) => (current ? { ...current, ...patch } : current));
  }

  async function saveDraft() {
    if (!draft || !context) {
      return;
    }

    const partySize = Number(normalizePeople(draft.party_size));
    const rawStartTime = draft.start_time.trim();
    const startTime = isValidTime(rawStartTime) ? normalizeDraftTime(rawStartTime, resolvedSettings) : rawStartTime;

    if (draft.mode === "create" && isValidTime(rawStartTime) && isBlankMergeDraft(draft)) {
      const mergeCandidate = findReservationToConnectAtTime(draft.tableId, startTime, reservations);

      if (mergeCandidate) {
        setConnectPrompt({ keep: mergeCandidate, tableId: draft.tableId });
        setDraft(null);
        setMessage(null);
        return;
      }
    }

    if (!isValidTime(rawStartTime) || !partySize || !draft.customer_name.trim() || !isValidPhone(draft.customer_phone)) {
      setMessage(`Use format: 17:30 4 name ${PHONE_PLACEHOLDER} ${COMMENT_PLACEHOLDER}`);
      return;
    }

    if (isOutsideBookableWindow(rawStartTime, resolvedSettings)) {
      setMessage(`Bookable starts are ${resolvedSettings.opening_start_time} to ${resolvedSettings.last_bookable_start_time}.`);
      return;
    }

    const endTime = addMinutes(startTime, resolvedSettings.default_duration_minutes);

    if (draft.mode === "create") {
      const now = new Date().toISOString();
      const reservation: Reservation = {
        id: createId("reservation"),
        restaurant_id: context.restaurant.id,
        reservation_date: selectedDate,
        start_time: startTime,
        end_time: endTime,
        duration_minutes: resolvedSettings.default_duration_minutes,
        party_size: partySize,
        customer_name: draft.customer_name.trim(),
        customer_phone: draft.customer_phone.trim(),
        note: draft.note.trim() || null,
        source: "manual",
        created_by: context.staffProfile.id,
        updated_by: context.staffProfile.id,
        version: 1,
        created_at: now,
        updated_at: now,
        tableIds: draft.tableIds,
        sync_state: "pending_create"
      };
      const mutation = makeReservationMutation("create", reservation, context.staffProfile, reservationPayload(reservation), null);
      const nextReservations = [...reservations, reservation];
      setReservations(nextReservations);
      await saveReservation(reservation);
      await queueReservationMutation(mutation);
      maybePromptConnectedReservation(reservation, nextReservations);
    } else {
      const existing = reservations.find((reservation) => reservation.id === draft.reservationId);

      if (!existing) {
        return;
      }

      const updated: Reservation = {
        ...existing,
        start_time: startTime,
        end_time: addMinutes(startTime, existing.duration_minutes),
        party_size: partySize,
        customer_name: draft.customer_name.trim(),
        customer_phone: draft.customer_phone.trim(),
        note: draft.note.trim() || null,
        updated_by: context.staffProfile.id,
        updated_at: new Date().toISOString(),
        sync_state: "pending_update"
      };
      const payload = {
        reservation_date: updated.reservation_date,
        start_time: updated.start_time,
        duration_minutes: updated.duration_minutes,
        party_size: updated.party_size,
        customer_name: updated.customer_name,
        customer_phone: updated.customer_phone,
        note: updated.note,
        table_ids: updated.tableIds
      };
      const mutation = makeReservationMutation("update", updated, context.staffProfile, payload, existing.version);
      setReservations((current) => current.map((reservation) => (reservation.id === updated.id ? updated : reservation)));
      await saveReservation(updated);
      await queueReservationMutation(mutation);
    }

    setDraft(null);
    setMessage(null);

    if (session && navigator.onLine) {
      await syncPendingMutations(session);
      await loadDayReservations(session, context.restaurant.id, selectedDate);
    }

    await refreshPendingCount();
  }

  async function deleteReservation(reservation: Reservation) {
    if (!context || !window.confirm("Delete this reservation?")) {
      return;
    }

    const deleted: Reservation = {
      ...reservation,
      deleted_at: new Date().toISOString(),
      deleted_by: context.staffProfile.id,
      updated_by: context.staffProfile.id,
      sync_state: "pending_delete"
    };
    const mutation = makeReservationMutation("delete", reservation, context.staffProfile, { operation: "delete" }, reservation.version);
    setReservations((current) => current.map((item) => (item.id === reservation.id ? deleted : item)));
    await saveReservation(deleted);
    await queueReservationMutation(mutation);
    setDraft(null);

    if (session && navigator.onLine) {
      await syncPendingMutations(session);
      await loadDayReservations(session, context.restaurant.id, selectedDate);
    }

    await refreshPendingCount();
  }

  function findReservationToConnectAtTime(tableId: string, startTime: string, allReservations: Reservation[]) {
    return activeReservations(allReservations).find(
      (reservation) =>
        reservation.reservation_date === selectedDate &&
        reservation.start_time === startTime &&
        !reservation.tableIds.includes(tableId)
    );
  }

  function maybePromptConnectedReservation(newReservation: Reservation, allReservations: Reservation[]) {
    const newPhone = normalizedPhone(newReservation.customer_phone);
    const duplicate = activeReservations(allReservations).find((reservation) => {
      if (
        reservation.id === newReservation.id ||
        reservation.reservation_date !== newReservation.reservation_date ||
        reservation.start_time !== newReservation.start_time
      ) {
        return false;
      }

      const samePhone = Boolean(newPhone) && normalizedPhone(reservation.customer_phone) === newPhone;
      const sameReservation =
        reservation.party_size === newReservation.party_size &&
        reservation.customer_name.trim().toLowerCase() === newReservation.customer_name.trim().toLowerCase() &&
        samePhone &&
        (reservation.note ?? "") === (newReservation.note ?? "");

      return sameReservation || samePhone;
    });

    if (duplicate) {
      setConnectPrompt({ keep: duplicate, merge: newReservation });
    }
  }

  async function connectPromptReservations() {
    if (!connectPrompt || !context) {
      return;
    }

    const tableIdsToAdd = connectPrompt.merge?.tableIds ?? (connectPrompt.tableId ? [connectPrompt.tableId] : []);
    const tableIds = Array.from(new Set([...connectPrompt.keep.tableIds, ...tableIdsToAdd]));

    if (tableIds.length === connectPrompt.keep.tableIds.length) {
      setConnectPrompt(null);
      return;
    }

    const merged: Reservation = {
      ...connectPrompt.keep,
      tableIds,
      updated_at: new Date().toISOString(),
      updated_by: context.staffProfile.id,
      sync_state: "pending_update"
    };
    const removed: Reservation | null = connectPrompt.merge
      ? {
          ...connectPrompt.merge,
          deleted_at: new Date().toISOString(),
          deleted_by: context.staffProfile.id,
          updated_by: context.staffProfile.id,
          sync_state: "pending_delete"
        }
      : null;
    const updateMutation = makeReservationMutation(
      "connect_tables",
      merged,
      context.staffProfile,
      { table_ids: tableIds },
      connectPrompt.keep.version
    );
    const deleteMutation = removed
      ? makeReservationMutation("delete", connectPrompt.merge!, context.staffProfile, { operation: "delete" }, connectPrompt.merge!.version)
      : null;

    setReservations((current) =>
      current.map((reservation) => {
        if (reservation.id === merged.id) {
          return merged;
        }

        if (removed && reservation.id === removed.id) {
          return removed;
        }

        return reservation;
      })
    );
    await saveReservation(merged);
    if (removed) {
      await saveReservation(removed);
    }
    await queueReservationMutation(updateMutation);
    if (deleteMutation) {
      await queueReservationMutation(deleteMutation);
    }
    setConnectPrompt(null);

    if (session && navigator.onLine) {
      await syncPendingMutations(session);
      await loadDayReservations(session, context.restaurant.id, selectedDate);
    }

    await refreshPendingCount();
  }

  async function retryPendingSync() {
    if (!session || !context) {
      setMessage("Sign in again to sync local changes.");
      return;
    }

    if (!navigator.onLine) {
      setMessage("Offline. Changes are saved on this device and will sync when internet returns.");
      return;
    }

    const result = await syncPendingMutations(session);
    setMessage(syncResultMessage(result));
    await loadDayReservations(session, context.restaurant.id, selectedDate);
    await refreshPendingCount();
  }

  function signOut() {
    clearStoredSession();
    router.replace("/admin/bookings/login");
  }

  function scrollToward(direction: "left" | "right") {
    const scrollElement = scrollRef.current;

    if (!scrollElement) {
      return;
    }

    const amount = direction === "left" ? -HOUR_WIDTH * 2 : HOUR_WIDTH * 2;
    scrollElement.scrollBy({ left: amount, behavior: "smooth" });
  }

  function scrollVerticallyToward(direction: "up" | "down") {
    const scrollElement = scrollRef.current;

    if (!scrollElement) {
      return;
    }

    const amount = direction === "up" ? -ROW_HEIGHT * 4 : ROW_HEIGHT * 4;
    scrollElement.scrollBy({ top: amount, behavior: "smooth" });
  }

  function openCalendarPicker() {
    const picker = calendarRef.current;

    if (!picker) {
      return;
    }

    picker.showPicker?.();
    picker.focus();
  }

  function applyDateText() {
    const parsedDate = parseDateDisplay(dateText);

    if (parsedDate) {
      setSelectedDate(parsedDate);
      setMessage(null);
    } else {
      setDateText(formatDateDisplay(selectedDate));
      setMessage("Use date format DD/MM/YYYY.");
    }
  }

  function handleDateTextKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.currentTarget.blur();
      applyDateText();
    }
  }

  function handleDraftKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveDraft();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setDraft(null);
    }
  }

  function getInlineFormMetrics(currentDraft: Draft) {
    const rawLeft = bookingMinuteToX(timelineMinuteForTime(currentDraft.start_time, resolvedSettings), resolvedSettings);
    const desiredWidth = Math.max(420, resolvedSettings.default_duration_minutes * MINUTE_WIDTH);
    const scrollElement = scrollRef.current;

    if (!scrollElement) {
      return {
        left: rawLeft,
        width: desiredWidth
      };
    }

    const visibleStart = Math.max(0, scrollElement.scrollLeft - tableColumnWidth);
    const visibleEnd = Math.max(visibleStart + 280, scrollElement.scrollLeft + scrollElement.clientWidth - tableColumnWidth);
    const availableWidth = Math.max(280, visibleEnd - visibleStart - 16);
    const width = Math.min(desiredWidth, availableWidth);
    const left = clamp(rawLeft, visibleStart + 8, Math.max(visibleStart + 8, visibleEnd - width - 8));

    return {
      left,
      width
    };
  }

  if (isLoading || !context) {
    return (
      <main className="booking-shell booking-safe-screen">
        <section className="booking-safe-panel">
          <h1>Loading booking book...</h1>
          <p>Local data will be used if the server is unavailable.</p>
        </section>
      </main>
    );
  }

  const draftWarning = draft
    ? nextReservationWarning(
        reservations,
        {
          id: draft.reservationId,
          tableIds: draft.tableIds,
          start_time: draft.start_time,
          end_time: addMinutes(draft.start_time, resolvedSettings.default_duration_minutes)
        },
        resolvedSettings
      )
    : null;
  const inlineFormMetrics = draft ? getInlineFormMetrics(draft) : null;
  const draftReservationId = draft?.mode === "edit" ? draft.reservationId : undefined;
  const draftAudit = draftReservationId ? auditByReservation[draftReservationId] : undefined;
  const shouldShowDraftAudit = Boolean(draftReservationId && canReadReservationAudit(context));

  return (
    <main className="booking-shell booking-book-shell">
      <header className="booking-topbar">
        <div className="booking-title-group">
          <img className="booking-logo" src="/icons/friendly_bear_logo.jpg" alt="" aria-hidden="true" />
          <div className="booking-title-copy">
            <p className="booking-kicker">{context.restaurant.name}</p>
            <h1>Reservation book</h1>
          </div>
          <div className="booking-day-summary" aria-label="Selected day summary">
            <span>{dailySummary.reservations} reservations</span>
            <span>{dailySummary.people} people</span>
          </div>
        </div>
        <div className="booking-datebar" aria-label="Date navigation">
          <button type="button" data-symbol="<" onClick={() => setSelectedDate(addDays(selectedDate, -1))} aria-label="Previous day">
            ‹
          </button>
          <div className="booking-date-picker">
            <input
              className="booking-date-text"
              aria-label="Booking date"
              value={dateText}
              inputMode="numeric"
              onChange={(event) => setDateText(event.target.value)}
              onClick={openCalendarPicker}
              onBlur={applyDateText}
              onKeyDown={handleDateTextKeyDown}
            />
            <input
              ref={calendarRef}
              className="booking-date-calendar"
              type="date"
              value={selectedDate}
              aria-label="Choose booking date"
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </div>
          <button type="button" data-symbol=">" onClick={() => setSelectedDate(addDays(selectedDate, 1))} aria-label="Next day">
            ›
          </button>
        </div>
        <div className="booking-menu">
          <button
            type="button"
            className="booking-menu-trigger"
            aria-label="Booking menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            ...
          </button>
          {isMenuOpen ? (
            <div className="booking-menu-panel" role="menu">
              <Link href="/admin/bookings/settings" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                Settings
              </Link>
              <Link href="/admin/bookings/conflicts" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                Conflicts
              </Link>
              <Link href="/admin/bookings/integrations" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                Integrations
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut();
                }}
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {!isOnline ? (
        <p className="booking-status booking-status-offline">
          Offline. Changes are saved on this device and will sync when internet returns.
        </p>
      ) : message ? (
        <p className="booking-status booking-status-warning">{message}</p>
      ) : pendingCount ? (
        <p className="booking-status booking-status-sync">
          <span>{pendingCount} local change(s) waiting to sync.</span>
          <button type="button" onClick={retryPendingSync}>
            Sync now
          </button>
        </p>
      ) : null}

      {groupedIds.size ? <p className="booking-group-message">Rows visually grouped for connected reservation</p> : null}

      <section className="booking-grid-frame" aria-label="Reservation grid">
        <div className="booking-scroll" ref={scrollRef} onScroll={updateHiddenRows}>
          <div
            className="booking-grid-surface"
            style={
              {
                "--timeline-width": `${timelineWidth}px`,
                "--table-column-width": `${tableColumnWidth}px`,
                "--booking-row-height": `${ROW_HEIGHT}px`,
                "--booking-header-height": `${HEADER_HEIGHT}px`,
                gridTemplateColumns: `${tableColumnWidth}px ${timelineWidth}px`,
                gridTemplateRows: `${HEADER_HEIGHT}px repeat(${visualTables.length}, ${ROW_HEIGHT}px)`
              } as CSSProperties
            }
          >
            <div className="booking-grid-corner">Table</div>
            <div className="booking-time-row">
              {timeLabels.map((label) => (
                <span key={label} style={{ left: `${bookingMinuteToX(timelineMinuteForTime(label, resolvedSettings), resolvedSettings)}px` }}>
                  {label}
                </span>
              ))}
            </div>

            {visualTables.map((table, index) => (
              <div
                key={table.id}
                className={`booking-table-cell ${groupedIds.has(table.id) ? "booking-table-cell-grouped" : ""}`}
                style={{ gridColumn: 1, gridRow: index + 2 }}
                onClick={() => openCreateDraftFromTableLabel(table.id)}
              >
                {tableLabel(table)}
              </div>
            ))}

            {visualTables.map((table, index) => (
              <div
                key={`${table.id}-row`}
                className="booking-row-cell"
                style={{ gridColumn: 2, gridRow: index + 2 }}
                onClick={(event) => openCreateDraft(table.id, event)}
              >
                <div className="booking-row-lines" />
              </div>
            ))}

            {currentTimeX !== null && visualTables.length ? (
              <div
                className="booking-current-time-line"
                style={
                  {
                    gridColumn: 2,
                    gridRow: `2 / span ${visualTables.length}`,
                    left: `${currentTimeX}px`
                  } as CSSProperties
                }
                aria-hidden="true"
              />
            ) : null}

            {activeDayReservations.map((reservation) => {
              const positions = reservation.tableIds
                .map((id) => tableIndexById.get(id))
                .filter((index): index is number => typeof index === "number");

              if (!positions.length) {
                return null;
              }

              const rowIndex = Math.min(...positions);
              const span = Math.max(1, Math.max(...positions) - rowIndex + 1);
              const primaryTableId = visualTables[rowIndex]?.id ?? reservation.tableIds[0];
              const overlap = overlapLayoutByTable.get(primaryTableId)?.get(reservation.id) ?? { count: 1, slot: 0 };
              const overlapInset = reservation.tableIds.length > 1 || overlap.count < 2 ? 0 : overlap.slot * OVERLAP_X_OFFSET;
              const baseWidth = reservationWidth(reservation);
              const blockStyle = {
                gridColumn: 2,
                gridRow: `${rowIndex + 2} / span ${span}`,
                left: `${reservationX(reservation, resolvedSettings) + overlapInset}px`,
                width: `${Math.max(44, baseWidth - overlapInset)}px`,
                top: "9px",
                zIndex: 9 + overlap.slot
              } as CSSProperties;
              const display = reservationDisplayParts(reservation);

              return (
                <button
                  key={reservation.id}
                  type="button"
                  className={`booking-reservation ${reservation.tableIds.length > 1 ? "booking-reservation-connected" : ""} ${
                    reservation.sync_state?.includes("pending") ? "booking-reservation-pending" : ""
                  } ${reservation.sync_state === "sync_conflict" ? "booking-reservation-conflict" : ""}`}
                  title={formatReservationText(reservation)}
                  style={blockStyle}
                  onClick={(event) => {
                    event.stopPropagation();
                    openEditDraft(reservation);
                  }}
                >
                  <span className="booking-reservation-text">
                    <span>{display.time}</span>
                    <span className="booking-reservation-divider">|</span>
                    <span className="booking-party-size">
                      <span className="booking-person-icon" aria-label="People" role="img" />
                      {display.partySize} {PEOPLE_WORD}
                    </span>
                    <span className="booking-reservation-divider">|</span>
                    <span>{display.name}</span>
                    <span className="booking-reservation-divider">|</span>
                    <span>{display.phone}</span>
                    {display.note ? (
                      <>
                        <span className="booking-reservation-divider">|</span>
                        <span>{display.note}</span>
                      </>
                    ) : null}
                  </span>
                </button>
              );
            })}

            {draft ? (
              <form
                className="booking-inline-form"
                style={
                  {
                    gridColumn: 2,
                    gridRow: (tableIndexById.get(draft.tableId) ?? 0) + 2,
                    left: `${inlineFormMetrics?.left ?? 0}px`,
                    width: `${inlineFormMetrics?.width ?? 420}px`
                  } as CSSProperties
                }
                onSubmit={(event) => {
                  event.preventDefault();
                  saveDraft();
                }}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={handleDraftKeyDown}
              >
                <button type="button" className="booking-inline-close" aria-label="Close reservation editor" onClick={() => setDraft(null)}>
                  x
                </button>
                <input
                  className="booking-inline-time"
                  aria-label="Time"
                  type="text"
                  value={draft.start_time}
                  onChange={(event) => updateDraft({ start_time: event.target.value })}
                  onBlur={() => {
                    if (isValidTime(draft.start_time)) {
                      updateDraft({ start_time: normalizeDraftTime(draft.start_time, resolvedSettings) });
                    }
                  }}
                  inputMode="numeric"
                  placeholder="17:30"
                  required
                />
                <span className="booking-inline-people-wrap">
                  <span className="booking-person-icon booking-person-icon-dark" aria-label="People" role="img" />
                  <input
                    ref={peopleInputRef}
                    className="booking-inline-people"
                    aria-label="People"
                    type="text"
                    value={draft.party_size}
                    onChange={(event) => updateDraft({ party_size: normalizePeople(event.target.value) })}
                    onFocus={(event) => event.currentTarget.select()}
                    onPointerUp={(event) => {
                      event.preventDefault();
                      event.currentTarget.select();
                    }}
                    inputMode="numeric"
                    placeholder="4"
                    required
                  />
                </span>
                <input
                  className="booking-inline-name"
                  aria-label="Name"
                  value={draft.customer_name}
                  onChange={(event) => updateDraft({ customer_name: event.target.value })}
                  placeholder="name"
                  required
                />
                <input
                  className="booking-inline-phone"
                  aria-label="Phone"
                  value={draft.customer_phone}
                  onChange={(event) => updateDraft({ customer_phone: event.target.value })}
                  placeholder={PHONE_PLACEHOLDER}
                  required
                />
                <input
                  className="booking-inline-note"
                  aria-label="Note"
                  value={draft.note}
                  onChange={(event) => updateDraft({ note: event.target.value })}
                  placeholder={COMMENT_PLACEHOLDER}
                />
                {draft.mode === "edit" ? (
                  <button
                    type="button"
                    className="booking-danger-button"
                    onClick={() => {
                      const reservation = reservations.find((item) => item.id === draft.reservationId);

                      if (reservation) {
                        deleteReservation(reservation);
                      }
                    }}
                  >
                    Delete
                  </button>
                ) : null}
                {phoneSuggestion && !draft.customer_phone ? (
                  <button type="button" className="booking-suggestion" onClick={() => updateDraft({ customer_phone: phoneSuggestion })}>
                    Use current caller: {phoneSuggestion}
                  </button>
                ) : null}
                {draftWarning ? <p className="booking-inline-warning">{draftWarning}</p> : null}
                {shouldShowDraftAudit ? (
                  <div className="booking-inline-audit">
                    {auditLoadingReservationId === draftReservationId ? (
                      <span>Loading account details...</span>
                    ) : draftAudit ? (
                      <>
                        <span>
                          Created by{" "}
                          {formatAuditActor(draftAudit.created_by_display_name)}
                          {formatAuditTime(draftAudit.created_at) ? `, ${formatAuditTime(draftAudit.created_at)}` : ""}
                        </span>
                        {shouldShowEditedAudit(draftAudit) ? (
                          <span>
                            Edited by {formatAuditActor(draftAudit.updated_by_display_name)}
                            {formatAuditTime(draftAudit.updated_at) ? `, ${formatAuditTime(draftAudit.updated_at)}` : ""}
                          </span>
                        ) : null}
                      </>
                    ) : (
                      <span>Account details available after server sync.</span>
                    )}
                  </div>
                ) : null}
              </form>
            ) : null}

            {hiddenRows.map((row) => (
              <div
                key={row.tableId}
                className="booking-row-hidden-layer"
                style={{ gridColumn: 2, gridRow: row.rowIndex + 2 } as CSSProperties}
              >
                {row.left ? (
                  <button
                    type="button"
                    className="booking-hidden-bubble booking-hidden-left"
                    style={{ left: `${row.visibleStart + 8}px` }}
                    onClick={() => scrollToward("left")}
                  >
                    &lt; {row.left}
                  </button>
                ) : null}
                {row.right ? (
                  <button
                    type="button"
                    className="booking-hidden-bubble booking-hidden-right"
                    style={{ left: `${Math.max(row.visibleStart + 8, row.visibleEnd - 52)}px` }}
                    onClick={() => scrollToward("right")}
                  >
                    &gt; {row.right}
                  </button>
                ) : null}
              </div>
            ))}

          </div>
        </div>
        {hiddenVertical.above ? (
          <button type="button" className="booking-hidden-vertical booking-hidden-up" onClick={() => scrollVerticallyToward("up")}>
            &uarr; {hiddenVertical.above}
          </button>
        ) : null}
        {hiddenVertical.below ? (
          <button type="button" className="booking-hidden-vertical booking-hidden-down" onClick={() => scrollVerticallyToward("down")}>
            &darr; {hiddenVertical.below}
          </button>
        ) : null}
      </section>

      {connectPrompt ? (
        <div className="booking-toast">
          <p>Connect these tables into one reservation?</p>
          <button type="button" onClick={connectPromptReservations}>
            Connect
          </button>
          <button type="button" onClick={() => setConnectPrompt(null)}>
            Keep separate
          </button>
        </div>
      ) : null}

      {preparePopup ? (
        <div className="booking-prepare-popup" role="dialog" aria-modal="false">
          <p className="booking-kicker">{preparePopup.reservation.start_time} reminder</p>
          <h2>{formatReservationText(preparePopup.reservation)}</h2>
          <p>
            Prepare {preparePopup.reservation.tableIds.length > 1 ? "tables" : "table"}{" "}
            {preparePopup.reservation.tableIds
              .map((id) => tableLabel(tables.find((table) => table.id === id) ?? ({ table_number: id, display_label: id } as RestaurantTable)))
              .join(", ")}{" "}
            for {preparePopup.reservation.party_size} people.
          </p>
          <button
            type="button"
            onClick={async () => {
              await rememberDismissedPopup(preparePopup.id);
              setPreparePopup(null);
            }}
          >
            Dismiss
          </button>
        </div>
      ) : null}
    </main>
  );
}
