import { ActionLink } from "@/components/action-link";
import { getBusinessProfileData, getEnPrimaryActions } from "@/lib/business-profile-module";
import { buildActionTracking } from "@/lib/tracking";

type TouristAudience = "italian" | "spanish" | "greek";

const touristConfigs: Record<
  TouristAudience,
  {
    eyebrow: string;
    title: string;
    lead: string;
    highlights: Array<{ title: string; text: string }>;
    checklist: string[];
    reassurance: string[];
  }
> = {
  italian: {
    eyebrow: "Italian visitors",
    title: "A friendly Sofia restaurant for Italian visitors",
    lead:
      "A cozy place in central Sofia for Italian visitors, with a secret garden, craft beer, vegetarian options, and an English-speaking team.",
    highlights: [
      {
        title: "Central and easy to find",
        text: "Slavyanska 23 stays visible from the first screen so the restaurant is clearly anchored in central Sofia."
      },
      {
        title: "Menu in English",
        text: "Open the menu from your phone and check seasonal dishes, allergens, and vegetarian-friendly choices before ordering."
      },
      {
        title: "Comfort and friendliness",
        text: "The garden and warm dining rooms make the restaurant feel easy and relaxed after exploring Sofia."
      }
    ],
    checklist: [
      "Open the menu first if you want to review the spring dishes.",
      "Check reservations if you want the fastest route to the current booking channel.",
      "Use directions for the most accurate route to Slavyanska 23."
    ],
    reassurance: [
      "Vegetarian-friendly choices are easy to find in the menu.",
      "The page is built to feel welcoming for international visitors.",
      "The key actions stay one or two taps away on mobile."
    ]
  },
  spanish: {
    eyebrow: "Spanish visitors",
    title: "A welcoming Sofia restaurant for Spanish visitors",
    lead:
      "A welcoming restaurant near Sofia's center with a hidden garden, slow-cooked meats, vegetarian dishes, and English-speaking staff.",
    highlights: [
      {
        title: "Easy central stop",
        text: "We are close to the National Theatre, making us an easy dinner stop after a walk through the city."
      },
      {
        title: "Menu confidence",
        text: "The HTML menu makes it easier to scan dishes, allergens, and vegetarian-friendly options from a phone."
      },
      {
        title: "Simple next step",
        text: "Open the menu, call to reserve, or get directions to Slavyanska 23 when you are ready."
      }
    ],
    checklist: [
      "Review the menu if you want to compare dishes before visiting.",
      "Open directions when you are ready to head toward central Sofia.",
      "Use the reservations page to see the current booking setup."
    ],
    reassurance: [
      "Vegetarian options are not hidden deep in the site structure.",
      "Friendly service is part of the experience.",
      "The central Sofia location remains visible across the page."
    ]
  },
  greek: {
    eyebrow: "Greek visitors",
    title: "A central Sofia restaurant for Greek visitors",
    lead:
      "A warm Sofia restaurant for Greek visitors, with a central location, genuine hospitality, vegetarian options, and an English menu.",
    highlights: [
      {
        title: "Location clarity",
        text: "The page ties the brand directly to Slavyanska 23 so the restaurant is easy to place within Sofia."
      },
      {
        title: "Friendly service",
        text: "Our team speaks English and can help with the menu, directions, or a reservation."
      },
      {
        title: "Useful from mobile",
        text: "Visitors can get from discovery to directions or reservations quickly on a phone."
      }
    ],
    checklist: [
      "Start with the menu to check the current seasonal dishes.",
      "Open directions when you are ready to route to the restaurant.",
      "Use the reservations page if you want the current booking option."
    ],
    reassurance: [
      "Vegetarian-friendly choices are already part of the menu content.",
      "The page is intentionally simple and welcoming.",
      "The most important actions remain easy to reach on mobile."
    ]
  }
};

type EnglishTouristLandingPageProps = {
  audience: TouristAudience;
};

export async function EnglishTouristLandingPage({ audience }: EnglishTouristLandingPageProps) {
  const businessProfile = await getBusinessProfileData();
  const config = touristConfigs[audience];
  const primaryActions = getEnPrimaryActions(businessProfile);
  const heroActions = [
    { href: "/en/menu", label: "Menu", kind: "menu" as const, external: false },
    { href: "/en/reservations", label: "Reservations", kind: "reservations" as const, external: false },
    { href: businessProfile.mapUrl, label: "Directions", kind: "directions" as const, external: true }
  ];

  return (
    <main className="page-shell">
      <section className="page-hero">
        <p className="eyebrow">{config.eyebrow}</p>
        <h1>{config.title}</h1>
        <p className="page-lead">{config.lead}</p>

        <div className="page-tags" aria-label="Visitor page highlights">
          <span>{businessProfile.address.en}</span>
          <span>{businessProfile.area.en}</span>
          <span>Vegetarian options</span>
          <span>Friendly service</span>
        </div>

        <div className="actions">
          {heroActions.map((action) => (
            <ActionLink
              key={action.href}
              href={action.href}
              label={action.label}
              external={action.external}
              tracking={buildActionTracking({
                kind: action.kind,
                locale: "en",
                location: "tourist_page_hero",
                label: action.label,
                target: action.href,
                external: action.external
              })}
            />
          ))}
        </div>
      </section>

      <section className="page-grid page-grid-three">
        {config.highlights.map((item) => (
          <article key={item.title} className="page-card">
            <p className="page-card-label">{item.title}</p>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="page-grid page-grid-two">
        <article className="page-card">
          <p className="page-card-label">Useful first steps</p>
          <h2>What the visitor can do next</h2>
          <ol className="page-list page-list-numbered">
            {config.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>

        <article className="page-card">
          <p className="page-card-label">Reassurance</p>
          <h2>Why the page is built this way</h2>
          <ul className="page-list">
            {config.reassurance.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <nav className="mobile-quickbar" aria-label="Quick actions">
        {primaryActions.map((action) => (
          <ActionLink
            key={action.href}
            href={action.href}
            label={action.label}
            className="mobile-quickbar-link"
            external={Boolean(action.external)}
            tracking={buildActionTracking({
              kind: action.kind,
              locale: "en",
              location: "mobile_quickbar",
              label: action.label,
              target: action.href,
              external: Boolean(action.external)
            })}
          />
        ))}
      </nav>
    </main>
  );
}
