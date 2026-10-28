"use client";

import { useSyncExternalStore } from "react";
import type { ISODate } from "./dates";

/**
 * The guest's chosen dates, shared by the hero search and every apartment on
 * the home page, so one search answers "which of the four is free?" in place.
 * Mirrored in the URL (?in=&out=&guests=) so a search can be shared or reloaded.
 */
export type Result =
  | { slug: string; capacity: number; available: true; nights: number; lodging: number; cleaning: number; cityTax: number; total: number }
  | { slug: string; capacity: number; available: false; reason: string; minNights?: number };

type State = {
  checkIn: ISODate | null;
  checkOut: ISODate | null;
  guests: number;
  loading: boolean;
  results: Record<string, Result> | null;
  /** apartments the guest has picked to book together */
  picked: string[];
};

let state: State = { checkIn: null, checkOut: null, guests: 2, loading: false, results: null, picked: [] };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const set = (patch: Partial<State>) => ((state = { ...state, ...patch }), emit());

export const searchStore = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  setDates(checkIn: ISODate | null, checkOut: ISODate | null) {
    set({ checkIn, checkOut, results: checkIn && checkOut ? state.results : null, picked: [] });
  },
  setGuests(guests: number) {
    set({ guests });
  },
  toggle(slug: string) {
    set({ picked: state.picked.includes(slug) ? state.picked.filter((s) => s !== slug) : [...state.picked, slug] });
  },
  clear() {
    set({ checkIn: null, checkOut: null, results: null, picked: [] });
    const url = new URL(location.href);
    ["in", "out", "guests"].forEach((k) => url.searchParams.delete(k));
    history.replaceState(null, "", url);
  },
  async run() {
    const { checkIn, checkOut, guests } = state;
    if (!checkIn || !checkOut) return;
    const url = new URL(location.href);
    url.searchParams.set("in", checkIn);
    url.searchParams.set("out", checkOut);
    url.searchParams.set("guests", String(guests));
    history.replaceState(null, "", url);
    set({ loading: true });
    try {
      const res = await fetch(`/api/search?in=${checkIn}&out=${checkOut}&guests=${guests}`);
      const data: { results: Result[] } = await res.json();
      const results = Object.fromEntries(data.results.map((r) => [r.slug, r]));
      set({ results, loading: false, picked: state.picked.filter((p) => results[p]?.available) });
    } catch {
      set({ loading: false, results: null });
    }
  },
};

const server: State = { checkIn: null, checkOut: null, guests: 2, loading: false, results: null, picked: [] };
export const useSearch = () => useSyncExternalStore(searchStore.subscribe, searchStore.get, () => server);
