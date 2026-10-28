import { NextResponse } from "next/server";
import { getGroupByRef, guestStatus } from "@/lib/bookings";

/** The booking page polls this until Netopia's answer has arrived. */
export async function GET(req: Request, { params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const token = new URL(req.url).searchParams.get("t") ?? "";
  const g = await getGroupByRef(ref, token);
  if (!g) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ status: guestStatus(g[0]) }, { headers: { "Cache-Control": "no-store" } });
}
