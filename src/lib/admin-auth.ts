// The admin is one person with one password. A signed cookie is enough: no
// user table, no sessions to expire by hand. Web Crypto, so proxy.ts can use it.

export const ADMIN_COOKIE = "serenity_admin";
const MAX_AGE_S = 60 * 60 * 24 * 30;

async function hmac(data: string): Promise<string> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET is not set");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Buffer.from(sig).toString("base64url");
}

export async function issueAdminToken(): Promise<{ value: string; maxAge: number }> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_S;
  return { value: `${exp}.${await hmac(String(exp))}`, maxAge: MAX_AGE_S };
}

export async function isValidAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  const expected = await hmac(exp);
  return timingSafeEqual(sig, expected);
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** For API routes, which proxy.ts does not guard. */
export async function isAdminRequest(req: Request): Promise<boolean> {
  const cookie = req.headers.get("cookie") ?? "";
  const token = cookie.split(/;\s*/).find((c) => c.startsWith(ADMIN_COOKIE + "="))?.slice(ADMIN_COOKIE.length + 1);
  return isValidAdminToken(token);
}
