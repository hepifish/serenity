import Link from "next/link";

export default function AdminNav({ active }: { active: "prices" | "bookings" }) {
  return (
    <header className="admin-bar">
      <Link href="/admin/prices" className="logo">Serenity<span>.</span> <small>admin</small></Link>
      <nav>
        <Link href="/admin/prices" aria-current={active === "prices" ? "page" : undefined}>Prices</Link>
        <Link href="/admin/bookings" aria-current={active === "bookings" ? "page" : undefined}>Bookings & sync</Link>
        <Link href="/en" target="_blank">Site ↗</Link>
        <form action="/api/admin/logout" method="post"><button>Log out</button></form>
      </nav>
    </header>
  );
}
