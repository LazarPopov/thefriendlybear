import Image from "next/image";
import type { SiteLocale } from "@/lib/site";

type GalleryLocale = SiteLocale | "it" | "es" | "el";

type TouristPhotoGalleryProps = {
  locale: GalleryLocale;
};

const gardenImages = [
  { src: "/images/garden_1.jpg", alt: "The Bear Garden at The Friendly Bear Sofia" },
  { src: "/images/garden_2.jpg", alt: "The Bear Terrace at The Friendly Bear Sofia" },
  { src: "/images/garden_3.jpg", alt: "View from the Den at The Friendly Bear Sofia" }
];

const interiorImages = [
  { src: "/images/interior_1.jpg", alt: "Cozy Den at The Friendly Bear Sofia" },
  { src: "/images/interior_2.jpg", alt: "Table for Long Talks at The Friendly Bear Sofia" },
  { src: "/images/interior_3.jpg", alt: "The Colorful Corridor at The Friendly Bear Sofia" },
  { src: "/images/interior_4.jpg", alt: "Bear Buddy at The Friendly Bear Sofia" },
  { src: "/images/interior_5.jpg", alt: "Cozy Evening at The Friendly Bear Sofia" }
];

const galleryCopy: Record<
  GalleryLocale,
  {
    eyebrow: string;
    title: string;
    intro: string;
    gardenLabel: string;
    interiorLabel: string;
  }
> = {
  bg: {
    eyebrow: "Atmosfera",
    title: "Gradina i ujutna vatrešna atmosfera",
    intro: "Snimkite podkrepyat dve od nai-silnite signalni tochki na myastoto: skritata gradina i topliya interior.",
    gardenLabel: "Gradina",
    interiorLabel: "Interior"
  },
  en: {
    eyebrow: "Atmosphere",
    title: "Garden setting and warm interior",
    intro: "These images reinforce two of the strongest first-impression signals for the venue: the hidden garden and the cozy indoor mood.",
    gardenLabel: "Garden",
    interiorLabel: "Interior"
  },
  it: {
    eyebrow: "Atmosfera",
    title: "Giardino riservato e interno accogliente",
    intro: "Queste immagini rafforzano due dei segnali piu forti del locale: il giardino nascosto e l'atmosfera calda all'interno.",
    gardenLabel: "Giardino",
    interiorLabel: "Interni"
  },
  es: {
    eyebrow: "Ambiente",
    title: "Jardin tranquilo e interior acogedor",
    intro: "Estas imagenes refuerzan dos de las senales mas fuertes del lugar: el jardin escondido y el ambiente calido del interior.",
    gardenLabel: "Jardin",
    interiorLabel: "Interior"
  },
  el: {
    eyebrow: "Ατμόσφαιρα",
    title: "Κήπος και ζεστό εσωτερικό",
    intro: "Αυτές οι εικόνες ενισχύουν δύο από τα πιο δυνατά πρώτα σήματα του χώρου: τον ήσυχο κήπο και τη ζεστή εσωτερική ατμόσφαιρα.",
    gardenLabel: "Κήπος",
    interiorLabel: "Εσωτερικό"
  }
};

export function TouristPhotoGallery({ locale }: TouristPhotoGalleryProps) {
  const copy = galleryCopy[locale];

  return (
    <section className="tourist-gallery">
      <div className="tourist-gallery-heading">
        <p className="page-card-label">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.intro}</p>
      </div>

      <div className="tourist-gallery-group">
        <div className="tourist-gallery-group-head">
          <p className="page-card-label">{copy.gardenLabel}</p>
        </div>

        <div className="tourist-gallery-featured">
          <article className="tourist-gallery-main">
            <Image
              src={gardenImages[0].src}
              alt={gardenImages[0].alt}
              width={960}
              height={720}
              className="tourist-gallery-image"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 620px"
            />
          </article>

          <div className="tourist-gallery-stack">
            {gardenImages.slice(1).map((image) => (
              <article key={image.src} className="tourist-gallery-side">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={720}
                  height={540}
                  className="tourist-gallery-image"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 300px"
                />
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="tourist-gallery-group">
        <div className="tourist-gallery-group-head">
          <p className="page-card-label">{copy.interiorLabel}</p>
        </div>

        <div className="tourist-gallery-grid">
          {interiorImages.map((image) => (
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
    </section>
  );
}
