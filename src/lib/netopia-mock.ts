import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash, generateKeyPairSync, randomUUID } from "node:crypto";
import { importPKCS8, SignJWT } from "jose";

/**
 * A local stand-in for Netopia, used only when NETOPIA_MOCK=1. It keeps the
 * real contract: start returns a payment page URL, and the outcome arrives as
 * an IPN signed RS512 with sub = base64(sha512(body)) and aud = POS signature.
 * The keypair is generated on first use and never leaves .netopia/.
 */

/** The parts of the start request (netopia.ts) the mock reads back. */
type StartBody = {
  config: { notifyUrl: string; redirectUrl: string; cancelUrl: string };
  order: { orderID: string; amount: number; posSignature: string; description: string };
};
type Order = { ntpId: string; body: StartBody; createdAt: number };
declare global {
  var __mockOrders: Map<string, Order> | undefined;
}
const orders = (globalThis.__mockOrders ??= new Map());

function ensureKeys() {
  if (existsSync(".netopia/mock-private-key.pem")) return;
  mkdirSync(".netopia", { recursive: true });
  const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  writeFileSync(".netopia/mock-public-key.pem", publicKey.export({ type: "spki", format: "pem" }));
  writeFileSync(".netopia/mock-private-key.pem", privateKey.export({ type: "pkcs8", format: "pem" }));
}

export async function mockStart(body: StartBody) {
  ensureKeys();
  const ntpId = "MOCK" + randomUUID().slice(0, 8).toUpperCase();
  orders.set(ntpId, { ntpId, body, createdAt: Date.now() });
  const base = new URL(body.config.notifyUrl).origin;
  return { ntpId, paymentUrl: `${base}/dev/netopia/${ntpId}` };
}

export function mockOrder(ntpId: string) {
  return orders.get(ntpId) ?? null;
}

/** Sends the IPN the way Netopia would, then tells the caller where the guest goes next. */
export async function mockComplete(ntpId: string, status: number, message: string) {
  const o = orders.get(ntpId);
  if (!o) throw new Error("Unknown mock order");
  ensureKeys();
  const raw = JSON.stringify({
    payment: { method: 1, ntpID: ntpId, status, amount: o.body.order.amount, currency: "RON", message, code: status === 3 ? "00" : "35",
      instrument: { panMasked: "9900****5098" } },
    order: { orderID: o.body.order.orderID },
  });
  const key = await importPKCS8(readFileSync(".netopia/mock-private-key.pem", "utf8"), "RS512");
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "RS512", typ: "JWT" })
    .setIssuer("NETOPIA Payments")
    .setAudience([o.body.order.posSignature])
    .setSubject(createHash("sha512").update(raw, "utf8").digest("base64"))
    .setIssuedAt()
    .sign(key);
  const res = await fetch(o.body.config.notifyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Verification-token": token },
    body: raw,
  });
  return { ipnStatus: res.status, ipnBody: await res.text(), redirect: status === 4 ? o.body.config.cancelUrl : o.body.config.redirectUrl, order: o };
}
