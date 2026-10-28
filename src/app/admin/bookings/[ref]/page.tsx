import Link from "next/link";
import { notFound } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import PrintButton from "@/components/PrintButton";
import { requireAdmin } from "@/lib/admin-auth";
import { TERMS_VERSIONS, isTermsVersion } from "@/content/terms";
import type { LegalDoc } from "@/content/legal";
import { APARTMENTS, isApartmentSlug } from "@/lib/apartments";
import { groupByRef } from "@/lib/bookings";
import { COMPANY, SITE_URL } from "@/lib/site";
import { acceptancesForGroup, hashStillMatches } from "@/lib/terms";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ ref: string }> };

const local = (t: Date) =>
  new Intl.DateTimeFormat("ro-RO", { dateStyle: "long", timeStyle: "medium", timeZone: "Europe/Bucharest" }).format(t);

/**
 * The evidence file for one booking: who booked, what they paid, and the
 * exact terms they accepted, when and from where. In Romanian, because its
 * reader is a Romanian court or authority. Print it (or save as PDF).
 */
export default async function BookingEvidencePage({ params }: Props) {
  await requireAdmin();
  const { ref } = await params;
  const group = await groupByRef(decodeURIComponent(ref));
  if (!group.length) notFound();
  const b = group[0];
  const acceptances = await acceptancesForGroup(b.group_id);
  const total = group.reduce((s, r) => s + Number(r.amount), 0);
  const name = (s: string) => (isApartmentSlug(s) ? APARTMENTS[s].name : s);

  return (
    <>
      <AdminNav active="bookings" />
      <main className="admin-main evidence" style={{ display: "grid", gap: "2.5rem", maxWidth: 900 }}>
        <div className="no-print" style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <Link className="link" href="/admin/bookings">← Direct bookings</Link>
          <PrintButton label="Print / save as PDF" />
        </div>

        <header style={{ display: "grid", gap: "0.4rem" }}>
          <p className="muted">{COMPANY.name} · CUI {COMPANY.cui} · {COMPANY.regCom}</p>
          <h1 className="display h3">Dovada acceptării termenilor · {b.group_ref}</h1>
          <p className="muted">Extras generat la {local(new Date())} din evidența electronică a rezervărilor de pe {SITE_URL.replace(/^https?:\/\//, "")}.</p>
        </header>

        <section className="ev-block">
          <h2>1. Rezervarea</h2>
          <dl className="ev-list">
            <dt>Cod rezervare</dt><dd>{b.group_ref}</dd>
            <dt>Apartament(e)</dt><dd>{group.map((r) => `${name(r.apartment)} (${r.ref}, ${r.guests} pers.)`).join("; ")}</dd>
            <dt>Perioada</dt><dd>{b.check_in} → {b.check_out}</dd>
            <dt>Oaspete (titularul rezervării)</dt><dd>{b.guest_name}</dd>
            <dt>E-mail</dt><dd>{b.guest_email}</dd>
            <dt>Telefon</dt><dd>{b.guest_phone}</dd>
            <dt>Țara</dt><dd>{b.guest_country}</dd>
            <dt>Limba site-ului</dt><dd>{b.lang.toUpperCase()}</dd>
            <dt>Total</dt><dd>{total.toFixed(2)} RON</dd>
            <dt>Stare</dt><dd>{b.status}{b.paid_at ? `, plătită la ${local(b.paid_at)}` : ""}</dd>
            <dt>Plată</dt><dd>NETOPIA Payments, card {b.pay_method === "voucher" ? "de vacanță" : "bancar"} cu 3-D Secure · ID tranzacție {b.netopia_ntp_id ?? "n/a"}</dd>
            <dt>Rezervare creată</dt><dd>{local(b.created_at)}</dd>
          </dl>
        </section>

        {acceptances.length === 0 ? (
          <p className="notice err">Nu există o înregistrare de acceptare pentru această rezervare (rezervare anterioară evidenței).</p>
        ) : acceptances.map((a, i) => {
          const ok = hashStillMatches(a);
          const lang = a.terms_lang as "ro" | "en" | "de";
          const docs: LegalDoc[] = isTermsVersion(a.terms_version)
            ? [TERMS_VERSIONS[a.terms_version].ro, ...(lang !== "ro" ? [TERMS_VERSIONS[a.terms_version][lang]] : [])]
            : [];
          return (
            <section className="ev-block" key={a.id}>
              <h2>{2 + i}. Acceptarea termenilor și condițiilor</h2>
              <dl className="ev-list">
                <dt>Data și ora</dt><dd>{local(a.accepted_at)} (ora României) · {a.accepted_at.toISOString()} UTC</dd>
                <dt>Adresa IP</dt><dd>{a.ip ?? "necunoscută"}</dd>
                <dt>Browser (user agent)</dt><dd style={{ wordBreak: "break-word" }}>{a.user_agent ?? "necunoscut"}</dd>
                <dt>Versiunea termenilor</dt><dd>{a.terms_version}, citită în limba {lang.toUpperCase()} · <a className="link" href={`${SITE_URL}/${lang}/terms/${a.terms_version}`}>{`${SITE_URL}/${lang}/terms/${a.terms_version}`}</a></dd>
                <dt>Amprenta SHA-256 a textului</dt><dd style={{ fontFamily: "ui-monospace, monospace", wordBreak: "break-all" }}>{a.terms_sha256}</dd>
                <dt>Verificare amprentă</dt><dd>{ok ? "✓ Textul arhivat de mai jos este identic cu cel acceptat." : "✗ Textul arhivat diferă de amprenta înregistrată."}</dd>
                <dt>Textul bifat de oaspete</dt><dd style={{ whiteSpace: "pre-wrap" }}>{a.statement}</dd>
              </dl>
              <p className="muted" style={{ fontSize: "0.85rem" }}>
                Fluxul de rezervare: căsuța de acceptare nu este bifată implicit, iar butonul de plată rămâne inactiv până la bifare. Regula privind pagubele este afișată separat, chiar lângă căsuță.
                Serverul înregistrează acceptarea în aceeași tranzacție cu rezervarea, înainte de redirecționarea la plată. Confirmarea trimisă oaspetelui pe e-mail indică versiunea și linkul permanent la text.
              </p>
              {docs.map((doc, j) => (
                <div key={j} className="ev-terms">
                  <h3>Anexa {2 + i}.{j + 1}: {doc.title} (versiunea {a.terms_version}, {j === 0 ? "RO, versiunea obligatorie" : lang.toUpperCase()})</h3>
                  {doc.intro ? <p>{doc.intro}</p> : null}
                  {doc.sections.map((s) => (
                    <div key={s.h}>
                      <h4>{s.h}</h4>
                      {s.p?.map((p, k) => <p key={k}>{p}</p>)}
                      {s.ul ? <ul>{s.ul.map((li, k) => <li key={k}>{li}</li>)}</ul> : null}
                    </div>
                  ))}
                </div>
              ))}
            </section>
          );
        })}
      </main>
    </>
  );
}
