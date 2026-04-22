# GA4 Event Map

Този документ описва текущия tracking слой за основните CTA действия в българската версия на сайта.

## Data Attributes

Интерактивните CTA елементи вече изкарват следните атрибути:

- `data-track-event`
- `data-track-action-type`
- `data-track-location`
- `data-track-label`
- `data-track-locale`
- `data-track-target`
- `data-track-external`

Това позволява GTM да чете едни и същи сигнали независимо дали елементът е вътрешен линк, външен линк, телефонен линк или WhatsApp линк.

## Event Names

- `click_to_call`
  Използва се за `tel:` CTA бутони.

- `whatsapp_click`
  Използва се за WhatsApp CTA бутони.

- `external_booking_click`
  Използва се за външни booking платформи.

- `menu_cta_click`
  Използва се за основни CTA бутони към менюто.

- `menu_category_click`
  Използва се за вътрешните category jump links в менюто.

- `reservation_cta_click`
  Използва се за CTA бутони към резервационната страница.

- `contact_cta_click`
  Използва се за CTA бутони към контактната страница.

- `directions_click`
  Използва се за Google Maps и други direction CTA елементи.

## Current UI Locations

- `home_hero`
- `home_featured_menu`
- `home_visit_panel`
- `about_hero`
- `about_location_card`
- `contact_hero`
- `contact_map_card`
- `reviews_hero`
- `reservations_hero`
- `menu_hero`
- `menu_category_nav`
- `tourists_index_hero`
- `tourists_index_grid`
- `tourist_page_hero`
- `mobile_quickbar`

## Suggested GTM Mapping

- Trigger:
  Click on element where `data-track-event` exists.

- Container bootstrap:
  Add `NEXT_PUBLIC_GTM_ID` in `apps/web/.env.local` to activate the GTM script in the frontend layout.

- Variables:
  Read each `data-track-*` attribute as a DOM element variable.

- GA4 event name:
  Use the value from `data-track-event`.

- Suggested GA4 parameters:
  - `action_type`
  - `location`
  - `label`
  - `locale`
  - `target`
  - `is_external`

## Consent Gate

- Analytics scripts load through `AnalyticsConsent`, not directly in the root layout.
- Visitors must accept analytics cookies before GTM or direct GA4 loads.
- Rejecting stores the choice, removes visible GA cookies, and keeps analytics disabled.
- The persistent cookie settings button lets visitors change their choice later.
- If `NEXT_PUBLIC_GTM_ID` is set, GTM is used as the analytics provider. If not, `NEXT_PUBLIC_GA_MEASUREMENT_ID` loads direct GA4.

## Notes

- `click_to_call`, `whatsapp_click` и `external_booking_click` ще започнат да се използват автоматично веднага щом в `business-profile.ts` бъдат добавени реални данни.
- `menu_category_click` е вече подготвен за category interaction tracking на HTML менюто.
- Следващата стъпка може да добави готов GTM `dataLayer.push()` helper, ако искаме fallback и за custom JS tracking.
