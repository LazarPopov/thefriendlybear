"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent
} from "react";

export type FoodMarqueeImage = {
  src: string;
  alt: string;
};

type FoodMarqueeProps = {
  images: readonly FoodMarqueeImage[];
  ariaLabel: string;
  sizes: string;
  imageWidth?: number;
  imageHeight?: number;
  priorityFirst?: boolean;
};

type FoodMarqueeStyle = CSSProperties & {
  "--food-manual-offset"?: string;
};

export function FoodMarquee({
  images,
  ariaLabel,
  sizes,
  imageWidth = 420,
  imageHeight = 315,
  priorityFirst = false
}: FoodMarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [manualIndex, setManualIndex] = useState<number | null>(null);
  const [manualOffset, setManualOffset] = useState(0);

  const renderedImages = images.length > 1 ? [...images, ...images] : [...images];

  const centerCard = useCallback((index: number) => {
    const marquee = marqueeRef.current;

    if (!marquee) {
      return;
    }

    const cards = marquee.querySelectorAll<HTMLElement>("[data-food-card]");
    const card = cards[index];

    if (!card) {
      return;
    }

    const targetOffset = card.offsetLeft - (marquee.clientWidth - card.offsetWidth) / 2;
    setManualOffset(Math.max(0, targetOffset));
  }, []);

  const advance = useCallback(() => {
    if (images.length === 0) {
      return;
    }

    setManualIndex((currentIndex) => {
      const nextIndex = currentIndex === null ? 1 % images.length : (currentIndex + 1) % images.length;
      return nextIndex;
    });
  }, [images.length]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      advance();
    },
    [advance]
  );

  useEffect(() => {
    if (manualIndex === null) {
      return;
    }

    const activeIndex = manualIndex;

    centerCard(activeIndex);

    function handleResize() {
      centerCard(activeIndex);
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [centerCard, manualIndex]);

  if (renderedImages.length === 0) {
    return null;
  }

  const className = `brand-marquee brand-marquee-interactive${manualIndex === null ? "" : " brand-marquee-manual"}`;
  const style: FoodMarqueeStyle = {
    "--food-manual-offset": `${manualOffset}px`
  };

  return (
    <div
      ref={marqueeRef}
      className={className}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={advance}
      onKeyDown={handleKeyDown}
      style={style}
    >
      <div className="brand-marquee-track">
        {renderedImages.map((image, index) => (
          <article
            key={`${image.src}-${index}`}
            className="food-card"
            aria-hidden={index >= images.length}
            data-food-card
          >
            <Image
              src={image.src}
              alt={index < images.length ? image.alt : ""}
              width={imageWidth}
              height={imageHeight}
              className="food-card-image"
              sizes={sizes}
              priority={priorityFirst && index === 0}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
