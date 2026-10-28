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
  // `was` is the slide fading out, kept mounted until its fade ends
  const [{ i, was }, setShow] = useState({ i: 0, was: 0 });
  const [paused, setPaused] = useState(false);
  const touch = useRef<number | null>(null);
  const n = slides.length;
  const show = useCallback((k: number) => setShow((s) => (k === s.i ? s : { i: k, was: s.i })), []);
  const go = useCallback((d: number) => setShow((s) => ({ i: (s.i + d + n) % n, was: s.i })), [n]);
  // Only the slide on screen, the one fading out and the next one hold a photo, so a
  // crossfade never decodes or paints six large images at once.
  const live = (k: number) => k === i || k === was || k === (i + 1) % n;

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
            {live(k) && <Image src={s.src} alt={s.alt} fill sizes="(max-width: 1280px) 92vw, 1170px" quality={60} style={{ objectFit: "cover" }} />}
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
          <button key={s.src} type="button" aria-label={`${k + 1} ${labels.of} ${n}`} aria-current={k === i} onClick={() => show(k)} />
        ))}
      </div>
    </div>
  );
}
