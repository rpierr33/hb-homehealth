"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2 } from "lucide-react";

export default function DuplicateButton({
  sourceLogId,
  patientLastName,
  patientFirstName,
}: {
  sourceLogId: string;
  patientLastName: string;
  patientFirstName: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handle = async () => {
    if (
      !confirm(
        `Start a new weekly log for ${patientLastName}, ${patientFirstName} using the same service types?`
      )
    )
      return;
    setBusy(true);
    const res = await fetch(
      `/api/caregiver/visits/${sourceLogId}/duplicate`,
      { method: "POST" }
    );
    if (!res.ok) {
      setBusy(false);
      alert("Could not duplicate. Try again.");
      return;
    }
    const { id } = await res.json();
    router.push(`/caregiver/visits/${id}`);
  };

  return (
    <button
      onClick={handle}
      disabled={busy}
      className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-neutral-dark transition-all hover:border-[#E8476C] hover:text-[#E8476C] disabled:opacity-50"
    >
      {busy ? <Loader2 size={11} className="animate-spin" /> : <Copy size={11} />}
      {busy ? "Duplicating…" : "Duplicate"}
    </button>
  );
}
