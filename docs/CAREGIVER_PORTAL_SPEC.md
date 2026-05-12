# Caregiver Portal — Phase 1 Spec

**Version:** 1.0
**Locked:** 2026-05-11
**Owner:** Ralph
**Source of truth:** This file. If anything here conflicts with another doc, this wins.

> **Why this file exists:** to keep the build on rails. Every time I (Claude) feel an urge to add a payer, a state, an EVV adapter, an "obvious cleanup," or any scope creep — re-read this. The plan is locked. If a real change is needed, update this file FIRST, then change code.

---

## 1. Problem we're solving

Mom's home health agency (Humanity & Blessings Home Health Care) uses a paper carbon-copy form called **Home Health Aide Notes** for every caregiver visit. Caregivers hand-fill it. Office staff manually re-key it into Mobile Caregiver+ (the EVV platform Simply Healthcare requires) for claim filing. This is slow, error-prone, and wastes paper.

**Goal:** A digital wizard that replaces the paper form. Caregiver fills it on a phone/tablet. Admin (Ralph) reviews submissions in a dashboard. The data exports in a format that can be imported into Mobile Caregiver+ (or any successor) for actual claim filing.

## 2. Explicitly NOT building (out of scope for Phase 1)

| Out of scope | Why |
|---|---|
| Alt-EVV integration (HHAeXchange SFTP/API, Mobile Caregiver+ alt-EVV API) | 6-8 week vendor onboarding. Not needed for digitization. Comes in Phase 2 if we sell B2B. |
| Direct claim filing | MCP does this. We feed MCP. |
| Multi-state support | Mom is FL only. Phase 2. |
| Multi-payer support | Mom files only through Simply/Anthem via Integrated. Phase 2. |
| Other MCO integrations | Sunshine, Humana, Aetna, Molina, etc. — not used currently. Phase 2. |
| Caregiver scheduling | MCP does this. We don't. |
| Payroll, training, time-off requests | Out of scope. Phase 2+ if there's appetite. |
| Anything that touches `lib/site-config.ts` shape | HANDOVER says don't. |
| Modifying existing DB tables | HANDOVER says don't. Additive only. |
| Fixing the 4 open SEO bugs (sitemap newline, robots newline, admin indexable, lastModified) | Different scope. Flag, don't fix here. |
| Multi-language beyond EN/ES | EN/ES is the paper form's languages. No others. |

## 3. Stakeholders

| Role | Name | Concerns |
|---|---|---|
| Agency owner | Mom | Compliance, billing accuracy, caregiver adoption |
| Admin | Ralph | Dashboard access, export quality, can run the system |
| Caregivers | Multiple (varies) | Easy to fill on phone, fast, EN/ES, works offline |
| Payer | Simply Healthcare (Anthem MMA), routed through Integrated, EVV via Mobile Caregiver+ | Data must be exportable in a format MCP accepts |
| State | FL AHCA (only matters if FFS — Mom is MCO-only, so AHCA doesn't directly receive data from us) | N/A for Phase 1 |

## 4. The form being digitized

**Master template:** `~/Documents/docs/Mom/Humanity & Blessings Doc/forms/HHNOTES-MODERN.html` (designed 2026-05-11, brand-colored, print-ready, single-page Letter)

**Master PDF:** `~/Documents/docs/Mom/Humanity & Blessings Doc/forms/HHNOTES-MODERN.pdf` (same content as HTML, exported)

**Paper original:** `~/Downloads/IMG_5766.jpg` (the carbon-copy form the user photographed)

**Fields captured (everything on the paper form):**

- Caregiver: name (last, first), employee number
- Voucher number, checked-by field
- Patient: name (last, first), patient number
- Service week: Mon–Sun with date for each day
- Per-day: time from-to, total hours worked
- Service type checkboxes (mutually inclusive — caregiver can check multiple per voucher): Personal Care, Respite, Companion, Escort, Homemaking
- Task checkboxes per day for 16 tasks:
  - Tub/Shower (Baño/Bañera)
  - Bed Bath (Baño en Cama)
  - Shave/Mouth/Nails/Hair (Afeitado/Boca/Uñas/Cabello)
  - Catheter/Drain (Cuidado de Catheter)
  - Dress (Vestir)
  - Prepare Meals (Preparar Comida)
  - Grocery Shop (Hacer Compras)
  - Wash Clothes (Lavar Ropa)
  - Transfer/Ambulation (Transferir/Ambulación)
  - Toileting (Eliminación)
  - Skin Care (Cuidado de la Piel)
  - Housekeeping (Limpieza de Casa)
  - Linen (Vestir la Cama)
  - Escort/Errands/Respite (Compañía/Ayuda)
  - Other 1 (free-text label, then check per day)
  - Other 2 (free-text label, then check per day)
- Comments / Comentarios (free text)
- Patient signature per day-of-service (Mon–Sun, plus Thursday in its own larger box)
- Attestation statement + caregiver signature/discipline
- DP USE ONLY: #1 #2 #3 #4 (admin-only fields, NOT shown to caregiver)
- Copy legend (White/Yellow/Pink) — informational, not a field

## 5. CURES Act EVV data elements (we capture all 6)

| # | CURES Act requirement | Where we capture it |
|---|---|---|
| 1 | Type of service performed | `visit_logs.service_types[]` + `visit_log_tasks` per day |
| 2 | Individual receiving the service | `patients.id` linked from `visit_logs.patient_id` |
| 3 | Date of service | `visit_logs.week_start_date` + `visit_log_days.day_of_week` |
| 4 | Location of service | `visit_log_days.clock_in_lat/lng` + patient address |
| 5 | Individual providing the service | `caregivers.id` linked from `visit_logs.caregiver_id` (verified via JWT login) |
| 6 | Time the service begins and ends | `visit_log_days.clock_in_at` + `clock_out_at` |

## 6. Database schema (5 new tables, additive only)

All in `lib/db/schema.ts`. Drizzle migration. Generated SQL diff to be reviewed before applying to prod Neon.

### `caregivers`
```ts
{
  id: uuid primary key default gen_random_uuid(),
  email: text unique not null,
  password_hash: text not null,            // bcryptjs, same pattern as admin_users
  first_name: text not null,
  last_name: text not null,
  employee_no: text unique not null,
  language_pref: text default 'en' check in ('en','es'),
  active: boolean default true,
  created_at: timestamptz default now(),
  updated_at: timestamptz default now(),
}
```

### `patients`
```ts
{
  id: uuid primary key default gen_random_uuid(),
  first_name: text not null,
  last_name: text not null,
  patient_no: text unique not null,
  street: text,
  city: text,
  state: text,                              // 2-letter, ISO
  zip: text,
  address_lat: numeric,                     // for GPS proximity check at clock-in
  address_lng: numeric,
  payer: text default 'simply',             // enum-ish: 'simply', 'private', 'other'
  medicaid_id: text,                        // PHI — encrypted at rest by Neon
  status: text default 'active' check in ('active','inactive','discharged'),
  created_at: timestamptz default now(),
  updated_at: timestamptz default now(),
}
```

### `visit_logs`
```ts
{
  id: uuid primary key default gen_random_uuid(),
  caregiver_id: uuid not null references caregivers(id),
  patient_id: uuid not null references patients(id),
  voucher_no: text not null,
  week_start_date: date not null,           // always a Monday
  service_types: text[] not null,           // ['personal_care','homemaking',...]
  comments: text,
  status: text default 'draft' check in ('draft','submitted','approved','rejected'),
  caregiver_signature_png_url: text,        // Vercel Blob URL
  caregiver_signature_svg: text,            // SVG path for crispness at any size
  caregiver_attestation_signed_at: timestamptz,
  caregiver_attestation_ip: text,
  caregiver_attestation_user_agent: text,
  submitted_at: timestamptz,
  approved_at: timestamptz,
  approved_by: uuid references admin_users(id),
  rejected_at: timestamptz,
  rejection_reason: text,
  dp_use_1: text,                           // admin-only
  dp_use_2: text,                           // admin-only
  dp_use_3: text,                           // admin-only
  dp_use_4: text,                           // admin-only
  pdf_url: text,                            // Vercel Blob URL of final PDF
  created_at: timestamptz default now(),
  updated_at: timestamptz default now(),
  unique (caregiver_id, patient_id, week_start_date, voucher_no),
}
```

### `visit_log_days`
```ts
{
  id: uuid primary key default gen_random_uuid(),
  visit_log_id: uuid not null references visit_logs(id) on delete cascade,
  day_of_week: text not null check in ('mon','tue','wed','thu','fri','sat','sun'),
  service_date: date not null,
  clock_in_at: timestamptz,
  clock_in_lat: numeric,
  clock_in_lng: numeric,
  clock_in_accuracy_m: numeric,             // meters — geolocation accuracy
  clock_out_at: timestamptz,
  clock_out_lat: numeric,
  clock_out_lng: numeric,
  clock_out_accuracy_m: numeric,
  total_hours: numeric,                     // computed: (clock_out - clock_in) in hours, rounded to 0.01
  patient_signature_png_url: text,
  patient_signature_svg: text,
  patient_signature_at: timestamptz,
  patient_signature_ip: text,
  patient_signed_by_name: text,             // typed name + scribble = signature ceremony
  unique (visit_log_id, day_of_week),
}
```

### `visit_log_tasks`
```ts
{
  visit_log_id: uuid not null references visit_logs(id) on delete cascade,
  day_of_week: text not null check in ('mon','tue','wed','thu','fri','sat','sun'),
  task_key: text not null,                  // 'tub_shower','bed_bath','transfer_ambulation','other_1','other_2', etc.
  task_label_custom: text,                  // only set for 'other_1' / 'other_2'
  checked: boolean default false,
  primary key (visit_log_id, day_of_week, task_key),
}
```

**Migration commands (when ready):**
```bash
npm run db:generate   # generates SQL migration file
# Ralph reviews the generated SQL diff
npm run db:migrate    # applies to current env (dev first, then prod)
```

## 7. Routes

All `/caregiver/*` and `/admin/visits*` get `noindex, nofollow` metadata so they don't bleed into SEO.

| Path | Method | Auth | Purpose |
|---|---|---|---|
| `/caregiver/login` | GET | none | Caregiver login form |
| `/caregiver/login` | POST | none | Auth: validates credentials, sets JWT cookie |
| `/caregiver` | GET | caregiver | Dashboard: this week's visits, drafts, recent submissions |
| `/caregiver/visits/new` | GET | caregiver | Start a new visit log (step 1 of wizard) |
| `/caregiver/visits/[id]` | GET | caregiver | Resume a draft or view a submitted log |
| `/caregiver/visits/[id]/step/[n]` | GET | caregiver | Wizard step n (1-5) |
| `/caregiver/visits/[id]/step/[n]` | POST | caregiver | Save step n's data, advance |
| `/caregiver/visits/[id]/submit` | POST | caregiver | Final submission with attestation |
| `/caregiver/logout` | POST | caregiver | Clear JWT |
| `/admin/visits` | GET | admin | List all submitted visits with filters |
| `/admin/visits/[id]` | GET | admin | View one (PDF + raw data + signatures) |
| `/admin/visits/[id]/approve` | POST | admin | Approve a submitted log |
| `/admin/visits/[id]/reject` | POST | admin | Reject with reason |
| `/admin/visits/[id]/pdf` | GET | admin | Stream the PDF |
| `/admin/visits/export` | GET | admin | Bulk export (CSV or zip of PDFs) for a week or date range |
| `/admin/caregivers` | GET/POST | admin | List + create caregivers |
| `/admin/caregivers/[id]` | GET/PATCH/DELETE | admin | Caregiver detail + edit + deactivate |
| `/admin/patients` | GET/POST | admin | List + create patients |
| `/admin/patients/[id]` | GET/PATCH/DELETE | admin | Patient detail + edit |
| `/api/caregiver/auth/login` | POST | none | API for login |
| `/api/caregiver/visits` | POST | caregiver | Create a new draft |
| `/api/caregiver/visits/[id]` | PATCH | caregiver | Update draft |
| `/api/caregiver/visits/[id]/signature` | POST | caregiver | Upload a signature PNG (caregiver or patient) |
| `/api/caregiver/visits/[id]/finalize` | POST | caregiver | Generate PDF, mark submitted |
| `/api/admin/visits/export` | GET | admin | CSV or ZIP export |

## 8. Weekly log with daily cards (REVISED 2026-05-11)

**Workflow correction:** Earlier draft of this spec described a linear 5-step wizard completed in one sitting. That's wrong for real caregiver workflow. Caregivers visit DAILY across the week and update the log per-visit. The paper form lives at the patient's home and gets filled in each day. The digital version must mirror this.

### Architecture

- **Weekly log = container** (one row in `visit_logs` per caregiver/patient/week)
- **7 daily cards** inside it (rows in `visit_log_days` Mon–Sun) — caregiver fills each card on the day she visits, not retroactively
- Caregiver can return to the same weekly log across multiple days
- Empty day cards = didn't work that day (no explicit "off" toggle for MVP)
- "Submit Week" available anytime ≥1 day is complete; label adapts to "Submit (N of 7 days)" if not all 7

### Entry points

| Surface | Action |
|---|---|
| Dashboard | "Today's visit" shortcut deep-linking to current week's log → today's card |
| Dashboard | "Start a new visit log" → patient setup form (current Step 1) |
| Dashboard | "Duplicate from previous week" → clones latest weekly log's patient + services into a new container for the current week |
| Weekly log page | 7 day cards, today highlighted/expanded, past days locked once submitted, future days disabled |

### Daily card content

| Field | Captured how |
|---|---|
| Clock In | Button → `navigator.geolocation.getCurrentPosition` + server timestamp |
| Tasks | 16-task checklist (custom Other 1/2 labels) — checkboxes |
| Clock Out | Button → GPS + server timestamp |
| Total Hours | Auto-computed from clock in/out |
| Patient signature | signature_pad canvas (mouse/trackpad/touch); patient types name + checks "I confirm" |
| Status | Not started / In progress / Complete / Locked (after week submission) |

### Week submission

End of week (or anytime ≥1 day filled): caregiver hits **Submit Week**:
1. Caregiver attestation screen (statement + caregiver signature + "I confirm" checkbox)
2. Server validates: each "started" day must have clock-in + clock-out + patient signature
3. Generates PDF (server-side render of HHNOTES-MODERN.html populated with this week's data)
4. Uploads to Vercel Blob, sets `status='submitted'`
5. Sends non-PHI notification email to `admin@humanityandblessings.com` with link

### Duplicate / recurring schedule

When caregiver picks "Duplicate from previous week":
- Server looks up caregiver's most recent submitted/approved weekly log
- Creates a new weekly log with: same `patient_first_name`, `patient_last_name`, same `service_types[]`, current week's Monday as `week_start_date`
- Days start empty (no clock-ins copied — those are per-visit)
- Caregiver continues from there

### Autosave + offline

- Every field change PATCHes to `/api/caregiver/visits/[id]/...` (debounced 1s) — no manual save button
- Offline: drafts persist to IndexedDB, sync on reconnect
- GPS timestamps are CAPTURED CLIENT-SIDE so offline drafts retain the actual visit time, not the sync time

## 9. Auth model

- Existing project uses JWT (jose + bcryptjs) with HttpOnly cookies (per HANDOVER)
- Extension: new role `caregiver` in JWT payload alongside existing `admin`
- Middleware (`middleware.ts`) routes:
  - `/caregiver/*` requires JWT with role `caregiver` (or `admin` for impersonation/testing)
  - `/admin/visits*` requires JWT with role `admin`
- Password reset: forgot-password email → token → reset page. Same pattern admin uses (verify in existing code).
- Session length: 14 days (caregivers shouldn't have to log in every shift)

## 10. Signatures (the e-sig ceremony)

For each signature capture (patient daily + caregiver attestation):

1. Caregiver hands device to patient
2. Patient (or caregiver for own attestation) scribbles on `signature_pad` canvas
3. Patient types their name in a "type your name to confirm" input
4. Patient checks "I confirm this is my signature and these services were performed"
5. On confirm, capture:
   - PNG of canvas (uploaded to Vercel Blob)
   - SVG path string (stored in DB for vector crispness)
   - Timestamp (server-side `now()`)
   - IP address (from request headers)
   - User agent (from request headers)
   - Typed name
   - Boolean of consent checkbox
6. All of the above bound to the `visit_log_days` row (for patient sig) or `visit_logs` row (for caregiver attestation)

This satisfies FL Medicaid's e-signature requirements under 21st Century Cures Act + standard ESIGN Act.

## 11. GPS capture

- Use `navigator.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 })`
- Capture: latitude, longitude, accuracy (in meters)
- On clock-in: compare to `patients.address_lat/lng`. If distance > 500m, show warning ("You appear far from the patient's address. Continue anyway?") but still allow — there are legitimate reasons (escort, errands, doctor's office visit)
- If geolocation denied/unavailable: show clear error, allow manual override with explanation note (logged in DB)
- All GPS data stays in DB. Never displayed back to caregiver in coordinates form (just shown as "verified" / "manual override").

## 12. Offline / PWA

- Extends existing `public/sw.js` (already PWA-scaffolded per HANDOVER)
- Caches: wizard pages, patient list (last fetched), task labels, signature_pad JS
- IndexedDB: draft visit_logs (encrypted with localStorage key)
- Sync queue: when reconnected, POST pending drafts to server
- Caveat: GPS clock-in/out timestamps will be at the time the action was taken, not the sync time. The form must capture event times client-side and send them, not rely on server timestamps for visit times.

## 13. Internationalization (EN / ES)

- Toggle in `/caregiver` header
- Stored in `caregivers.language_pref`
- All caregiver-facing strings in `lib/i18n/caregiver.{en,es}.ts`
- Patient signature screen shows both languages on the attestation statement (the patient may speak Spanish, caregiver may speak English, or vice versa — the legal text needs to be presentable in both regardless of UI lang)
- Admin dashboard remains English only (Ralph is the only admin)

## 14. Mobile UX requirements

- Viewport: meta viewport with `width=device-width, initial-scale=1, user-scalable=no` (prevent accidental zoom while signing)
- Touch targets: minimum 44pt × 44pt (iOS HIG)
- Signature canvas: full width, 200pt tall, smooth Bezier curves
- Forms: single column on mobile, no horizontal scroll
- Buttons: bottom-fixed nav bar with "Back" / "Continue" so they're always thumb-reachable
- Loading states: every async action shows a spinner or skeleton
- Errors: inline next to the field, never alert/toast for validation

## 15. Admin dashboard (`/admin/visits`)

**List view:**
- Filter by: caregiver, patient, status (draft / submitted / approved / rejected), week range
- Sort by: submitted date (default desc), caregiver name, patient name
- Each row shows: caregiver, patient, week, status badge, submitted-at, [view] button
- Bulk actions: export selected as zip of PDFs, export selected as CSV

**Detail view (`/admin/visits/[id]`):**
- PDF embed (the generated form, populated)
- Raw data panel (collapsible)
- Per-day signatures shown inline (so admin can verify they're not all the same scribble)
- GPS map (small embedded map showing clock-in/out points + patient address)
- Service-type → estimated billing code mapping
- Approve / Reject / Request revision buttons
- DP USE ONLY fields editable (#1 #2 #3 #4) — admin's working space
- Comments log (any back-and-forth between admin and caregiver)

**Approve:** sets `status='approved'`, `approved_at=now()`, `approved_by=admin.id`. Optionally exports to CSV in batch later.

**Reject:** prompts for `rejection_reason`, sets `status='rejected'`, notifies caregiver (in-app + non-PHI email).

## 16. Submission pipeline (server-side)

```
POST /api/caregiver/visits/[id]/finalize
  ↓
1. Re-validate completeness (server doesn't trust client)
  ↓
2. Lock row (UPDATE … SET status='submitted', submitted_at=now() WHERE id=$1 AND status='draft' RETURNING *)
  ↓
3. Render PDF
   - puppeteer-core + @sparticuz/chromium-min
   - HTML template: HHNOTES-MODERN-rendered.html (server-side variant with mustache slots for data)
   - Populated with full visit_log + days + tasks + signatures (as data URIs)
   ↓
4. Upload PDF to Vercel Blob, get URL
   ↓
5. UPDATE visit_logs SET pdf_url=$2
   ↓
6. Send notification email to admin@humanityandblessings.com
   - Subject: "New visit log — voucher [voucher_no]"
   - Body: "A new visit log was submitted. Open dashboard: https://www.humanityandblessings.com/admin/visits/[id]"
   - ZERO PHI in body
   ↓
7. Return 200 with PDF URL for caregiver's records
```

**Idempotency:** the finalize endpoint accepts an `Idempotency-Key` header; replays return the original result (per `~/.claude/rules/coding-fundamentals.md`).

**Atomicity:** all of step 2–5 is in a transaction; if PDF generation fails, status reverts to draft.

**Rate limit:** 1 finalize per visit_log per minute (idempotent key handles intentional retries; this is for malicious or buggy retries).

## 17. Export formats

### PDF
- Already designed. Generated by server-side rendering of `HHNOTES-MODERN-rendered.html` template.
- Signature canvases rendered as inlined data-URI PNGs in the appropriate cells.
- Filename: `HHNotes_[patient_lastname]_[voucher_no]_[week_start].pdf`

### CSV (the export-to-MCP path)
- One CSV per submission (or one combined CSV for a date range bulk export)
- Columns (to be aligned with MCP's visit-import expected columns after we read their spec — see Open Items §22):
  ```
  patient_no, patient_first_name, patient_last_name,
  caregiver_employee_no, caregiver_first_name, caregiver_last_name,
  service_date, day_of_week,
  service_code (HCPCS — derived from service_types via lookup table),
  clock_in_iso, clock_out_iso,
  clock_in_lat, clock_in_lng, clock_in_accuracy_m,
  clock_out_lat, clock_out_lng, clock_out_accuracy_m,
  total_hours,
  task_summary (comma-separated task_keys checked that day),
  comments,
  voucher_no,
  patient_signature_at, patient_signature_ip,
  caregiver_attestation_at, caregiver_attestation_ip
  ```
- UTF-8, RFC 4180-compliant quoting

### Week pack (ZIP)
- All PDFs for a week, named consistently
- A `summary.csv` inside with one row per visit_log_day across all visits in the range
- A `README.txt` explaining the layout

## 18. HIPAA boundaries

| Data | Classification | Storage |
|---|---|---|
| Caregiver name, email, employee # | Not PHI | `caregivers` table |
| Patient name, patient #, address | PHI | `patients` table — Neon at-rest encryption |
| Medicaid ID | PHI (highly sensitive) | `patients.medicaid_id` — Neon at-rest encryption |
| Visit times, GPS, signatures, tasks | PHI | `visit_logs` + `visit_log_days` + `visit_log_tasks` |
| Final PDF | PHI | Vercel Blob — Vercel's BAA (Enterprise tier) |
| Notification email body | Must be NON-PHI | Just contains link + voucher #; no patient name, no PHI |

**BAA gap to confirm with Ralph + Mom:**
- Neon Business plan (~$69/mo) — needed for BAA
- Vercel Enterprise tier — needed for BAA
- Sentry Business plan — needed for BAA

These are NOT blockers for development. They ARE blockers for go-live with real Medicaid PHI. Ralph + Mom address before flipping the prod switch on real data.

## 19. What MUST NOT be touched

Per HANDOVER's "do not touch" list and common sense:

- `lib/site-config.ts` shape (values fine; shape no)
- Existing `lib/db/schema.ts` tables (inquiries, leads, referrals, applications, admin_users) — additive only
- The www / apex URL inconsistency
- Marketing pages (`app/page.tsx`, `app/services/*`, `app/privacy/*`)
- JSON-LD, sitemap, robots, services pages
- The 4 open SEO bugs — different scope
- `business/sit-to-stand-lift-tutorial/` — marketing-final
- HANDOVER.md / AGENTS.md / CLAUDE.md (Ralph edits these)

## 20. Build phases & acceptance criteria

### Phase 1A — Foundation (~1.5 days)
- [ ] Feature branch `feat/caregiver-portal` created from `main`
- [ ] 5 new tables added to `lib/db/schema.ts` (diff reviewed by Ralph before migration)
- [ ] `npm run db:generate` produces clean migration; SQL reviewed; `npm run db:migrate` applied to dev only
- [ ] Caregiver role added to JWT type (`lib/auth.ts`)
- [ ] `middleware.ts` routes `/caregiver/*` → caregiver-or-admin, `/admin/visits*` → admin
- [ ] `/caregiver/login` page renders, accepts credentials, sets cookie
- [ ] `/caregiver` empty dashboard renders for logged-in caregiver
- [ ] `/admin/caregivers` CRUD works (Ralph can create a caregiver record)
- [ ] `/admin/patients` CRUD works (Ralph can create a patient record)
- [ ] All `/caregiver/*` and `/admin/visits*` routes have `noindex, nofollow`

### Phase 1B — Wizard (~2.5 days)
- [ ] `/caregiver/visits/new` creates a draft row, redirects to step 1
- [ ] Step 1 (Setup): patient picker, voucher, service types, week-start
- [ ] Step 2 (Schedule): per-day GPS clock-in/out, total auto-calc
- [ ] Step 3 (Tasks): 16-task × N-day matrix, EN/ES toggle, Other 1/2 custom labels
- [ ] Step 4 (Comments): textarea, max-length validated
- [ ] Step 5 (Sign): signature_pad per day + caregiver attestation
- [ ] Autosave on field change (debounced)
- [ ] Resumable: re-open `/caregiver/visits/[id]` shows current step with all data
- [ ] Mobile-tested at 375px viewport, all interactions reachable thumb

### Phase 1C — Submit + Admin dashboard (~1 day)
- [ ] `/api/caregiver/visits/[id]/finalize` validates, locks, generates PDF, uploads to Blob, emails admin
- [ ] Email contains zero PHI (just link + voucher)
- [ ] `/admin/visits` list view with filters
- [ ] `/admin/visits/[id]` detail view with embedded PDF + signatures + GPS map
- [ ] Approve / Reject flow works; rejection notifies caregiver

### Phase 1D — Exports (~1 day)
- [ ] PDF download for any submission
- [ ] CSV export for one or many submissions (column spec aligned with MCP — see Open Items)
- [ ] Week-pack ZIP export (all PDFs + summary CSV)

### Phase 1E — Polish (~1.5 days)
- [ ] PWA offline: drafts persist + sync
- [ ] EN/ES toggle complete across all caregiver screens
- [ ] Mobile polish: 375px / 768px / 1024px tested with screenshots
- [ ] Accessibility: WCAG 2.2 AA pass (keyboard nav, focus states, ARIA, color contrast)
- [ ] Error states: every API failure has a user-visible message
- [ ] Empty states: every list view has a useful empty state
- [ ] Load states: every fetch has a spinner or skeleton

**Total: ~7.5 working days.**

## 21. Phase 2 (NOT in scope here, captured for memory)

- Spin out to a separate repo: `caregiver-portal-saas` (working title)
- Generic, multi-tenant: any home health agency in any state
- Multi-payer: Sunshine, Humana, Aetna, Molina, etc.
- Multi-state: per-state EVV adapter (FL→HHAeXchange, NJ→HHAeXchange, NC→Sandata, …)
- Alt-EVV integration: formal SFTP/API integration with state aggregators (6-8 week vendor onboarding per state)
- Billing: SaaS pricing tiers
- Marketing site + onboarding flow
- This is its own conversation. Don't pre-build Phase 2 surface area in Phase 1.

## 22. Open items requiring Ralph or Mom input

| # | Item | Owner | Status |
|---|---|---|---|
| 1 | MCP visit-import CSV column spec (so our CSV export matches their import expectation exactly) | Claude (research) | Pending |
| 2 | HCPCS service code mapping for each service type, per Mom's contract with Simply | Mom | Pending |
| 3 | Initial caregiver roster (names + employee #s) for `caregivers` table seed | Mom or Ralph | Pending — can defer to Phase 1A end |
| 4 | Initial patient roster for `patients` table seed | Mom or Ralph | Pending — can defer to Phase 1A end |
| 5 | BAAs: Neon Business plan, Vercel Enterprise, Sentry Business — sign before prod go-live with real PHI | Ralph | Pending — not a dev blocker |

## 23. Anti-scope-drift rules (read these every time before adding a feature)

1. **Is it in §2's NOT building list?** Stop.
2. **Does Mom need it for her actual workflow today?** If no, defer to Phase 2.
3. **Am I adding a state, payer, or EVV vendor?** Stop. FL + Simply + MCP only.
4. **Am I adding a feature because "it would be cool"?** Stop. Boring + correct beats cool + broken.
5. **Am I "cleaning up" code outside the caregiver portal scope?** Stop. Scope discipline. HANDOVER's "do not touch" applies.
6. **Am I about to claim something works without testing it?** Per `~/.claude/rules/testing-and-verification.md` — no. Test it. No lazy tests.
7. **Am I about to push without polling the deploy?** Per `~/.claude/projects/-Users-ralphpierre/memory/feedback_poll_every_push.md` — poll Vercel until READY/ERROR.
8. **Am I conflating FFS and MCO EVV paths again?** Per `feedback_dont_conflate_ffs_mco_evv.md` — no. Mom is MCO-only.

## 24. References

- Master form template: `~/Documents/docs/Mom/Humanity & Blessings Doc/forms/HHNOTES-MODERN.html`
- Paper original photo: `~/Downloads/IMG_5766.jpg`
- HB project handover: `HANDOVER.md` (this project root)
- Memory: `~/.claude/projects/-Users-ralphpierre/memory/project_hb_caregiver_portal.md`
- Memory: `feedback_dont_conflate_ffs_mco_evv.md`
- Memory: `feedback_dont_boil_ocean.md`
- FL EVV info: https://www.hhaexchange.com/info-hub/florida
- MCP alt-EVV info: https://mobilecaregiverplus.com/resources/
