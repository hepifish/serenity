import { notFound, redirect } from "next/navigation";
import { mockComplete, mockOrder } from "@/lib/netopia-mock";

// A stand-in for Netopia's hosted card page, only with NETOPIA_MOCK=1.
// Each button plays one of Netopia's documented sandbox outcomes.
const OUTCOMES = [
  { status: 3, label: "Pay (9900 0048 1022 5098, accepted)", message: "Tranzacție aprobată" },
  { status: 12, label: "Decline (9900 5185 7283 1942, insufficient funds)", message: "Fonduri insuficiente" },
  { status: 4, label: "Cancel and go back", message: "Anulat de client" },
];

export default async function MockPay({ params }: { params: Promise<{ id: string }> }) {
  if (process.env.NETOPIA_MOCK !== "1") notFound();
  const { id } = await params;
  const o = mockOrder(id);
  if (!o) notFound();

  async function finish(formData: FormData) {
    "use server";
    const status = Number(formData.get("status"));
    const out = OUTCOMES.find((x) => x.status === status)!;
    const r = await mockComplete(id, status, out.message);
    console.log("[netopia-mock] IPN answered", r.ipnStatus, r.ipnBody);
    redirect(r.redirect);
  }

  return (
    <main style={{ maxWidth: 460, margin: "8vh auto", background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 10px 40px rgba(0,0,0,.08)" }}>
      <p style={{ fontSize: 12, letterSpacing: 2, color: "#2a5bd7", fontWeight: 700 }}>NETOPIA · LOCAL TEST STAND-IN</p>
      <h1 style={{ fontSize: 22, margin: "12px 0" }}>{o.body.order.amount.toFixed(2)} RON</h1>
      <p style={{ color: "#555", fontSize: 14 }}>{o.body.order.description}</p>
      <form action={finish} style={{ display: "grid", gap: 10, marginTop: 24 }}>
        {OUTCOMES.map((x) => (
          <button key={x.status} name="status" value={x.status} style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #ccd", background: x.status === 3 ? "#2a5bd7" : "#fff", color: x.status === 3 ? "#fff" : "#111", cursor: "pointer", textAlign: "left" }}>
            {x.label}
          </button>
        ))}
      </form>
    </main>
  );
}
