import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import {
  visitLogs,
  visitLogDays,
  visitLogTasks,
  caregivers,
} from "@/lib/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { DAYS_OF_WEEK, TASKS } from "@/lib/caregiver-tasks";
import AdminActions from "./_components/AdminActions";
import PrintableForm from "./_components/PrintableForm";

export const metadata = {
  title: "Visit Log Detail · Admin",
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-amber-100 text-amber-800",
  submitted: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const DAY_LABELS: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

type TaskMeta = { key: string; en: string; es: string; custom?: boolean };
const TASK_LABELS = new Map<string, TaskMeta>(
  TASKS.map((t) => [t.key as string, t as unknown as TaskMeta])
);

export default async function AdminVisitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [log] = await db
    .select({
      id: visitLogs.id,
      patientFirstName: visitLogs.patientFirstName,
      patientLastName: visitLogs.patientLastName,
      patientNo: visitLogs.patientNo,
      voucherNo: visitLogs.voucherNo,
      weekStartDate: visitLogs.weekStartDate,
      serviceTypes: visitLogs.serviceTypes,
      comments: visitLogs.comments,
      status: visitLogs.status,
      submittedAt: visitLogs.submittedAt,
      caregiverSignaturePngUrl: visitLogs.caregiverSignaturePngUrl,
      caregiverAttestationSignedAt: visitLogs.caregiverAttestationSignedAt,
      caregiverAttestationIp: visitLogs.caregiverAttestationIp,
      caregiverAttestationUserAgent: visitLogs.caregiverAttestationUserAgent,
      cgFirstName: caregivers.firstName,
      cgLastName: caregivers.lastName,
      cgEmail: caregivers.email,
      cgEmployeeNo: caregivers.employeeNo,
    })
    .from(visitLogs)
    .leftJoin(caregivers, eq(caregivers.id, visitLogs.caregiverId))
    .where(eq(visitLogs.id, id))
    .limit(1);

  if (!log) notFound();

  const days = await db
    .select()
    .from(visitLogDays)
    .where(eq(visitLogDays.visitLogId, id))
    .orderBy(asc(visitLogDays.serviceDate));

  const taskRows = await db
    .select()
    .from(visitLogTasks)
    .where(eq(visitLogTasks.visitLogId, id));

  const tasksByDay: Record<string, Record<string, { checked: boolean; customLabel: string | null }>> = {};
  for (const t of taskRows) {
    if (!tasksByDay[t.dayOfWeek]) tasksByDay[t.dayOfWeek] = {};
    tasksByDay[t.dayOfWeek][t.taskKey] = {
      checked: t.checked ?? false,
      customLabel: t.taskLabelCustom ?? null,
    };
  }

  const daysWorked = days.filter((d) => d.clockInAt);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 visit-print-root">
      <style>{`
        /* Screen vs Print mode swap */
        .print-only { display: none; }
        @media print {
          @page { size: Letter; margin: 0.3in; }
          html, body { background: #fff !important; }

          /* Hide ALL site chrome aggressively */
          header, nav, footer,
          [data-mobile-cta-bar],
          [class*="MobileCTABar"], [class*="mobile-cta"],
          .tawk-min-container, iframe[title*="chat" i], iframe[src*="tawk"],
          #tawk-min-container, [class*="TawkChat"], [id*="tawk"],
          .admin-actions, .back-to-list, .next-devtools-info-button,
          .print-hide, .ua-print-hide, .screen-only,
          [aria-label*="chat" i], [data-chat-widget] {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
          }

          /* Show the branded print form */
          .print-only { display: block !important; }
          .printable-form { width: 100% !important; }

          /* Make root take full page, kill any fixed offsets */
          .visit-print-root {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            position: static !important;
          }
          .visit-print-root * { box-shadow: none !important; }
          .visit-print-root .day-card { page-break-inside: avoid; }

          /* Aggressively compact cards */
          .visit-print-root .rounded-2xl,
          .visit-print-root .rounded-xl,
          .visit-print-root .rounded-lg { border-radius: 4pt !important; }
          .visit-print-root .p-6 { padding: 6pt !important; }
          .visit-print-root .p-5 { padding: 5pt !important; }
          .visit-print-root .p-4 { padding: 5pt !important; }
          .visit-print-root .p-3 { padding: 3pt !important; }
          .visit-print-root .py-8 { padding-top: 0 !important; padding-bottom: 0 !important; }
          .visit-print-root .py-2 { padding-top: 1pt !important; padding-bottom: 1pt !important; }
          .visit-print-root .py-3 { padding-top: 2pt !important; padding-bottom: 2pt !important; }
          .visit-print-root .px-4 { padding-left: 5pt !important; padding-right: 5pt !important; }
          .visit-print-root .mt-8 { margin-top: 4pt !important; }
          .visit-print-root .mt-6 { margin-top: 3pt !important; }
          .visit-print-root .mt-4 { margin-top: 3pt !important; }
          .visit-print-root .mt-3 { margin-top: 2pt !important; }
          .visit-print-root .mt-2 { margin-top: 1pt !important; }
          .visit-print-root .mt-1 { margin-top: 1pt !important; }
          .visit-print-root .mb-3 { margin-bottom: 2pt !important; }
          .visit-print-root .mb-4 { margin-bottom: 2pt !important; }
          .visit-print-root .mb-6 { margin-bottom: 3pt !important; }
          .visit-print-root .pt-4 { padding-top: 2pt !important; }
          .visit-print-root .space-y-3 > * + * { margin-top: 3pt !important; }
          .visit-print-root .gap-3 { gap: 3pt !important; }
          .visit-print-root .gap-4 { gap: 3pt !important; }

          /* Compact "not worked" day rows */
          .visit-print-root .day-not-worked {
            padding: 2pt 6pt !important;
            border-radius: 3pt !important;
            font-size: 8pt !important;
            margin-bottom: 1pt !important;
          }

          /* Compress signature blocks */
          .visit-print-root img[alt*="signature" i] {
            max-height: 45pt !important;
          }

          /* Font scaling */
          .visit-print-root { font-size: 9pt; line-height: 1.25; }
          .visit-print-root h1 { font-size: 14pt !important; line-height: 1.1 !important; }
          .visit-print-root h2 { font-size: 11pt !important; margin-top: 4pt !important; }
          .visit-print-root h3 { font-size: 9pt !important; }
          .visit-print-root .text-2xl { font-size: 14pt !important; }
          .visit-print-root .text-lg { font-size: 11pt !important; }
          .visit-print-root .text-sm { font-size: 8.5pt !important; }
          .visit-print-root .text-xs { font-size: 7.5pt !important; }
          .visit-print-root .text-\\[10px\\] { font-size: 6.5pt !important; }
        }
      `}</style>

      <Link
        href="/admin/visits"
        className="back-to-list mb-4 inline-flex items-center gap-1 text-sm text-neutral-mid hover:text-[#E8476C]"
      >
        <ChevronLeft size={16} /> All visit logs
      </Link>

      <AdminActions visitLogId={log.id} status={log.status} />

      {/* PRINT-ONLY: branded form */}
      <div className="print-only">
        <PrintableForm
          log={{
            patientFirstName: log.patientFirstName,
            patientLastName: log.patientLastName,
            weekStartDate: log.weekStartDate,
            serviceTypes: log.serviceTypes,
            comments: log.comments,
            status: log.status,
            submittedAt: log.submittedAt,
            cgFirstName: log.cgFirstName,
            cgLastName: log.cgLastName,
            cgEmployeeNo: log.cgEmployeeNo,
            caregiverSignaturePngUrl: log.caregiverSignaturePngUrl,
            caregiverAttestationSignedAt: log.caregiverAttestationSignedAt,
          }}
          days={days.map((d) => ({
            dayOfWeek: d.dayOfWeek,
            serviceDate: d.serviceDate as unknown as string,
            clockInAt: d.clockInAt,
            clockOutAt: d.clockOutAt,
            totalHours: d.totalHours,
            clockInLat: d.clockInLat,
            clockInLng: d.clockInLng,
            clockInAccuracyM: d.clockInAccuracyM,
            clockOutLat: d.clockOutLat,
            clockOutLng: d.clockOutLng,
            clockOutAccuracyM: d.clockOutAccuracyM,
            patientSignaturePngUrl: d.patientSignaturePngUrl,
            patientSignedByName: d.patientSignedByName,
            patientSignatureAt: d.patientSignatureAt,
            patientSignatureIp: d.patientSignatureIp,
          }))}
          tasksByDay={tasksByDay}
        />
      </div>

      {/* SCREEN-ONLY: existing card view (hidden on print) */}
      <div className="screen-only">

      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#E8476C]">
              Visit Log
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-neutral-dark">
              {log.patientLastName}, {log.patientFirstName}
            </h1>
            <p className="mt-1 text-sm text-neutral-mid">
              Week of{" "}
              {new Date(log.weekStartDate).toISOString().slice(0, 10)} ·{" "}
              {log.serviceTypes.map((s) => s.replace(/_/g, " ")).join(", ")}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              STATUS_STYLES[log.status ?? "draft"] ?? STATUS_STYLES.draft
            }`}
          >
            {log.status}
          </span>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-neutral-mid">
              Caregiver
            </dt>
            <dd className="mt-1 font-medium text-neutral-dark">
              {log.cgLastName}, {log.cgFirstName}
            </dd>
            <dd className="text-xs text-neutral-mid">#{log.cgEmployeeNo}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-neutral-mid">
              Patient #
            </dt>
            <dd className="mt-1 font-medium text-neutral-dark">
              {log.patientNo || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-neutral-mid">
              Voucher
            </dt>
            <dd className="mt-1 font-medium text-neutral-dark">
              {log.voucherNo || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-neutral-mid">
              Submitted
            </dt>
            <dd className="mt-1 font-medium text-neutral-dark">
              {log.submittedAt
                ? new Date(log.submittedAt).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "—"}
            </dd>
          </div>
        </dl>
      </div>

      {/* Days */}
      <h2 className="mt-8 mb-3 font-display text-lg font-semibold text-neutral-dark">
        Daily visits ({daysWorked.length} day{daysWorked.length === 1 ? "" : "s"} worked)
      </h2>

      <div className="space-y-3">
        {DAYS_OF_WEEK.map((dayKey) => {
          const d = days.find((x) => x.dayOfWeek === dayKey);
          if (!d) return null;
          const worked = d.clockInAt !== null;
          if (!worked) {
            return (
              <div
                key={dayKey}
                className="day-not-worked rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-xs text-neutral-mid"
              >
                {DAY_LABELS[dayKey]}{" "}
                <span className="text-neutral-mid">
                  · {new Date(d.serviceDate).toISOString().slice(0, 10)}
                </span>{" "}
                — not worked
              </div>
            );
          }
          const dayTasks = tasksByDay[dayKey];
          const checkedTasks = dayTasks
            ? Object.entries(dayTasks).filter(([, v]) => v.checked)
            : [];

          return (
            <div
              key={dayKey}
              className="rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-neutral-dark">
                    {DAY_LABELS[dayKey]}
                  </h3>
                  <p className="text-xs text-neutral-mid">
                    {new Date(d.serviceDate).toISOString().slice(0, 10)}
                  </p>
                </div>
                {d.totalHours && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    {d.totalHours}h
                  </span>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-gray-200 p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-mid">
                    Clock In
                  </p>
                  <p className="mt-1 font-semibold text-neutral-dark">
                    {d.clockInAt
                      ? new Date(d.clockInAt).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "—"}
                  </p>
                  {d.clockInLat && (
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-neutral-mid">
                      <MapPin size={9} />
                      {d.clockInLat}, {d.clockInLng}
                      {d.clockInAccuracyM && ` (±${d.clockInAccuracyM}m)`}
                    </p>
                  )}
                </div>
                <div className="rounded-lg border border-gray-200 p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-mid">
                    Clock Out
                  </p>
                  <p className="mt-1 font-semibold text-neutral-dark">
                    {d.clockOutAt
                      ? new Date(d.clockOutAt).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "—"}
                  </p>
                  {d.clockOutLat && (
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-neutral-mid">
                      <MapPin size={9} />
                      {d.clockOutLat}, {d.clockOutLng}
                      {d.clockOutAccuracyM && ` (±${d.clockOutAccuracyM}m)`}
                    </p>
                  )}
                </div>
              </div>

              {checkedTasks.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-mid">
                    Tasks performed ({checkedTasks.length})
                  </p>
                  <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {checkedTasks.map(([key, info]) => {
                      const t = TASK_LABELS.get(key);
                      const isCustom = t && "custom" in t && t.custom;
                      return (
                        <li
                          key={key}
                          className="flex items-start gap-1.5 text-xs text-neutral-dark"
                        >
                          <CheckCircle2
                            size={11}
                            className="mt-0.5 text-green-600"
                          />
                          <span>
                            {isCustom && info.customLabel
                              ? info.customLabel
                              : t?.en || key}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {d.patientSignaturePngUrl && (
                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-mid">
                    Patient signature
                  </p>
                  <div className="mt-2 inline-block rounded-md border border-gray-200 bg-white p-2">
                    <Image
                      src={d.patientSignaturePngUrl}
                      alt="Patient signature"
                      width={300}
                      height={80}
                      unoptimized
                      className="max-h-20 max-w-xs object-contain"
                    />
                  </div>
                  <p className="mt-2 text-xs text-neutral-mid">
                    Signed by{" "}
                    <span className="font-medium text-neutral-dark">
                      {d.patientSignedByName}
                    </span>
                    {d.patientSignatureAt && (
                      <>
                        {" "}
                        <Clock size={9} className="inline mb-0.5" />{" "}
                        {new Date(d.patientSignatureAt).toLocaleString()}
                      </>
                    )}
                    {d.patientSignatureIp && (
                      <> · IP {d.patientSignatureIp}</>
                    )}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comments */}
      {log.comments && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-mid">
            Comments
          </h3>
          <p className="mt-2 text-sm text-neutral-dark">{log.comments}</p>
        </div>
      )}

      {/* Caregiver attestation */}
      {log.caregiverSignaturePngUrl && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="font-display text-lg font-semibold text-neutral-dark">
            Caregiver attestation
          </h2>
          <p className="mt-2 text-sm text-neutral-mid">
            &ldquo;I personally have performed all services in accordance with
            Agency policy and have followed Universal Precautions, safety,
            infection control, and given emotional support.&rdquo;
          </p>
          <div className="mt-4 inline-block rounded-md border border-gray-200 bg-gray-50 p-3">
            <Image
              src={log.caregiverSignaturePngUrl}
              alt="Caregiver signature"
              width={300}
              height={80}
              unoptimized
              className="max-h-20 max-w-xs object-contain"
            />
          </div>
          <p className="mt-3 text-xs text-neutral-mid">
            Signed by{" "}
            <span className="font-medium text-neutral-dark">
              {log.cgLastName}, {log.cgFirstName}
            </span>{" "}
            <Clock size={9} className="inline mb-0.5" />{" "}
            {log.caregiverAttestationSignedAt &&
              new Date(log.caregiverAttestationSignedAt).toLocaleString()}{" "}
            · IP {log.caregiverAttestationIp || "—"}
          </p>
          {log.caregiverAttestationUserAgent && (
            <p className="ua-print-hide mt-1 text-xs text-neutral-mid">
              UA:{" "}
              <code className="font-mono text-[10px]">
                {log.caregiverAttestationUserAgent}
              </code>
            </p>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
