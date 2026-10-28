"use client";

import { useEffect, useRef, useState } from "react";
import MorphLoader from "./MorphLoader";

const GRACE = 300; // ms: a quick answer never shows the wait at all (matches .morph-delay)

/**
 * The search's waiting state, right under the search bar: the morphing mark
 * and a few short lines that crossfade while the calendars are read. Only the
 * first line is announced; the rest are for the eye. On a phone the bar can
 * sit at the bottom of the screen, so once the wait shows it is nudged into view.
 */
export default function SearchPending({ lines }: { lines: string[] }) {
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setShown((n) => (n + 1) % lines.length), 1600);
    return () => clearInterval(id);
  }, [lines.length]);

  useEffect(() => {
    const id = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const { top, bottom } = el.getBoundingClientRect();
      if (top >= 0 && bottom <= innerHeight) return;
      const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "nearest" });
    }, GRACE);
    return () => clearTimeout(id);
  }, []);

  return (
    <div ref={ref} className="search-wait">
      <MorphLoader
        size={44}
        className="morph-inline"
        label={
          <>
            <span className="sr-only">{lines[0]}</span>
            <span className="pending-lines" aria-hidden="true">
              {lines.map((l, i) => (
                <span key={l} className={i === shown ? "on" : undefined}>
                  {l}
                </span>
              ))}
            </span>
          </>
        }
      />
    </div>
  );
}
