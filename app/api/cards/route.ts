import { NextResponse } from "next/server";
import { db } from "@vercel/postgres";
import { formatCurrency } from "@/app/lib/utils";

export async function GET() {
  const client = await db.connect();

  try {
    const invoiceCountPromise = await client.sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise =
      await client.sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = await client.sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? "0");
    const numberOfCustomers = Number(data[1].rows[0].count ?? "0");
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? "0");
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? "0");
    
      const cardArray = [
        {numberOfCustomers,
        numberOfInvoices,
        totalPaidInvoices,
        totalPendingInvoices,}
      ];

      return NextResponse.json(cardArray); // Return the query results as JSON
  } catch (error) {
    console.error("Error executing query:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  } finally {
    client.release(); // Ensure the client is released back to the pool
  }
}
