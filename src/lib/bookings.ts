import { randomBytes } from "node:crypto";
import { sql } from "./db";
import { HOLD_MINUTES } from "./site";
import type { Quote } from "./pricing";

export type Booking = {
  id: string;
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
  status: "pending" | "paid" | "failed" | "cancelled" | "expired";
  hold_until: Date;
  netopia_ntp_id: string | null;
  netopia_status: number | null;
  netopia_message: string | null;
  created_at: Date;
  paid_at: Date | null;
};

const COLUMNS = sql`id, ref, access_token, apartment, to_char(check_in,'YYYY-MM-DD') as check_in,
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
 * Takes the nights for HOLD_MINUTES while the guest pays. The advisory lock
 * makes two guests racing for the same nights take turns, so only one of them
 * gets the hold. Returns null when the nights were taken in the meantime.
 */
export async function createPendingBooking(q: Quote, g: GuestDetails): Promise<Booking | null> {
  return sql.begin(async (tx) => {
    await tx`select pg_advisory_xact_lock(hashtext(${q.apartment}))`;
    const [clash] = await tx`
      select 1 from bookings
      where apartment = ${q.apartment}
        and (status = 'paid' or (status = 'pending' and hold_until > now()))
        and check_in < ${q.checkOut} and check_out > ${q.checkIn}
      limit 1`;
    if (clash) return null;
    const [b] = await tx<Booking[]>`
      insert into bookings (ref, access_token, apartment, check_in, check_out, guests, guest_name, guest_email,
        guest_phone, guest_country, guest_note, lang, lodging_total, cleaning_fee, city_tax, amount, nightly, pay_method, hold_until)
      values (${newRef()}, ${randomBytes(18).toString("base64url")}, ${q.apartment}, ${q.checkIn}, ${q.checkOut},
        ${q.guests}, ${g.name}, ${g.email}, ${g.phone}, ${g.country}, ${g.note ?? null}, ${g.lang}, ${q.lodging},
        ${q.cleaning}, ${q.cityTax}, ${q.total}, ${tx.json(q.nightly)}, ${g.payMethod}, now() + make_interval(mins => ${HOLD_MINUTES}))
      returning ${COLUMNS}`;
    return b;
  });
}

export async function attachPayment(id: string, ntpId: string) {
  await sql`update bookings set netopia_ntp_id = ${ntpId}, updated_at = now() where id = ${id}`;
}

export async function markFailed(id: string, message: string) {
  await sql`update bookings set status = 'failed', netopia_message = ${message}, updated_at = now()
            where id = ${id} and status = 'pending'`;
}

export async function getBooking(id: string) {
  const [b] = await sql<Booking[]>`select ${COLUMNS} from bookings where id = ${id}`;
  return b ?? null;
}

export async function getBookingByRef(ref: string, token: string) {
  const [b] = await sql<Booking[]>`select ${COLUMNS} from bookings where ref = ${ref}`;
  // compare outside SQL so a wrong token and an unknown ref look the same
  return b && b.access_token === token ? b : null;
}

/**
 * Applies a payment outcome. Returns the booking only when this call is the
 * one that turned it paid, so emails go out once even if Netopia retries.
 */
export async function applyPaymentStatus(id: string, outcome: "paid" | "failed" | "pending" | "cancelled", ntpStatus: number, message: string) {
  if (outcome === "paid") {
    const [b] = await sql<Booking[]>`
      update bookings set status = 'paid', paid_at = now(), netopia_status = ${ntpStatus}, netopia_message = ${message}, updated_at = now()
      where id = ${id} and status <> 'paid' returning ${COLUMNS}`;
    return b ?? null;
  }
  if (outcome === "pending") {
    await sql`update bookings set netopia_status = ${ntpStatus}, netopia_message = ${message}, updated_at = now()
              where id = ${id} and status = 'pending'`;
    return null;
  }
  // a refund (cancelled) can hit a paid booking; a decline only a pending one
  await sql`update bookings set status = ${outcome}, netopia_status = ${ntpStatus}, netopia_message = ${message}, updated_at = now()
            where id = ${id} and (status = 'pending' or ${outcome === "cancelled"})`;
  return null;
}

/** Another paid booking or Booking.com reservation already holds some of these nights. */
export async function paidOverlap(b: Booking) {
  const [row] = await sql`
    select 1 from bookings where apartment = ${b.apartment} and status = 'paid' and id <> ${b.id}
      and check_in < ${b.check_out} and check_out > ${b.check_in} limit 1`;
  return !!row;
}

export async function listBookings(limit = 200) {
  return sql<Booking[]>`select ${COLUMNS} from bookings where status in ('paid','pending','cancelled')
    order by check_in desc limit ${limit}`;
}

export async function directBookingsFor(apartment: string) {
  return sql<{ id: string; check_in: string; check_out: string }[]>`
    select id, to_char(check_in,'YYYY-MM-DD') as check_in, to_char(check_out,'YYYY-MM-DD') as check_out
    from bookings where apartment = ${apartment}
      and (status = 'paid' or (status = 'pending' and hold_until > now()))
      and check_out >= current_date`;
}
