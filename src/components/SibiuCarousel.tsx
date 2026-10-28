"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Slide = { src: string; w: number; h: number; alt: string; author: string; license: string; source: string };

/**
 * Sibiu, one wide frame at a time. Crossfades on its own every few seconds,
 * stops while the visitor is hovering, has focus inside, or prefers less
 * motion. Arrows, dots, swipe and the keyboard all move it.
 */
export default function SibiuCarousel({ slides, labels }: { slides: Slide[]; labels: { prev: string; next: string; photo: string; of: string } }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touch = useRef<number | null>(null);
  const n = slides.length;
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || still || n < 2) return;
    const id = setInterval(() => go(1), 6500);
    return () => clearInterval(id);
  }, [paused, go, n]);

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Sibiu"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => (e.key === "ArrowLeft" ? go(-1) : e.key === "ArrowRight" ? go(1) : null)}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <div className="carousel-frame">
        {slides.map((s, k) => (
          <figure key={s.src} className={`carousel-slide ${k === i ? "on" : ""}`} aria-hidden={k !== i} role="group" aria-roledescription="slide" aria-label={`${k + 1} ${labels.of} ${n}`}>
            <Image src={s.src} alt={s.alt} fill sizes="(max-width: 1280px) 100vw, 1280px" priority={k === 0} loading={k === 0 ? undefined : "lazy"} style={{ objectFit: "cover" }} />
            <figcaption>
              <span className="carousel-caption">{s.alt}</span>
              <a href={s.source} target="_blank" rel="noopener" tabIndex={k === i ? 0 : -1}>
                {labels.photo} {s.author} · {s.license}
              </a>
            </figcaption>
          </figure>
        ))}
        <button type="button" className="icon-btn prev" onClick={() => go(-1)} aria-label={labels.prev}>
          <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button type="button" className="icon-btn next" onClick={() => go(1)} aria-label={labels.next}>
          <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
      <div className="carousel-dots">
        {slides.map((s, k) => (
          <button key={s.src} type="button" aria-label={`${k + 1} ${labels.of} ${n}`} aria-current={k === i} onClick={() => setI(k)} />
        ))}
      </div>
    </div>
  );
}
