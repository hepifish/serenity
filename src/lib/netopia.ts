import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { importSPKI, jwtVerify } from "jose";

/**
 * Netopia Payments, API v2 (hosted payment page). We never see a card number:
 * the guest types it on Netopia's page, and Netopia tells us the outcome in a
 * signed server-to-server notification (IPN).
 *
 * NETOPIA_MOCK=1 swaps Netopia for a local stand-in (src/app/dev/netopia) that
 * speaks the same protocol, so the full flow can be tested without credentials.
 * Production ignores it.
 */

const PRODUCTION = process.env.VERCEL_ENV === "production";
// local only: never on any Vercel deployment, preview included
export const MOCK = process.env.NETOPIA_MOCK === "1" && !PRODUCTION && !process.env.VERCEL;
// Live unless sandbox is asked for by name. Sandbox in production would let the
// public test card "pay", so it stops every payment instead.
const SANDBOX = process.env.NETOPIA_SANDBOX === "true";
function base() {
  if (SANDBOX && PRODUCTION) throw new Error("NETOPIA_SANDBOX=true in production: set it to false");
  return SANDBOX ? "https://secure.sandbox.netopia-payments.com" : "https://secure.mobilpay.ro/pay";
}
/** An IPN older than this is a replay, not a retry. */
const IPN_MAX_AGE_S = 3 * 24 * 3600;

export const PAID_STATUSES = new Set([3, 5]); // paid, confirmed
export const PENDING_STATUSES = new Set([1, 2, 6, 14, 15]); // new, opened, pending, auth pending, 3DS
// anything else (4 cancelled, 8 refunded, 11 error, 12 declined, 13 fraud, 17 reversed) frees the dates

export type StartPayment = {
  orderId: string;
  amount: number;
  description: string;
  lang: string;
  notifyUrl: string;
  redirectUrl: string;
  cancelUrl: string;
  billing: { email: string; phone: string; firstName: string; lastName: string; countryName: string };
  products: { name: string; code: string; price: number }[];
};

function posSignature() {
  const s = process.env.NETOPIA_POS_SIGNATURE;
  if (!s && !MOCK) throw new Error("NETOPIA_POS_SIGNATURE is not set");
  return s ?? "MOCK-POS0-SIGN-ATUR-E000";
}

export async function startPayment(p: StartPayment): Promise<{ ntpId: string; paymentUrl: string }> {
  const body = {
    config: {
      notifyUrl: p.notifyUrl,
      redirectUrl: p.redirectUrl,
      cancelUrl: p.cancelUrl,
      language: p.lang === "ro" ? "ro" : p.lang === "de" ? "de" : "en",
    },
    payment: { options: { installments: 0, bonus: 0 }, data: {} },
    order: {
      ntpID: "",
      posSignature: posSignature(),
      dateTime: new Date().toISOString(),
      description: p.description,
      orderID: p.orderId,
      amount: p.amount,
      currency: "RON",
      billing: { ...p.billing, city: "", country: 0, state: "", postalCode: "", details: "" },
      // The company is not VAT registered, so no VAT on any line.
      products: p.products.map((x) => ({ ...x, category: "accommodation", vat: 0 })),
      installments: { selected: 0, available: [0] },
      data: {},
    },
  };

  if (MOCK) {
    const { mockStart } = await import("./netopia-mock");
    return mockStart(body);
  }

  const apiKey = process.env.NETOPIA_API_KEY;
  if (!apiKey) throw new Error("NETOPIA_API_KEY is not set");
  const res = await fetch(`${base()}/payment/card/start`, {
    method: "POST",
    headers: { Authorization: apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  const data = await res.json().catch(() => null);
  const url = data?.payment?.paymentURL;
  if (!res.ok || !url) {
    throw new Error(`Netopia start failed (${res.status}): ${data?.error?.code ?? ""} ${data?.error?.message ?? ""}`.trim());
  }
  return { ntpId: String(data.payment.ntpID), paymentUrl: url };
}

// Netopia's IPN key is public and lives in the repo: one source, same in every
// environment (next.config.ts traces it into the IPN function).
let publicKey: Promise<CryptoKey> | null = null;
function netopiaPublicKey() {
  publicKey ??= importSPKI(readFileSync(MOCK ? ".netopia/mock-public-key.pem" : ".netopia/netopia-ipn-public-key.pem", "utf8"), "RS512");
  return publicKey;
}

export type Ipn = {
  payment: { ntpID: string; status: number; amount: number; currency: string; message?: string; code?: string };
  order: { orderID: string };
};

/**
 * Accepts the notification only if Netopia signed it, for our POS, over these
 * exact bytes. Throws otherwise.
 */
export async function verifyIpn(rawBody: string, token: string | null): Promise<Ipn> {
  if (!token) throw new Error("Missing Verification-token");
  base(); // refuses sandbox in production here too
  const { payload } = await jwtVerify(token, await netopiaPublicKey(), {
    algorithms: ["RS512"],
    issuer: "NETOPIA Payments",
  });
  // jose's maxTokenAge would reject a token without iat; Netopia's docs do not promise one.
  if (typeof payload.iat === "number" && Date.now() / 1000 - payload.iat > IPN_MAX_AGE_S) throw new Error("IPN token too old");
  const aud = Array.isArray(payload.aud) ? payload.aud[0] : payload.aud;
  if (aud !== posSignature()) throw new Error("IPN is for another POS");
  const digest = createHash("sha512").update(rawBody, "utf8").digest("base64");
  if (payload.sub !== digest) throw new Error("IPN body does not match its signature");
  return JSON.parse(rawBody) as Ipn;
}
