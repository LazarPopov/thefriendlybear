import Link from "next/link";

export default function BookingOfflinePage() {
  return (
    <main className="booking-shell booking-safe-screen">
      <section className="booking-safe-panel">
        <h1>Bookings are offline.</h1>
        <p>The app shell is available. Reopen the book to use cached days and local changes.</p>
        <Link href="/admin/bookings">Open booking book</Link>
      </section>
    </main>
  );
}
