"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, CheckCircle2 } from "lucide-react";
import SignaturePadModal from "./SignaturePadModal";

export default function SubmitWeekPanel({
  visitLogId,
  daysComplete,
  daysStarted,
  daysReadyToSubmit,
  totalDays,
}: {
  visitLogId: string;
  daysComplete: number;
  daysStarted: number;
  daysReadyToSubmit: number;
  totalDays: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = daysReadyToSubmit > 0 && daysStarted === daysReadyToSubmit;
  const blockedByIncomplete = daysStarted > daysReadyToSubmit;

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
      <h2 className="font-semibold text-neutral-dark">End this week</h2>
      <p className="mt-1 text-sm text-neutral-mid">
        {daysReadyToSubmit === totalDays
          ? `All ${totalDays} days complete. You can end the week now.`
          : daysStarted === 0
            ? "Start by clocking in on a day card above."
            : blockedByIncomplete
              ? `Finish the rest (clock out + patient signature) on the started days before ending the week.`
              : daysReadyToSubmit === 1
                ? "You can end the week with 1 worked day. Any other day stays blank — that's fine."
                : `You can end the week with these ${daysReadyToSubmit} worked days. Any other day stays blank — that's fine.`}
      </p>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
        disabled={!canSubmit}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E8476C] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#c73a5a] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send size={14} />
        {daysReadyToSubmit === totalDays
          ? "End Week & Submit"
          : daysReadyToSubmit === 1
            ? "End Week & Submit (1 day worked)"
            : `End Week & Submit (${daysReadyToSubmit} days worked)`}
      </button>

      <p className="mt-2 text-xs text-neutral-mid">
        After ending the week, you&apos;ll sign the caregiver attestation and
        the log is sent to the office. It becomes read-only.
      </p>

      <SignaturePadModal
        open={open}
        onClose={() => setOpen(false)}
        title="Caregiver Attestation"
        subtitle="Required to submit this week's log"
        consentText="I personally have performed all services in accordance with Agency policy and have followed Universal Precautions, safety, infection control, and given emotional support."
        saveLabel="Submit Week"
        onSave={async ({ pngDataUrl, svgString }) => {
          const res = await fetch(
            `/api/caregiver/visits/${visitLogId}/submit`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                signaturePng: pngDataUrl,
                signatureSvg: svgString,
              }),
            }
          );
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error || "Could not submit week.");
          }
          setOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
}

export function SubmittedBanner({
  submittedAt,
}: {
  submittedAt: string;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
      <div className="flex items-center gap-2 text-blue-900">
        <CheckCircle2 size={18} />
        <h2 className="font-semibold">Submitted to the office</h2>
      </div>
      <p className="mt-1 text-sm text-blue-900">
        This weekly log was submitted on{" "}
        {new Date(submittedAt).toLocaleString([], {
          dateStyle: "medium",
          timeStyle: "short",
        })}{" "}
        and is awaiting admin review. The form is now read-only.
      </p>
    </div>
  );
}
