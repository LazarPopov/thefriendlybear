# Web App Guidelines

This directory contains the Next.js frontend for The Friendly Bear.

## Component Naming Conventions

The project uses a strict naming convention for page-level components:

- **Locale Prefix:** Components are prefixed with their locale (e.g., `bg-` for Bulgarian, `en-` for English).
- **Suffix Strategy:**
  - `-cms.tsx`: Components that are designed to work with Strapi CMS data, often used for previews or dynamic content.
  - `-live.tsx`: Production-ready components, potentially using static data or optimized fetches.
  - `-curated.tsx`: Specifically used for hand-picked content like reviews.

## Layouts & Structure

- `src/app/[locale]`: Uses Next.js dynamic routes for localization.
- `src/components/site-chrome.tsx`: The main wrapper for the site layout.

## SEO & Metadata

- **Localized Metadata:** Each page in `src/app/[locale]` must implement dynamic metadata to target local keywords (e.g., "ресторант София") and tourist keywords (e.g., "best restaurants in Sofia").
- **Structured Data:** Use the `src/components/structured-data.tsx` component to inject JSON-LD for `Restaurant`, `LocalBusiness`, and `BreadcrumbList` schemas.
- **Image Optimization:** Always use `next/image` with proper `alt` text in the correct locale.

## Adding New Locales

When adding a new locale:
1. Create a new directory in `src/app/[locale]`.
2. Create corresponding components in `src/components` following the `[locale]-page-type.tsx` pattern.
