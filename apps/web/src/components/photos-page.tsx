import Image from "next/image";
import { ActionLink } from "@/components/action-link";
import {
  getBusinessProfileData
} from "@/lib/business-profile-module";
import type { SiteLocale } from "@/lib/site";
import { buildActionTracking, type BusinessActionKind } from "@/lib/tracking";
import {
  getFoodGalleryImages,
  getGardenGalleryImages,
  getInteriorGalleryImages,
  type StaticVenueGalleryImage
} from "@/lib/venue-gallery-images";

type PhotosPageProps = {
  locale: SiteLocale;
};

type PhotoGroup = {
  id: string;
  label: string;
  title: string;
  text: string;
  images: StaticVenueGalleryImage[];
};

const copy: Record<
  SiteLocale,
  {
    eyebrow: string;
    title: string;
    lead: string;
    introTitle: string;
    intro: string;
    tags: string[];
    actions: Array<{
      href: string;
      label: string;
      kind: BusinessActionKind;
      external?: boolean;
      map?: boolean;
    }>;
    groups: Array<Omit<PhotoGroup, "images">>;
  }
> = {
  bg: {
    eyebrow: "Снимки",
    title: "Снимки от The Friendly Bear Sofia",
    lead:
      "Вижте храната, скритата градина и уютния интериор на The Friendly Bear преди да дойдете на ул. Славянска 23.",
    introTitle: "Храна, градина и атмосфера на едно място",
    intro:
      "Тази галерия събира реални снимки от ресторанта: сезонни ястия, зеления двор и топлите вътрешни зали.",
    tags: ["Сезонни ястия", "Скрита градина", "Уютен интериор"],
    actions: [
      { href: "/bg/menu", label: "Виж менюто", kind: "menu" },
      { href: "/bg/reservations", label: "Резервирай", kind: "reservations" },
      { href: "", label: "Упътвания", kind: "directions", external: true, map: true }
    ],
    groups: [
      {
        id: "food",
        label: "Храна",
        title: "Сезонни ястия и любими вкусове",
        text: "Снимки на ястия от кухнята, включително бавно готвени меса, свежи салати и сезонни предложения."
      },
      {
        id: "garden",
        label: "Градина",
        title: "Скритата градина в центъра",
        text: "Зелено и спокойно място за вечеря, напитки и срещи близо до Народния театър."
      },
      {
        id: "interior",
        label: "Интериор",
        title: "Топли вътрешни зали",
        text: "Уютна атмосфера, ретро детайли и маси за дълги разговори."
      }
    ]
  },
  en: {
    eyebrow: "Photos",
    title: "The Friendly Bear Sofia Photos",
    lead:
      "See photos of the food, hidden garden, and cozy interior at The Friendly Bear before you visit Slavyanska 23.",
    introTitle: "Food, garden, and atmosphere in one gallery",
    intro:
      "This gallery brings together real restaurant photos: seasonal dishes, the green courtyard, and the warm indoor rooms.",
    tags: ["Seasonal food", "Hidden garden", "Cozy interior"],
    actions: [
      { href: "/en/menu", label: "See the menu", kind: "menu" },
      { href: "/en/reservations", label: "Reserve", kind: "reservations" },
      { href: "", label: "Directions", kind: "directions", external: true, map: true }
    ],
    groups: [
      {
        id: "food",
        label: "Food",
        title: "Seasonal dishes and house favorites",
        text: "Photos from the kitchen, including slow-cooked meats, fresh salads, and seasonal specials."
      },
      {
        id: "garden",
        label: "Garden",
        title: "The hidden garden in the center",
        text: "A green, calm place for dinner, drinks, and meetups near the National Theatre."
      },
      {
        id: "interior",
        label: "Interior",
        title: "Warm indoor rooms",
        text: "Cozy atmosphere, retro details, and tables made for long conversations."
      }
    ]
  }
};

function getPhotoGroups(locale: SiteLocale): PhotoGroup[] {
  const pageCopy = copy[locale];
  const imagesByGroup = {
    food: getFoodGalleryImages(locale),
    garden: getGardenGalleryImages(locale),
    interior: getInteriorGalleryImages(locale)
  };

  return pageCopy.groups.map((group) => ({
    ...group,
    images: imagesByGroup[group.id as keyof typeof imagesByGroup]
  }));
}

export async function PhotosPage({ locale }: PhotosPageProps) {
  const businessProfile = await getBusinessProfileData();
  const pageCopy = copy[locale];
  const groups = getPhotoGroups(locale);
  const actions = pageCopy.actions.map((action) => ({
    ...action,
    href: action.map ? businessProfile.mapUrl : action.href
  }));

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">{pageCopy.eyebrow}</p>
        <h1>{pageCopy.title}</h1>
        <p className="page-lead">{pageCopy.lead}</p>

        <div className="page-tags" aria-label={locale === "bg" ? "Акценти в снимките" : "Photo highlights"}>
          {pageCopy.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="actions">
          {actions.map((action) => (
            <ActionLink
              key={`${action.kind}-${action.href}`}
              href={action.href}
              label={action.label}
              external={action.external}
              tracking={buildActionTracking({
                kind: action.kind,
                locale,
                location: "photos_hero",
                label: action.label,
                target: action.href,
                external: Boolean(action.external)
              })}
            />
          ))}
        </div>
      </section>

      <section className="tourist-gallery" aria-label={pageCopy.title}>
        <div className="tourist-gallery-heading">
          <p className="page-card-label">{pageCopy.eyebrow}</p>
          <h2>{pageCopy.introTitle}</h2>
          <p>{pageCopy.intro}</p>
        </div>

        {groups.map((group) => (
          <div key={group.id} className="tourist-gallery-group">
            <div className="tourist-gallery-group-head">
              <p className="page-card-label">{group.label}</p>
              <h2>{group.title}</h2>
              <p>{group.text}</p>
            </div>

            <div className="tourist-gallery-grid">
              {group.images.map((image) => (
                <article key={image.src} className="tourist-gallery-tile">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={720}
                    height={540}
                    className="tourist-gallery-image"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                  />
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
