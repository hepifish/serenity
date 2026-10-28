import { createHmac } from "node:crypto";
import { safeEqual } from "./admin-auth";

/**
 * A password in front of the whole site until card payments are verified
 * live. On only while SITE_GATE_PASSWORD is set; delete the variable to open
 * the site. The pass is an HMAC of a constant keyed by the password, so a new
 * password turns every old pass away.
 */
export const GATE_COOKIE = "__Host-serenity_gate";
export const GATE_MAX_AGE_S = 60 * 60 * 24 * 30;

export const gateActive = () => !!process.env.SITE_GATE_PASSWORD;

export function gatePass(): string {
  return createHmac("sha256", process.env.SITE_GATE_PASSWORD ?? "").update("serenity-site-gate").digest("base64url");
}

export const isGatePass = (cookie: string | undefined) => !!cookie && safeEqual(cookie, gatePass());
export const isGatePassword = (password: string) => safeEqual(password, process.env.SITE_GATE_PASSWORD ?? "");

/** Machines that must get through: Netopia's IPN, Booking.com's import, Vercel Cron, the gate itself. */
export function gateExempt(pathname: string): boolean {
  return (
    pathname === "/api/netopia/ipn" ||
    pathname === "/api/gate" ||
    pathname.startsWith("/api/cron/") ||
    pathname.startsWith("/ical/") ||
    /^\/(en|ro|de)\/gate$/.test(pathname)
  );
}

/**
 * Only a path on this site. Browsers drop tabs and newlines and read "\\" as "/"
 * before resolving, so "/\t/evil.com" would become "//evil.com": reject those
 * characters outright, then resolve and keep nothing but the path.
 */
export function safeNext(next: unknown): string {
  if (typeof next !== "string" || !next.startsWith("/") || /[\u0000-\u001f\u007f\\]/.test(next)) return "/";
  const url = new URL(next, "http://gate.invalid");
  return url.origin === "http://gate.invalid" && !url.pathname.startsWith("//") ? url.pathname + url.search + url.hash : "/";
}
