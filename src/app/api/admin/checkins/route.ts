import { isAdminRequest } from "@/lib/admin-auth";
import { APARTMENTS, isApartmentSlug } from "@/lib/apartments";
import { listCheckins } from "@/lib/checkins";

/** CSV for invoicing (SmartBill import or a spreadsheet). Owner only. */
export async function GET(req: Request) {
  if (!(await isAdminRequest(req))) return new Response("Unauthorized", { status: 401 });
  const rows = await listCheckins(5000);
  const head = ["arrival", "nights", "apartment", "source", "reservation", "full_name", "email", "phone", "street", "city", "postal_code", "country", "cnp", "company_name", "company_cui", "submitted"];
  const cell = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = rows.map((r) => [r.arrival, r.nights, r.apartment && isApartmentSlug(r.apartment) ? APARTMENTS[r.apartment].name : r.apartment, r.source, r.reservation,
    r.full_name, r.email, r.phone, r.street, r.city, r.postal_code, r.country, r.cnp, r.company_name, r.company_cui, r.created_at.toISOString()].map(cell).join(","));
  return new Response("﻿" + [head.join(","), ...lines].join("\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="serenity-checkins.csv"`, "Cache-Control": "no-store" },
  });
}
