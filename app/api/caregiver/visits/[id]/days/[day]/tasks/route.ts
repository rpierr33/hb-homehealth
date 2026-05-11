import { NextResponse } from "next/server";
import { getCaregiverFromCookie } from "@/lib/caregiver-auth";
import { db } from "@/lib/db";
import { visitLogs, visitLogTasks } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { DAYS_OF_WEEK, TASKS, type DayOfWeek } from "@/lib/caregiver-tasks";

const VALID_TASK_KEYS = new Set<string>(TASKS.map((t) => t.key));

function isValidDay(d: string): d is DayOfWeek {
  return (DAYS_OF_WEEK as readonly string[]).includes(d);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; day: string }> }
) {
  const me = await getCaregiverFromCookie();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, day } = await params;
  if (!isValidDay(day)) {
    return NextResponse.json({ error: "Invalid day" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { taskKey, checked, customLabel } = body as {
    taskKey?: string;
    checked?: boolean;
    customLabel?: string;
  };

  if (!taskKey || !VALID_TASK_KEYS.has(taskKey)) {
    return NextResponse.json({ error: "Invalid taskKey" }, { status: 400 });
  }
  if (typeof checked !== "boolean") {
    return NextResponse.json(
      { error: "checked must be boolean" },
      { status: 400 }
    );
  }

  // Verify ownership + draft status
  const [parent] = await db
    .select({ id: visitLogs.id, status: visitLogs.status })
    .from(visitLogs)
    .where(and(eq(visitLogs.id, id), eq(visitLogs.caregiverId, me.sub)))
    .limit(1);
  if (!parent) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (parent.status !== "draft") {
    return NextResponse.json(
      { error: "Visit log is already submitted and cannot be modified." },
      { status: 409 }
    );
  }

  // Upsert (composite PK is visit_log_id + day_of_week + task_key)
  await db
    .insert(visitLogTasks)
    .values({
      visitLogId: id,
      dayOfWeek: day,
      taskKey,
      checked,
      taskLabelCustom: customLabel ?? null,
    })
    .onConflictDoUpdate({
      target: [
        visitLogTasks.visitLogId,
        visitLogTasks.dayOfWeek,
        visitLogTasks.taskKey,
      ],
      set: {
        checked,
        taskLabelCustom: customLabel ?? null,
      },
    });

  return NextResponse.json({ ok: true, taskKey, checked });
}
