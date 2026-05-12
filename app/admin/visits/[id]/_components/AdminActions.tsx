"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Trash2,
  Download,
  Printer,
  Loader2,
  RotateCw,
} from "lucide-react";

export default function AdminActions({
  visitLogId,
  status,
}: {
  visitLogId: string;
  status: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState("");

  const callAction = async (
    action: "approve" | "reject" | "reopen",
    extra?: Record<string, unknown>
  ) => {
    setError("");
    setBusy(action);
    const res = await fetch(`/api/admin/visits/${visitLogId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    setBusy(null);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || `${action} failed`);
      return;
    }
    setShowReject(false);
    setRejectReason("");
    router.refresh();
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Delete this visit log permanently? This cannot be undone."
      )
    )
      return;
    setBusy("delete");
    const res = await fetch(`/api/admin/visits/${visitLogId}`, {
      method: "DELETE",
    });
    setBusy(null);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Delete failed");
      return;
    }
    router.push("/admin/visits");
  };

  const downloadCsv = () => {
    window.location.href = `/api/admin/visits/${visitLogId}/export/csv`;
  };

  const print = () => window.print();

  return (
    <div className="admin-actions sticky top-2 z-10 mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-mid">
        Actions
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {status !== "approved" && (
          <button
            onClick={() => callAction("approve")}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-green-700 disabled:opacity-50"
          >
            {busy === "approve" ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <CheckCircle2 size={12} />
            )}
            Approve
          </button>
        )}
        {status !== "rejected" && (
          <button
            onClick={() => setShowReject((v) => !v)}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-50"
          >
            <XCircle size={12} />
            Reject
          </button>
        )}
        {(status === "approved" || status === "rejected") && (
          <button
            onClick={() => callAction("reopen")}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-amber-700 disabled:opacity-50"
          >
            {busy === "reopen" ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <RotateCw size={12} />
            )}
            Reopen
          </button>
        )}
        <span className="mx-1 h-5 w-px bg-gray-200" />
        <button
          onClick={downloadCsv}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-neutral-dark transition-all hover:border-[#E8476C] hover:text-[#E8476C]"
        >
          <Download size={12} />
          Export CSV
        </button>
        <button
          onClick={print}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-neutral-dark transition-all hover:border-[#E8476C] hover:text-[#E8476C]"
        >
          <Printer size={12} />
          Print / Save PDF
        </button>
        <span className="mx-1 h-5 w-px bg-gray-200" />
        <button
          onClick={handleDelete}
          disabled={busy !== null}
          className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-50 disabled:opacity-50"
        >
          {busy === "delete" ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Trash2 size={12} />
          )}
          Delete
        </button>
      </div>

      {showReject && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
          <label className="block text-xs font-medium text-red-900">
            Rejection reason (caregiver will see this)
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-red-300 bg-white p-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
            placeholder="What needs to be corrected?"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() =>
                callAction("reject", { rejectionReason: rejectReason })
              }
              disabled={busy !== null || !rejectReason.trim()}
              className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-50"
            >
              {busy === "reject" ? (
                <Loader2 size={11} className="animate-spin" />
              ) : null}
              Confirm reject
            </button>
            <button
              onClick={() => setShowReject(false)}
              className="rounded-full px-3 py-1 text-xs text-red-700 hover:text-red-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}

      <style>{`
        @media print {
          .admin-actions { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>
    </div>
  );
}
