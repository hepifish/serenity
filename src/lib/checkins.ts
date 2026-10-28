import { requireAdmin } from "./admin-auth";
import { sql } from "./db";
import { unseal } from "./seal";

export type Checkin = {
  id: string; source: string; reservation: string | null; apartment: string | null; arrival: string; nights: number | null;
  guests: number | null; full_name: string; email: string; phone: string | null; street: string; city: string;
  postal_code: string | null; country: string; cnp: string | null; company_name: string | null; company_cui: string | null;
  lang: string; created_at: Date;
};

/** For the owner's eyes only: the admin page and the CSV export. The CNP is unsealed here and nowhere else. */
export async function listCheckins(limit = 500): Promise<Checkin[]> {
  await requireAdmin(); // checked next to the data too, whoever the caller is
  const rows = await sql<(Omit<Checkin, "cnp"> & { cnp_enc: string | null })[]>`
    select id, source, reservation, apartment, to_char(arrival,'YYYY-MM-DD') as arrival, nights, guests, full_name, email, phone,
      street, city, postal_code, country, cnp_enc, company_name, company_cui, lang, created_at
    from checkins order by arrival desc, created_at desc limit ${limit}`;
  return rows.map(({ cnp_enc, ...r }) => {
    let cnp: string | null = null;
    try {
      cnp = cnp_enc ? unseal(cnp_enc) : null;
    } catch {
      cnp = "(unreadable)";
    }
    return { ...r, cnp };
  });
}
