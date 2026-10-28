import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// Sensitive fields (the CNP) are sealed before they reach the database:
// AES-256-GCM, key in CHECKIN_KEY (32 random bytes, base64). Stored as
// iv.tag.ciphertext, all base64url. A leaked database alone reveals nothing.

function key() {
  const k = Buffer.from(process.env.CHECKIN_KEY ?? "", "base64");
  if (k.length !== 32) throw new Error("CHECKIN_KEY must be 32 bytes, base64");
  return k;
}

export function seal(plain: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key(), iv);
  const body = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), body].map((b) => b.toString("base64url")).join(".");
}

export function unseal(sealed: string): string {
  const [iv, tag, body] = sealed.split(".").map((p) => Buffer.from(p, "base64url"));
  const d = createDecipheriv("aes-256-gcm", key(), iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(body), d.final()]).toString("utf8");
}
