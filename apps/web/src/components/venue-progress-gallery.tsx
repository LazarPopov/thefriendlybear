"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import { ActionLink } from "@/components/action-link";
import type { SiteLocale } from "@/lib/site";

type GalleryLocale = SiteLocale | "it" | "es" | "el";

export type VenueGalleryImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type VenueGalleryGroup = {
  id: string;
  label: string;
  title?: string;
  intro?: string;
  images: VenueGalleryImage[];
};

type VenueProgressGalleryProps = {
  locale: GalleryLocale;
  eyebrow: string;
  title: string;
  intro: string;
  groups: VenueGalleryGroup[];
  directionsHref: string;
  callHref: string | null;
};

const clickDelayMs = 720;
const bearReactionEmoji = "\uD83D\uDC3B";
const galleryReactionEmojis = ["\u2764\uFE0F", "\uD83D\uDE0D", "\uD83D\uDC4D", "\u2728", bearReactionEmoji];

function vibrateForBearReaction(emoji: string) {
  if (emoji !== bearReactionEmoji || typeof navigator === "undefined" || !navigator.vibrate) return;
  navigator.vibrate([80, 35, 130]);
}

const galleryUiCopy: Record<
  GalleryLocale,
  {
    previousAria: string;
    nextAria: string;
    restartAria: string;
    finalEyebrow: string;
    finalTitle: string;
    finalText: string;
    directions: string;
    callToReserve: string;
  }
> = {
  bg: {
    previousAria: "Предишна снимка",
    nextAria: "Следваща снимка",
    restartAria: "Започни отначало",
    // OLD TEXT:
    // finalEyebrow: "Нека оставим нещо и на въображението",
    // finalTitle: "Ела в Бърлогата на добрия вкус",
    // finalText: "Останалото е най-добре да се усети на живо. Влез, отпусни се и остави мястото да довърши историята.",
    
    // NEW TEXT:
    finalEyebrow: "Любопитството е убило котката...",
    finalTitle: "Ако искаш да си умреш от кеф",
    finalText: "Ела в бърлогата на добрия вкус",
    
    directions: "Как да стигнете",
    callToReserve: "Обади се за резервация"
  },
  en: {
    previousAria: "Previous image",
    nextAria: "Next image",
    restartAria: "Restart gallery",
    finalEyebrow: "Let's leave something to the imagination",
    finalTitle: "Come to the den of the good taste",
    finalText: "The rest is better experienced in person. Come in, relax and enjoy.",
    directions: "How to get there",
    callToReserve: "Call for reservation"
  },
  it: {
    previousAria: "Foto precedente",
    nextAria: "Foto successiva",
    restartAria: "Ricomincia la galleria",
    finalEyebrow: "Lasciamo qualcosa all'immaginazione",
    finalTitle: "Venite nella tana del buon gusto",
    finalText: "Il resto si scopre meglio dal vivo. Entrate, rilassatevi e godetevi l'atmosfera.",
    directions: "Indicazioni",
    callToReserve: "Chiama per prenotare"
  },
  es: {
    previousAria: "Foto anterior",
    nextAria: "Foto siguiente",
    restartAria: "Reiniciar galeria",
    finalEyebrow: "Dejemos algo a la imaginacion",
    finalTitle: "Ven a la guarida del buen gusto",
    finalText: "Lo demas se disfruta mejor en persona. Entra, relajate y disfruta.",
    directions: "Indicaciones",
    callToReserve: "Llama para reservar"
  },
  el: {
    previousAria: "Προηγούμενη εικόνα",
    nextAria: "Επόμενη εικόνα",
    restartAria: "Ξεκινήστε ξανά",
    finalEyebrow: "Ας αφήσουμε κάτι στη φαντασία",
    finalTitle: "Ελάτε στη φωλιά της καλής γεύσης",
    finalText: "Τα υπόλοιπα αξίζουν περισσότερο από κοντά. Περάστε, χαλαρώστε και απολαύστε το.",
    directions: "Οδηγίες",
    callToReserve: "Καλέστε για κράτηση"
  }
};

const galleryPolaroidCaptions: Record<GalleryLocale, string[]> = {
  bg: [
    "Вечер в тайната градина",
    "Студена бира под лампичките",
    "Тихо място в сърцето на София",
    "До камината след работа",
    "Дълъг разговор в бърлогата",
    "Уютът си има адрес"
  ],
  en: [
    "Evening in the secret garden",
    "Cold beer under the lights",
    "A quiet spot in the heart of Sofia",
    "By the fireplace after work",
    "A long talk in the den",
    "Cozy has an address"
  ],
  it: [
    "Sera nel giardino segreto",
    "Birra fredda sotto le luci",
    "Un angolo tranquillo nel cuore di Sofia",
    "Accanto al camino",
    "Una lunga chiacchierata",
    "Il calore ha un indirizzo"
  ],
  es: [
    "Noche en el jardin secreto",
    "Cerveza fria bajo las luces",
    "Un rincon tranquilo en el centro de Sofia",
    "Junto a la chimenea",
    "Una larga conversacion",
    "Lo acogedor tiene direccion"
  ],
  el: [
    "Βράδυ στον κρυφό κήπο",
    "Κρύα μπίρα κάτω από τα φώτα",
    "Μια ήσυχη γωνιά στο κέντρο της Σόφιας",
    "Δίπλα στο τζάκι",
    "Μια μεγάλη κουβέντα",
    "Η ζεστασιά έχει διεύθυνση"
  ]
};

const galleryReviewCopy: Record<
  GalleryLocale,
  Array<{
    eyebrow: string;
    quote: string;
    author: string;
    meta: string;
  }>
> = {
  bg: [
    { eyebrow: "Отзив от Google", quote: "Един от по-добрите ресторанти в София.", author: "Lazar Popov", meta: "5/5 · преди 1 година" },
    { eyebrow: "Отзив от Google", quote: "Страхотно място с топла атмосфера и наистина приветливо обслужване.", author: "J Moreno", meta: "5/5 · преди 1 месец" },
    { eyebrow: "Отзив от Google", quote: "Перфектно място с невероятно обслужване и страхотна храна.", author: "Viltė Čepulytė", meta: "5/5 · преди 2 месеца" },
    { eyebrow: "Отзив от Google", quote: "Дойдохме без резервация, а сервитьорът ни помогна с чудесна маса.", author: "Alice T", meta: "5/5 · преди 2 месеца" }
  ],
  en: [
    { eyebrow: "Review from Google", quote: "One of the better restaurants in Sofia.", author: "Lazar Popov", meta: "5/5 · a year ago" },
    { eyebrow: "Review from Google", quote: "A great place to visit if you are looking for a warm atmosphere and welcoming service.", author: "J Moreno", meta: "5/5 · a month ago" },
    { eyebrow: "Review from Google", quote: "Perfect place with amazing service and great food.", author: "Viltė Čepulytė", meta: "5/5 · 2 months ago" },
    { eyebrow: "Review from Google", quote: "We came in without a reservation, the waiter helped us to a great table.", author: "Alice T", meta: "5/5 · 2 months ago" }
  ],
  it: [
    { eyebrow: "Recensione da Google", quote: "Posto perfetto, servizio incredibile e ottimo cibo.", author: "Viltė Čepulytė", meta: "5/5 · 2 mesi fa" },
    { eyebrow: "Recensione da Google", quote: "Siamo arrivati senza prenotazione e il cameriere ci ha trovato un ottimo tavolo.", author: "Alice T", meta: "5/5 · 2 mesi fa" }
  ],
  es: [
    { eyebrow: "Resena de Google", quote: "Lugar perfecto, servicio increible y comida muy buena.", author: "Viltė Čepulytė", meta: "5/5 · hace 2 meses" },
    { eyebrow: "Resena de Google", quote: "Llegamos sin reserva y el camarero nos ayudo a encontrar una mesa estupenda.", author: "Alice T", meta: "5/5 · hace 2 meses" }
  ],
  el: [
    { eyebrow: "Κριτική από Google", quote: "Τέλειο μέρος με εξαιρετική εξυπηρέτηση και πολύ καλό φαγητό.", author: "Viltė Čepulytė", meta: "5/5 · πριν από 2 μήνες" },
    { eyebrow: "Κριτική από Google", quote: "Ήρθαμε χωρίς κράτηση και ο σερβιτόρος μας βοήθησε να βρούμε ένα πολύ καλό τραπέζι.", author: "Alice T", meta: "5/5 · πριν από 2 μήνες" }
  ]
};

function VenueGalleryCard({
  locale,
  group,
  directionsHref,
  callHref,
  activeIndex,
  onActiveIndexChange
}: {
  locale: GalleryLocale;
  group: VenueGalleryGroup;
  directionsHref: string;
  callHref: string | null;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}) {
  const ui = galleryUiCopy[locale];
  const polaroidCaptions = galleryPolaroidCaptions[locale];
  
  const [locked, setLocked] = useState(false);
  const [reactions, setReactions] = useState<{ id: number; emoji: string; x: number; y: number }[]>([]);
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const clickCountRef = useRef(0);
  
  const finalIndex = group.images.length;
  const index = activeIndex;
  const isFinalSlide = index === finalIndex;
  const captionOffset = group.id === "interior" ? 3 : 0;
  const polaroidCaption = group.images[index]?.caption ?? polaroidCaptions[(index + captionOffset) % polaroidCaptions.length];

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isFinalSlide) return;
    const scrollTimer = setTimeout(() => {
      stageRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
    return () => clearTimeout(scrollTimer);
  }, [isFinalSlide]);

  // Instant transition (used for keyboard or restart button)
  function goNext() {
    if (locked) return;
    setLocked(true);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    onActiveIndexChange(index >= finalIndex ? 0 : index + 1);
    
    timeoutRef.current = setTimeout(() => {
      setLocked(false);
    }, clickDelayMs);
  }

  // Unified click handler for both the stage and the arrow
  function handleEmojiClick(event: MouseEvent<HTMLElement>) {
    if (locked || isFinalSlide) return;
    
    // Stop event propagation so clicking the arrow doesn't fire the stage's click too
    event.stopPropagation();

    // Ensure we always calculate coordinates relative to the stage, even if arrow was clicked
    const stageEl = stageRef.current;
    if (!stageEl) return;

    const rect = stageEl.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const currentEmoji = galleryReactionEmojis[clickCountRef.current % galleryReactionEmojis.length];
    vibrateForBearReaction(currentEmoji);
    
    // Increment for the next click
    clickCountRef.current += 1;

    const id = Date.now();

    setReactions((prev) => [...prev, { id, emoji: currentEmoji, x, y }]);
    setLocked(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Wait for the emoji animation to transpire before going to next slide
    timeoutRef.current = setTimeout(() => {
      onActiveIndexChange(index >= finalIndex ? 0 : index + 1);
      setReactions((prev) => prev.filter((r) => r.id !== id));
      setLocked(false);
    }, 800); // 800ms matches the animation duration
  }

  function handleStageKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goNext();
    }
  }

  return (
    <article className="venue-gallery-card">
      <div className="venue-gallery-head">
        <p className="page-card-label">{group.label}</p>
        {group.title ? <h3>{group.title}</h3> : null}
        {group.intro ? <p>{group.intro}</p> : null}
      </div>

      <div
        ref={stageRef}
        className={`venue-gallery-stage ${locked ? "venue-gallery-stage-transitioning" : ""}`}
        role={isFinalSlide ? undefined : "button"}
        tabIndex={isFinalSlide ? -1 : 0}
        onClick={isFinalSlide ? undefined : handleEmojiClick}
        onKeyDown={isFinalSlide ? undefined : handleStageKeyDown}
      >
        {/* Render Floating Emojis */}
        {reactions.map((reaction) => (
          <span
            key={reaction.id}
            className="venue-gallery-reaction"
            style={
              {
                "--reaction-x": `${reaction.x}px`,
                "--reaction-y": `${reaction.y}px`
              } as CSSProperties
            }
          >
            {reaction.emoji}
          </span>
        ))}

        <div
          className={`venue-gallery-stage-cues ${isFinalSlide ? "venue-gallery-stage-cues-final" : ""}`}
        >
          <button
            type="button"
            className="venue-gallery-stage-arrow venue-gallery-stage-arrow-right"
            onClick={isFinalSlide ? (e) => { e.stopPropagation(); goNext(); } : handleEmojiClick}
            disabled={locked}
            aria-label={isFinalSlide ? ui.restartAria : ui.nextAria}
            title={isFinalSlide ? ui.restartAria : ui.nextAria}
          >
            {isFinalSlide ? "↺" : "→"}
          </button>
        </div>

        {isFinalSlide ? (
          <div className="venue-gallery-stage-inner venue-gallery-stage-inner-final venue-gallery-inner-safe-zone">
            <div className="venue-gallery-final-copy">
              
              <div className="venue-gallery-final-header">
                <p className="page-card-label">
                  {ui.finalEyebrow}
                </p>
              </div>

              <h3>{ui.finalTitle}</h3>
              <p>{ui.finalText}</p>
            </div>

            <img
              src="/icons/friendly_bear_logo.jpg"
              alt="The Friendly Bear Sofia logo"
              className="venue-gallery-final-brand"
            />
            
            <div className="actions venue-gallery-actions" onClick={(event) => event.stopPropagation()}>
              {callHref ? <ActionLink href={callHref} label={ui.callToReserve} /> : null}
              <ActionLink href={directionsHref} label={ui.directions} external />
            </div>
          </div>
        ) : (
          <div
            key={`${group.id}-${index}`}
            className={`venue-gallery-stage-inner venue-gallery-stage-inner-image venue-gallery-polaroid-tilt-${
              (index % 5) + 1
            }`}
          >
            <img
              src={group.images[index].src}
              alt={group.images[index].alt}
              className="venue-gallery-image"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
            />
            <div className="venue-gallery-polaroid-caption" aria-hidden="true">
              <span className="venue-gallery-polaroid-title">{polaroidCaption}</span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function VenueGalleryReview({ locale, index }: { locale: GalleryLocale; index: number; }) {
  const reviews = galleryReviewCopy[locale];
  const review = reviews[index % reviews.length];

  return (
    <aside className="venue-gallery-review" aria-label={review.eyebrow}>
      <div key={`${locale}-${index}`} className="venue-gallery-review-content">
        <p className="page-card-label">{review.eyebrow}</p>
        <p className="venue-gallery-review-stars" aria-label="5 stars">
          ★★★★★
        </p>
        <blockquote>“{review.quote}”</blockquote>
        <p className="venue-gallery-review-author">{review.author}</p>
        <p className="venue-gallery-review-meta">{review.meta}</p>
      </div>
    </aside>
  );
}

function VenueGalleryFeature({
  locale,
  group,
  directionsHref,
  callHref
}: {
  locale: GalleryLocale;
  group: VenueGalleryGroup;
  directionsHref: string;
  callHref: string | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isFinalSlide = activeIndex === group.images.length;

  return (
    <div className={`venue-progress-gallery-feature ${isFinalSlide ? "venue-progress-gallery-feature-final" : ""}`}>
      <VenueGalleryCard
        locale={locale}
        group={group}
        directionsHref={directionsHref}
        callHref={callHref}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
      />
      <VenueGalleryReview locale={locale} index={activeIndex} />
    </div>
  );
}

export function VenueProgressGallery({
  locale,
  eyebrow,
  title,
  intro,
  groups,
  directionsHref,
  callHref
}: VenueProgressGalleryProps) {
  const hasCopy = Boolean(eyebrow || title || intro);

  return (
    <section className="venue-progress-gallery">
      {hasCopy ? (
        <div className="venue-progress-gallery-copy">
          {eyebrow ? <p className="page-card-label">{eyebrow}</p> : null}
          {title ? <h2>{title}</h2> : null}
          {intro ? <p>{intro}</p> : null}
        </div>
      ) : null}

      <div className={`venue-progress-gallery-grid venue-progress-gallery-grid-${groups.length}`}>
        {groups.map((group, index) => (
          <div
            key={group.id}
            className={`venue-progress-gallery-block ${
              index > 0 ? "venue-progress-gallery-block-delayed" : ""
            }`}
          >
            <VenueGalleryFeature
              locale={locale}
              group={group}
              directionsHref={directionsHref}
              callHref={callHref}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
