import { NextResponse } from "next/server";
import { db } from "@vercel/postgres";

export async function GETREVENUE() {
  const client = await db.connect();

  try {
    const result = await client.sql`
      SELECT * FROM revenue;
    `;

    return NextResponse.json(result.rows); // Return the query results as JSON
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
