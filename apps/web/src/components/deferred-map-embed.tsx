"use client";

import { useState } from "react";

type DeferredMapEmbedProps = {
  src: string;
  title: string;
  loadLabel: string;
  mapPinLabel?: string;
};

export function DeferredMapEmbed({ src, title, loadLabel, mapPinLabel = "Map" }: DeferredMapEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (isLoaded) {
    return (
      <iframe
        className="home-visit-map-frame"
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-scripts allow-same-origin allow-popups"
        title={title}
      />
    );
  }

  return (
    <div className="home-visit-map-placeholder">
      <span aria-hidden="true" className="home-visit-map-pin">
        {mapPinLabel}
      </span>
      <button type="button" className="home-visit-map-load" onClick={() => setIsLoaded(true)}>
        {loadLabel}
      </button>
    </div>
  );
}
