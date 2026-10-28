import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin-auth";
import { GATE_COOKIE, gateActive, gateExempt, isGatePass } from "@/lib/gate";

// Three jobs: the pre-launch password gate (only while SITE_GATE_PASSWORD is
// set), turning everyone but Pati away from /admin early, and sending visitors
// without a language prefix to the right one. The admin check is the first
// door only: every admin page and route checks the cookie again itself.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const first = pathname.split("/")[1];

  if (gateActive()) {
    const res = gate(req) ?? route(req);
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }
  if (first === "api" || isLocale(first)) return NextResponse.next();
  return route(req);
}

function gate(req: NextRequest): NextResponse | null {
  const { pathname, search } = req.nextUrl;
  if (gateExempt(pathname) || isGatePass(req.cookies.get(GATE_COOKIE)?.value)) return null;
  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "gated" }, { status: 401 });
  const first = pathname.split("/")[1];
  const url = req.nextUrl.clone();
  url.pathname = `/${isLocale(first) ? first : preferredLocale(req)}/gate`;
  url.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

function route(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;
  const first = pathname.split("/")[1];
  if (first === "api" || first === "ical" || first === "dev" || isLocale(first)) return NextResponse.next();

  if (first === "admin") {
    if (pathname === "/admin/login") return NextResponse.next();
    if (isValidAdminToken(req.cookies.get(ADMIN_COOKIE)?.value)) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // /RO/... is /ro/...; an unknown two-letter prefix (/fr, /es) is a language
  // we don't have, so it is replaced rather than kept as a path segment.
  const rest = pathname.slice(first.length + 1);
  const url = req.nextUrl.clone();
  if (isLocale(first.toLowerCase())) url.pathname = `/${first.toLowerCase()}${rest}`;
  else if (/^[a-z]{2}$/i.test(first)) url.pathname = `/${preferredLocale(req)}${rest}`;
  else url.pathname = `/${preferredLocale(req)}${pathname === "/" ? "" : pathname}`;
  const res = NextResponse.redirect(url);
  res.headers.set("Vary", "Accept-Language");
  return res;
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
  // Everything but Next internals and static files (images, fonts, robots.txt,
  // sitemap.xml, the .ics feeds). RSC and segment-prefetch paths (.rsc) do come
  // through. With the gate off, localized pages and API routes return at once.
  matcher: ["/((?!_next/|.*\\.(?:png|jpe?g|webp|avif|gif|svg|ico|ics|txt|xml|woff2?|webmanifest)$).*)"],
};
