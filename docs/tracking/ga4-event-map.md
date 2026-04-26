# GA4 Event Map

This document describes the consent-aware Google Analytics tracking layer for The Friendly Bear website.

## Consent Boundary

- The Google tag loads on every page with consent defaults set to `denied`.
- Rejecting or ignoring the cookie banner keeps analytics storage denied.
- Custom GA4 page views and interaction events from the app stay off until the visitor accepts analytics cookies.
- The accepted-cookie population can be analyzed by page, locale, CTA location, and interaction type.

## Shared Parameters

Tracked CTA elements use these attributes:

- `data-track-event`
- `data-track-action-type`
- `data-track-location`
- `data-track-label`
- `data-track-locale`
- `data-track-target`
- `data-track-external`

Most GA4 events include:

- `action_type`
- `location`
- `label`
- `locale`
- `target`
- `is_external`
- `page_path`
- `page_location`
- `page_title`

Observer-based events may also include:

- `route_key`
- `tourist_audience`
- `section_index`
- `section_id`
- `section_class`
- `section_label`

## CTA Events

- `click_to_call`: Phone CTA clicks, including header, footer, reservation popup, mobile quickbar, and venue gallery final slide.
- `directions_click`: Google Maps or directions CTA clicks.
- `external_map_open`: Secondary event fired together with `directions_click`, useful as a key event.
- `menu_cta_click`: Clicks that lead toward the menu page.
- `menu_category_click`: Menu category jump-link clicks on the HTML menu page.
- `story_cta_click`: About/story CTA clicks.
- `reservation_cta_click`: Reservation page CTA clicks.
- `contact_cta_click`: Contact CTA clicks.
- `whatsapp_click`: WhatsApp CTA clicks if enabled in business profile data.
- `external_booking_click`: External booking platform clicks if enabled in business profile data.
- `social_click`: Facebook and Instagram link clicks.
- `language_switch_click`: Header and footer language switch clicks.
- `quickbar_click`: Secondary event fired when a tracked CTA is clicked inside `.mobile-quickbar`.

## Consent Events

- `cookie_consent_click`: Sent when a visitor accepts analytics cookies.

## Reservation Popup Events

- `reservation_popup_impression`: Popup card or minimized widget is shown to a consented visitor.
- `reservation_popup_close`: Expanded popup is minimized.
- `reservation_widget_expand_click`: Minimized widget is opened.
- `click_to_call` with `location=reservation_popup_phone`: Popup phone reservation click.

## Menu Intent Events

- `menu_view_intent`: Fired on menu page load and when a visitor clicks a menu CTA/category link.
- `menu_category_view`: Fired when a menu category section scrolls into view.
- `menu_category_click`: Fired when a visitor taps a category jump link.

## Page Engagement Events

- `scroll_depth`: Fired once per page at 50%, 75%, and 90% scroll depth.
- `section_view`: Fired once when important `section`/`aside` blocks enter view.
- `review_interaction`: Fired on reviews page view and when review sections enter view.
- `tourist_language_page_engagement`: Fired on tourist/language landing page view and at scroll milestones.
- `dead_end_404`: Fired when a consented visitor reaches the custom 404 page.

Tourist market route context now covers:

- `/it/ristorante-sofia-centro` with `tourist_audience=italian`
- `/es/restaurante-centro-sofia` with `tourist_audience=spanish`
- `/el/estiatorio-sofia-kentro` with `tourist_audience=greek`
- `/de/restaurant-sofia-zentrum` with `tourist_audience=german`
- `/ro/restaurante-centru-sofia` with `tourist_audience=romanian`
- `/en-gb/traditional-restaurant-sofia` with `tourist_audience=uk`
- `/en/hidden-gem-restaurant-sofia` with `tourist_audience=hidden_gem`

## Venue Gallery Events

- `venue_gallery_stage_click`: Fired when a visitor advances the venue gallery.
- `venue_gallery_final_reached`: Fired when a visitor reaches the final gallery slide.
- `click_to_call` with `location=venue_gallery_final`: Reservation from gallery final slide.
- `directions_click` with `location=venue_gallery_final`: Directions from gallery final slide.

Gallery-specific parameters:

- `gallery_group`
- `gallery_label`
- `slide_index`
- `slide_count`
- `next_slide_index`
- `click_source`
- `is_final_slide`

## Current UI Locations

- `header_call`
- `header_directions`
- `header_menu`
- `header_about`
- `header_social`
- `header_language`
- `footer_call`
- `footer_directions`
- `footer_menu`
- `footer_about`
- `footer_social`
- `footer_language`
- `mobile_quickbar`
- `reservation_popup_card`
- `reservation_popup_minimized`
- `reservation_popup_phone`
- `venue_gallery_stage`
- `venue_gallery_final`
- `menu_category_nav`
- `menu_category_section`
- `section_observer`
- `page_scroll`
- `page_load`
- `reviews_page`
- `review_section`
- `{market_locale}_market_hero`
- `{market_locale}_market_quickbar`
- `hidden_gem_hero`
- `not_found_page`

## Suggested GA4 Key Events

- `click_to_call`
- `external_map_open`
- `reservation_widget_expand_click`
- `venue_gallery_final_reached`
- `menu_view_intent`
- `dead_end_404`

For a tighter dashboard, break down key events by `location`, `page_path`, `locale`, and `tourist_audience`.
