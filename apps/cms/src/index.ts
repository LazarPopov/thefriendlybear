import type { Core } from "@strapi/strapi";
import {
  businessProfileSeed,
  menuCategorySeeds,
  menuItemSeeds,
  moduleTogglesSeed,
  pageSeeds,
  promotionSeeds,
  reservationSettingsSeed,
  reviewSnippetSeeds,
  touristLandingPageSeeds
} from "./seed-data";

const BUSINESS_PROFILE_UID = "api::business-profile.business-profile";
const MENU_CATEGORY_UID = "api::menu-category.menu-category";
const MENU_ITEM_UID = "api::menu-item.menu-item";
const RESERVATION_SETTING_UID = "api::reservation-setting.reservation-setting";
const MODULE_TOGGLE_UID = "api::module-toggle.module-toggle";
const PAGE_UID = "api::page.page";
const PROMOTION_UID = "api::promotion.promotion";
const REVIEW_SNIPPET_UID = "api::review-snippet.review-snippet";
const TOURIST_LANDING_PAGE_UID = "api::tourist-landing-page.tourist-landing-page";

async function ensurePublishedSingleType(strapi: Core.Strapi, uid: string, data: Record<string, unknown>) {
  const documents = strapi.documents(uid as never);
  const canPublish = typeof documents.publish === "function";
  const draft = canPublish ? await documents.findFirst({ status: "draft" }) : await documents.findFirst();
  const published = canPublish ? await documents.findFirst({ status: "published" }) : draft;

  if (!draft) {
    const created = await documents.create({ data });
    const createdDocumentId = (created as { documentId?: string }).documentId;

    if (canPublish) {
      if (!createdDocumentId) {
        throw new Error(`[seed] Missing documentId after creating ${uid}`);
      }

      await documents.publish({ documentId: createdDocumentId });
      strapi.log.info(`[seed] Created and published ${uid}`);
    } else {
      strapi.log.info(`[seed] Created ${uid}`);
    }
    return;
  }

  if (canPublish && !published) {
    const draftDocumentId = (draft as { documentId?: string }).documentId;

    if (!draftDocumentId) {
      throw new Error(`[seed] Missing documentId on existing draft for ${uid}`);
    }

    await documents.publish({ documentId: draftDocumentId });
    strapi.log.info(`[seed] Published existing draft for ${uid}`);
  }
}

async function ensurePublishedReviewSnippet(
  strapi: Core.Strapi,
  authorName: string,
  data: Record<string, unknown>
) {
  await ensurePublishedCollectionEntry(strapi, REVIEW_SNIPPET_UID, "authorName", authorName, data);
}

async function ensurePublishedCollectionEntry(
  strapi: Core.Strapi,
  uid: string,
  fieldName: string,
  fieldValue: string,
  data: Record<string, unknown>
) {
  const label = `${uid}:${fieldName}=${fieldValue}`;
  const documents = strapi.documents(uid as never);
  const canPublish = typeof documents.publish === "function";
  const filters = {
    [fieldName]: {
      $eq: fieldValue
    }
  };

  const draft = await documents.findFirst({
    ...(canPublish ? { status: "draft" } : {}),
    filters
  });

  const published = canPublish
    ? await documents.findFirst({
        status: "published",
        filters
      })
    : draft;

  if (!draft) {
    const created = await documents.create({ data });
    const createdDocumentId = (created as { documentId?: string }).documentId;

    if (canPublish) {
      if (!createdDocumentId) {
        throw new Error(`[seed] Missing documentId after creating ${label}`);
      }

      await documents.publish({ documentId: createdDocumentId });
      strapi.log.info(`[seed] Created and published ${label}`);
    } else {
      strapi.log.info(`[seed] Created ${label}`);
    }

    return;
  }

  if (canPublish && !published) {
    const draftDocumentId = (draft as { documentId?: string }).documentId;

    if (!draftDocumentId) {
      throw new Error(`[seed] Missing documentId on existing draft for ${label}`);
    }

    await documents.publish({ documentId: draftDocumentId });
    strapi.log.info(`[seed] Published existing draft for ${label}`);
  }
}

async function ensurePublishedCollectionSeedsIfEmpty(
  strapi: Core.Strapi,
  uid: string,
  entries: ReadonlyArray<Record<string, unknown>>
) {
  const documents = strapi.documents(uid as never);
  const canPublish = typeof documents.publish === "function";
  const draft = await documents.findFirst({
    ...(canPublish ? { status: "draft" } : {})
  });
  const published = canPublish ? await documents.findFirst({ status: "published" }) : draft;
  const existing = draft ?? published;

  if (existing) {
    return;
  }

  for (const entry of entries) {
    const created = await documents.create({ data: entry });
    const createdDocumentId = (created as { documentId?: string }).documentId;

    if (canPublish) {
      if (!createdDocumentId) {
        throw new Error(`[seed] Missing documentId after creating ${uid}`);
      }

      await documents.publish({ documentId: createdDocumentId });
    }
  }

  strapi.log.info(`[seed] Created initial seeded entries for ${uid}`);
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensurePublishedSingleType(strapi, BUSINESS_PROFILE_UID, businessProfileSeed as Record<string, unknown>);
    await ensurePublishedSingleType(
      strapi,
      RESERVATION_SETTING_UID,
      reservationSettingsSeed as Record<string, unknown>
    );
    await ensurePublishedSingleType(strapi, MODULE_TOGGLE_UID, moduleTogglesSeed as Record<string, unknown>);

    for (const page of pageSeeds) {
      await ensurePublishedCollectionEntry(strapi, PAGE_UID, "key", page.key, page as Record<string, unknown>);
    }

    await ensurePublishedCollectionSeedsIfEmpty(
      strapi,
      PROMOTION_UID,
      promotionSeeds as ReadonlyArray<Record<string, unknown>>
    );

    for (const menuCategory of menuCategorySeeds) {
      await ensurePublishedCollectionEntry(
        strapi,
        MENU_CATEGORY_UID,
        "key",
        menuCategory.key,
        menuCategory as Record<string, unknown>
      );
    }

    for (const menuItem of menuItemSeeds) {
      await ensurePublishedCollectionEntry(
        strapi,
        MENU_ITEM_UID,
        "key",
        menuItem.key,
        menuItem as Record<string, unknown>
      );
    }

    for (const reviewSnippet of reviewSnippetSeeds) {
      await ensurePublishedReviewSnippet(
        strapi,
        reviewSnippet.authorName,
        reviewSnippet as Record<string, unknown>
      );
    }

    for (const touristLandingPage of touristLandingPageSeeds) {
      await ensurePublishedCollectionEntry(
        strapi,
        TOURIST_LANDING_PAGE_UID,
        "audience",
        touristLandingPage.audience,
        touristLandingPage as Record<string, unknown>
      );
    }
  }
};
