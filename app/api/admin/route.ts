import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { leads, inquiries, referrals, applications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

const TABLES = {
  leads,
  inquiries,
  referrals,
  applications,
} as const;

type TableName = keyof typeof TABLES;

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const table = (searchParams.get("table") || "leads") as string;
  const format = searchParams.get("format");

  if (!(table in TABLES)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const tableRef = TABLES[table as TableName];

  try {
    const data = await db
      .select()
      .from(tableRef)
      .orderBy(desc(tableRef.createdAt));

    if (format === "csv") {
      if (!data || data.length === 0) {
        return new Response("No data", { status: 200, headers: { "Content-Type": "text/csv" } });
      }
      const headers = Object.keys(data[0]);
      const csv = [
        headers.join(","),
        ...data.map((row: Record<string, unknown>) =>
          headers.map((h) => {
            const val = row[h];
            const str = val instanceof Date ? val.toISOString() : String(val ?? "");
            return `"${str.replace(/"/g, '""')}"`;
          }).join(",")
        ),
      ].join("\n");

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${table}-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, table, status } = body;

  if (!id || !table || !status) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!(table in TABLES)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const tableRef = TABLES[table as TableName];

  try {
    await db.update(tableRef).set({ status }).where(eq(tableRef.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const table = searchParams.get("table");

  if (!id || !table) {
    return NextResponse.json({ error: "Missing id or table" }, { status: 400 });
  }

  if (!(table in TABLES)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const tableRef = TABLES[table as TableName];

  try {
    await db.delete(tableRef).where(eq(tableRef.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
