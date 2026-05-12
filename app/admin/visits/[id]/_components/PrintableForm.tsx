import { DAYS_OF_WEEK, TASKS, SERVICE_TYPES } from "@/lib/caregiver-tasks";

type Day = {
  dayOfWeek: string;
  serviceDate: string;
  clockInAt: Date | null;
  clockOutAt: Date | null;
  totalHours: string | null;
  clockInLat: string | null;
  clockInLng: string | null;
  clockInAccuracyM: string | null;
  clockOutLat: string | null;
  clockOutLng: string | null;
  clockOutAccuracyM: string | null;
  patientSignaturePngUrl: string | null;
  patientSignedByName: string | null;
  patientSignatureAt: Date | null;
  patientSignatureIp: string | null;
};

type Log = {
  patientFirstName: string;
  patientLastName: string;
  weekStartDate: string | Date;
  serviceTypes: string[];
  comments: string | null;
  status: string | null;
  submittedAt: Date | null;
  cgFirstName: string | null;
  cgLastName: string | null;
  cgEmployeeNo: string | null;
  caregiverSignaturePngUrl: string | null;
  caregiverAttestationSignedAt: Date | null;
};

const DAY_LABEL: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const BRAND = "#E8476C";
const BRAND_SOFT = "#FFF5F8";
const INK = "#1F2937";
const INK_SOFT = "#6B7280";
const LINE = "#E5E7EB";

const TASK_LABELS = new Map<string, { en: string; es: string; custom?: boolean }>(
  TASKS.map((t) => [
    t.key as string,
    { en: t.en, es: t.es, custom: "custom" in t ? t.custom : undefined },
  ])
);

function fmtDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  // Use UTC to avoid timezone shifts on date-only strings
  return date.toISOString().slice(0, 10);
}
function fmtTime(d: Date | null) {
  if (!d) return "—";
  return new Date(d).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function PrintableForm({
  log,
  days,
  tasksByDay,
}: {
  log: Log;
  days: Day[];
  tasksByDay: Record<string, Record<string, { checked: boolean; customLabel: string | null }>>;
}) {
  const daysWorked = days.filter((d) => d.clockInAt);

  // Section card style
  const card: React.CSSProperties = {
    border: `1px solid ${LINE}`,
    borderRadius: "8pt",
    background: "#fff",
    padding: "10pt 12pt",
    marginTop: "8pt",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "7pt",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: INK_SOFT,
  };

  return (
    <div
      className="printable-form"
      style={{
        fontFamily:
          '-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif',
        color: INK,
        fontSize: "10pt",
        lineHeight: 1.4,
        background: "#fff",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        width: "100%",
        margin: 0,
      }}
    >
      {/* HEADER — slim brand bar with logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6pt 12pt",
          background: BRAND,
          color: "#fff",
          borderRadius: "8pt 8pt 0 0",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "4pt",
            padding: "4pt 10pt",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.webp"
            alt="Humanity & Blessings Home Health"
            style={{ height: "32pt", width: "auto", display: "block" }}
          />
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: "11pt",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              lineHeight: 1.2,
            }}
          >
            Home Health Aide Visit Log
          </div>
          <div
            style={{
              fontSize: "7.5pt",
              fontWeight: 400,
              opacity: 0.9,
              marginTop: "2pt",
            }}
          >
            Notas del Auxiliar de Salud en el Hogar
          </div>
        </div>
      </div>

      {/* SUMMARY CARD */}
      <div
        style={{
          border: `1px solid ${LINE}`,
          borderTop: "none",
          borderRadius: "0 0 8pt 8pt",
          background: "#fff",
          padding: "12pt 14pt",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "12pt",
            alignItems: "start",
          }}
        >
          <div>
            <div style={{ ...labelStyle, color: BRAND }}>Patient</div>
            <div
              style={{
                fontSize: "17pt",
                fontWeight: 700,
                marginTop: "2pt",
                color: INK,
                lineHeight: 1.1,
              }}
            >
              {log.patientLastName}, {log.patientFirstName}
            </div>
            <div
              style={{ fontSize: "9pt", color: INK_SOFT, marginTop: "3pt" }}
            >
              Week of {fmtDate(log.weekStartDate)}
              {log.serviceTypes.length > 0 && (
                <>
                  {" · "}
                  {log.serviceTypes
                    .map((s) => {
                      const st = SERVICE_TYPES.find((x) => x.key === s);
                      return st?.en || s.replace(/_/g, " ");
                    })
                    .join(", ")}
                </>
              )}
            </div>
          </div>
          <div
            style={{
              padding: "3pt 10pt",
              fontSize: "8pt",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              background:
                log.status === "approved"
                  ? "#DCFCE7"
                  : log.status === "rejected"
                    ? "#FEE2E2"
                    : "#DBEAFE",
              color:
                log.status === "approved"
                  ? "#166534"
                  : log.status === "rejected"
                    ? "#991B1B"
                    : "#1E40AF",
              borderRadius: "999pt",
            }}
          >
            {log.status}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "10pt",
            marginTop: "12pt",
            paddingTop: "10pt",
            borderTop: `1px solid ${LINE}`,
          }}
        >
          <div>
            <div style={labelStyle}>Caregiver</div>
            <div style={{ fontSize: "10pt", fontWeight: 600, marginTop: "2pt" }}>
              {log.cgLastName}, {log.cgFirstName}
            </div>
            <div style={{ fontSize: "8pt", color: INK_SOFT }}>
              Emp # {log.cgEmployeeNo}
            </div>
          </div>
          <div>
            <div style={labelStyle}>Submitted</div>
            <div style={{ fontSize: "10pt", fontWeight: 600, marginTop: "2pt" }}>
              {log.submittedAt
                ? new Date(log.submittedAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </div>
            <div style={{ fontSize: "8pt", color: INK_SOFT }}>
              {log.submittedAt &&
                new Date(log.submittedAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
            </div>
          </div>
          <div>
            <div style={labelStyle}>Days Worked</div>
            <div style={{ fontSize: "10pt", fontWeight: 600, marginTop: "2pt" }}>
              {daysWorked.length} of 7
            </div>
            <div style={{ fontSize: "8pt", color: INK_SOFT }}>
              {daysWorked
                .map((d) => DAY_LABEL[d.dayOfWeek].slice(0, 3))
                .join(", ")}
            </div>
          </div>
        </div>
      </div>

      {/* DAILY VISITS SECTION HEADER */}
      <h2
        style={{
          fontSize: "12pt",
          fontWeight: 700,
          color: INK,
          margin: "14pt 0 4pt",
          borderLeft: `3px solid ${BRAND}`,
          paddingLeft: "8pt",
        }}
      >
        Daily Visits{" "}
        <span
          style={{ fontWeight: 400, color: INK_SOFT, fontSize: "9pt" }}
        >
          ({daysWorked.length} day{daysWorked.length === 1 ? "" : "s"} worked)
        </span>
      </h2>

      {/* DAY CARDS — only days actually worked */}
      {DAYS_OF_WEEK.map((dayKey) => {
        const d = days.find((x) => x.dayOfWeek === dayKey);
        if (!d || !d.clockInAt) return null;

        const dayTasks = tasksByDay[dayKey] || {};
        const checked: { label: string; isCustom: boolean }[] = [];
        for (const t of TASKS) {
          const info = dayTasks[t.key];
          if (!info?.checked) continue;
          const isCustom = "custom" in t && t.custom === true;
          if (isCustom && info.customLabel) {
            checked.push({ label: info.customLabel, isCustom: true });
          } else {
            checked.push({ label: t.en, isCustom: false });
          }
        }

        return (
          <div key={dayKey} style={card}>
            {/* Day header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                paddingBottom: "6pt",
                borderBottom: `1px solid ${LINE}`,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "13pt",
                    fontWeight: 700,
                    color: INK,
                    lineHeight: 1.1,
                  }}
                >
                  {DAY_LABEL[dayKey]}
                </div>
                <div style={{ fontSize: "8pt", color: INK_SOFT, marginTop: "1pt" }}>
                  {fmtDate(d.serviceDate)}
                </div>
              </div>
              {d.totalHours && (
                <div
                  style={{
                    padding: "2pt 8pt",
                    fontSize: "9pt",
                    fontWeight: 700,
                    background: "#DCFCE7",
                    color: "#166534",
                    borderRadius: "999pt",
                  }}
                >
                  {d.totalHours}h
                </div>
              )}
            </div>

            {/* Clock in/out */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8pt",
                marginTop: "8pt",
              }}
            >
              <div
                style={{
                  border: `1px solid ${LINE}`,
                  borderRadius: "5pt",
                  padding: "5pt 8pt",
                }}
              >
                <div style={labelStyle}>Clock In</div>
                <div
                  style={{ fontSize: "12pt", fontWeight: 700, marginTop: "1pt" }}
                >
                  {fmtTime(d.clockInAt)}
                </div>
                {d.clockInLat && (
                  <div
                    style={{
                      fontSize: "7pt",
                      color: INK_SOFT,
                      marginTop: "1pt",
                    }}
                  >
                    GPS {Number(d.clockInLat).toFixed(4)},{" "}
                    {Number(d.clockInLng).toFixed(4)}
                  </div>
                )}
              </div>
              <div
                style={{
                  border: `1px solid ${LINE}`,
                  borderRadius: "5pt",
                  padding: "5pt 8pt",
                }}
              >
                <div style={labelStyle}>Clock Out</div>
                <div
                  style={{ fontSize: "12pt", fontWeight: 700, marginTop: "1pt" }}
                >
                  {fmtTime(d.clockOutAt)}
                </div>
                {d.clockOutLat && (
                  <div
                    style={{
                      fontSize: "7pt",
                      color: INK_SOFT,
                      marginTop: "1pt",
                    }}
                  >
                    GPS {Number(d.clockOutLat).toFixed(4)},{" "}
                    {Number(d.clockOutLng).toFixed(4)}
                  </div>
                )}
              </div>
            </div>

            {/* Tasks performed */}
            {checked.length > 0 && (
              <div style={{ marginTop: "8pt" }}>
                <div style={labelStyle}>
                  Tasks performed ({checked.length})
                </div>
                <ul
                  style={{
                    margin: "4pt 0 0",
                    padding: 0,
                    listStyle: "none",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "2pt 12pt",
                  }}
                >
                  {checked.map((t, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: "9pt",
                        color: INK,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "5pt",
                      }}
                    >
                      <span
                        style={{
                          color: BRAND,
                          fontWeight: 700,
                          fontSize: "10pt",
                          lineHeight: 1,
                        }}
                      >
                        ✓
                      </span>
                      <span>{t.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Patient signature */}
            {d.patientSignaturePngUrl && (
              <div
                style={{
                  marginTop: "8pt",
                  padding: "6pt 8pt",
                  background: BRAND_SOFT,
                  border: `1px solid ${LINE}`,
                  borderRadius: "5pt",
                }}
              >
                <div style={labelStyle}>Patient Signature</div>
                <div
                  style={{
                    marginTop: "3pt",
                    background: "#fff",
                    border: `1px solid ${LINE}`,
                    borderRadius: "3pt",
                    padding: "3pt 6pt",
                    display: "inline-block",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.patientSignaturePngUrl}
                    alt="Patient signature"
                    style={{
                      maxHeight: "40pt",
                      maxWidth: "180pt",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: "3pt",
                    fontSize: "8pt",
                    color: INK_SOFT,
                  }}
                >
                  Signed by{" "}
                  <strong style={{ color: INK }}>
                    {d.patientSignedByName}
                  </strong>
                  {d.patientSignatureAt && (
                    <>
                      {" · "}
                      {new Date(d.patientSignatureAt).toLocaleString([], {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </>
                  )}
                  {d.patientSignatureIp && <> · IP {d.patientSignatureIp}</>}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* COMMENTS */}
      {log.comments && (
        <div style={card}>
          <div style={labelStyle}>Comments</div>
          <div style={{ marginTop: "3pt", fontSize: "9.5pt", color: INK }}>
            {log.comments}
          </div>
        </div>
      )}

      {/* CAREGIVER ATTESTATION */}
      {log.caregiverSignaturePngUrl && (
        <div style={card}>
          <h2
            style={{
              fontSize: "11pt",
              fontWeight: 700,
              color: INK,
              margin: 0,
              borderLeft: `3px solid ${BRAND}`,
              paddingLeft: "6pt",
            }}
          >
            Caregiver Attestation
          </h2>
          <p
            style={{
              fontSize: "9pt",
              color: INK_SOFT,
              marginTop: "5pt",
              fontStyle: "italic",
            }}
          >
            &ldquo;I personally have performed all services in accordance with
            Agency policy and have followed Universal Precautions, safety,
            infection control, and given emotional support.&rdquo;
          </p>
          <div
            style={{
              marginTop: "6pt",
              display: "flex",
              alignItems: "center",
              gap: "12pt",
            }}
          >
            <div
              style={{
                background: "#fff",
                border: `1px solid ${LINE}`,
                borderRadius: "3pt",
                padding: "3pt 6pt",
                display: "inline-block",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={log.caregiverSignaturePngUrl}
                alt="Caregiver signature"
                style={{
                  maxHeight: "42pt",
                  maxWidth: "200pt",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
            <div style={{ fontSize: "8pt", color: INK_SOFT, lineHeight: 1.4 }}>
              Signed by{" "}
              <strong style={{ color: INK }}>
                {log.cgLastName}, {log.cgFirstName}
              </strong>
              <br />
              {log.caregiverAttestationSignedAt &&
                new Date(log.caregiverAttestationSignedAt).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
            </div>
          </div>
        </div>
      )}

      {/* Suppress unused warning for TASK_LABELS — used elsewhere if needed in future */}
      <div style={{ display: "none" }}>{TASK_LABELS.size}</div>
    </div>
  );
}
