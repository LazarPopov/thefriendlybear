import Link from "next/link";
import { NotFoundTracker } from "@/components/not-found-tracker";

export default function NotFound() {
  return (
    <main className="page-shell">
      <NotFoundTracker />
      <section className="page-hero" data-track-section="not_found" data-track-section-label="404">
        <p className="eyebrow">404</p>
        <h1>This page could not be found.</h1>
        <p className="page-lead">
          The address may have changed. The quickest path back is the home page or the menu.
        </p>
        <div className="actions">
          <Link href="/bg">Home</Link>
          <Link href="/bg/menu">Menu</Link>
        </div>
      </section>
    </main>
  );
}
