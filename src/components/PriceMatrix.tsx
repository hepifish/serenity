"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fromDate, toDate, type ISODate } from "@/lib/dates";
import type { PriceMatrix as Matrix } from "@/app/api/admin/prices/route";

/**
 * The price matrix, laid out like Booking.com's calendar: one row per
 * apartment, one column per night. Drag across cells (or tap one, then
 * shift-tap another) to select, type one price, Apply. "Back to default"
 * removes the custom price so the everyday/weekend rate applies again.
 */

type Cell = `${string}|${ISODate}`; // slug|night

function monthStart(d: ISODate) {
  return d.slice(0, 8) + "01";
}
function nextMonth(first: ISODate, n: number) {
  const d = toDate(first);
  d.setUTCMonth(d.getUTCMonth() + n);
  return fromDate(d);
}

export default function PriceMatrix({ today }: { today: ISODate }) {
  const [month, setMonth] = useState(monthStart(today));
  const [data, setData] = useState<Matrix | null>(null);
  const [sel, setSel] = useState<Set<Cell>>(new Set());
  const [anchor, setAnchor] = useState<Cell | null>(null);
  const [price, setPrice] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [flash, setFlash] = useState<Set<Cell>>(new Set());
  const [saving, setSaving] = useState(false);
  const drag = useRef<{ from: Cell; additive: boolean } | null>(null);

  const load = useCallback(async () => {
    const to = nextMonth(month, 1);
    const r = await fetch(`/api/admin/prices?from=${month}&to=${to}`);
    if (r.status === 401) return location.assign("/admin/login");
    setData(await r.json());
  }, [month]);

  useEffect(() => {
    setData(null);
    setSel(new Set());
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  const slugs = data?.rows.map((r) => r.slug) ?? [];
  const nights = data?.nights ?? [];

  /** Every cell in the rectangle between two cells. */
  const rect = useCallback(
    (a: Cell, b: Cell) => {
      const [sa, na] = a.split("|");
      const [sb, nb] = b.split("|");
      const [r1, r2] = [slugs.indexOf(sa), slugs.indexOf(sb)].sort((x, y) => x - y);
      const [n1, n2] = [na, nb].sort();
      const out: Cell[] = [];
      for (let r = r1; r <= r2; r++) for (const n of nights) if (n >= n1 && n <= n2) out.push(`${slugs[r]}|${n}`);
      return out;
    },
    [slugs, nights],
  );

  function down(c: Cell, e: React.PointerEvent) {
    if (e.shiftKey && anchor) {
      setSel(new Set(rect(anchor, c)));
      return;
    }
    const additive = e.metaKey || e.ctrlKey;
    drag.current = { from: c, additive };
    setAnchor(c);
    setSel((s) => (additive ? new Set([...s, c]) : new Set([c])));
  }
  function enter(c: Cell) {
    if (!drag.current) return;
    const cells = rect(drag.current.from, c);
    setSel((s) => (drag.current!.additive ? new Set([...s, ...cells]) : new Set(cells)));
  }
  useEffect(() => {
    const up = () => (drag.current = null);
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, []);

  function selectRow(slug: string) {
    setSel(new Set(nights.map((n) => `${slug}|${n}` as Cell)));
  }
  function selectColumn(night: ISODate) {
    setSel(new Set(slugs.map((s) => `${s}|${night}` as Cell)));
  }
  function selectWeekends() {
    setSel(new Set(slugs.flatMap((s) => nights.filter((n) => [5, 6].includes(toDate(n).getUTCDay())).map((n) => `${s}|${n}` as Cell))));
  }

  async function apply(value: number | null) {
    if (!sel.size) return;
    setSaving(true);
    const byApt = new Map<string, ISODate[]>();
    for (const c of sel) {
      const [s, n] = c.split("|");
      byApt.set(s, [...(byApt.get(s) ?? []), n]);
    }
    const ok = (
      await Promise.all(
        [...byApt].map(([s, ns]) =>
          fetch("/api/admin/prices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ apartments: [s], nights: ns, price: value }) }).then((r) => r.ok),
        ),
      )
    ).every(Boolean);
    setSaving(false);
    if (!ok) return setToast("Not saved. Check the price and try again.");
    setFlash(new Set(sel));
    setTimeout(() => setFlash(new Set()), 1200);
    setToast(value === null ? `Back to default · ${sel.size} nights` : `Saved · ${value} RON on ${sel.size} nights`);
    setSel(new Set());
    setPrice("");
    load();
  }

  const label = useMemo(() => new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(toDate(month)), [month]);
  const dow = new Intl.DateTimeFormat("en-GB", { weekday: "narrow", timeZone: "UTC" });
  const priceNum = Number(price);
  const validPrice = Number.isInteger(priceNum) && priceNum > 0;

  return (
    <div className="pm">
      <div className="pm-head">
        <div>
          <h1 className="display h3">Prices</h1>
          <p className="muted">Drag across days to select. Shift-click to extend, ⌘/Ctrl-click to add. Type one price and apply.</p>
        </div>
        <div className="pm-month">
          <button type="button" className="icon-btn" onClick={() => setMonth(nextMonth(month, -1))} disabled={month <= monthStart(today)} aria-label="Previous month">
            <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <p>{label}</p>
          <button type="button" className="icon-btn" onClick={() => setMonth(nextMonth(month, 1))} aria-label="Next month">
            <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      <div className="pm-quick">
        <span className="muted">Quick select:</span>
        <button type="button" onClick={selectWeekends}>All Fri + Sat nights</button>
        {data?.rows.map((r) => <button key={r.slug} type="button" onClick={() => selectRow(r.slug)}>All of {r.name}</button>)}
      </div>

      <div className="pm-scroll">
        {!data ? <p className="muted" style={{ padding: "2rem" }}>Loading…</p> : (
          <table className="pm-table" onPointerLeave={() => (drag.current = null)}>
            <thead>
              <tr>
                <th />
                {nights.map((n) => {
                  const wd = toDate(n).getUTCDay();
                  return (
                    <th key={n} className={`${wd === 5 || wd === 6 ? "we" : ""} ${n === today ? "today" : ""}`}>
                      <button type="button" onClick={() => selectColumn(n)} title="Select this night for every apartment">
                        <span>{dow.format(toDate(n))}</span>
                        <strong>{Number(n.slice(8))}</strong>
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => (
                <tr key={r.slug} style={{ ["--accent" as string]: r.accent }}>
                  <th scope="row">
                    <button type="button" onClick={() => selectRow(r.slug)}>{r.name}</button>
                  </th>
                  {nights.map((n) => {
                    const c: Cell = `${r.slug}|${n}`;
                    const v = r.nights[n];
                    const past = n < today;
                    return (
                      <td
                        key={n}
                        className={[sel.has(c) && "sel", v?.custom && "custom", v?.busy && "busy", past && "past", flash.has(c) && "flash"].filter(Boolean).join(" ")}
                        onPointerDown={(e) => !past && down(c, e)}
                        onPointerEnter={() => !past && enter(c)}
                        title={`${r.name} · ${n}${v?.busy ? " · booked" : ""}${v?.custom ? " · custom price" : " · default price"}`}
                      >
                        {v?.price ?? "–"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ul className="pm-legend">
        <li><i className="l-custom" /> custom price</li>
        <li><i className="l-default" /> default price</li>
        <li><i className="l-busy" /> booked (Booking.com or direct)</li>
      </ul>

      <div className={`pm-bar ${sel.size ? "on" : ""}`} aria-live="polite">
        <span><strong>{sel.size}</strong> {sel.size === 1 ? "night" : "nights"} selected</span>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (validPrice) apply(priceNum);
          }}
          className="pm-set"
        >
          <label className="sr-only" htmlFor="pm-price">Price per night in RON</label>
          <input id="pm-price" inputMode="numeric" pattern="[0-9]*" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} autoComplete="off" />
          <span className="muted">RON</span>
          <button className="btn" disabled={!validPrice || saving}>Apply</button>
        </form>
        <button type="button" className="btn ghost" onClick={() => apply(null)} disabled={saving}>Back to default</button>
        <button type="button" className="pm-x" onClick={() => setSel(new Set())} aria-label="Clear selection">✕</button>
      </div>

      {data ? <Defaults rows={data.rows} onSaved={(m) => (setToast(m), load())} /> : null}

      {toast ? <p className="pm-toast" role="status">{toast}</p> : null}
    </div>
  );
}

function Defaults({ rows, onSaved }: { rows: Matrix["rows"]; onSaved: (msg: string) => void }) {
  return (
    <section className="pm-defaults">
      <h2 className="display h3" style={{ fontSize: "1.6rem" }}>Defaults</h2>
      <p className="muted">Used on every night without a custom price. Cleaning is charged once per stay; Sibiu&apos;s 2% tax is added on top automatically.</p>
      <div className="pm-def-grid">
        <span />
        <span className="search-label">Everyday</span>
        <span className="search-label">Fri + Sat</span>
        <span className="search-label">Min nights</span>
        <span className="search-label">Cleaning</span>
        <span />
        {rows.map((r) => <DefaultRow key={r.slug + JSON.stringify(r.rate)} row={r} onSaved={onSaved} />)}
      </div>
    </section>
  );
}

function DefaultRow({ row, onSaved }: { row: Matrix["rows"][number]; onSaved: (msg: string) => void }) {
  const [v, setV] = useState({
    base: String(row.rate?.base_price ?? ""),
    weekend: String(row.rate?.weekend_price ?? ""),
    min: String(row.rate?.min_nights ?? 2),
    cleaning: String(row.rate?.cleaning_fee ?? 0),
  });
  const dirty =
    v.base !== String(row.rate?.base_price ?? "") || v.weekend !== String(row.rate?.weekend_price ?? "") ||
    v.min !== String(row.rate?.min_nights ?? 2) || v.cleaning !== String(row.rate?.cleaning_fee ?? 0);
  const num = (s: string) => s.replace(/\D/g, "");

  async function save() {
    const r = await fetch("/api/admin/rates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apartment: row.slug, base_price: Number(v.base), weekend_price: v.weekend ? Number(v.weekend) : null, min_nights: Number(v.min), cleaning_fee: Number(v.cleaning || 0) }),
    });
    onSaved(r.ok ? `${row.name}: defaults saved` : "Not saved. Every field needs a number.");
  }

  return (
    <>
      <span style={{ fontFamily: "var(--serif)", fontSize: "1.2rem" }}>{row.name}</span>
      <input aria-label={`${row.name} everyday price`} inputMode="numeric" value={v.base} onChange={(e) => setV({ ...v, base: num(e.target.value) })} />
      <input aria-label={`${row.name} Friday and Saturday price`} inputMode="numeric" placeholder="same" value={v.weekend} onChange={(e) => setV({ ...v, weekend: num(e.target.value) })} />
      <input aria-label={`${row.name} minimum nights`} inputMode="numeric" value={v.min} onChange={(e) => setV({ ...v, min: num(e.target.value) })} />
      <input aria-label={`${row.name} cleaning fee`} inputMode="numeric" value={v.cleaning} onChange={(e) => setV({ ...v, cleaning: num(e.target.value) })} />
      <button type="button" className={`btn ${dirty ? "" : "ghost"}`} disabled={!dirty || !v.base} onClick={save}>{dirty ? "Save" : "Saved"}</button>
    </>
  );
}

