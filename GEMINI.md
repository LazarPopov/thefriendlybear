# Gemini Instructions for The Friendly Bear

This workspace is a monorepo containing a Strapi CMS and a Next.js web application.

## Project Structure

- `apps/cms`: Strapi 5 Headless CMS (TypeScript).
- `apps/web`: Next.js Web Application (TypeScript, App Router).
- `packages/types`: Shared TypeScript definitions.
- `docs/`: Documentation for architecture, content model, and handoff.

## Tech Stack & Conventions

### CMS (`apps/cms`)
- **Framework:** Strapi 5.
- **Database:** SQLite (`.tmp/data.db`) for local development.
- **Conventions:** Follow Strapi 5 idiomatic patterns for controllers, services, and middlewares. Always check `apps/cms/types/generated/` for content type definitions.

### Web (`apps/web`)
- **Framework:** Next.js (App Router).
- **Styling:** Prefer Vanilla CSS as per global defaults.
- **Language:** TypeScript.
- **Conventions:** Use React Server Components (RSC) by default. Use `use client` only when necessary for interactivity.

## Development Workflow

- **Package Manager:** Use `npm`. Although `pnpm-workspace.yaml` exists, `package-lock.json` is the source of truth and root scripts use `npm`.

### Useful Commands
- `npm run dev:web`: Starts the Next.js development server.
- `npm run dev:cms`: Starts the Strapi development server.
- `npm run build:web`: Builds the web application.
- `npm run build:cms`: Builds the Strapi admin panel.

## Mandates

- **SEO Priority:** Every code and content change must be evaluated for its SEO impact. The primary goal is to rank for local Bulgarian keywords and "Sofia tourism" related queries.
- **Technical SEO:**
  - Maintain valid semantic HTML and structured data (JSON-LD).
  - Ensure fast PageSpeed insights by optimizing images and minimizing layout shifts.
  - Keep `sitemap.ts` and `robots.ts` in `apps/web` updated.
- **Localized Content:** Content updates must be optimized for both local Bulgarian context and international tourists in Sofia.
- **Documentation First:** Refer to `docs/` before making structural changes to the content model or architecture.
- **Type Safety:** Ensure shared types in `packages/types` are updated when API contracts change.
- **Contextual Awareness:** When working in `apps/web`, always consider the Strapi content model defined in `apps/cms`.
