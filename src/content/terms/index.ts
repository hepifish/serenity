import type { LegalDoc } from "../legal";
import { TERMS_2026_10_28 } from "./2026-10-28";

/**
 * Every version of the Terms and conditions a guest may have accepted.
 * To change the terms: copy the newest file to a new date, edit the copy,
 * add it here and point TERMS_VERSION at it. Old files stay untouched, so
 * each guest's acceptance record still points at the exact text they saw.
 */
type Lang = "ro" | "en" | "de";

export const TERMS_VERSIONS: Record<string, Record<Lang, LegalDoc>> = {
  "2026-10-28": TERMS_2026_10_28,
};

export const TERMS_VERSION = "2026-10-28";

export const currentTerms = (lang: Lang) => TERMS_VERSIONS[TERMS_VERSION][lang];

export const isTermsVersion = (v: string) => Object.hasOwn(TERMS_VERSIONS, v);

/** The document as plain text, one block per line: what the hash is taken over. */
export function termsText(doc: LegalDoc) {
  return [
    doc.title,
    doc.updated,
    doc.intro ?? "",
    ...doc.sections.flatMap((s) => [s.h, ...(s.p ?? []), ...(s.ul ?? []).map((li) => `- ${li}`)]),
  ].join("\n");
}
