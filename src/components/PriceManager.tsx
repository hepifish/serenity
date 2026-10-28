"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addDays, eachNight, fromDate, isISODate, nightsBetween, toDate, type ISODate } from "@/lib/dates";
import { conflictsWith, nightRule, type NightRule, type Period, type PeriodKind } from "@/lib/price-rules";
import type { PriceBook } from "@/app/api/admin/prices/route";

/**
 * The price manager: one apartment at a time, a year of nights as twelve
 * strips, each night coloured by what prices it (base, a season, a special
 * date). Picking a range on the strip fills the form; the form's draft is
 * drawn on the strip before it is saved, so the effect is visible first.
 */

type Row = PriceBook["rows"][number];
type Draft = {
  id: number | null; // null = new
  kind: PeriodKind;
  label: string;
  first: string;
  last: string;
  yearly: boolean;
  price: string;
  weekend: string;
  min: string;
  apartments: string[];
};
type Toast = { text: string; tone: "ok" | "err"; undo?: Period };

const DRAFT_ID = -1;
// muted jewel tones for seasons, gold for special dates (see .pr-day in admin.css)
const SEASON_TONES = 6;

const fmt = {
  day: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }),
  dayYear: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }),
  long: new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }),
  month: new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" }),
  monthYear: new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" }),
};
const ron = (n: number) => new Intl.NumberFormat("en-GB").format(n);
const nightsWord = (n: number) => `${n} ${n === 1 ? "night" : "nights"}`;

function addMonths(first: ISODate, n: number): ISODate {
  const d = toDate(first);
  d.setUTCMonth(d.getUTCMonth() + n);
  return fromDate(d);
}
const monthEnd = (first: ISODate) => addDays(addMonths(first, 1), -1);

/** "10 – 12 Jul", "28 Nov – 3 Dec", with the year only when the period is dated. */
function span(first: ISODate, last: ISODate, yearly: boolean) {
  const end = (yearly ? fmt.day : fmt.dayYear).format(toDate(last));
  if (first === last) return end;
  const sameYear = yearly || first.slice(0, 4) === last.slice(0, 4);
  const start = first.slice(0, 7) === last.slice(0, 7) ? String(Number(first.slice(8))) : (sameYear ? fmt.day : fmt.dayYear).format(toDate(first));
  return `${start} – ${end}`;
}

const emptyDraft = (slug: string, kind: PeriodKind = "season"): Draft => ({
  id: null, kind, label: "", first: "", last: "", yearly: kind === "season", price: "", weekend: "", min: "", apartments: [slug],
});

function draftFrom(p: Period): Draft {
  return {
    id: p.id, kind: p.kind, label: p.label ?? "", first: p.first_night, last: p.last_night, yearly: p.yearly,
    price: String(p.price), weekend: p.weekend_price ? String(p.weekend_price) : "", min: p.min_nights ? String(p.min_nights) : "", apartments: [p.apartment],
  };
}

type DraftCheck = { period: Omit<Period, "apartment"> | null; problem: string | null };
function checkDraft(d: Draft): DraftCheck {
  const price = Number(d.price), weekend = d.weekend ? Number(d.weekend) : null, min = d.min ? Number(d.min) : null;
  if (!isISODate(d.first) || !isISODate(d.last)) return { period: null, problem: d.first || d.last ? "Pick the first and the last night." : null };
  if (d.last < d.first) return { period: null, problem: "The last night comes before the first." };
  if (d.yearly && nightsBetween(d.first, d.last) >= 366) return { period: null, problem: "A yearly period fits in one year." };
  if (!(price > 0)) return { period: null, problem: d.price ? "The price must be above 0." : null };
  if (min !== null && !(min >= 1 && min <= 30)) return { period: null, problem: "Minimum stay is 1 to 30 nights." };
  return {
    period: { id: d.id ?? DRAFT_ID, kind: d.kind, label: d.label.trim() || null, first_night: d.first, last_night: d.last, yearly: d.yearly, price, weekend_price: d.kind === "season" ? weekend : null, min_nights: min },
    problem: null,
  };
}

/** An apartment's periods with the draft in place of the one being edited. */
function withDraft(row: Row, draft: Draft, check: DraftCheck): Period[] {
  if (!check.period || !draft.apartments.includes(row.slug)) return row.periods;
  const p: Period = { ...check.period, id: DRAFT_ID, apartment: row.slug };
  return [p, ...row.periods.filter((x) => x.id !== draft.id)];
}

export default function PriceManager({ today }: { today: ISODate }) {
  const [book, setBook] = useState<PriceBook | null>(null);
  const [slug, setSlug] = useState<string>("");
  const [draft, setDraft] = useState<Draft>(emptyDraft(""));
  const [toast, setToast] = useState<Toast | null>(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState(0);

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/prices");
    if (r.status === 401) return location.assign("/admin/login");
    if (!r.ok) return setToast({ text: "Prices could not be loaded. Reload the page.", tone: "err" });
    const b: PriceBook = await r.json();
    setBook(b);
    setSlug((s) => s || b.rows[0]?.slug || "");
    setDraft((d) => (d.apartments.length && d.apartments[0] ? d : emptyDraft(b.rows[0]?.slug ?? "")));
  }, []);
  useEffect(() => void load(), [load]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), toast.undo ? 8000 : 3200);
    return () => clearTimeout(id);
  }, [toast]);

  const row = book?.rows.find((r) => r.slug === slug) ?? null;
  const check = useMemo(() => checkDraft(draft), [draft]);
  const rowsBySlug = useMemo(() => new Map(book?.rows.map((r) => [r.slug, r]) ?? []), [book]);

  /** Every target apartment's view of the draft: collisions, nights, prices. */
  const effects = useMemo(() => {
    if (!book || !check.period) return [];
    return draft.apartments.flatMap((a) => {
      const r = rowsBySlug.get(a);
      if (!r?.rate) return [];
      const p: Period = { ...check.period!, id: draft.id ?? DRAFT_ID, apartment: a };
      const periods = withDraft(r, draft, check);
      const nights = eachNight(draft.first as ISODate, addDays(draft.last as ISODate, 1)).map((n) => nightRule(r.rate!, periods, n));
      const busy = new Set(r.busy);
      return [{ row: r, conflicts: conflictsWith(p, r.periods), nights, overruled: nights.filter((n) => n.period?.id !== DRAFT_ID).length, booked: nights.filter((n) => busy.has(n.night)).length }];
    });
  }, [book, check, draft, rowsBySlug]);
  const blocked = effects.some((e) => e.conflicts.length);

  function pickTab(s: string) {
    setSlug(s);
    // a new draft follows the tab; an edit stays on its own apartment
    if (draft.id === null && draft.apartments.length <= 1) setDraft({ ...draft, apartments: [s] });
  }

  async function save() {
    if (!check.period || blocked || !draft.apartments.length) return;
    setSaving(true);
    const { id: _id, ...period } = check.period;
    const res = await fetch("/api/admin/prices", {
      method: draft.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft.id ? { id: draft.id, period } : { apartments: draft.apartments, period }),
    }).catch(() => null);
    setSaving(false);
    if (!res?.ok) {
      const body = res?.status === 409 ? await res.json().catch(() => null) : null;
      return setToast({ text: body?.conflicts?.length ? "Not saved: it overlaps a period saved meanwhile. The calendar is reloaded." : "Not saved. Check the fields and try again.", tone: "err" }), load();
    }
    const names = draft.apartments.map((a) => rowsBySlug.get(a)?.name).join(", ");
    setToast({ text: `Saved · ${period.label ?? (draft.kind === "season" ? "Season" : "Special date")} on ${names}`, tone: "ok" });
    setFlash((f) => f + 1);
    // keep the price, clear the dates: the next range at the same price is one pick away
    setDraft({ ...draft, id: null, first: "", last: "", apartments: draft.id ? [slug] : draft.apartments });
    load();
  }

  async function remove(p: Period) {
    const res = await fetch(`/api/admin/prices?id=${p.id}`, { method: "DELETE" }).catch(() => null);
    if (!res?.ok) return setToast({ text: "Not deleted. Try again.", tone: "err" });
    if (draft.id === p.id) setDraft(emptyDraft(slug, p.kind));
    setToast({ text: `Deleted · ${p.label ?? span(p.first_night, p.last_night, p.yearly)}`, tone: "ok", undo: p });
    load();
  }

  async function undo(p: Period) {
    const { id: _id, apartment, ...period } = p;
    const res = await fetch("/api/admin/prices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ apartments: [apartment], period }) }).catch(() => null);
    setToast(res?.ok ? { text: "Restored", tone: "ok" } : { text: "Could not restore: the dates are taken by another period now.", tone: "err" });
    load();
  }

  if (!book) return <p className="muted" style={{ padding: "2rem 0" }}>Loading prices…</p>;
  if (!row) return <p className="muted">No apartments to price.</p>;

  return (
    <div className="pr">
      <div className="pr-head">
        <h1 className="display h3">Prices</h1>
        <p className="muted">A special date wins over a season, a season wins over the base price. Sibiu&apos;s 2% tax and cleaning are added at checkout.</p>
      </div>

      <div className="pr-tabs" role="tablist" aria-label="Apartment">
        {book.rows.map((r) => (
          <button key={r.slug} role="tab" type="button" aria-selected={r.slug === slug} onClick={() => pickTab(r.slug)} style={{ ["--accent" as string]: r.accent }}>
            <i aria-hidden="true" /> {r.name}
          </button>
        ))}
      </div>

      <YearStrip
        key={slug}
        today={today}
        row={row}
        periods={withDraft(row, draft, check)}
        flash={flash}
        onPick={(first, last) => setDraft((d) => ({ ...d, first, last }))}
        range={draft.first && draft.last ? [draft.first, draft.last] : null}
      />

      <div className="pr-work">
        <PeriodForm
          draft={draft}
          setDraft={setDraft}
          rows={book.rows}
          check={check}
          effects={effects}
          saving={saving}
          onSave={save}
          onCancel={() => setDraft(emptyDraft(slug, draft.kind))}
          onEdit={(p) => (setSlug(p.apartment), setDraft(draftFrom(p)))}
        />
        <PeriodList row={row} today={today} editing={draft.id} onEdit={(p) => setDraft(draftFrom(p))} onDelete={remove} onSaved={(t) => (setToast(t), load())} />
      </div>

      {toast ? (
        <div className={`pr-toast ${toast.tone}`} role="status">
          <span>{toast.text}</span>
          {toast.undo ? <button type="button" onClick={() => (setToast(null), undo(toast.undo!))}>Undo</button> : null}
        </div>
      ) : null}
    </div>
  );
}

/* ───────── the year ───────── */

function YearStrip({ today, row, periods, flash, onPick, range }: {
  today: ISODate; row: Row; periods: Period[]; flash: number; range: [string, string] | null;
  onPick: (first: ISODate, last: ISODate) => void;
}) {
  const [offset, setOffset] = useState(0); // in years
  const [focus, setFocus] = useState<NightRule | null>(null);
  const anchor = useRef<[ISODate, ISODate] | null>(null);
  const [anchored, setAnchored] = useState<ISODate | null>(null);
  const start = addMonths(today.slice(0, 8) + "01", offset * 12);
  const months = Array.from({ length: 12 }, (_, i) => addMonths(start, i));
  const busy = useMemo(() => new Set(row.busy), [row.busy]);

  // a stable tone per season, by its order in the year
  const tone = useMemo(() => {
    const m = new Map<number, number>();
    periods.filter((p) => p.kind === "season" && p.id !== DRAFT_ID).sort((a, b) => a.first_night.slice(5).localeCompare(b.first_night.slice(5))).forEach((p, i) => m.set(p.id, i % SEASON_TONES));
    return m;
  }, [periods]);

  /** First pick starts a range, the second one closes it; tapping a month picks all of it. */
  function pick(first: ISODate, last: ISODate) {
    const a = anchor.current;
    if (a) {
      onPick(first < a[0] ? first : a[0], last > a[1] ? last : a[1]);
      anchor.current = null;
      setAnchored(null);
    } else {
      onPick(first, last);
      anchor.current = [first, last];
      setAnchored(first);
    }
  }

  const rate = row.rate;
  if (!rate) return <p className="notice err">{row.name} has no base price yet. Set one below.</p>;

  return (
    <section className="pr-year" aria-label={`${row.name}: prices for the year`} style={{ ["--accent" as string]: row.accent }}>
      <div className="pr-year-head">
        <button type="button" className="pr-arrow" onClick={() => setOffset(offset - 1)} disabled={offset === 0} aria-label="Previous 12 months">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <p>{fmt.monthYear.format(toDate(months[0]))} – {fmt.monthYear.format(toDate(months[11]))}</p>
        <button type="button" className="pr-arrow" onClick={() => setOffset(offset + 1)} disabled={offset >= 2} aria-label="Next 12 months">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      <div className={`pr-grid ${flash ? "flash" : ""}`} key={flash} onPointerLeave={() => setFocus(null)}>
        {months.map((m) => {
          const days = eachNight(m, addMonths(m, 1));
          return (
            <div className="pr-month" key={m}>
              <button type="button" className="pr-mlabel" onClick={() => pick(m, monthEnd(m))} aria-label={`Pick all of ${fmt.monthYear.format(toDate(m))}`}>
                {fmt.month.format(toDate(m))}
              </button>
              <div className="pr-days">
                {days.map((d) => {
                  const r = nightRule(rate, periods, d);
                  const p = r.period;
                  const cls = [
                    "pr-day",
                    p ? (p.id === DRAFT_ID ? "draft" : p.kind === "special" ? "special" : `s${tone.get(p.id) ?? 0}`) : "base",
                    d < today && "past",
                    busy.has(d) && "busy",
                    [5, 6].includes(toDate(d).getUTCDay()) && "we",
                    range && d >= range[0] && d <= range[1] && "sel",
                    anchored === d && "anchor",
                  ].filter(Boolean).join(" ");
                  return (
                    <button
                      key={d}
                      type="button"
                      className={cls}
                      onClick={() => pick(d, d)}
                      onPointerEnter={() => setFocus(r)}
                      onFocus={() => setFocus(r)}
                      aria-label={`${fmt.long.format(toDate(d))}, ${r.price} RON`}
                    >
                      <span>{r.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="pr-detail" aria-live="polite">
        {focus ? (
          <>
            <strong>{fmt.long.format(toDate(focus.night))}</strong> · {focus.price} RON · {focus.period ? (focus.period.id === DRAFT_ID ? "your draft" : focus.period.label ?? (focus.period.kind === "season" ? "season" : "special date")) : "base price"}
            {focus.minNights > 1 ? ` · min ${nightsWord(focus.minNights)}` : ""}
            {busy.has(focus.night) ? " · taken" : ""}
          </>
        ) : anchored ? (
          <>Now pick the last night, or another month to extend.</>
        ) : (
          <>Tap a month, or a first and a last night, to set a price for that range.</>
        )}
      </p>

      <ul className="pr-legend" aria-label="Legend">
        <li><i className="pr-day base" /> base</li>
        <li><i className="pr-day s0" /><i className="pr-day s1" /> seasons</li>
        <li><i className="pr-day special" /> special date</li>
        <li><i className="pr-day draft" /> not saved yet</li>
        <li><i className="pr-day base busy" /> taken (booked or closed)</li>
      </ul>
    </section>
  );
}

/* ───────── add or edit ───────── */

type Effect = { row: Row; conflicts: Period[]; nights: NightRule[]; overruled: number; booked: number };

function PeriodForm({ draft, setDraft, rows, check, effects, saving, onSave, onCancel, onEdit }: {
  draft: Draft; setDraft: (d: Draft) => void; rows: Row[]; check: DraftCheck; effects: Effect[]; saving: boolean;
  onSave: () => void; onCancel: () => void; onEdit: (p: Period) => void;
}) {
  const set = (patch: Partial<Draft>) => setDraft({ ...draft, ...patch });
  const num = (s: string) => s.replace(/\D/g, "").slice(0, 6);
  const editing = draft.id !== null;
  const all = rows.every((r) => draft.apartments.includes(r.slug));
  const blocked = effects.some((e) => e.conflicts.length);
  const what = draft.kind === "season" ? "season" : "special date";
  const toggle = (s: string) => set({ apartments: draft.apartments.includes(s) ? draft.apartments.filter((a) => a !== s) : [...draft.apartments, s] });

  return (
    <form className="pr-form" onSubmit={(e) => (e.preventDefault(), onSave())} aria-label={editing ? `Edit ${what}` : `New ${what}`}>
      <div className="pr-form-head">
        <h2>{editing ? `Edit ${what}` : "Set a price for a range"}</h2>
        <div className="pr-seg" role="radiogroup" aria-label="Kind">
          {(["season", "special"] as const).map((k) => (
            <button key={k} type="button" role="radio" aria-checked={draft.kind === k} onClick={() => set({ kind: k, yearly: editing ? draft.yearly : k === "season" })}>
              {k === "season" ? "Season" : "Special date"}
            </button>
          ))}
        </div>
      </div>
      <p className="muted pr-hint">{draft.kind === "season" ? "A stretch of the year at its own price: summer, winter, the quiet months." : "One night or a few with a price of their own: Christmas market, New Year. Wins over any season."}</p>

      <div className="pr-fields">
        <label className="pr-f wide">
          <span>Name <em>optional</em></span>
          <input value={draft.label} maxLength={60} placeholder={draft.kind === "season" ? "Summer" : "Christmas market"} onChange={(e) => set({ label: e.target.value })} />
        </label>
        <label className="pr-f">
          <span>First night</span>
          <input type="date" value={draft.first} onChange={(e) => set({ first: e.target.value, last: draft.last && draft.last >= e.target.value ? draft.last : e.target.value })} />
        </label>
        <label className="pr-f">
          <span>Last night</span>
          <input type="date" value={draft.last} min={draft.first || undefined} onChange={(e) => set({ last: e.target.value })} />
        </label>
        <label className="pr-f">
          <span>Per night</span>
          <span className="pr-ron"><input inputMode="numeric" value={draft.price} placeholder="RON" onChange={(e) => set({ price: num(e.target.value) })} required /></span>
        </label>
        {draft.kind === "season" ? (
          <label className="pr-f">
            <span>Fri + Sat <em>optional</em></span>
            <span className="pr-ron"><input inputMode="numeric" value={draft.weekend} placeholder="same" onChange={(e) => set({ weekend: num(e.target.value) })} /></span>
          </label>
        ) : null}
        <label className="pr-f">
          <span>Min stay <em>optional</em></span>
          <input inputMode="numeric" value={draft.min} placeholder="base" onChange={(e) => set({ min: num(e.target.value).slice(0, 2) })} />
        </label>
        <label className="pr-check">
          <input type="checkbox" checked={draft.yearly} onChange={(e) => set({ yearly: e.target.checked })} />
          <span>Every year</span>
        </label>
      </div>

      {editing ? (
        <p className="pr-for muted">For {rows.find((r) => r.slug === draft.apartments[0])?.name} only.</p>
      ) : (
        <div className="pr-for" role="group" aria-label="Apply to">
          <span className="search-label">Apply to</span>
          <div className="pr-chips">
            {rows.map((r) => (
              <button key={r.slug} type="button" aria-pressed={draft.apartments.includes(r.slug)} onClick={() => toggle(r.slug)} style={{ ["--accent" as string]: r.accent }}>
                <i aria-hidden="true" /> {r.name}
              </button>
            ))}
            <button type="button" className="all" aria-pressed={all} onClick={() => set({ apartments: all ? [draft.apartments[0] ?? rows[0].slug] : rows.map((r) => r.slug) })}>
              All {rows.length}
            </button>
          </div>
        </div>
      )}

      <div className="pr-preview" aria-live="polite">
        {check.problem ? <p className="pr-warn">{check.problem}</p> : null}
        {!check.period && !check.problem ? <p className="muted">Pick a range on the calendar or type the dates, then a price.</p> : null}
        {!draft.apartments.length ? <p className="pr-warn">Choose at least one apartment.</p> : null}
        {effects.map((e) => <EffectLine key={e.row.slug} e={e} draft={draft} onEdit={onEdit} />)}
      </div>

      <div className="pr-actions">
        <button className="btn" disabled={!check.period || blocked || saving || !draft.apartments.length}>
          {saving ? "Saving…" : editing ? "Save changes" : `Save ${what}`}
        </button>
        {editing || draft.first || draft.price ? <button type="button" className="btn ghost" onClick={onCancel}>{editing ? "Cancel" : "Clear"}</button> : null}
      </div>
    </form>
  );
}

function EffectLine({ e, draft, onEdit }: { e: Effect; draft: Draft; onEdit: (p: Period) => void }) {
  if (e.conflicts.length) {
    const c = e.conflicts[0];
    return (
      <p className="pr-warn">
        {e.row.name}: overlaps “{c.label ?? (c.kind === "season" ? "season" : "special date")}” ({span(c.first_night, c.last_night, c.yearly)}{c.yearly ? ", every year" : ""}){e.conflicts.length > 1 ? ` and ${e.conflicts.length - 1} more` : ""}.
        {" "}Change the dates, or <button type="button" className="pr-link" onClick={() => onEdit(c)}>edit that one</button>.
      </p>
    );
  }
  const byPrice = new Map<number, number>();
  for (const n of e.nights) byPrice.set(n.price, (byPrice.get(n.price) ?? 0) + 1);
  const parts = [...byPrice].sort((a, b) => b[1] - a[1]);
  const total = e.nights.reduce((s, n) => s + n.price, 0);
  const sum = parts.length <= 3 ? parts.map(([p, n]) => `${n} × ${ron(p)}`).join(" + ") : nightsWord(e.nights.length);
  return (
    <p className="pr-effect">
      <strong>{e.row.name}</strong>, {span(draft.first as ISODate, draft.last as ISODate, draft.yearly)}: {nightsWord(e.nights.length)} · {sum} = <strong>{ron(total)} RON</strong>
      {e.overruled ? <span className="muted"> · a special date keeps {nightsWord(e.overruled)}</span> : null}
      {e.booked ? <span className="muted"> · {nightsWord(e.booked)} already taken, those stays keep their price</span> : null}
    </p>
  );
}

/* ───────── what is set ───────── */

function PeriodList({ row, today, editing, onEdit, onDelete, onSaved }: {
  row: Row; today: ISODate; editing: number | null; onEdit: (p: Period) => void; onDelete: (p: Period) => void; onSaved: (t: Toast) => void;
}) {
  const tone = new Map(row.periods.filter((p) => p.kind === "season").sort((a, b) => a.first_night.slice(5).localeCompare(b.first_night.slice(5))).map((p, i) => [p.id, i % SEASON_TONES]));
  const group = (k: PeriodKind) => row.periods.filter((p) => p.kind === k);
  return (
    <section className="pr-list" aria-label={`${row.name}: what is set`}>
      <BaseRate key={row.slug + JSON.stringify(row.rate)} row={row} onSaved={onSaved} />
      {(["season", "special"] as const).map((k) => {
        const items = group(k);
        return (
          <div key={k} className="pr-group">
            <h3>{k === "season" ? "Seasons" : "Special dates"} <span className="muted">{items.length || ""}</span></h3>
            {!items.length ? (
              <p className="muted pr-empty">{k === "season" ? "None yet. Tap a month on the calendar to start one." : "None yet. Christmas market or New Year go here."}</p>
            ) : (
              <ul>
                {items.map((p) => {
                  const ended = !p.yearly && p.last_night < today;
                  return (
                    <li key={p.id} className={[editing === p.id && "editing", ended && "ended"].filter(Boolean).join(" ")}>
                      <i className={`pr-day ${k === "special" ? "special" : `s${tone.get(p.id) ?? 0}`}`} aria-hidden="true" />
                      <button type="button" className="pr-item" onClick={() => onEdit(p)} aria-label={`Edit ${p.label ?? span(p.first_night, p.last_night, p.yearly)}`}>
                        <span className="pr-item-name">{p.label ?? (k === "season" ? "Season" : "Special date")}</span>
                        <span className="pr-item-when">{span(p.first_night, p.last_night, p.yearly)}{p.yearly ? " · every year" : ""}{ended ? " · ended" : ""}</span>
                        <span className="pr-item-price">
                          {p.price}{p.weekend_price ? ` · Fri+Sat ${p.weekend_price}` : ""}{p.min_nights ? ` · min ${p.min_nights}` : ""}
                        </span>
                      </button>
                      <button type="button" className="pr-del" onClick={() => onDelete(p)} aria-label={`Delete ${p.label ?? span(p.first_night, p.last_night, p.yearly)}`}>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" /></svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </section>
  );
}

function BaseRate({ row, onSaved }: { row: Row; onSaved: (t: Toast) => void }) {
  const init = {
    base: String(row.rate?.base_price ?? ""),
    weekend: String(row.rate?.weekend_price ?? ""),
    min: String(row.rate?.min_nights ?? 2),
    cleaning: String(row.rate?.cleaning_fee ?? 0),
  };
  const [v, setV] = useState(init);
  const [saving, setSaving] = useState(false);
  const dirty = (Object.keys(init) as (keyof typeof init)[]).some((k) => v[k] !== init[k]);
  const num = (s: string) => s.replace(/\D/g, "").slice(0, 6);

  async function save() {
    setSaving(true);
    const r = await fetch("/api/admin/rates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apartment: row.slug, base_price: Number(v.base), weekend_price: v.weekend ? Number(v.weekend) : null, min_nights: Number(v.min), cleaning_fee: Number(v.cleaning || 0) }),
    }).catch(() => null);
    setSaving(false);
    onSaved(r?.ok ? { text: `Saved · ${row.name} base price`, tone: "ok" } : { text: "Not saved. Every field needs a number; min stay is 1 to 30.", tone: "err" });
  }

  const field = (k: keyof typeof init, label: string, placeholder?: string) => (
    <label className="pr-f">
      <span>{label}</span>
      <input inputMode="numeric" value={v[k]} placeholder={placeholder} onChange={(e) => setV({ ...v, [k]: num(e.target.value) })} />
    </label>
  );

  return (
    <form className="pr-group pr-base" onSubmit={(e) => (e.preventDefault(), save())}>
      <h3>Base price <span className="muted">every night without a season or special date</span></h3>
      <div className="pr-fields">
        {field("base", "Per night")}
        {field("weekend", "Fri + Sat", "same")}
        {field("min", "Min stay")}
        {field("cleaning", "Cleaning, once")}
        <button className={`btn ${dirty ? "" : "ghost"}`} disabled={!dirty || !v.base || saving}>{saving ? "Saving…" : dirty ? "Save" : "Saved"}</button>
      </div>
    </form>
  );
}
