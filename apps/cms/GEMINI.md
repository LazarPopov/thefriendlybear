# CMS Guidelines

This directory contains the Strapi 5 Headless CMS.

## Content Management

- **APIs:** Located in `src/api`. Each folder corresponds to a content type.
- **Seeding:** `src/seed-data.ts` contains the logic for populating the database. Use this for setting up local development environments.
- **Types:** Generated types are in `types/generated/contentTypes.d.ts`. Always refer to these when writing custom controllers or services.

## Development

- Use `npm run develop` to start Strapi with auto-reload.
- Configuration is in the `config/` directory. Database settings are in `config/database.ts`.

## Custom Logic

- Custom lifecycle hooks or bootstrap logic should be in `src/index.ts`.
- Prefer Strapi's built-in Query API over raw SQL whenever possible.
