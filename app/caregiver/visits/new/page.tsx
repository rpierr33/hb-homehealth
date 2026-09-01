"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { SERVICE_TYPES, getMondayOfWeek } from "@/lib/caregiver-tasks";

function snapToMonday(isoDate: string): string {
  // isoDate is YYYY-MM-DD from a <input type="date"> — interpret as local
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const day = dt.getDay(); // 0 Sun .. 6 Sat
  const diff = day === 0 ? -6 : 1 - day;
  dt.setDate(dt.getDate() + diff);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export default function NewVisitPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [weekStartDate, setWeekStartDate] = useState(getMondayOfWeek());
  const [comments, setComments] = useState("");

  const toggleService = (key: string) => {
    setServiceTypes((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (
      !patientFirstName.trim() ||
      !patientLastName.trim() ||
      serviceTypes.length === 0
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/caregiver/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientFirstName,
        patientLastName,
        serviceTypes,
        weekStartDate,
        comments,
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Could not save. Try again.");
      setSubmitting(false);
      return;
    }
    const { id } = await res.json();
    router.push(`/caregiver/visits/${id}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/caregiver"
        className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-mid hover:text-[#E8476C]"
      >
        <ChevronLeft size={16} /> Back to dashboard
      </Link>

      <p className="text-xs font-semibold uppercase tracking-wider text-[#E8476C]">
        Step 1 of 5 · Visit Information
      </p>
      <h1 className="mt-1 font-display text-3xl font-bold text-neutral-dark">
        Start a new weekly visit log
      </h1>
      <p className="mt-2 text-sm text-neutral-mid">
        This replaces the paper HHA Notes. Fill in the patient and assignment
        details below, then continue to log your daily visits, tasks, and
        signatures.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-neutral-dark">
            Patient
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-neutral-mid">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                value={patientFirstName}
                onChange={(e) => setPatientFirstName(e.target.value)}
                required
                autoComplete="off"
                className="mt-1 w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-[#E8476C] focus:ring-1 focus:ring-[#E8476C]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-neutral-mid">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                value={patientLastName}
                onChange={(e) => setPatientLastName(e.target.value)}
                required
                autoComplete="off"
                className="mt-1 w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-[#E8476C] focus:ring-1 focus:ring-[#E8476C]"
              />
            </div>
          </div>
        </fieldset>

        <div className="border-t border-gray-100 pt-6">
          <label className="block text-sm font-medium text-neutral-dark">
            Service Week <span className="text-red-500">*</span>
          </label>
          <p className="mt-1 text-xs text-neutral-mid">
            Pick any date in the week you worked. The week always starts on
            Monday and ends Sunday — we&apos;ll snap your pick to that Monday.
          </p>
          <input
            type="date"
            value={weekStartDate}
            onChange={(e) =>
              setWeekStartDate(
                e.target.value ? snapToMonday(e.target.value) : e.target.value
              )
            }
            required
            className="mt-2 w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-[#E8476C] focus:ring-1 focus:ring-[#E8476C]"
          />
          {weekStartDate && (
            <p className="mt-1 text-xs text-neutral-mid">
              Week of <strong>{weekStartDate}</strong> (Mon) through{" "}
              <strong>
                {(() => {
                  const [y, m, d] = weekStartDate.split("-").map(Number);
                  const sun = new Date(y, m - 1, d);
                  sun.setDate(sun.getDate() + 6);
                  return sun.toISOString().slice(0, 10);
                })()}
              </strong>{" "}
              (Sun).
            </p>
          )}
        </div>

        <div>
          <span className="block text-sm font-medium text-neutral-dark">
            Service Type(s) <span className="text-red-500">*</span>
          </span>
          <p className="mt-1 text-xs text-neutral-mid">Check all that apply.</p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SERVICE_TYPES.map((s) => {
              const checked = serviceTypes.includes(s.key);
              return (
                <label
                  key={s.key}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-all ${
                    checked
                      ? "border-[#E8476C] bg-[#E8476C]/5 text-[#E8476C]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleService(s.key)}
                    className="h-4 w-4 rounded border-gray-300 text-[#E8476C] focus:ring-[#E8476C]"
                  />
                  <span className="font-medium">{s.en}</span>
                  <span className="ml-auto text-xs italic text-neutral-mid">
                    {s.es}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor="comments"
            className="block text-sm font-medium text-neutral-dark"
          >
            Comments
          </label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={3}
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#E8476C] focus:ring-1 focus:ring-[#E8476C]"
            placeholder="Optional notes for the office."
          />
        </div>

        {error && (
          <div
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <Link
            href="/caregiver"
            className="text-sm font-medium text-neutral-mid hover:text-neutral-dark"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-[#E8476C] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#c73a5a] disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving…
              </>
            ) : (
              <>
                Continue <ChevronRight size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
