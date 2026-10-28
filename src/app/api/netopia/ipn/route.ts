import { NextResponse } from "next/server";
import { applyPaymentStatus, getBooking, paidOverlap } from "@/lib/bookings";
import { isApartmentSlug } from "@/lib/apartments";
import { isStayFree } from "@/lib/availability";
import { sendBookingConfirmed } from "@/lib/email";
import { PAID_STATUSES, PENDING_STATUSES, verifyIpn } from "@/lib/netopia";

// Netopia's server calls this after every change in a payment. Nothing here
// trusts the body until verifyIpn has checked Netopia's signature over it.
const ok = () => NextResponse.json({ errorType: 0, errorCode: null, errorMessage: "" });

export async function POST(req: Request) {
  const raw = await req.text();
  let ipn;
  try {
    ipn = await verifyIpn(raw, req.headers.get("verification-token"));
  } catch (e) {
    console.warn("[ipn] rejected", e instanceof Error ? e.message : e);
    return NextResponse.json({ errorType: 2, errorCode: 1, errorMessage: "invalid signature" }, { status: 401 });
  }

  const booking = await getBooking(ipn.order.orderID).catch(() => null);
  if (!booking) return ok(); // not ours (or deleted): acknowledge so Netopia stops retrying
  if (Math.abs(Number(booking.amount) - Number(ipn.payment.amount)) > 0.01) {
    console.error("[ipn] amount mismatch", booking.ref, booking.amount, ipn.payment.amount);
    return NextResponse.json({ errorType: 2, errorCode: 2, errorMessage: "amount mismatch" });
  }

  const status = Number(ipn.payment.status);
  const message = ipn.payment.message ?? "";
  try {
    if (PAID_STATUSES.has(status)) {
      const paid = await applyPaymentStatus(booking.id, "paid", status, message);
      if (paid) {
        // A payment that lands after its hold expired may have lost the nights meanwhile.
        const lateClash = await paidOverlap(paid);
        const bookingComClash = isApartmentSlug(paid.apartment)
          ? !(await isStayFree(paid.apartment, paid.check_in, paid.check_out, { fresh: true, exceptBooking: paid.id }).catch(() => true))
          : false;
        await sendBookingConfirmed(paid, { conflict: lateClash || bookingComClash });
      }
    } else if (PENDING_STATUSES.has(status)) {
      await applyPaymentStatus(booking.id, "pending", status, message);
    } else if (status === 8 || status === 4) {
      await applyPaymentStatus(booking.id, booking.status === "paid" ? "cancelled" : "failed", status, message);
    } else {
      await applyPaymentStatus(booking.id, "failed", status, message);
    }
  } catch (e) {
    console.error("[ipn] processing failed", e);
    return NextResponse.json({ errorType: 1, errorCode: 3, errorMessage: "temporary" }); // Netopia retries
  }
  return ok();
}
