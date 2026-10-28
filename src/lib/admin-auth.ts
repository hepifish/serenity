import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// The admin is one person with one password. A signed cookie is enough: no
// user table. Bumping ADMIN_SESSION_GEN logs out every browser at once.
// proxy.ts checks it first; every admin page, route and action checks again,
// so a request that slips past the proxy still meets a closed door.

export const ADMIN_COOKIE = "__Host-serenity_admin"; // Secure, Path=/, no Domain: the browser enforces it
const MAX_AGE_S = 60 * 60 * 24 * 7;

function hmac(data: string): Buffer {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET is not set");
  return createHmac("sha256", secret).update(`${data}.${process.env.ADMIN_SESSION_GEN ?? "1"}`).digest();
}

const EQ_KEY = randomBytes(32);
/** Constant time, length included: both sides are hashed to 32 bytes first. */
export function safeEqual(a: string, b: string): boolean {
  const d = (s: string) => createHmac("sha256", EQ_KEY).update(s).digest();
  return timingSafeEqual(d(a), d(b));
}

export function issueAdminToken(): { value: string; maxAge: number } {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE_S);
  return { value: `${exp}.${hmac(exp).toString("base64url")}`, maxAge: MAX_AGE_S };
}

export function isValidAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !(Number(exp) > Date.now() / 1000)) return false;
  return safeEqual(sig, hmac(exp).toString("base64url"));
}

/** Admin pages and server actions: anyone else goes to the login page. */
export async function requireAdmin(): Promise<void> {
  if (!isValidAdminToken((await cookies()).get(ADMIN_COOKIE)?.value)) redirect("/admin/login");
}

/** A write from another site (CSRF) carries a foreign Origin header. */
export function isForeignOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  return !!origin && origin !== new URL(req.url).origin;
}

/** Admin API routes: null when the caller is Pati, else the response to send. */
export function adminDenied(req: Request): Response | null {
  const cookie = req.headers.get("cookie") ?? "";
  const token = cookie.split(/;\s*/).find((c) => c.startsWith(ADMIN_COOKIE + "="))?.slice(ADMIN_COOKIE.length + 1);
  if (!isValidAdminToken(token)) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (req.method !== "GET" && isForeignOrigin(req)) return Response.json({ error: "forbidden" }, { status: 403 });
  return null;
}
