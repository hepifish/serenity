import { notFound } from "next/navigation";
import AptMark from "@/components/AptMark";
import MorphLoader from "@/components/MorphLoader";
import { MARK_ORDER } from "@/lib/marks";

// Proof sheet for the apartment marks and the loader. Local development only.
export default function MarksSheet() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main style={{ background: "var(--ink)", color: "var(--stone)", minHeight: "100dvh", padding: 32, display: "grid", gap: 48 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-end" }}>
        {MARK_ORDER.map((s) => (
          <div key={s} style={{ display: "grid", gap: 16, justifyItems: "start" }}>
            <AptMark slug={s} size={160} />
            <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
              <AptMark slug={s} size={48} />
              <AptMark slug={s} size={24} />
            </div>
          </div>
        ))}
      </div>
      <div id="loader" style={{ display: "grid", placeItems: "center", padding: 40 }}>
        <MorphLoader size={160} label="Opening the door" delay={false} />
      </div>
    </main>
  );
}
