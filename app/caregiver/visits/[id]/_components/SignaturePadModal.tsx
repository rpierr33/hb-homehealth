"use client";

import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { X, Eraser, Check, Loader2 } from "lucide-react";

export default function SignaturePadModal({
  open,
  onClose,
  title,
  subtitle,
  consentText,
  saveLabel,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  consentText: string;
  saveLabel?: string;
  onSave: (payload: {
    pngDataUrl: string;
    svgString: string;
    signedByName: string;
  }) => Promise<void> | void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    const canvas = canvasRef.current;

    // High-DPI fixup
    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      const ctx = canvas.getContext("2d");
      ctx?.scale(ratio, ratio);
      padRef.current?.clear();
    };

    padRef.current = new SignaturePad(canvas, {
      penColor: "#1f2937",
      backgroundColor: "rgba(255,255,255,0)",
      minWidth: 0.6,
      maxWidth: 2.0,
    });
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      padRef.current?.off();
      padRef.current = null;
    };
  }, [open]);

  if (!open) return null;

  const clear = () => padRef.current?.clear();

  const handleSave = async () => {
    setError("");
    if (!padRef.current || padRef.current.isEmpty()) {
      setError("Please draw a signature.");
      return;
    }
    if (!name.trim()) {
      setError("Please type a name to confirm.");
      return;
    }
    if (!agreed) {
      setError("Please check the confirmation box.");
      return;
    }
    setSaving(true);
    try {
      const pngDataUrl = padRef.current.toDataURL("image/png");
      const svgString = padRef.current.toDataURL("image/svg+xml");
      await onSave({ pngDataUrl, svgString, signedByName: name.trim() });
      // Caller controls close
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save signature.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-gray-100 p-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-neutral-dark">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-xs text-neutral-mid">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-mid hover:bg-gray-100 hover:text-neutral-dark"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-mid">
            Sign below (mouse / trackpad / finger)
          </p>
          <div className="relative rounded-lg border-2 border-dashed border-gray-300 bg-white">
            <canvas
              ref={canvasRef}
              className="h-48 w-full cursor-crosshair touch-none rounded-lg"
            />
            <button
              type="button"
              onClick={clear}
              className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-[10px] font-medium text-neutral-mid backdrop-blur hover:bg-white hover:text-neutral-dark"
            >
              <Eraser size={10} /> Clear
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-neutral-mid">
                Type your name to confirm
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                className="mt-1 w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-[#E8476C] focus:ring-1 focus:ring-[#E8476C]"
                placeholder="Full name"
              />
            </div>

            <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#E8476C] focus:ring-[#E8476C]"
              />
              <span className="text-neutral-dark">{consentText}</span>
            </label>
          </div>

          {error && (
            <p className="mt-3 text-xs text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-100 p-4">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-full px-4 py-2 text-sm font-medium text-neutral-mid hover:text-neutral-dark"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[#E8476C] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#c73a5a] disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Check size={14} />
            )}
            {saving ? "Saving…" : saveLabel || "Save Signature"}
          </button>
        </div>
      </div>
    </div>
  );
}
