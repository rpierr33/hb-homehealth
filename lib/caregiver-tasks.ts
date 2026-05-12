// Canonical task list and service types for the caregiver portal.
// Used by wizard, exports, and PDF generation.

export const SERVICE_TYPES = [
  { key: "personal_care", en: "Personal Care", es: "Cuidado Personal" },
  { key: "respite", en: "Respite", es: "Respiro" },
  { key: "companion", en: "Companion", es: "Compañía" },
  { key: "escort", en: "Escort", es: "Escolta" },
  { key: "homemaking", en: "Homemaking", es: "Tareas del Hogar" },
] as const;

export type ServiceTypeKey = (typeof SERVICE_TYPES)[number]["key"];

export const TASKS = [
  { key: "tub_shower", en: "Tub / Shower", es: "Baño / Bañera" },
  { key: "bed_bath", en: "Bed Bath", es: "Baño en Cama" },
  { key: "shave_mouth_nails_hair", en: "Shave / Mouth / Nails / Hair", es: "Afeitado / Boca / Uñas / Cabello" },
  { key: "catheter_drain", en: "Catheter / Drain", es: "Cuidado de Catheter" },
  { key: "dress", en: "Dress", es: "Vestir" },
  { key: "prepare_meals", en: "Prepare Meals", es: "Preparar Comida" },
  { key: "grocery_shop", en: "Grocery Shop", es: "Hacer Compras" },
  { key: "wash_clothes", en: "Wash Clothes", es: "Lavar Ropa" },
  { key: "transfer_ambulation", en: "Transfer / Ambulation", es: "Transferir / Ambulación" },
  { key: "toileting", en: "Toileting", es: "Eliminación" },
  { key: "skin_care", en: "Skin Care", es: "Cuidado de la Piel" },
  { key: "housekeeping", en: "Housekeeping", es: "Limpieza de Casa" },
  { key: "linen", en: "Linen", es: "Vestir la Cama" },
  { key: "escort_errands_respite", en: "Escort / Errands / Respite", es: "Compañía / Ayuda" },
  { key: "other_1", en: "Other 1", es: "Otra 1", custom: true },
  { key: "other_2", en: "Other 2", es: "Otra 2", custom: true },
] as const;

export const DAYS_OF_WEEK = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const DAY_LABELS = {
  en: { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" },
  es: { mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb", sun: "Dom" },
} as const;

// Returns the Monday of the week containing the given date (ISO YYYY-MM-DD).
export function getMondayOfWeek(d: Date = new Date()): string {
  const day = d.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(d);
  mon.setDate(d.getDate() + diff);
  return mon.toISOString().slice(0, 10);
}
