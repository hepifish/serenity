import { NextResponse } from "next/server";
import { applyPaymentStatus, getGroup } from "@/lib/bookings";
import { isApartmentSlug } from "@/lib/apartments";
import { isStayFree } from "@/lib/availability";
import { sendBookingConfirmed } from "@/lib/email";
import { PAID_STATUSES, PENDING_STATUSES, verifyIpn } from "@/lib/netopia";

// Netopia's server calls this after every change in a payment. Nothing here
// trusts the body until verifyIpn has checked Netopia's signature over it.
const ok = () => NextResponse.json({ errorType: 0, errorCode: null, errorMessage: "" });
const refuse = (errorMessage: string) => NextResponse.json({ errorType: 2, errorCode: 2, errorMessage });

export async function POST(req: Request) {
  const raw = await req.text();
  let ipn;
  try {
    ipn = await verifyIpn(raw, req.headers.get("verification-token"));
  } catch (e) {
    console.warn("[ipn] rejected", e instanceof Error ? e.message : e);
    return NextResponse.json({ errorType: 2, errorCode: 1, errorMessage: "invalid signature" }, { status: 401 });
  }

  const group = await getGroup(ipn.order.orderID).catch(() => []);
  if (!group.length) return ok(); // not ours: acknowledge so Netopia stops retrying
  // Bound to the payment we started: an IPN for another transaction (or the
  // other Netopia environment) is acknowledged and ignored. The id is stored
  // right after start, so an IPN that beats it is let through.
  const ntpId = group[0].netopia_ntp_id;
  if (ntpId && String(ipn.payment.ntpID) !== ntpId) {
    console.warn("[ipn] ntpID mismatch", group[0].group_ref);
    return ok();
  }
  if (ipn.payment.currency !== "RON") {
    console.error("[ipn] currency mismatch", group[0].group_ref, ipn.payment.currency);
    return refuse("currency mismatch");
  }
  const expected = group.reduce((s, b) => s + Number(b.amount), 0);
  if (Math.abs(expected - Number(ipn.payment.amount)) > 0.01) {
    console.error("[ipn] amount mismatch", group[0].group_ref, expected, ipn.payment.amount);
    return refuse("amount mismatch");
  }

  const groupId = group[0].group_id;
  const status = Number(ipn.payment.status);
  const message = ipn.payment.message ?? "";
  try {
    if (PAID_STATUSES.has(status)) {
      const settled = await applyPaymentStatus(groupId, "paid", status, message);
      if (settled.length) {
        // Late payments: our own clash is already 'conflict'; Booking.com may have sold the nights meanwhile.
        let conflict = false;
        for (const b of settled) {
          if (b.status === "conflict") conflict = true;
          else if (isApartmentSlug(b.apartment) && !(await isStayFree(b.apartment, b.check_in, b.check_out, { fresh: true, exceptBooking: b.id }).catch(() => true))) conflict = true;
        }
        await sendBookingConfirmed(settled, { conflict });
      }
    } else if (PENDING_STATUSES.has(status)) {
      await applyPaymentStatus(groupId, "pending", status, message);
    } else if (status === 8 || status === 4) {
      const settled = group[0].status === "paid" || group[0].status === "conflict";
      await applyPaymentStatus(groupId, settled ? "cancelled" : "failed", status, message);
    } else {
      await applyPaymentStatus(groupId, "failed", status, message);
    }
  } catch (e) {
    console.error("[ipn] processing failed", e);
    return NextResponse.json({ errorType: 1, errorCode: 3, errorMessage: "temporary" }); // Netopia retries
  }
  return ok();
}
