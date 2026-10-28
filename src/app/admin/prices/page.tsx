import AdminNav from "@/components/AdminNav";
import PriceMatrix from "@/components/PriceMatrix";
import { requireAdmin } from "@/lib/admin-auth";
import { todayInSibiu } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function PricesPage() {
  await requireAdmin();
  return (
    <>
      <AdminNav active="prices" />
      <main className="admin-main">
        <PriceMatrix today={todayInSibiu()} />
      </main>
    </>
  );
}
