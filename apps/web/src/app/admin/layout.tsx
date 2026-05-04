import type { Metadata } from "next";
import { AdminBugCapture } from "@/components/admin/admin-bug-capture";
import "./bookings/bookings.css";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AdminBugCapture />
    </>
  );
}
