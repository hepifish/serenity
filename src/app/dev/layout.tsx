import "../globals.css";

export const metadata = { robots: { index: false } };

export default function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#f4f4f6", color: "#111" }}>{children}</body>
    </html>
  );
}
