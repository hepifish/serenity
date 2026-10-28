import { NextResponse } from "next/server";
import { isForeignOrigin } from "@/lib/admin-auth";
import { GATE_COOKIE, GATE_MAX_AGE_S, gateActive, gatePass, isGatePassword, safeNext } from "@/lib/gate";
import { overLimit } from "@/lib/rate-limit";

/** The gate form posts here: a pass for 30 days, then back to the page the visitor asked for. */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const form = await req.formData();
  const next = safeNext(form.get("next"));
  // with the gate off there is nothing to unlock: never follow `next` then
  if (!gateActive()) return NextResponse.redirect(new URL("/", url), 303);
  const lang = ["en", "ro", "de"].includes(String(form.get("lang"))) ? String(form.get("lang")) : "en";
  const back = (error: string) => NextResponse.redirect(new URL(`/${lang}/gate?error=${error}&next=${encodeURIComponent(next)}`, url), 303);
  if (isForeignOrigin(req)) return back("1");
  if (await overLimit(req, "gate", 10, 600)) return back("limit");
  if (!isGatePassword(String(form.get("password") ?? ""))) return back("1");
  const res = NextResponse.redirect(new URL(next, url), 303);
  res.cookies.set(GATE_COOKIE, gatePass(), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: GATE_MAX_AGE_S });
  return res;
}
