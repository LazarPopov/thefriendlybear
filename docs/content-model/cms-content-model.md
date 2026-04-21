# CMS Content Model

Този документ описва минималния content model за сайта на The Friendly Bear Sofia.

## Общи правила

- Всички основни текстови полета трябва да поддържат `bg` и `en`.
- Tourist landing pages могат да имат и допълнителни market-specific полета за `it`, `es` и `el`.
- Не ползваме автоматичен runtime превод.
- Всички основни типове съдържание имат SEO метаданни там, където има смисъл.
- Статусите са `draft`, `published`, `archived`.
- Slug полетата са ръчно контролирани и трябва да водят към native URL структура.

## Типове съдържание

### 1. BusinessProfile

Използва се за основния live профил на ресторанта и трябва да бъде `single type`.

Полета:
- `sourceMode`
- `futureConnector`
- `syncReady`
- `lastBusinessUpdateNote.bg`
- `lastBusinessUpdateNote.en`
- `address.bg`
- `address.en`
- `area.bg`
- `area.en`
- `mapUrl`
- `mapsLabel.bg`
- `mapsLabel.en`
- `phoneNumber`
- `phoneDisplay`
- `whatsappNumber`
- `whatsappPrefill.bg`
- `whatsappPrefill.en`
- `bookingMode`
- `externalBookingUrl`
- `externalBookingLabel.bg`
- `externalBookingLabel.en`
- `serviceOptions.bg[]`
- `serviceOptions.en[]`
- `openingHours[]`
- `statusMessages.bg`
- `statusMessages.en`
- `visitNotes.bg[]`
- `visitNotes.en[]`
- `arrivalTips.bg[]`
- `arrivalTips.en[]`
- `seo`

### 2. Page

Използва се за:
- Home
- About
- Contact
- Reviews
- Promotions index
- Редакционно съдържание

Полета:
- `id`
- `key`
- `status`
- `slug.bg`
- `slug.en`
- `title.bg`
- `title.en`
- `intro.bg`
- `intro.en`
- `body.bg`
- `body.en`
- `seo`

### 3. MenuCategory

Използва се за логическите секции на менюто.

Полета:
- `id`
- `key`
- `status`
- `slug.bg`
- `slug.en`
- `name.bg`
- `name.en`
- `description.bg`
- `description.en`
- `sortOrder`
- `isActive`
- `seo`

### 4. MenuItem

Използва се за всяка отделна позиция от менюто.

Полета:
- `id`
- `status`
- `key`
- `categoryKey`
- `slug.bg`
- `slug.en`
- `name.bg`
- `name.en`
- `description.bg`
- `description.en`
- `allergens.bg`
- `allergens.en`
- `servingLabel.bg`
- `servingLabel.en`
- `caloriesLabel.bg`
- `caloriesLabel.en`
- `price`
- `currency`
- `priceDisplayBgn`
- `priceDisplayEur`
- `sortOrder`
- `dietaryTags`
- `isVegetarian`
- `isFeatured`
- `imageUrl`
- `sourceRefs.googleBusinessProfileId`
- `sourceRefs.metaCatalogId`
- `sourceRefs.lastSyncedAt`
- `seo`

### 5. Promotion

Използва се за кампании, оферти и сезонни предложения.

Полета:
- `id`
- `status`
- `slug.bg`
- `slug.en`
- `title.bg`
- `title.en`
- `summary.bg`
- `summary.en`
- `body.bg`
- `body.en`
- `ctaLabel.bg`
- `ctaLabel.en`
- `ctaUrl.bg`
- `ctaUrl.en`
- `startsAt`
- `endsAt`
- `isEnabled`
- `seo`

### 6. ReviewSnippet

Използва се за curated ревюта от Google, TripAdvisor или ръчно одобрени записи.

Полета:
- `id`
- `status`
- `source`
- `authorName`
- `rating`
- `reviewText.bg`
- `reviewText.en`
- `reviewDate`
- `relativeDateLabel.bg`
- `relativeDateLabel.en`
- `sourceUrl`
- `keywordTags.bg[]`
- `keywordTags.en[]`
- `isFeatured`
- `seo`

### 7. ReservationSettings

Използва се за управление на резервационния модул и трябва да бъде `single type`.

Полета:
- `id`
- `isEnabled`
- `mode`
- `stickyCallEnabled`
- `stickyWhatsappEnabled`
- `phoneNumber`
- `whatsappNumber`
- `externalBookingUrl`
- `externalBookingProvider`
- `externalBookingDomain`
- `ctaLabel.bg`
- `ctaLabel.en`
- `confirmationMessage.bg`
- `confirmationMessage.en`

### 8. TouristLandingPage

Използва се за леките страници за туристи.

Полета:
- `id`
- `status`
- `audience`
- `slug.bg`
- `slug.en`
- `marketSlug.it`
- `marketSlug.es`
- `marketSlug.el`
- `title.bg`
- `title.en`
- `marketTitle.it`
- `marketTitle.es`
- `marketTitle.el`
- `intro.bg`
- `intro.en`
- `marketIntro.it`
- `marketIntro.es`
- `marketIntro.el`
- `vegetarianMessage.bg`
- `vegetarianMessage.en`
- `marketVegetarianMessage.it`
- `marketVegetarianMessage.es`
- `marketVegetarianMessage.el`
- `serviceMessage.bg`
- `serviceMessage.en`
- `marketServiceMessage.it`
- `marketServiceMessage.es`
- `marketServiceMessage.el`
- `primaryCtaLabel.bg`
- `primaryCtaLabel.en`
- `marketPrimaryCtaLabel.it`
- `marketPrimaryCtaLabel.es`
- `marketPrimaryCtaLabel.el`
- `primaryCtaUrl.bg`
- `primaryCtaUrl.en`
- `marketPrimaryCtaUrl.it`
- `marketPrimaryCtaUrl.es`
- `marketPrimaryCtaUrl.el`
- `seo`

### 9. ModuleToggles

Използва се за owner-friendly включване и изключване на ключови модули и трябва да бъде `single type`.

Полета:
- `promotionsEnabled`
- `reservationsEnabled`
- `reviewsEnabled`
- `socialFeedEnabled`

## Поддържащи компоненти

Минималният Strapi setup трябва да има reusable компоненти за:

- `Localized String`
- `Localized Text`
- `Localized Rich Text`
- `Localized String List`
- `Market String`
- `Market Text`
- `Opening Hours Entry`
- `SEO Metadata`

`Opening Hours Entry` трябва да поддържа:

- `dayOfWeek`
- `opens`
- `closes`
- `closed`

## SEO Metadata

SEO блокът трябва да поддържа:

- `title.bg`
- `title.en`
- `description.bg`
- `description.en`
- `canonicalPath.bg`
- `canonicalPath.en`
- `keywords.bg[]`
- `keywords.en[]`
- `noindex`
- `schema.restaurant`
- `schema.localBusiness`
- `schema.menu`
- `schema.aggregateRating`
- `schema.faq`
- `schema.speakable`

## Бележки за singleton моделите

- `BusinessProfile` е source of truth за телефон, адрес, работно време, service options и бъдещ sync към Google Business Profile.
- `ReservationSettings` управлява behavior-а на booking action layer-а.
- `ModuleToggles` позволява owner-facing включване и изключване на ключови секции без код.

## Бележки за CMS имплементацията

- `Reservations` и `Promotions` трябва да могат да се включват и изключват без код.
- Менюто трябва да има fallback ръчна редакция, ако sync от външен източник е непълен.
- Review records трябва да поддържат keyword филтриране, например `cozy` и `craft beer`.
- Tourist landing pages трябва да останат леки и бързи, без тежки widgets.
- Frontend-ът трябва да е готов да чете CMS данни първо, с локален fallback само докато връзката със CMS още не е вързана.
- Market routes като `/it`, `/es` и `/el` трябва да четат първо native market полетата и да падат обратно към `en`, ако native copy още не е попълнен.
