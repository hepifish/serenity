import AdminNav from "@/components/AdminNav";
import PriceMatrix from "@/components/PriceMatrix";
import { todayInSibiu } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default function PricesPage() {
  return (
    <>
      <AdminNav active="prices" />
      <main className="admin-main">
        <PriceMatrix today={todayInSibiu()} />
      </main>
    </>
  );
}
