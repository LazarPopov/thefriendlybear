# Strapi Content Pass

Use this checklist while Strapi is running locally at `http://localhost:1337/admin`.

Frontend preview:

- `${NEXT_PUBLIC_BASE_URL}/bg`
- `${NEXT_PUBLIC_BASE_URL}/en`
- `${NEXT_PUBLIC_BASE_URL}/it/ristorante-sofia-centro`
- `${NEXT_PUBLIC_BASE_URL}/es`
- `${NEXT_PUBLIC_BASE_URL}/el`

After editing an entry in Strapi, always click `Save` and `Publish`, then refresh the matching frontend page.

## 1. Business Profile

Open `Business Profile`.

Check these fields:

- `address.bg`: `ул. Славянска 23, 1000 София, България`
- `address.en`: `Sofia Center, Slavyanska St 23, 1000 Sofia, Bulgaria`
- `phoneNumber`: `+359 87 612 2114`
- `phoneDisplay`: `+359 87 612 2114`
- `bookingMode`: `call_only`
- `whatsappNumber`: leave empty unless the business confirms WhatsApp
- `externalBookingUrl`: leave empty unless the business confirms a booking URL
- `serviceOptions.bg`: `Места на открито`, `Камина`, `Страхотни коктейли`
- `serviceOptions.en`: `Outdoor seating`, `Fireplace`, `Great cocktails`
- `openingHours`: Monday closed, Tuesday-Friday 17:00-23:00, Saturday-Sunday 12:00-23:00

Frontend pages to verify:

- `/bg`
- `/bg/contact`
- `/bg/reservations`
- `/en/contact`
- `/en/reservations`

Pass criteria:

- phone button opens `tel:+359876122114`
- Google Maps opens from directions buttons
- no WhatsApp or online booking CTA appears

## 2. Reservation Settings

Open `Reservation Settings`.

Recommended final state:

- `isEnabled`: true
- `mode`: `call_only`
- `stickyCallEnabled`: true
- `stickyWhatsappEnabled`: false
- `phoneNumber`: `+359 87 612 2114`
- `whatsappNumber`: empty
- `externalBookingUrl`: empty
- `ctaLabel.bg`: `Обади се за резервация`
- `ctaLabel.en`: `Call for reservation`
- `confirmationMessage.bg`: `Най-бързият текущ път за резервация е по телефон.`
- `confirmationMessage.en`: `The fastest current reservation path is by phone.`

Frontend pages to verify:

- `/bg/reservations`
- `/en/reservations`

Pass criteria:

- page does not imply there is an online reservation system
- CTA is phone-first
- WhatsApp remains hidden

## 3. Module Toggles

Open `Module Toggles`.

Recommended final state:

- `promotionsEnabled`: true if the spring menu/promotion is active
- `reservationsEnabled`: true
- `reviewsEnabled`: true
- `socialFeedEnabled`: false until there is a real social feed integration

Frontend pages to verify:

- `/bg`
- `/en`
- `/bg/promotions`
- `/en/promotions`
- `/bg/reviews`
- `/en/reviews`

Pass criteria:

- disabled modules do not show misleading buttons or empty sections
- enabled modules show useful content

## 4. Pages

Open `Pages`.

Review these entries:

- `home`
- `about`
- `contact`
- `reviews`
- `promotions`

For every page, check:

- `title.bg`
- `title.en`
- `intro.bg`
- `intro.en`
- `body.bg`
- `body.en`

Important cleanup:

- remove internal/project wording like `schema`, `CTA flow`, `AI summaries`, `developer`, `owner-managed`, or `content type` from public-facing copy
- keep copy restaurant-focused, not implementation-focused
- keep Bulgarian natural, not translated mechanically
- keep English visitor-friendly and concise

Suggested public tone:

- clear location
- warm atmosphere
- easy menu access
- phone-first reservation/contact
- honest service options

Frontend pages to verify:

- `/bg`
- `/bg/about`
- `/bg/contact`
- `/bg/reviews`
- `/bg/promotions`
- `/en`
- `/en/about`
- `/en/contact`
- `/en/reviews`
- `/en/promotions`

Pass criteria:

- no placeholder/developer language remains
- every page sounds like a real restaurant page
- Bulgarian and English are not exact word-for-word clones

## 5. Promotions

Open `Promotions`.

Review the spring menu promotion:

- `isEnabled`: true if the spring menu is currently active
- `title.bg`: `Пролетно специално меню`
- `title.en`: `Special Spring Menu`
- `summary.bg`: should clearly mention seasonal dishes
- `summary.en`: should clearly mention seasonal dishes
- `ctaLabel.bg`: `Виж менюто`
- `ctaLabel.en`: `See the menu`
- `ctaUrl.bg`: `/bg/menu`
- `ctaUrl.en`: `/en/menu`
- `startsAt` and `endsAt`: optional, but useful if the offer is temporary

Frontend pages to verify:

- `/bg/promotions`
- `/en/promotions`
- `/bg`
- `/en`

Pass criteria:

- promotion does not show if disabled
- CTA opens the correct menu page
- no expired promotion appears as current

## 6. Menu Categories And Menu Items

Open `Menu Categories` first.

Check:

- category order: Drinks, Starters, Main Course, Dessert
- all active categories have `isActive`: true
- slugs are readable

Open `Menu Items`.

Check every item for:

- Bulgarian name and English name
- description formatting
- allergens
- serving label
- BGN/EUR display
- vegetarian flag where relevant
- sort order inside category

Important:

- do not use menu screenshots as the live menu
- keep the HTML menu as the source users and search engines can read

Frontend pages to verify:

- `/bg/menu`
- `/en/menu`

Pass criteria:

- prices match the source menu
- allergens are visible
- vegetarian drob sarma is marked vegetarian
- dessert line does not show a fake price

## 7. Review Snippets

Open `Review Snippets`.

Check the 4 Google snippets:

- Lazar Popov
- J Moreno
- Viltė Čepulytė
- Alice T

For each review:

- `source`: google
- `rating`: 5
- `relativeDateLabel.bg`
- `relativeDateLabel.en`
- `reviewText.bg`
- `reviewText.en`
- `keywordTags.bg`
- `keywordTags.en`
- `isFeatured`: true if it should appear publicly

Important:

- keep snippets short if Google only shows partial text
- do not invent full review text
- only show nationality-specific tourist reviews when we can honestly associate them with that audience

Frontend pages to verify:

- `/bg/reviews`
- `/en/reviews`
- `/es/...` if Spanish audience review is enabled

Pass criteria:

- reviews are clearly attributed to Google
- no fake aggregate rating appears
- nationality review blocks remain optional

## 8. Tourist Landing Pages

Open `Tourist Landing Pages`.

Entries:

- Italian
- Spanish
- Greek

For every entry, check:

- `audience`
- `slug.bg`
- `slug.en`
- `title.bg`
- `title.en`
- `intro.bg`
- `intro.en`
- `vegetarianMessage.bg`
- `vegetarianMessage.en`
- `serviceMessage.bg`
- `serviceMessage.en`
- `primaryCtaLabel.bg`
- `primaryCtaLabel.en`
- `primaryCtaUrl.bg`
- `primaryCtaUrl.en`

Market-specific fields:

- Italian uses `marketSlug.it`, `marketTitle.it`, `marketIntro.it`, `marketVegetarianMessage.it`, `marketServiceMessage.it`, `marketPrimaryCtaLabel.it`
- Spanish should use `marketSlug.es`, `marketTitle.es`, `marketIntro.es`, `marketVegetarianMessage.es`, `marketServiceMessage.es`, `marketPrimaryCtaLabel.es`
- Greek should use `marketSlug.el`, `marketTitle.el`, `marketIntro.el`, `marketVegetarianMessage.el`, `marketServiceMessage.el`, `marketPrimaryCtaLabel.el`

Current Italian target:

- `marketSlug.it`: `ristorante-sofia-centro`
- `marketTitle.it`: `Benvenuti al The Friendly Bear`
- `marketPrimaryCtaLabel.it`: `Vedi il Menu e Contattaci`

Frontend pages to verify:

- `/it/ristorante-sofia-centro`
- `/it`
- `/es`
- `/el`
- `/en/tourists`
- `/bg/tourists`

Pass criteria:

- `/it` redirects to the Italian slug
- tourist galleries show all `garden_n` and `interior_n` photos
- food carousel appears on tourist landing pages
- final gallery slide has localized cheeky CTA copy
- nationality-specific review block appears only when there is real matching review data

## Final Sweep

Run these local checks after the content pass:

```powershell
npm run build:web
npm run build:cms
```

Then manually test:

- desktop width and spacing
- mobile sticky actions
- gallery click speed
- food carousel size
- logo and slogan
- directions links
- call buttons
- menu readability
- all public route URLs
