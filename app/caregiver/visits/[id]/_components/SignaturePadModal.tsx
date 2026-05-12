"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    const canvas = canvasRef.current;

    const setupCanvas = () => {
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
    setupCanvas();
    window.addEventListener("resize", setupCanvas);

    // Lock body scroll while open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("resize", setupCanvas);
      document.body.style.overflow = prevOverflow;
      padRef.current?.off();
      padRef.current = null;
    };
  }, [open]);

  if (!open || !mounted) return null;

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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save signature.");
    } finally {
      setSaving(false);
    }
  };

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0,0,0,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <div>
            <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1f2937" }}>
              {title}
            </h2>
            {subtitle && (
              <p
                style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              padding: "4px",
              color: "#6b7280",
              background: "transparent",
              border: "none",
              borderRadius: "999px",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "16px" }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#6b7280",
              marginBottom: "6px",
            }}
          >
            Sign below (mouse / trackpad / finger)
          </p>
          <div
            style={{
              position: "relative",
              borderRadius: "10px",
              border: "2px dashed #d1d5db",
              backgroundColor: "#fff",
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                display: "block",
                width: "100%",
                height: "160px",
                cursor: "crosshair",
                touchAction: "none",
                borderRadius: "8px",
              }}
            />
            <button
              type="button"
              onClick={clear}
              style={{
                position: "absolute",
                right: "8px",
                top: "8px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 8px",
                fontSize: "10px",
                fontWeight: 500,
                color: "#6b7280",
                background: "rgba(255,255,255,0.85)",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Eraser size={10} /> Clear
            </button>
          </div>

          <div style={{ marginTop: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "10px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#6b7280",
              }}
            >
              Type your name to confirm
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              placeholder="Full name"
              style={{
                marginTop: "4px",
                width: "100%",
                padding: "9px 12px",
                fontSize: "14px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </div>

          <label
            style={{
              marginTop: "12px",
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              padding: "10px",
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "12px",
              lineHeight: "1.4",
            }}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginTop: "2px", width: "16px", height: "16px" }}
            />
            <span style={{ color: "#1f2937" }}>{consentText}</span>
          </label>

          {error && (
            <p
              role="alert"
              style={{
                marginTop: "10px",
                fontSize: "12px",
                color: "#dc2626",
              }}
            >
              {error}
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "8px",
            padding: "14px 16px",
            borderTop: "1px solid #f3f4f6",
          }}
        >
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#6b7280",
              background: "transparent",
              border: "none",
              borderRadius: "999px",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 20px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "#E8476C",
              border: "none",
              borderRadius: "999px",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.5 : 1,
            }}
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

  return createPortal(modal, document.body);
}
