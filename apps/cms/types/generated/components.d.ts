import type { Schema, Struct } from '@strapi/strapi';

export interface SharedLocalizedRichtext extends Struct.ComponentSchema {
  collectionName: 'components_shared_localized_richtexts';
  info: {
    description: 'Bilingual rich text';
    displayName: 'Localized Rich Text';
  };
  attributes: {
    bg: Schema.Attribute.RichText & Schema.Attribute.Required;
    en: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface SharedLocalizedString extends Struct.ComponentSchema {
  collectionName: 'components_shared_localized_strings';
  info: {
    description: 'Short bilingual text';
    displayName: 'Localized String';
  };
  attributes: {
    bg: Schema.Attribute.String & Schema.Attribute.Required;
    en: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLocalizedStringList extends Struct.ComponentSchema {
  collectionName: 'components_shared_localized_string_lists';
  info: {
    description: 'Bilingual list of short strings';
    displayName: 'Localized String List';
  };
  attributes: {
    bg: Schema.Attribute.JSON & Schema.Attribute.Required;
    en: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface SharedLocalizedText extends Struct.ComponentSchema {
  collectionName: 'components_shared_localized_texts';
  info: {
    description: 'Long bilingual plain text';
    displayName: 'Localized Text';
  };
  attributes: {
    bg: Schema.Attribute.Text & Schema.Attribute.Required;
    en: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedMarketString extends Struct.ComponentSchema {
  collectionName: 'components_shared_market_strings';
  info: {
    description: 'Optional short text for tourist market routes';
    displayName: 'Market String';
  };
  attributes: {
    el: Schema.Attribute.String;
    es: Schema.Attribute.String;
    it: Schema.Attribute.String;
  };
}

export interface SharedMarketText extends Struct.ComponentSchema {
  collectionName: 'components_shared_market_texts';
  info: {
    description: 'Optional longer text for tourist market routes';
    displayName: 'Market Text';
  };
  attributes: {
    el: Schema.Attribute.Text;
    es: Schema.Attribute.Text;
    it: Schema.Attribute.Text;
  };
}

export interface SharedOpeningHoursEntry extends Struct.ComponentSchema {
  collectionName: 'components_shared_opening_hours_entries';
  info: {
    description: 'Single day opening hours row';
    displayName: 'Opening Hours Entry';
  };
  attributes: {
    closed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    closes: Schema.Attribute.String;
    dayOfWeek: Schema.Attribute.Enumeration<
      [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ]
    > &
      Schema.Attribute.Required;
    opens: Schema.Attribute.String;
  };
}

export interface SharedSeoMetadata extends Struct.ComponentSchema {
  collectionName: 'components_shared_seo_metadata';
  info: {
    description: 'Bilingual SEO metadata and schema flags';
    displayName: 'SEO Metadata';
  };
  attributes: {
    canonicalPath: Schema.Attribute.Component<'shared.localized-string', false>;
    description: Schema.Attribute.Component<'shared.localized-text', false> &
      Schema.Attribute.Required;
    keywords: Schema.Attribute.JSON;
    noindex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    schemaAggregateRating: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    schemaFaq: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    schemaLocalBusiness: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    schemaMenu: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    schemaRestaurant: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    schemaSpeakable: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.Component<'shared.localized-string', false> &
      Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.localized-richtext': SharedLocalizedRichtext;
      'shared.localized-string': SharedLocalizedString;
      'shared.localized-string-list': SharedLocalizedStringList;
      'shared.localized-text': SharedLocalizedText;
      'shared.market-string': SharedMarketString;
      'shared.market-text': SharedMarketText;
      'shared.opening-hours-entry': SharedOpeningHoursEntry;
      'shared.seo-metadata': SharedSeoMetadata;
    }
  }
}
