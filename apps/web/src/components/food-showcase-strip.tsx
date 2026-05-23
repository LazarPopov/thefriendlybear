import { FoodMarquee } from "@/components/food-marquee";
import type { SiteLocale } from "@/lib/site";
import { foodGalleryImages } from "@/lib/venue-gallery-images";

type FoodShowcaseLocale = SiteLocale | "it" | "es" | "el" | "de" | "ro" | "en-gb";

type FoodShowcaseStripProps = {
  locale: FoodShowcaseLocale;
};

const showcaseCopy: Record<
  FoodShowcaseLocale,
  {
    eyebrow: string;
    title: string;
    intro: string;
  }
> = {
  bg: {
    eyebrow: "Ястия",
    title: "Няколко акцента от кухнята",
    intro: "Още преди пълното меню посетителят вижда как изглежда храната и какъв тип място е това."
  },
  en: {
    eyebrow: "Food",
    title: "A quick look at the kitchen",
    intro: "Visitors can understand the food mood early, before opening the full menu."
  },
  it: {
    eyebrow: "Piatti",
    title: "Uno sguardo veloce alla cucina",
    intro: "Prima ancora di aprire il menu completo, il visitatore capisce subito il tono dei piatti."
  },
  es: {
    eyebrow: "Platos",
    title: "Una mirada rápida a la cocina",
    intro: "Antes de abrir el menú completo, el visitante ya percibe el estilo de la comida."
  },
  el: {
    eyebrow: "Πιάτα",
    title: "Μια γρήγορη ματιά στην κουζίνα",
    intro: "Πριν ανοίξει το πλήρες μενού, ο επισκέπτης καταλαβαίνει αμέσως τον χαρακτήρα του φαγητού."
  },
  de: {
    eyebrow: "Essen",
    title: "Ein kurzer Blick in die Küche",
    intro: "Noch vor der ganzen Speisekarte wird klar, welche Art von Essen und Stimmung Sie erwartet."
  },
  ro: {
    eyebrow: "Mâncare",
    title: "O privire rapidă în bucătărie",
    intro: "Înainte de meniul complet, vizitatorii înțeleg rapid stilul preparatelor și atmosfera locului."
  },
  "en-gb": {
    eyebrow: "Food",
    title: "A quick look at the kitchen",
    intro: "Visitors can understand the food mood early, before opening the full menu."
  }
};

export function FoodShowcaseStrip({ locale }: FoodShowcaseStripProps) {
  const copy = showcaseCopy[locale];

  return (
    <section className="page-card food-showcase-strip">
      <div className="food-showcase-copy">
        <p className="page-card-label">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.intro}</p>
      </div>

      <FoodMarquee
        images={foodGalleryImages}
        ariaLabel="Next food photo"
        sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 300px"
      />
    </section>
  );
}
