import { Resend } from "resend";
import { APARTMENTS, isApartmentSlug } from "./apartments";
import { COMPANY, SITE_URL } from "./site";
import type { Booking } from "./bookings";

/**
 * Two letters per paid booking: a confirmation to the guest in their language,
 * and a note to the owner with the one thing she must do by hand (close the
 * nights on Booking.com if its calendar has not caught up yet).
 * Without RESEND_API_KEY the letters are printed to the server log instead.
 */
const FROM = process.env.EMAIL_FROM ?? "Serenity Apartments <onboarding@resend.dev>";
const OWNER = process.env.OWNER_EMAIL ?? COMPANY.email;

async function send(to: string, subject: string, html: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email] to=${to} subject="${subject}"\n${html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 600)}`);
    return;
  }
  const { error } = await new Resend(key).emails.send({ from: FROM, to, subject, html, replyTo });
  if (error) console.error("[email] failed", to, error);
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const T = {
  en: { subject: "Your stay at Serenity is confirmed", hello: "Dear", body: "Your booking is confirmed and paid. We look forward to welcoming you in Sibiu.",
        ref: "Booking code", dates: "Dates", guests: "Guests", paid: "Paid", tax: "including Sibiu tourism tax", checkin: "Check-in from 15:00, check-out until 11:00. We will send arrival instructions a few days before your stay.",
        view: "View your booking", questions: "Questions? Just reply to this email." },
  ro: { subject: "Sejurul tău la Serenity este confirmat", hello: "Dragă", body: "Rezervarea ta este confirmată și plătită. Te așteptăm cu drag în Sibiu.",
        ref: "Cod rezervare", dates: "Perioada", guests: "Oaspeți", paid: "Plătit", tax: "inclusiv taxa de promovare turistică Sibiu", checkin: "Check-in de la 15:00, check-out până la 11:00. Îți trimitem instrucțiunile de acces cu câteva zile înainte.",
        view: "Vezi rezervarea", questions: "Întrebări? Răspunde direct la acest email." },
  de: { subject: "Ihr Aufenthalt im Serenity ist bestätigt", hello: "Liebe/r", body: "Ihre Buchung ist bestätigt und bezahlt. Wir freuen uns, Sie in Sibiu (Hermannstadt) willkommen zu heißen.",
        ref: "Buchungscode", dates: "Zeitraum", guests: "Gäste", paid: "Bezahlt", tax: "inklusive Tourismusabgabe Sibiu", checkin: "Check-in ab 15:00 Uhr, Check-out bis 11:00 Uhr. Die Anreiseinformationen senden wir Ihnen einige Tage vorher.",
        view: "Buchung ansehen", questions: "Fragen? Antworten Sie einfach auf diese E-Mail." },
} as const;

function layout(inner: string) {
  return `<div style="background:#0E0B10;padding:40px 16px;font-family:Georgia,serif;color:#EDE6DA">
  <div style="max-width:520px;margin:0 auto">
    <p style="letter-spacing:.3em;text-transform:uppercase;font-size:11px;color:#A79F95;margin:0 0 28px">Serenity · Sibiu</p>
    ${inner}
    <p style="font-size:11px;color:#7d756c;margin-top:40px;line-height:1.6">${COMPANY.name} · CUI ${COMPANY.cui} · ${COMPANY.address}</p>
  </div></div>`;
}

export async function sendBookingConfirmed(b: Booking, opts: { conflict: boolean }) {
  const apt = isApartmentSlug(b.apartment) ? APARTMENTS[b.apartment] : null;
  const lang = (b.lang in T ? b.lang : "en") as keyof typeof T;
  const t = T[lang];
  const fmt = new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  const d = (s: string) => fmt.format(new Date(s + "T00:00:00Z"));
  const link = `${SITE_URL}/${lang}/booking/${b.ref}?t=${b.access_token}`;
  const row = (k: string, v: string) => `<tr><td style="padding:6px 0;color:#A79F95;font-size:13px">${k}</td><td style="padding:6px 0;text-align:right;font-size:14px">${v}</td></tr>`;

  await send(b.guest_email, `${t.subject} · ${b.ref}`, layout(`
    <h1 style="font-weight:400;font-size:30px;margin:0 0 16px">${esc(apt?.name ?? b.apartment)}</h1>
    <p style="line-height:1.7;font-size:15px">${t.hello} ${esc(b.guest_name)},<br>${t.body}</p>
    <table style="width:100%;border-collapse:collapse;margin:24px 0;border-top:1px solid #2a2230;border-bottom:1px solid #2a2230">
      ${row(t.ref, b.ref)}${row(t.dates, `${d(b.check_in)} → ${d(b.check_out)}`)}${row(t.guests, String(b.guests))}
      ${row(t.paid, `${Number(b.amount).toFixed(2)} RON <span style="color:#A79F95;font-size:12px">(${t.tax})</span>`)}
    </table>
    <p style="line-height:1.7;font-size:14px;color:#cfc6b8">${t.checkin}</p>
    <p style="margin:28px 0"><a href="${link}" style="color:#0E0B10;background:#C9A45C;padding:12px 22px;text-decoration:none;font-family:Arial,sans-serif;font-size:13px;letter-spacing:.08em">${t.view}</a></p>
    <p style="font-size:13px;color:#A79F95">${t.questions}</p>`), OWNER);

  const warn = opts.conflict
    ? `<p style="background:#5B1E2D;padding:14px;line-height:1.6"><b>Atenție: suprapunere.</b> Plata a venit după ce perioada a fost ocupată în altă parte. Verifică Booking.com și contactează oaspetele (rambursare sau altă unitate).</p>`
    : `<p style="line-height:1.6">Booking.com citește calendarul nostru automat, dar cu întârziere. <b>Dacă vrei siguranță imediată, închide nopțile în extranet.</b></p>`;
  await send(OWNER, `${opts.conflict ? "⚠ SUPRAPUNERE · " : ""}Rezervare directă ${b.ref} · ${apt?.name ?? b.apartment} · ${b.check_in} → ${b.check_out}`, layout(`
    <h1 style="font-weight:400;font-size:26px;margin:0 0 16px">Rezervare directă nouă</h1>
    ${warn}
    <table style="width:100%;border-collapse:collapse;margin:20px 0">
      ${row("Apartament", apt?.name ?? b.apartment)}${row("Perioada", `${b.check_in} → ${b.check_out}`)}${row("Oaspeți", String(b.guests))}
      ${row("Nume", esc(b.guest_name))}${row("Email", esc(b.guest_email))}${row("Telefon", esc(b.guest_phone))}${row("Țara", esc(b.guest_country))}
      ${row("Cazare", `${Number(b.lodging_total).toFixed(2)} RON`)}${row("Curățenie", `${Number(b.cleaning_fee).toFixed(2)} RON`)}${row("Taxă promovare turistică", `${Number(b.city_tax).toFixed(2)} RON`)}
      ${row("Total încasat", `${Number(b.amount).toFixed(2)} RON`)}${row("Metodă", b.pay_method === "voucher" ? "Card de vacanță" : "Card")}
      ${row("Netopia ID", esc(b.netopia_ntp_id ?? ""))}
    </table>
    ${b.guest_note ? `<p style="line-height:1.6"><i>${esc(b.guest_note)}</i></p>` : ""}
    <p><a href="${SITE_URL}/admin/bookings" style="color:#C9A45C">Deschide în admin</a></p>`), b.guest_email);
}

export async function sendContactMessage(m: { name: string; email: string; message: string; lang: string }) {
  await send(OWNER, `Mesaj de pe site · ${m.name}`, layout(`
    <p style="line-height:1.7"><b>${esc(m.name)}</b> &lt;${esc(m.email)}&gt; (${esc(m.lang)})</p>
    <p style="line-height:1.7;white-space:pre-wrap">${esc(m.message)}</p>`), m.email);
}
