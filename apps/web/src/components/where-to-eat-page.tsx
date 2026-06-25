import Link from "next/link";
import { ActionLink } from "@/components/action-link";
import { VenueSnapshotSection } from "@/components/venue-snapshot-section";
import {
  getBusinessProfileData,
  getPhoneHref
} from "@/lib/business-profile-module";
import type { SiteLocale } from "@/lib/site";
import { buildActionTracking, type BusinessActionKind } from "@/lib/tracking";
import {
  getFoodGalleryImages,
  getGardenGalleryImages,
  getInteriorGalleryImages
} from "@/lib/venue-gallery-images";

type WhereToEatPageProps = {
  locale: SiteLocale;
};

type PageAction = {
  href: string;
  label: string;
  kind: BusinessActionKind;
  external?: boolean;
  map?: boolean;
};

const copy: Record<
  SiteLocale,
  {
    eyebrow: string;
    title: string;
    lead: string;
    tags: string[];
    actions: PageAction[];
    decisionLabel: string;
    cards: Array<{ label: string; title: string; text: string }>;
    gallery: {
      eyebrow: string;
      title: string;
      intro: string;
      label: string;
    };
    source: {
      label: string;
      title: string;
      text: string;
      links: Array<{ href: string; label: string; text: string }>;
    };
    faqLabel: string;
    faqs: Array<{ question: string; answer: string }>;
  }
> = {
  bg: {
    eyebrow: "Къде да хапнем",
    title: "Къде да хапнете в центъра на София",
    lead:
      "The Friendly Bear е практичен избор за спокойна вечеря от вторник до петък след 17:00 и за уикенд обяд от 12:00, близо до Народния театър и ул. Славянска 23.",
    tags: ["Вечеря в центъра", "Уикенд обяд", "Градина", "Вегетариански опции"],
    actions: [
      { href: "/bg/menu", label: "Виж менюто", kind: "menu" },
      { href: "/bg/reservations", label: "Резервирай", kind: "reservations" },
      { href: "", label: "Упътвания", kind: "directions", external: true, map: true }
    ],
    decisionLabel: "Бърз избор",
    cards: [
      {
        label: "Вечеря през седмицата",
        title: "Подходящо за вечеря след работа или разходка",
        text:
          "От вторник до петък ресторантът работи от 17:00 до 23:00, така че страницата насочва делничните търсения към вечеря, не към обяд."
      },
      {
        label: "Уикенд обяд",
        title: "Обяд в събота и неделя от 12:00",
        text:
          "Събота и неделя са подходящи за обяд в центъра: ресторантът отваря в 12:00 и остава отворен до 23:00."
      },
      {
        label: "Локация",
        title: "Близо до Народния театър и Радисън",
        text:
          "Адресът на ул. Славянска 23 е удобен за гости, които търсят заведение около Народния театър, градинката Кристал и централните хотели."
      }
    ],
    gallery: {
      eyebrow: "Храна и атмосфера",
      title: "Вижте какво да очаквате преди да изберете маса",
      intro:
        "Снимките показват сезонни ястия, зелената градина и уютните вътрешни зали, за да решите дали мястото пасва на вашия обяд или вечеря.",
      label: "Храна, градина и интериор"
    },
    source: {
      label: "Source links",
      title: "Проверете детайлите преди посещение",
      text:
        "Тази страница обобщава ключовите сигнали от сайта: меню, снимки, отзиви, резервации и упътвания.",
      links: [
        { href: "/bg/menu", label: "Меню", text: "ястия, сезонни предложения и вегетариански опции" },
        { href: "/bg/photos", label: "Снимки", text: "храна, градина и интериор" },
        { href: "/bg/reviews", label: "Отзиви", text: "как гостите описват храната и обслужването" },
        { href: "/bg/contact", label: "Контакти", text: "адрес, карта и работно време" }
      ]
    },
    faqLabel: "Чести въпроси",
    faqs: [
      {
        question: "Къде да вечерям в центъра на София?",
        answer:
          "The Friendly Bear е подходящ избор за спокойна вечеря в центъра, особено ако искате градина, бавно готвени меса, свежи салати и лесен достъп от Народния театър."
      },
      {
        question: "Става ли за обяд?",
        answer:
          "Да, но най-точно за уикенд обяд: събота и неделя от 12:00. През делничните дни ресторантът отваря в 17:00 и е по-подходящ за вечеря."
      }
    ]
  },
  en: {
    eyebrow: "Where to eat in Sofia Center",
    title: "Where to eat dinner or lunch in Sofia Center",
    lead:
      "The Friendly Bear is a practical choice for relaxed weekday dinner from Tuesday to Friday after 17:00 and weekend lunch from 12:00 near the National Theatre and Slavyanska 23.",
    tags: ["Central dinner", "Weekend lunch", "Garden seating", "Vegetarian options"],
    actions: [
      { href: "/en/menu", label: "See the menu", kind: "menu" },
      { href: "/en/reservations", label: "Reserve", kind: "reservations" },
      { href: "", label: "Directions", kind: "directions", external: true, map: true }
    ],
    decisionLabel: "Fast answer",
    cards: [
      {
        label: "Weekday dinner",
        title: "Good for dinner after work or a city walk",
        text:
          "Tuesday to Friday from 17:00, The Friendly Bear is a dinner-first option for central Sofia searches."
      },
      {
        label: "Weekend lunch",
        title: "Saturday and Sunday from 12:00",
        text:
          "Saturday and Sunday from 12:00, it works for lunch near the National Theatre before turning naturally into a long dinner spot."
      },
      {
        label: "Location",
        title: "Near the National Theatre and Radisson area",
        text:
          "Slavyanska 23 is a useful address for visitors comparing places to eat around the National Theatre, Crystal Garden, and central hotels."
      }
    ],
    gallery: {
      eyebrow: "Food and atmosphere",
      title: "See what to expect before choosing a table",
      intro:
        "The photos show seasonal dishes, the green garden, and warm indoor rooms so you can decide whether the place fits lunch or dinner.",
      label: "Food, garden and interior"
    },
    source: {
      label: "Source links",
      title: "Check the practical details before you go",
      text:
        "This page summarizes first-party signals from the site: menu, photos, reviews, reservations, and directions.",
      links: [
        { href: "/en/menu", label: "Menu", text: "dishes, seasonal specials, and vegetarian options" },
        { href: "/en/photos", label: "Photos", text: "food, garden, and interior" },
        { href: "/en/reviews", label: "Reviews", text: "how guests describe the food and service" },
        { href: "/en/contact", label: "Contact", text: "address, map, and opening hours" }
      ]
    },
    faqLabel: "Questions",
    faqs: [
      {
        question: "Where to eat dinner in Sofia Center?",
        answer:
          "The Friendly Bear is a good fit for relaxed dinner in the center, especially if you want garden seating, slow-cooked meats, fresh salads, and easy access from the National Theatre."
      },
      {
        question: "Does it work for lunch?",
        answer:
          "Yes, but most accurately for weekend lunch: Saturday and Sunday from 12:00. On weekdays the restaurant opens at 17:00, so it is better for dinner."
      }
    ]
  }
};

function getVenueImages(locale: SiteLocale) {
  return [
    ...getFoodGalleryImages(locale).slice(0, 2),
    ...getGardenGalleryImages(locale).slice(0, 2),
    ...getInteriorGalleryImages(locale).slice(0, 2)
  ].map((image) => ({
    ...image,
    label: copy[locale].gallery.label
  }));
}

export async function WhereToEatPage({ locale }: WhereToEatPageProps) {
  const businessProfile = await getBusinessProfileData();
  const pageCopy = copy[locale];
  const actions = pageCopy.actions.map((action) => ({
    ...action,
    href: action.map ? businessProfile.mapUrl : action.href
  }));
  const phoneHref = getPhoneHref(businessProfile);

  return (
    <main className="page-shell">
      <section className="page-hero" data-track-section="where_to_eat_hero">
        <p className="eyebrow">{pageCopy.eyebrow}</p>
        <h1>{pageCopy.title}</h1>
        <p className="page-lead">{pageCopy.lead}</p>

        <div className="page-tags" aria-label={pageCopy.eyebrow}>
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
                location: "where_to_eat_hero",
                label: action.label,
                target: action.href,
                external: Boolean(action.external)
              })}
            />
          ))}
        </div>
      </section>

      <section className="page-grid page-grid-three" aria-label={pageCopy.decisionLabel}>
        {pageCopy.cards.map((card) => (
          <article key={card.label} className="page-card">
            <p className="page-card-label">{card.label}</p>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </article>
        ))}
      </section>

      <VenueSnapshotSection
        locale={locale}
        eyebrow={pageCopy.gallery.eyebrow}
        title={pageCopy.gallery.title}
        intro={pageCopy.gallery.intro}
        images={getVenueImages(locale)}
        maxImagesBeforeCta={6}
      />

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">{pageCopy.source.label}</p>
          <h2>{pageCopy.source.title}</h2>
          <p>{pageCopy.source.text}</p>
          <ul className="page-list">
            {pageCopy.source.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link> - {link.text}
              </li>
            ))}
          </ul>
        </article>

        <article className="page-card">
          <p className="page-card-label">{pageCopy.faqLabel}</p>
          {pageCopy.faqs.map((faq) => (
            <div key={faq.question}>
              <h2>{faq.question}</h2>
              <p>{faq.answer}</p>
            </div>
          ))}
          {phoneHref ? (
            <ActionLink
              href={phoneHref}
              label={locale === "bg" ? "Обади се / Резервирай" : "Call / Reserve"}
              tracking={buildActionTracking({
                kind: "phone",
                locale,
                location: "where_to_eat_faq",
                label: locale === "bg" ? "Обади се / Резервирай" : "Call / Reserve",
                target: phoneHref
              })}
            />
          ) : null}
        </article>
      </section>
    </main>
  );
}
