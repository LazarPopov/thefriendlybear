# Special Menu Indexing Design

## Goal

Rename the public special menu labels in Bulgarian and English, rename the Bulgarian regular menu copy to "Основно меню", and request Google Indexing when staff publish the special menu from the admin panel.

## Scope

- Update fallback public special menu labels from "Special Weekly Menu" / "Специално седмично меню" to "Special Menu" / "Специално меню".
- Update the Bulgarian regular menu download copy from "Редовно меню" wording to "Основно меню" wording.
- Trigger Google Indexing only after the admin menu API successfully publishes the menu, not when saving drafts.
- Request indexing for both localized public menu URLs: `/bg/menu` and `/en/menu`.

## Architecture

The existing `POST /api/admin/menu` route remains the single publish entry point. After `publishSeasonalMenu` succeeds, the route calls a focused server-only Google Indexing helper that creates a service-account JWT from `GOOGLE_INDEXING_CLIENT_EMAIL` and `GOOGLE_INDEXING_PRIVATE_KEY`, exchanges it for an OAuth token, and posts `URL_UPDATED` notifications for both menu URLs.

Indexing is a post-publish side effect. If Google indexing fails or is misconfigured, the publish response still succeeds and includes an indexing result that the admin UI can show as a warning. This avoids losing staff changes because of a transient external API failure.

## Testing

Add a static regression test that verifies the helper exists, uses the service-account env vars, sends `URL_UPDATED` notifications to the Google Indexing endpoint, the admin route calls it only on publish, and the menu label copy has changed.
