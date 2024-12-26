import { Card } from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import { lusitana } from "@/app/ui/fonts";
import {
  CustomerField,
  CustomersTableType,
  Cards,
  InvoiceForm,
  InvoicesTable,
  LatestInvoice,
  LatestInvoiceRaw,
  Revenue,
} from "@/app/lib/definitions";

export default async function Page() {

   const res = await fetch("http://localhost:3000/api/revenue", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch revenue data");
  }
   const resInvoices = await fetch("http://localhost:3000/api/invoices", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch invoices data");
  }
   const resCards = await fetch("http://localhost:3000/api/cards", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch cards data");
  }

  const revenue: Revenue[] = await res.json();
  const latestInvoices: LatestInvoice[] = await resInvoices.json();
  const cards: Cards[] = await resCards.json();

  
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>

      {cards.map((card, index) => (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" key={index}>
          <Card
            title="Collected"
            value={card.totalPaidInvoices}
            type="collected"
          />
          <Card
            title="Pending"
            value={card.totalPendingInvoices}
            type="pending"
          />
          <Card
            title="Total Invoices"
            value={card.numberOfInvoices}
            type="invoices"
          />
          <Card
            title="Total Customers"
            value={card.numberOfCustomers}
            type="customers"
          />
        </div>
      ))}

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue} />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}
