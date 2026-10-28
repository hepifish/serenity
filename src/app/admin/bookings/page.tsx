import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import CopyButton from "@/components/CopyButton";
import { requireAdmin } from "@/lib/admin-auth";
import { APARTMENTS, apartmentList, isApartmentSlug } from "@/lib/apartments";
import { listBookings } from "@/lib/bookings";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const d = (s: string) => new Intl.DateTimeFormat("ro-RO", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(s + "T00:00:00Z"));
const at = (t: Date) => new Intl.DateTimeFormat("ro-RO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Bucharest" }).format(t);

export default async function BookingsPage() {
  await requireAdmin();
  const bookings = await listBookings();
  const key = process.env.ICAL_EXPORT_KEY;

  return (
    <>
      <AdminNav active="bookings" />
      <main className="admin-main" style={{ display: "grid", gap: "3.5rem" }}>
        <section style={{ display: "grid", gap: "1rem" }}>
          <h1 className="display h3">Direct bookings</h1>
          <p className="muted">Paid and pending direct bookings. Booking.com reservations stay in the extranet; both block the website calendar. Open a code for its evidence file (who accepted which terms, when, from where), ready to print for a damage claim.</p>
          {bookings.length === 0 ? <p className="notice">No direct bookings yet.</p> : (
            <div style={{ overflowX: "auto" }}>
              <table className="bk-table">
                <thead>
                  <tr><th>Code</th><th>Apartment</th><th>Stay</th><th>Guest</th><th className="hide-sm">Contact</th><th>Total</th><th>Status</th><th className="hide-sm">Created</th></tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <Link href={`/admin/bookings/${b.group_ref}`} style={{ fontFamily: "var(--serif)", fontSize: "1.05rem", color: "var(--gold)" }}>{b.ref}</Link>
                        <br /><Link className="link muted" href={`/admin/bookings/${b.group_ref}`} style={{ fontSize: "0.75rem" }}>Evidence</Link>
                      </td>
                      <td>{isApartmentSlug(b.apartment) ? APARTMENTS[b.apartment].name : b.apartment}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{d(b.check_in)} → {d(b.check_out)}<br /><span className="muted">{b.guests} guests</span></td>
                      <td>{b.guest_name}<br /><span className="muted">{b.guest_country} · {b.lang.toUpperCase()}</span>{b.guest_note ? <><br /><i className="muted">“{b.guest_note}”</i></> : null}</td>
                      <td className="hide-sm"><a className="link" href={`mailto:${b.guest_email}`}>{b.guest_email}</a><br /><a className="link" href={`tel:${b.guest_phone}`}>{b.guest_phone}</a></td>
                      <td style={{ whiteSpace: "nowrap" }}>{Number(b.amount).toFixed(2)} RON<br /><span className="muted">{b.pay_method === "voucher" ? "voucher card" : "card"} · tax {Number(b.city_tax).toFixed(2)}</span></td>
                      <td><span className={`pill ${b.status}`}>{b.status}</span></td>
                      <td className="hide-sm muted">{at(b.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section style={{ display: "grid", gap: "1rem", maxWidth: 900 }}>
          <h2 className="display h3">Booking.com sync</h2>
          <p className="muted">
            Booking.com → website happens on its own: the site reads each apartment&apos;s Booking calendar live before every payment.
            <br />
            Website → Booking.com: paste each link below once in the extranet, under <b>Rates &amp; Availability → Sync calendars → Import calendar</b>.
            Booking then closes the nights of every direct booking. It checks every few hours, so after a direct booking you also get an email to close the nights by hand if you want certainty.
          </p>
          {!key ? <p className="notice err">ICAL_EXPORT_KEY is not set, so the export feeds are switched off.</p> : (
            <div>
              {apartmentList().filter((a) => !a.comingSoon).map((a) => {
                const url = `${SITE_URL}/ical/${a.slug}.ics?key=${key}`;
                return (
                  <div className="copy-row" key={a.slug}>
                    <span style={{ fontFamily: "var(--serif)", fontSize: "1.15rem" }}>{a.name}</span>
                    <code>{url}</code>
                    <CopyButton text={url} />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
