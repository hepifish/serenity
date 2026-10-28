import { NextResponse } from "next/server";
import { ADMIN_COOKIE, issueAdminToken, timingSafeEqual } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD ?? "";
  const url = new URL(req.url);
  if (!expected || !timingSafeEqual(password, expected)) {
    await new Promise((r) => setTimeout(r, 1200)); // slow down guessing
    return NextResponse.redirect(new URL("/admin/login?error=1", url), 303);
  }
  const { value, maxAge } = await issueAdminToken();
  const res = NextResponse.redirect(new URL("/admin/prices", url), 303);
  res.cookies.set(ADMIN_COOKIE, value, { httpOnly: true, secure: url.protocol === "https:", sameSite: "lax", path: "/", maxAge });
  return res;
}
