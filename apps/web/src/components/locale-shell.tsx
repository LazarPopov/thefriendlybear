import Link from "next/link";
import type { SiteLocale } from "@/lib/site";
import { BrandShowcasePanel } from "@/components/brand-showcase-panel";

type ActionLink = {
  href: string;
  label: string;
};

type LocaleShellProps = {
  locale: SiteLocale;
  eyebrow: string;
  title: string;
  description: string;
  links?: ActionLink[];
  showcase?: boolean;
};

const localeLabel = {
  bg: "🇧🇬 Bulgarian",
  en: "🇬🇧 English"
} as const;

export function LocaleShell({
  locale,
  eyebrow,
  title,
  description,
  links = [],
  showcase = false
}: LocaleShellProps) {
  return (
    <main className="shell">
      <div className="card">
        {showcase ? <BrandShowcasePanel locale={locale} /> : null}
        <p className="eyebrow">
          {localeLabel[locale]} • {eyebrow}
        </p>
        <h1>{title}</h1>
        <p>{description}</p>
        {links.length > 0 ? (
          <div className="actions">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
