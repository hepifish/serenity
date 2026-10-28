import { createHash } from "node:crypto";
import { TERMS_VERSION, TERMS_VERSIONS, isTermsVersion, termsText } from "@/content/terms";
import { getDict } from "@/i18n";
import type { Locale } from "@/i18n/config";
import type postgres from "postgres";
import { sql } from "./db";

/**
 * Proof that a guest accepted the terms: who (IP, browser), when, and exactly
 * what (version, language, SHA-256 of the text). The acceptance row is what
 * the owner shows a court; the hash proves the text has not changed since.
 */
export function termsHash(version: string, lang: Locale) {
  return createHash("sha256").update(termsText(TERMS_VERSIONS[version][lang]), "utf8").digest("hex");
}

export type Acceptance = {
  id: string;
  context: "booking" | "checkin";
  group_id: string | null;
  checkin_id: string | null;
  terms_version: string;
  terms_lang: string;
  terms_sha256: string;
  statement: string;
  ip: string | null;
  user_agent: string | null;
  accepted_at: Date;
};

export type AcceptanceInput = { terms_version: string; terms_lang: Locale; terms_sha256: string; statement: string; ip: string | null; user_agent: string | null };

/** Vercel puts the real client first in x-forwarded-for; later hops are proxies. */
export function requestOrigin(req: Request): Pick<AcceptanceInput, "ip" | "user_agent"> {
  const h = req.headers;
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip")?.trim() || null;
  return { ip: ip?.slice(0, 64) ?? null, user_agent: h.get("user-agent")?.slice(0, 500) ?? null };
}

/** Word for word what the guest saw next to the box they ticked. */
export function checkoutStatement(lang: Locale) {
  const t = getDict(lang).checkout;
  return `${t.damageLabel}: ${t.damage}\n${t.terms(t.termsLink, t.privacyLink)}`;
}
export function checkinStatement(lang: Locale) {
  const t = getDict(lang).checkin;
  return [...t.rules.map((r, i) => `${i + 1}. ${r}`), t.accept].join("\n");
}

/** The current version, in the language the guest read, with what the checkbox said. */
export function acceptanceOf(req: Request, lang: Locale, statement: string): AcceptanceInput {
  return { terms_version: TERMS_VERSION, terms_lang: lang, terms_sha256: termsHash(TERMS_VERSION, lang), statement, ...requestOrigin(req) };
}

export async function recordAcceptance(
  tx: postgres.Sql | postgres.TransactionSql,
  link: { context: "booking"; group_id: string } | { context: "checkin"; checkin_id: string },
  a: AcceptanceInput,
) {
  await tx`
    insert into terms_acceptances (context, group_id, checkin_id, terms_version, terms_lang, terms_sha256, statement, ip, user_agent)
    values (${link.context}, ${"group_id" in link ? link.group_id : null}, ${"checkin_id" in link ? link.checkin_id : null},
      ${a.terms_version}, ${a.terms_lang}, ${a.terms_sha256}, ${a.statement}, ${a.ip}, ${a.user_agent})`;
}

export async function acceptancesForGroup(groupId: string) {
  return sql<Acceptance[]>`select * from terms_acceptances where group_id = ${groupId} order by accepted_at`;
}

/** True when the stored hash still matches the archived text of that version. */
export const hashStillMatches = (a: Pick<Acceptance, "terms_version" | "terms_lang" | "terms_sha256">) =>
  isTermsVersion(a.terms_version) && termsHash(a.terms_version, a.terms_lang as Locale) === a.terms_sha256;
