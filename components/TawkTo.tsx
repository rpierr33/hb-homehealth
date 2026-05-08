"use client";

import { useEffect } from "react";

export function TawkTo() {
  const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID?.trim();

  useEffect(() => {
    if (!propertyId) return;

    // Tawk.to global API object
    const w = window as unknown as Record<string, unknown>;
    w.Tawk_API = w.Tawk_API || {};
    w.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID?.trim() || "default";
    script.src = `https://embed.tawk.to/${encodeURIComponent(propertyId)}/${encodeURIComponent(widgetId)}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [propertyId]);

  return null;
}
