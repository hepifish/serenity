import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { gateActive, safeNext } from "@/lib/gate";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Serenity Apartments", robots: { index: false, follow: false } };

// Only while SITE_GATE_PASSWORD is set (see src/lib/gate.ts). Kept out of the sitemap.
const T = {
  en: { lead: "The site opens soon. Enter the password to see it.", label: "Password", enter: "Enter", wrong: "That password didn't work.", limit: "Too many attempts. Try again in 10 minutes." },
  ro: { lead: "Site-ul se deschide în curând. Introdu parola ca să îl vezi.", label: "Parolă", enter: "Intră", wrong: "Parola nu este corectă.", limit: "Prea multe încercări. Încearcă din nou peste 10 minute." },
  de: { lead: "Die Website öffnet bald. Geben Sie das Passwort ein, um sie zu sehen.", label: "Passwort", enter: "Weiter", wrong: "Dieses Passwort ist nicht richtig.", limit: "Zu viele Versuche. Bitte in 10 Minuten erneut versuchen." },
} as const;

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ next?: string; error?: string }> };

export default async function GatePage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { next, error } = await searchParams;
  if (!gateActive()) redirect(`/${lang}`);
  const t = T[lang];
  return (
    <main className="status">
      <form className="form status-inner" action="/api/gate" method="post" style={{ width: "min(100%, 22rem)" }}>
        <p className="logo" style={{ fontSize: "2rem" }}>Serenity<span>.</span></p>
        <p className="muted" style={{ textAlign: "center" }}>{t.lead}</p>
        <input type="hidden" name="next" value={safeNext(next ?? `/${lang}`)} />
        <input type="hidden" name="lang" value={lang} />
        <div className="field" style={{ width: "100%" }}>
          <label htmlFor="pw">{t.label}</label>
          <input id="pw" name="password" type="password" autoComplete="current-password" required autoFocus aria-invalid={error ? true : undefined} />
        </div>
        {error ? <p className="error-text" role="alert">{error === "limit" ? t.limit : t.wrong}</p> : null}
        <button className="btn block">{t.enter}</button>
      </form>
    </main>
  );
}
