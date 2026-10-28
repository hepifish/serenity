"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Photo = { src: string; w: number; h: number; alt: string };

/** Seven photos in a mosaic, every photo in the lightbox. Arrows, Esc, swipe. */
export default function Gallery({ photos, moreLabel }: { photos: Photo[]; moreLabel: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const touch = useRef<number | null>(null);
  const n = photos.length;
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + n) % n)), [n]);

  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", key);
    };
  }, [open, go]);

  const shown = photos.slice(0, 7);
  return (
    <>
      <div className="gallery">
        {shown.map((p, i) => (
          <button key={p.src} type="button" onClick={() => setOpen(i)} className={i === 6 && n > 7 ? "more" : ""} aria-label={p.alt}>
            <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes={i === 0 ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 50vw, 20vw"} />
            {i === 6 && n > 7 ? <span>{moreLabel}</span> : null}
          </button>
        ))}
      </div>
      {open !== null ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={photos[open].alt}
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current === null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            touch.current = null;
          }}
        >
          <div className="lightbox-top">
            <span>{open + 1} / {n}</span>
            <button type="button" className="icon-btn" onClick={() => setOpen(null)} aria-label="Close" autoFocus>
              <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="lightbox-stage" onClick={() => setOpen(null)}>
            <Image key={photos[open].src} src={photos[open].src} alt={photos[open].alt} width={photos[open].w} height={photos[open].h} sizes="100vw" onClick={(e) => e.stopPropagation()} />
            <button type="button" className="icon-btn prev" onClick={(e) => (e.stopPropagation(), go(-1))} aria-label="Previous photo">
              <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button type="button" className="icon-btn next" onClick={(e) => (e.stopPropagation(), go(1))} aria-label="Next photo">
              <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
          <p className="lightbox-caption">{photos[open].alt}</p>
        </div>
      ) : null}
    </>
  );
}
