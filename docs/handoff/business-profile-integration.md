# Business Profile Integration

## Source Files

Fallback business details live in:

- `apps/web/src/lib/business-profile-source.ts`

The normalized frontend-facing module lives in:

- `apps/web/src/lib/business-profile-module.ts`

The CMS adapter layer lives in:

- `apps/web/src/lib/cms/business-profile-adapter.ts`
- `apps/web/src/lib/cms/strapi.ts`

The Strapi single type lives in:

- `apps/cms/src/api/business-profile/content-types/business-profile/schema.json`

Seed data for first boot lives in:

- `apps/cms/src/seed-data.ts`

## Current Live Fields

- address
- phone
- opening hours
- service options
- map / directions link

## Fields Available For Later Activation

- `whatsappNumber`
- `externalBookingUrl`

## Current Confirmed Values

- Phone: `+359 87 612 2114`
- Address: `Sofia Center, Slavyanska St 23, 1000 Sofia, Bulgaria`
- Hours:
  - Monday: Closed
  - Tuesday: 17:00-23:00
  - Wednesday: 17:00-23:00
  - Thursday: 17:00-23:00
  - Friday: 17:00-23:00
  - Saturday: 12:00-23:00
  - Sunday: 12:00-23:00
- Not used right now:
  - WhatsApp
  - External booking link

## Runtime Behavior

- The frontend reads Strapi first when `STRAPI_URL` is configured.
- If Strapi is unavailable or returns no content, the site falls back to the local source module.
- `STRAPI_API_TOKEN` can be added if the frontend should read protected CMS content server-side.

## Integration Note

The source shape is intentionally modular so it can later be replaced or hydrated from Google Business Profile data without rewriting the frontend components.
