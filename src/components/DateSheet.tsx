"use client";

import { useEffect, useRef } from "react";
import RangeCalendar from "./RangeCalendar";
import type { ISODate } from "@/lib/dates";
import { getDict } from "@/i18n";
import type { Locale } from "@/i18n/config";

type Props = {
  open: boolean;
  onClose: () => void;
  lang: Locale;
  title: string;
  today: ISODate;
  maxDate: ISODate;
  checkIn: ISODate | null;
  checkOut: ISODate | null;
  onChange: (a: ISODate | null, b: ISODate | null) => void;
  busy?: Set<ISODate>;
  prices?: Map<ISODate, number>;
  minNights?: number | ((arrival: ISODate) => number);
  limitFor?: (checkIn: ISODate) => ISODate | null;
  footer?: React.ReactNode;
};

/** The calendar in a dialog: centred on desktop, a bottom sheet on a phone. */
export default function DateSheet({ open, onClose, lang, title, footer, ...cal }: Props) {
  const t = getDict(lang).search;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", esc);
      prev?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  const wide = typeof window !== "undefined" && window.matchMedia("(min-width: 700px)").matches;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <p className="display h3" style={{ fontSize: "1.6rem" }}>{title}</p>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t.done}>
            <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <RangeCalendar
          locale={lang}
          months={wide ? 2 : 1}
          labels={{ prev: t.prev, next: t.next, checkIn: t.pickArrival, checkOut: t.pickDeparture, minNights: t.minNights }}
          {...cal}
        />
        <div className="sheet-foot">
          <button type="button" className="link" style={{ background: "none", border: 0, cursor: "pointer" }} onClick={() => cal.onChange(null, null)}>
            {t.clear}
          </button>
          {footer ?? (
            <button type="button" className="btn" onClick={onClose} disabled={!cal.checkIn || !cal.checkOut}>
              {t.done}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
