"use client";

import { useEffect } from "react";

export function BookingsPwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.register("/bookings-service-worker.js", {
      scope: "/admin/bookings"
    });
  }, []);

  return null;
}
