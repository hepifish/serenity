import { NextResponse } from "next/server";
import { getGroupByRef } from "@/lib/bookings";

/** The booking page polls this until Netopia's answer has arrived. */
export async function GET(req: Request, { params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const token = new URL(req.url).searchParams.get("t") ?? "";
  const g = await getGroupByRef(ref, token);
  if (!g) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const b = g[0];
  const expired = b.status === "pending" && b.hold_until < new Date() && !b.netopia_status;
  return NextResponse.json({ status: expired ? "expired" : b.status }, { headers: { "Cache-Control": "no-store" } });
}
