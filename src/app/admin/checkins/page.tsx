import AdminNav from "@/components/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import CopyButton from "@/components/CopyButton";
import { APARTMENTS, isApartmentSlug } from "@/lib/apartments";
import { listCheckins } from "@/lib/checkins";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const d = (s: string) => new Intl.DateTimeFormat("ro-RO", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(s + "T00:00:00Z"));

// The screen shows enough to match a guest; the CSV, which the invoice needs, has it whole.
const maskCnp = (c: string) => (/^\d{13}$/.test(c) ? `${c[0]}${"•".repeat(9)}${c.slice(-3)}` : c);

export default async function CheckinsPage() {
  await requireAdmin();
  const rows = await listCheckins();
  return (
    <>
      <AdminNav active="checkins" />
      <main className="admin-main" style={{ display: "grid", gap: "2.5rem" }}>
        <section style={{ display: "grid", gap: "1rem", maxWidth: 900 }}>
          <h1 className="display h3">Online check-in</h1>
          <p className="muted">Send guests the link in their language. For Booking.com, paste it into the automated message for arrival day.</p>
          {(["ro", "en", "de"] as const).map((l) => {
            const url = `${SITE_URL}/${l}/checkin`;
            return (
              <div className="copy-row" key={l}>
                <span style={{ fontFamily: "var(--serif)", fontSize: "1.15rem" }}>{l === "ro" ? "Română" : l === "en" ? "English" : "Deutsch"}</span>
                <code>{url}</code>
                <CopyButton text={url} />
              </div>
            );
          })}
        </section>
        <section style={{ display: "grid", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "1rem", flexWrap: "wrap" }}>
            <h2 className="display h3">Received</h2>
            <a className="btn ghost" href="/api/admin/checkins" download>Download CSV</a>
          </div>
          {rows.length === 0 ? <p className="notice">No check-ins yet.</p> : (
            <div style={{ overflowX: "auto" }}>
              <table className="bk-table">
                <thead>
                  <tr><th>Arrival</th><th>Apartment</th><th>Guest</th><th>Address</th><th>CNP</th><th className="hide-sm">Invoice to</th><th className="hide-sm">Booking</th></tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td style={{ whiteSpace: "nowrap" }}>{d(r.arrival)}{r.nights ? <><br /><span className="muted">{r.nights} nights · {r.guests ?? "?"} guests</span></> : null}</td>
                      <td>{r.apartment && isApartmentSlug(r.apartment) ? APARTMENTS[r.apartment].name : "?"}</td>
                      <td>{r.full_name}<br /><a className="link muted" href={`mailto:${r.email}`}>{r.email}</a>{r.phone ? <><br /><span className="muted">{r.phone}</span></> : null}</td>
                      <td>{r.street}<br /><span className="muted">{[r.postal_code, r.city, r.country].filter(Boolean).join(", ")}</span></td>
                      <td style={{ fontVariantNumeric: "tabular-nums" }} title="Full CNP in the CSV">{r.cnp ? maskCnp(r.cnp) : <span className="muted">none</span>}</td>
                      <td className="hide-sm">{r.company_name ? <>{r.company_name}<br /><span className="muted">CUI {r.company_cui}</span></> : <span className="muted">person</span>}</td>
                      <td className="hide-sm"><span className="pill">{r.source}</span>{r.reservation ? <><br /><span className="muted">{r.reservation}</span></> : null}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
