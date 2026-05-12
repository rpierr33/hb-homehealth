import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { visitLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { action, rejectionReason } = body as {
    action?: "approve" | "reject" | "reopen";
    rejectionReason?: string;
  };

  const [existing] = await db
    .select()
    .from(visitLogs)
    .where(eq(visitLogs.id, id))
    .limit(1);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = new Date();

  if (action === "approve") {
    await db
      .update(visitLogs)
      .set({
        status: "approved",
        approvedAt: now,
        approvedBy: admin.sub,
        rejectedAt: null,
        rejectionReason: null,
        updatedAt: now,
      })
      .where(eq(visitLogs.id, id));
    return NextResponse.json({ ok: true, status: "approved" });
  }
  if (action === "reject") {
    if (!rejectionReason?.trim()) {
      return NextResponse.json(
        { error: "rejectionReason is required" },
        { status: 400 }
      );
    }
    await db
      .update(visitLogs)
      .set({
        status: "rejected",
        rejectedAt: now,
        rejectionReason: rejectionReason.trim(),
        approvedAt: null,
        approvedBy: null,
        updatedAt: now,
      })
      .where(eq(visitLogs.id, id));
    return NextResponse.json({ ok: true, status: "rejected" });
  }
  if (action === "reopen") {
    await db
      .update(visitLogs)
      .set({
        status: "submitted",
        approvedAt: null,
        approvedBy: null,
        rejectedAt: null,
        rejectionReason: null,
        updatedAt: now,
      })
      .where(eq(visitLogs.id, id));
    return NextResponse.json({ ok: true, status: "submitted" });
  }

  return NextResponse.json(
    { error: "action must be 'approve' | 'reject' | 'reopen'" },
    { status: 400 }
  );
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const result = await db
    .delete(visitLogs)
    .where(eq(visitLogs.id, id))
    .returning({ id: visitLogs.id });
  if (result.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, deletedId: id });
}
