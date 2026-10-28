import { randomBytes } from "node:crypto";
import { sql } from "./db";
import { HOLD_MINUTES } from "./site";
import type { Quote } from "./pricing";
import { recordAcceptance, type AcceptanceInput } from "./terms";

export type Booking = {
  id: string;
  group_id: string;
  group_ref: string;
  ref: string;
  access_token: string;
  apartment: string;
  check_in: string;
  check_out: string;
  guests: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guest_country: string;
  guest_note: string | null;
  lang: string;
  lodging_total: string;
  cleaning_fee: string;
  city_tax: string;
  amount: string;
  nightly: { night: string; price: number }[];
  pay_method: "card" | "voucher";
  status: "pending" | "paid" | "failed" | "cancelled" | "expired" | "conflict";
  hold_until: Date;
  netopia_ntp_id: string | null;
  netopia_status: number | null;
  netopia_message: string | null;
  created_at: Date;
  paid_at: Date | null;
};

const COLUMNS = sql`id, group_id, group_ref, ref, access_token, apartment, to_char(check_in,'YYYY-MM-DD') as check_in,
  to_char(check_out,'YYYY-MM-DD') as check_out, guests, guest_name, guest_email, guest_phone, guest_country,
  guest_note, lang, lodging_total, cleaning_fee, city_tax, amount, nightly, pay_method, status, hold_until, netopia_ntp_id,
  netopia_status, netopia_message, created_at, paid_at`;

// No 0/O, 1/I/L: the code gets read out over the phone.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
function newRef() {
  const bytes = randomBytes(5);
  return "SR-" + Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export type GuestDetails = {
  name: string; email: string; phone: string; country: string; note?: string; lang: string; payMethod: "card" | "voucher";
};

/**
 * Takes the nights of one or several apartments for HOLD_MINUTES while the
 * guest pays, as one group: all of them or none. Advisory locks, taken in a
 * fixed order, make two guests racing for the same nights take turns.
 * Returns null when any of the nights was taken in the meantime.
 * The guest's acceptance of the terms is stored in the same transaction.
 */
export async function createPendingGroup(quotes: Quote[], g: GuestDetails, acceptance: AcceptanceInput): Promise<Booking[] | null> {
  return sql.begin(async (tx) => {
    for (const a of [...new Set(quotes.map((q) => q.apartment))].sort()) await tx`select pg_advisory_xact_lock(hashtext(${a}))`;
    for (const q of quotes) {
      const [clash] = await tx`
        select 1 from bookings
        where apartment = ${q.apartment}
          and (status = 'paid' or (status = 'pending' and hold_until > now()))
          and check_in < ${q.checkOut} and check_out > ${q.checkIn}
        limit 1`;
      if (clash) return null;
    }
    const groupRef = newRef();
    const token = randomBytes(18).toString("base64url");
    const [{ id: groupId }] = await tx<{ id: string }[]>`select gen_random_uuid() as id`;
    const rows: Booking[] = [];
    for (const [i, q] of quotes.entries()) {
      const ref = quotes.length === 1 ? groupRef : `${groupRef}-${i + 1}`;
      const [b] = await tx<Booking[]>`
        insert into bookings (group_id, group_ref, ref, access_token, apartment, check_in, check_out, guests, guest_name, guest_email,
          guest_phone, guest_country, guest_note, lang, lodging_total, cleaning_fee, city_tax, amount, nightly, pay_method, hold_until)
        values (${groupId}, ${groupRef}, ${ref}, ${token}, ${q.apartment}, ${q.checkIn}, ${q.checkOut},
          ${q.guests}, ${g.name}, ${g.email}, ${g.phone}, ${g.country}, ${g.note ?? null}, ${g.lang}, ${q.lodging},
          ${q.cleaning}, ${q.cityTax}, ${q.total}, ${tx.json(q.nightly)}, ${g.payMethod}, now() + make_interval(mins => ${HOLD_MINUTES}))
        returning ${COLUMNS}`;
      rows.push(b);
    }
    // The acceptance is part of the booking: no row without it, no it without the rows.
    await recordAcceptance(tx, { context: "booking", group_id: groupId }, acceptance);
    return rows;
  });
}

export async function attachPayment(groupId: string, ntpId: string) {
  await sql`update bookings set netopia_ntp_id = ${ntpId}, updated_at = now() where group_id = ${groupId}`;
}

export async function markFailed(groupId: string, message: string) {
  await sql`update bookings set status = 'failed', netopia_message = ${message}, updated_at = now()
            where group_id = ${groupId} and status = 'pending'`;
}

export async function getGroup(groupId: string) {
  return sql<Booking[]>`select ${COLUMNS} from bookings where group_id = ${groupId} order by ref`;
}

/** Admin only: no token check. */
export async function groupByRef(groupRef: string) {
  return sql<Booking[]>`select ${COLUMNS} from bookings where group_ref = ${groupRef} order by ref`;
}

export async function getGroupByRef(groupRef: string, token: string) {
  const rows = await groupByRef(groupRef);
  // compared outside SQL so a wrong token and an unknown code look the same
  return rows.length && rows[0].access_token === token ? rows : null;
}

/**
 * Applies a payment outcome to the whole group. Returns the rows only when
 * this call is the one that settled them, so emails go out once even if
 * Netopia retries. Status only moves forward: a refund is final, and a late
 * or replayed "paid" never revives a cancelled booking.
 */
export async function applyPaymentStatus(groupId: string, outcome: "paid" | "failed" | "pending" | "cancelled", ntpStatus: number, message: string) {
  if (outcome === "paid") return settlePaid(groupId, ntpStatus, message);
  if (outcome === "pending") {
    await sql`update bookings set netopia_status = ${ntpStatus}, netopia_message = ${message}, updated_at = now()
              where group_id = ${groupId} and status = 'pending'`;
    return [];
  }
  // a refund (cancelled) can hit a paid or conflicting booking; a decline only a pending one
  await sql`update bookings set status = ${outcome}, netopia_status = ${ntpStatus}, netopia_message = ${message}, updated_at = now()
            where group_id = ${groupId} and (status = 'pending' or (${outcome === "cancelled"} and status in ('paid','conflict')))`;
  return [];
}

/**
 * A payment can land after its hold expired and someone else paid for the same
 * nights. Under the same apartment locks as createPendingGroup, such a row
 * becomes 'conflict' instead of a second 'paid' (sql/005 enforces it too), and
 * the owner email flags it.
 */
async function settlePaid(groupId: string, ntpStatus: number, message: string) {
  return sql.begin(async (tx) => {
    const apts = await tx<{ apartment: string }[]>`select distinct apartment from bookings where group_id = ${groupId}`;
    for (const a of apts.map((r) => r.apartment).sort()) await tx`select pg_advisory_xact_lock(hashtext(${a}))`;
    return tx<Booking[]>`
      update bookings b set
        status = case when exists (
          select 1 from bookings o where o.apartment = b.apartment and o.status = 'paid'
            and o.check_in < b.check_out and o.check_out > b.check_in) then 'conflict' else 'paid' end,
        paid_at = now(), netopia_status = ${ntpStatus}, netopia_message = ${message}, updated_at = now()
      where group_id = ${groupId} and status in ('pending','failed','expired')
      returning ${COLUMNS}`;
  });
}

/** What the guest's page shows. A lapsed hold reads as expired; a conflict reads as paid, since the money is in and Pati resolves it. */
export function guestStatus(b: Booking): Exclude<Booking["status"], "conflict"> {
  if (b.status === "conflict") return "paid";
  return b.status === "pending" && b.hold_until < new Date() && !b.netopia_status ? "expired" : b.status;
}

/** The admin list: settled bookings and live holds. A lapsed hold is noise. */
export async function listBookings(limit = 200) {
  return sql<Booking[]>`select ${COLUMNS} from bookings
    where status in ('paid','conflict','cancelled') or (status = 'pending' and hold_until > now())
    order by check_in desc, ref limit ${limit}`;
}

// What Booking.com sees: only stays a guest has paid for (a "conflict" is paid too).
// Unpaid holds stay off the feed, or a 20-minute hold could close nights there until its next sync.
export async function directBookingsFor(apartment: string) {
  return sql<{ id: string; check_in: string; check_out: string }[]>`
    select id, to_char(check_in,'YYYY-MM-DD') as check_in, to_char(check_out,'YYYY-MM-DD') as check_out
    from bookings where apartment = ${apartment}
      and status in ('paid', 'conflict')
      and check_out >= current_date`;
}
