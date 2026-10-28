"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import AptName from "./AptName";
import { getDict } from "@/i18n";
import type { Locale } from "@/i18n/config";
import type { Landmark, Place, Way } from "@/lib/apartments";

type Props = {
  lang: Locale;
  places: Place[];
  landmarks: readonly Landmark[];
  /** an apartment page: its pin leads, the others step back */
  focus?: string;
};

type Slot = { id: string; el: HTMLElement; landmark?: Landmark };

/**
 * Where the apartments are. The frame and the list below it render on the
 * server; the map itself (MapLibre on OpenFreeMap tiles) loads only when the
 * frame comes near the viewport, into a box that already has its final size.
 * Every pin and every list row is a link to Google Maps directions; the
 * landmarks are quiet names for orientation, never links.
 */
export default function LocationMap({ lang, places, landmarks, focus }: Props) {
  const t = getDict(lang).map;
  const frame = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"waiting" | "ready" | "failed">("waiting");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [active, setActive] = useState<string | null>(null);

  const focused = places.find((p) => p.apartments.some((a) => a.slug === focus));
  const listed = focused ? [focused] : places;

  useEffect(() => {
    const box = frame.current;
    const target = canvas.current;
    if (!box || !target) return;
    let handle: { remove: () => void } | null = null;
    let gone = false;

    const start = async () => {
      try {
        const { mount } = await import("./map/mount");
        if (gone) return;
        const framed = frameOn(places, focused, landmarks);
        // the landmarks these doors have a distance cue for: walks are always framed, drives when there is room
        const reached = (by: Way["by"]) => landmarks.filter((l) => framed.some((p) => p.ways.some((w) => w.to === l.id && w.by === by)));
        const centre = landmarks.filter((l) => l.id === "centre");
        const m = mount({
          container: target,
          fit: [...framed, ...centre, ...reached("foot")],
          fitWide: reached("car"),
          reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
          onError: () => setStatus("failed"),
          locale: {
            "NavigationControl.ZoomIn": t.zoomIn,
            "NavigationControl.ZoomOut": t.zoomOut,
            "CooperativeGesturesHandler.WindowsHelpText": t.gestureCtrl,
            "CooperativeGesturesHandler.MacHelpText": t.gestureMac,
            "CooperativeGesturesHandler.MobileHelpText": t.gestureTouch,
            "Map.Title": t.region,
          },
        });
        handle = m;
        const anchor = (p: { lat: number; lng: number }) => {
          const el = document.createElement("div");
          el.className = "pin-anchor";
          m.addMarker(el, p);
          return el;
        };
        // landmarks first, so an apartment pin always paints above a landmark name
        const next: Slot[] = [
          ...landmarks.map((l) => ({ id: `lm-${l.id}`, el: anchor(l), landmark: l })),
          ...places.map((p) => ({ id: p.id, el: anchor(p) })),
        ];
        // small landmarks wait for the zoom at which they have room
        const sync = () => {
          const z = m.map.getZoom();
          for (const s of next) if (s.landmark) s.el.classList.toggle("is-hidden", z < s.landmark.minZoom);
        };
        sync();
        m.map.on("zoom", sync);
        setSlots(next);
        m.map.once("load", () => setStatus((s) => (s === "failed" ? s : "ready")));
      } catch {
        setStatus("failed");
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        void start();
      },
      { rootMargin: "500px 0px" },
    );
    io.observe(box);
    return () => {
      gone = true;
      io.disconnect();
      handle?.remove();
    };
    // places and landmarks come from the server and do not change while mounted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const km = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 });
  const distance = (d: number) => (d < 1 ? `${Math.round(d * 10) * 100} m` : `${km.format(d)} km`);
  const names = (p: Place) => new Intl.ListFormat(lang, { type: "conjunction" }).format(p.apartments.map((a) => a.name));
  const address = (p: Place) => (p.address.postalCode ? `${p.address.streetAddress}, ${p.address.locality}` : `${p.address.streetAddress}, ${t.westSibiu}`);
  const cue = (w: Way) => t.way(distance(w.km), w.minutes, w.by, w.to);
  const dot = (p: Place) =>
    p.apartments.length === 1 || focused === p
      ? (p.apartments.find((a) => a.slug === focus) ?? p.apartments[0]).accent
      : `conic-gradient(${p.apartments.map((a, i, all) => `${a.accent} ${(i / all.length) * 360}deg ${((i + 1) / all.length) * 360}deg`).join(", ")})`;

  return (
    <div className={`locmap ${focused ? "is-single" : ""}`}>
      <div ref={frame} className="locmap-frame" data-status={status} role="region" aria-label={t.region}>
        <div ref={canvas} className="locmap-canvas" />
        {status !== "ready" ? (
          <p className="locmap-note" aria-live="polite">
            {status === "failed" ? t.failed : <span className="sr-only">{t.loading}</span>}
          </p>
        ) : null}
      </div>

      <ul className="locmap-list">
        {listed.map((p) => (
          <li key={p.id}>
            <a
              className={`locmap-row ${active === p.id ? "is-active" : ""}`}
              href={p.href}
              target="_blank"
              rel="noopener"
              aria-label={`${t.directionsTo(names(p))}. ${p.ways.map(cue).join(". ")}.`}
              onMouseEnter={() => setActive(p.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(p.id)}
              onBlur={() => setActive(null)}
            >
              <span className="locmap-dot" style={{ background: dot(p) }} aria-hidden="true" />
              <span className="locmap-names">
                {p.apartments
                  .filter((a) => !focused || a.slug === focus)
                  .map((a) => (
                    <span key={a.slug} style={{ fontFamily: `var(--font-${a.slug}), var(--serif)`, color: a.accent }}>
                      <AptName slug={a.slug} name={a.name} />
                    </span>
                  ))}
              </span>
              <span className="locmap-addr">{address(p)}</span>
              <span className="locmap-cues">
                {p.ways.map((w) => (
                  <span key={w.to} className="locmap-cue">{cue(w)}</span>
                ))}
              </span>
              <span className="locmap-go">
                {t.directions} <Arrow />
              </span>
            </a>
          </li>
        ))}
      </ul>

      {slots.map((s) => {
        if (s.landmark) {
          const [name, sub] = t.landmarks[s.landmark.id] ?? [];
          return createPortal(
            <span className={`landmark landmark-${s.landmark.id} ${"labelAbove" in s.landmark ? "is-above" : ""}`} aria-hidden="true">
              <span className="landmark-mark" />
              <span className="landmark-name">
                {name}
                {sub ? <small>{sub}</small> : null}
              </span>
            </span>,
            s.el,
            s.id,
          );
        }
        const p = places.find((x) => x.id === s.id)!;
        const faded = !!focused && focused !== p;
        return createPortal(
          <a
            className={`pin ${faded ? "is-faded" : ""} ${active === p.id ? "is-active" : ""}`}
            href={p.href}
            target="_blank"
            rel="noopener"
            aria-label={t.directionsTo(names(p))}
            onMouseEnter={() => setActive(p.id)}
            onMouseLeave={() => setActive(null)}
          >
            <span className="pin-card">
              {p.apartments.map((a) => (
                <span
                  key={a.slug}
                  className={`pin-name ${focus && focus !== a.slug ? "is-other" : ""}`}
                  style={{ fontFamily: `var(--font-${a.slug}), var(--serif)`, ["--pin-accent" as string]: a.accent }}
                >
                  <AptName slug={a.slug} name={a.name} />
                </span>
              ))}
              <span className="pin-go">
                {t.directions} <Arrow />
              </span>
            </span>
            <span className="pin-stem" />
            <span className="pin-dot" style={{ background: dot(p) }} />
          </a>,
          s.el,
          s.id,
        );
      })}
    </div>
  );
}

type Point = { lat: number; lng: number };

/** Squared distance on a local flat projection: enough to compare a few points in one city. */
const far = (a: Point, b: Point) => ((a.lat - b.lat) ** 2 + ((a.lng - b.lng) * Math.cos((a.lat * Math.PI) / 180)) ** 2);

/**
 * Which doors the map frames: all of them on the home page; on an apartment
 * page its own, plus any other door nearer Piața Mare (so it costs no zoom
 * and is never cut in half at the edge). The landmarks each framed door has
 * a distance cue for are framed with it.
 */
function frameOn(places: Place[], focused: Place | undefined, landmarks: readonly Landmark[]) {
  if (!focused) return places;
  const centre = landmarks.find((l) => l.id === "centre")!;
  const reach = far(focused, centre);
  return places.filter((p) => p === focused || far(p, centre) <= reach);
}

function Arrow() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
      <path d="M3 9 9 3M4.5 3H9v4.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
