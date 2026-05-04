import { Suspense } from "react";
import { BookingLoginClient } from "@/components/bookings/booking-login-client";

export default function BookingLoginPage() {
  return (
    <Suspense fallback={null}>
      <BookingLoginClient />
    </Suspense>
  );
}
