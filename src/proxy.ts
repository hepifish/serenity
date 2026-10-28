import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin-auth";

// Two jobs: send visitors without a language prefix to the right one, and turn
// everyone but Pati away from /admin early. It is the first door only: every
// admin page and route checks the cookie again itself.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    if (isValidAdminToken(req.cookies.get(ADMIN_COOKIE)?.value)) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  const url = req.nextUrl.clone();
  url.pathname = `/${preferredLocale(req)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

function preferredLocale(req: NextRequest) {
  const header = req.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (isLocale(code)) return code;
  }
  return DEFAULT_LOCALE;
}

export const config = {
  // Only what needs a decision: unprefixed paths and /admin. Localized pages
  // (cached), API routes, Next internals, the calendar feeds and files skip it.
  matcher: ["/((?!en(?:/|$)|ro(?:/|$)|de(?:/|$)|api|_next|ical|dev|.*\\..*).*)"],
};

