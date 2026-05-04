import type { Metadata } from "next";
import { BookingErrorBoundary } from "@/components/bookings/booking-error-boundary";
import { BookingsPwaRegister } from "@/components/bookings/bookings-pwa-register";

export const metadata: Metadata = {
  title: "The Friendly Bear Bookings",
  description: "Private staff reservation book for The Friendly Bear Sofia.",
  manifest: "/manifest.webmanifest",
  robots: {
    index: false,
    follow: false
  },
  icons: {
    icon: [{ url: "/icons/bookings-192.png", type: "image/png" }],
    apple: [{ url: "/icons/bookings-192.png", type: "image/png" }]
  }
};

export default function AdminBookingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookingErrorBoundary>
      <BookingsPwaRegister />
      {children}
    </BookingErrorBoundary>
  );
}
