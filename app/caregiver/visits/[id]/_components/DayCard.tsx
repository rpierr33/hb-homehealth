"use client";

import { useState } from "react";
import { Clock, LogIn, LogOut, MapPin, Loader2 } from "lucide-react";

type DayState = {
  day: string;
  serviceDate: string;
  clockInAt: string | null;
  clockOutAt: string | null;
  totalHours: string | null;
  clockInLat: string | null;
  clockInLng: string | null;
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

function fmtTime(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function isToday(serviceDate: string) {
  const today = new Date().toISOString().slice(0, 10);
  return serviceDate === today;
}

export default function DayCard({
  visitLogId,
  initial,
  locked,
}: {
  visitLogId: string;
  initial: DayState;
  locked: boolean;
}) {
  const [state, setState] = useState(initial);
  const [busy, setBusy] = useState<"in" | "out" | null>(null);
  const [error, setError] = useState<string>("");

  const isFuture = state.serviceDate > new Date().toISOString().slice(0, 10);
  const today = isToday(state.serviceDate);
  const status = state.clockOutAt
    ? "complete"
    : state.clockInAt
      ? "in_progress"
      : isFuture
        ? "future"
        : "not_started";

  const handleClock = async (action: "clock-in" | "clock-out") => {
    setError("");
    setBusy(action === "clock-in" ? "in" : "out");

    let lat: number | null = null;
    let lng: number | null = null;
    let accuracy: number | null = null;

    if ("geolocation" in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          })
        );
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        accuracy = pos.coords.accuracy;
      } catch {
        // continue without GPS; server will record nulls
      }
    }

    const res = await fetch(
      `/api/caregiver/visits/${visitLogId}/days/${state.day}/clock`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, lat, lng, accuracy }),
      }
    );
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || `${action} failed`);
      setBusy(null);
      return;
    }
    const data = await res.json();
    setState((prev) => ({ ...prev, ...data }));
    setBusy(null);
  };

  return (
    <div
      className={`rounded-2xl border p-4 transition-all ${
        status === "complete"
          ? "border-green-200 bg-green-50"
          : status === "in_progress"
            ? "border-amber-300 bg-amber-50 ring-2 ring-amber-200"
            : today
              ? "border-[#E8476C] bg-[#E8476C]/5 ring-2 ring-[#E8476C]/20"
              : isFuture
                ? "border-gray-100 bg-gray-50 opacity-60"
                : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-neutral-dark">
            {DAY_LABELS[state.day]}
          </h3>
          <p className="text-xs text-neutral-mid">{state.serviceDate}</p>
          {today && (
            <span className="mt-1 inline-block rounded-full bg-[#E8476C] px-2 py-0.5 text-xs font-medium text-white">
              Today
            </span>
          )}
        </div>
        <div className="text-right">
          {status === "complete" && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              Complete · {state.totalHours}h
            </span>
          )}
          {status === "in_progress" && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              Clocked in
            </span>
          )}
          {status === "not_started" && !isFuture && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              Not started
            </span>
          )}
          {isFuture && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
              Future
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-gray-200 bg-white p-2.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-mid">
            Clock In
          </p>
          <p className="mt-0.5 font-semibold text-neutral-dark">
            {fmtTime(state.clockInAt)}
          </p>
          {state.clockInLat && (
            <p className="mt-0.5 flex items-center gap-1 text-[10px] text-neutral-mid">
              <MapPin size={9} /> GPS verified
            </p>
          )}
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-2.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-mid">
            Clock Out
          </p>
          <p className="mt-0.5 font-semibold text-neutral-dark">
            {fmtTime(state.clockOutAt)}
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}

      {!locked && !isFuture && (
        <div className="mt-3 flex gap-2">
          {!state.clockInAt && (
            <button
              onClick={() => handleClock("clock-in")}
              disabled={busy !== null}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#E8476C] py-2 text-xs font-semibold text-white transition-all hover:bg-[#c73a5a] disabled:opacity-50"
            >
              {busy === "in" ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <LogIn size={12} />
              )}
              {busy === "in" ? "Capturing GPS…" : "Clock In"}
            </button>
          )}
          {state.clockInAt && !state.clockOutAt && (
            <button
              onClick={() => handleClock("clock-out")}
              disabled={busy !== null}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-neutral-dark py-2 text-xs font-semibold text-white transition-all hover:bg-black disabled:opacity-50"
            >
              {busy === "out" ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <LogOut size={12} />
              )}
              {busy === "out" ? "Capturing GPS…" : "Clock Out"}
            </button>
          )}
          {state.clockInAt && state.clockOutAt && (
            <p className="flex-1 text-center text-xs text-neutral-mid">
              <Clock size={11} className="inline mb-0.5" /> Tasks &amp; patient
              signature: coming next
            </p>
          )}
        </div>
      )}
    </div>
  );
}
