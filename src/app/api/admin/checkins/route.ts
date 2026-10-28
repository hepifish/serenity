import { adminDenied } from "@/lib/admin-auth";
import { APARTMENTS, isApartmentSlug } from "@/lib/apartments";
import { listCheckins } from "@/lib/checkins";

/**
 * One CSV cell. Guests type these values, and a spreadsheet runs a cell that
 * starts with = + - @ as a formula: a leading apostrophe keeps it text.
 * Plain numbers such as +40 712 345 678 stay as typed; they cannot call anything.
 */
function cell(v: unknown) {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s) && !/^[+-]?[\d ().-]+$/.test(s)) s = "'" + s;
  return /[",\r\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** CSV for invoicing (SmartBill import or a spreadsheet). Owner only. */
export async function GET(req: Request) {
  const denied = adminDenied(req);
  if (denied) return denied;
  const rows = await listCheckins(5000);
  const head = ["arrival", "nights", "apartment", "source", "reservation", "full_name", "email", "phone", "street", "city", "postal_code", "country", "cnp", "company_name", "company_cui", "submitted"];
  const lines = rows.map((r) => [r.arrival, r.nights, r.apartment && isApartmentSlug(r.apartment) ? APARTMENTS[r.apartment].name : r.apartment, r.source, r.reservation,
    r.full_name, r.email, r.phone, r.street, r.city, r.postal_code, r.country, r.cnp, r.company_name, r.company_cui, r.created_at.toISOString()].map(cell).join(","));
  return new Response("﻿" + [head.join(","), ...lines].join("\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="serenity-checkins.csv"`, "Cache-Control": "no-store" },
  });
}
