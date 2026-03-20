import { ImageResponse } from "next/og";

export const alt = "Humanity & Blessings Home Health — Compassionate Care at Home";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFF0F3 0%, #ffffff 50%, #FCE4EC 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "linear-gradient(135deg, #E8476C, #FF6B8A)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 42,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          H
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#1A2332",
            marginBottom: 8,
          }}
        >
          Humanity &amp; Blessings Home Health
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#E8476C",
            marginBottom: 32,
          }}
        >
          Compassionate Care at Home
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#6B7280",
            maxWidth: 600,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Professional home health care and healthcare staffing services in Oakland Park, Florida.
        </div>
        <div
          style={{
            marginTop: 32,
            padding: "12px 32px",
            background: "#E8476C",
            color: "white",
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          Request Care Today
        </div>
      </div>
    ),
    { ...size }
  );
}
