import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isForeignOrigin, issueAdminToken, safeEqual } from "@/lib/admin-auth";
import { overLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const back = (error: string) => NextResponse.redirect(new URL(`/admin/login?error=${error}`, url), 303);
  if (isForeignOrigin(req)) return back("1");
  if (await overLimit(req, "login", 5, 600)) return back("limit");
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || !safeEqual(password, expected)) return back("1");
  const { value, maxAge } = issueAdminToken();
  const res = NextResponse.redirect(new URL("/admin/prices", url), 303);
  res.cookies.set(ADMIN_COOKIE, value, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge });
  return res;
}
