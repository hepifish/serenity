import { APARTMENTS, isApartmentSlug } from "@/lib/apartments";
import { timingSafeEqual } from "@/lib/admin-auth";
import { directBookingsFor } from "@/lib/bookings";
import { buildIcal } from "@/lib/ical";

/**
 * /ical/<apartment>.ics?key=...  The feed Booking.com imports so our direct
 * bookings close those nights there too. The key keeps guests' dates private.
 */
export async function GET(req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const slug = file.replace(/\.ics$/, "");
  const key = new URL(req.url).searchParams.get("key") ?? "";
  const expected = process.env.ICAL_EXPORT_KEY ?? "";
  if (!isApartmentSlug(slug) || !expected || !timingSafeEqual(key, expected)) return new Response("Not found", { status: 404 });
  const rows = await directBookingsFor(slug);
  const body = buildIcal(`Serenity ${APARTMENTS[slug].name}`, rows.map((r) => ({ uid: r.id, start: r.check_in, end: r.check_out })));
  return new Response(body, { headers: { "Content-Type": "text/calendar; charset=utf-8", "Cache-Control": "no-store" } });
}
