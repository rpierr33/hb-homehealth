# HB Home Health — Session Handover

**Last updated:** 2026-05-08 by Claude (Opus 4.7) with Ralph
**Production:** https://www.humanityandblessings.com (Vercel project `hb-homehealth`, deployed `dpl_7QtZBsXA8xQD5UzHtUH32Jxxybmf` → Ready)
**Repo:** github.com/rpierr33/hb-homehealth, branch `main` clean and pushed (HEAD `8f00674`)

If you are an agent picking up work on this project, **read this file before doing anything**. It supersedes any stale memory you may have about this project's state.

---

## What just shipped (do not redo)

- **Drizzle/Neon migration** — Supabase fully retired; production runs on Neon Postgres + Drizzle ORM + JWT auth (jose + bcryptjs). Schema in `lib/db/schema.ts` matches production Neon (5/5 tables: `inquiries`, `leads`, `referrals`, `applications`, `admin_users`). Verified with end-to-end smoke test on 2026-05-08 — all 4 form endpoints write rows successfully and clean up.
- **Sentry observability** — `sentry.{client,edge,server}.config.ts` live. Errors are being captured.
- **PWA scaffold** — `public/manifest.json`, `public/sw.js`, `public/icons/`.
- **Contact info update + canonical source of truth** — Address, phone, fax, email all live and consistent across the platform. **All contact info now flows from `lib/site-config.ts`** — `SITE.company`, `SITE.contact`, `SITE.address`. Edit there, not in components. 14 files import `SITE`.
  - Address: `2121 W Oakland Park BLVD, Suite 9, Oakland Park, FL 33311`
  - Phone display: `954-637-1334` · `tel:` href: `9546371334` · E.164: `+1-954-637-1334`
  - Fax: `1-844-905-0544` (E.164 `+1-844-905-0544`)
  - Email: `admin@humanityandblessings.com` (lowercase everywhere — was `Admin@…` previously)
  - AHCA license: `30212381`
- **Vercel `NOTIFICATION_EMAIL`** corrected (was `Admin@humanityandblessings.com\n` with capital A and trailing newline). Now `admin@humanityandblessings.com`. Effective on next deploy.
- **Page-level metadata** — All public pages now have `<title>`, OG tags, Twitter cards, canonical URLs, keywords. JSON-LD is rich (LocalBusiness + MedicalBusiness with AHCA license, MedicalTherapy services, GeoCoordinates, OpeningHoursSpecification, Service, City, State, AdministrativeArea).
- **Privacy / HIPAA page** at `/privacy`.
- **Service detail pages** — `/services/{cna-hha,companion-sitter,rn-lpn,skilled-nursing}` all live with their own metadata and JSON-LD.

---

## CRITICAL BUGS IN PRODUCTION RIGHT NOW

These are silently killing SEO. Fix first.

### 1. Sitemap is malformed — every `<loc>` has a trailing newline
Live response shows:
```xml
<loc>https://www.humanityandblessings.com
</loc>
```
Google's crawler treats every URL as invalid because of the trailing `\n`. This may explain why the site isn't ranking despite being indexed.

**Source:** `app/sitemap.ts`. Strong suspicion the bug is `process.env.NEXT_PUBLIC_SITE_URL` having a trailing `\n` — same failure mode we already found and fixed for `NOTIFICATION_EMAIL` on 2026-05-07. **Verify with `vercel env pull --environment=production /tmp/x && grep NEXT_PUBLIC_SITE_URL /tmp/x`.** If the value has `\n`, fix it via `vercel env rm` + `vercel env add`. If the env is clean, the bug is in `app/sitemap.ts` itself — likely from concatenating a base URL with a trailing newline somewhere.

### 2. robots.txt has the same newline bug
The `Sitemap:` line is split across two lines, so Google Search Console auto-discovery of the sitemap is broken.
**Source:** `app/robots.ts`. Same root cause as #1.

### 3. Admin pages are indexable
`/admin` and `/admin/login` have zero `noindex` directives. They could leak into search results.
**Fix:** Add `export const metadata = { robots: { index: false, follow: false } }` (or whatever this Next.js version's API is — see `node_modules/next/dist/docs/` per `AGENTS.md`) to:
- `app/admin/page.tsx`
- `app/admin/login/page.tsx`
- `app/admin/applications/page.tsx`
- `app/admin/referrals/page.tsx`

### 4. Sitemap `lastModified` uses `new Date()`
Every deploy makes Google think every page changed today. Real content dates are better.
**Source:** `app/sitemap.ts`. Replace `lastModified: new Date()` with a per-page actual modification date (could be a constant per page, or git-derived).

---

## RALPH'S DIRECTIVE: BLOG PAGES FOR BROWARD RANKING

Ralph wants blog/content pages — **as many as necessary to properly compete for ranking position in Broward County**. This is not a one-off task; it's an ongoing content engine.

### Why this matters
The Mar 31 audit confirmed the site is indexed but not ranking. JSON-LD and metadata are now in place, but Google rewards content depth + freshness + local relevance. Without ongoing content, the site is competing against established home-health players (Visiting Angels, BrightStar, Comfort Keepers, etc.) on metadata alone — which is not enough.

### Two content tracks to run in parallel

**Track A — Programmatic Broward city pages** (highest local-SEO leverage)
- One page per city HB serves: Oakland Park (already on home), Fort Lauderdale, Pompano Beach, Coral Springs, Parkland, Miramar, Weston, Hollywood, Lauderdale-By-The-Sea, Deerfield Beach, Coconut Creek, Margate (the `areaServed` list in `JsonLd.tsx` is the canonical service-area inventory).
- Suggested URL pattern: `/locations/oakland-park`, `/locations/coral-springs`, etc. Or `/home-health-care-in-coral-springs-fl/` for keyword density.
- Each page: hero with city + service, local landmarks/proof, drive-time copy, embedded map centered on that city, LocalBusiness JSON-LD with `areaServed` scoped to that city, internal links to relevant service pages.
- Use a single template + data array — do NOT hand-author 12 pages.
- Reference: the `programmatic-seo` skill in `~/.claude/skills/programmatic-seo/SKILL.md`. Also `local-seo` and `landing-page-generator`.

**Track B — Editorial blog**
- URL: `/blog/[slug]` — does not currently exist (`/blog` returns 404). Build the scaffold first (MDX, Notion, or Sanity-backed — Ralph's call). Recommend MDX in `app/blog/[slug]/page.tsx` for zero-cost simplicity.
- Seed posts (high-intent queries):
  1. "How to Choose a Home Health Provider in Broward County" — buyer-intent, high commercial value
  2. "Medicare vs. Private Pay for Home Care: What Florida Families Need to Know" — informational, builds trust
  3. "What CNAs Can and Can't Do in Florida" — clarifies role, ranks for license queries
  4. "Signs Your Aging Parent Needs Home Health Care" — top-of-funnel, emotional, shareable
  5. "Post-Surgery Home Care: A Family Caregiver's Checklist" — practical, links to RN/LPN service page
  6. "Companion Care vs. Home Health Aide: Which Is Right for Your Loved One?" — disambiguation, internal-linking gold
  7. "How Florida Medicaid Covers Home Health Services" — local + practical
  8. "Hiring a Caregiver Privately vs. Through an Agency: The Hidden Costs" — competitive frame, captures DIY-curious searchers
- Cadence after seed: 2 posts/week minimum to compound. AI can draft, human (Ralph or hire) edits + adds local proof + photos.
- Each post: FAQ schema, author bio with credentials (E-E-A-T), real images (not stock), internal links to service pages and relevant city pages.
- Reference skills: `blog-post`, `content-strategy`, `content-marketing`, `seo-strategy`, `keyword-research`.

### Volume target
Don't pre-decide a fixed number. Compete until ranking. Realistic: 12 city pages + 24+ blog posts in the first 90 days, growing from there. **The point of "as many as necessary" is that this is not a one-and-done — it's a content operation that runs until HB owns the Broward home-health SERP.**

---

## GEO / AI Discoverability — currently weak

Generative engines (ChatGPT, Claude, Perplexity, Google AI Overviews) need different signals than classical SEO. Current state:

**Already helps (don't redo):** LocalBusiness, MedicalBusiness, Service, MedicalTherapy JSON-LD. Comprehensive.

**Missing:**
- `/llms.txt` — the emerging standard for LLM-friendly site summary. Should be a curated, plain-text guide to what HB does, who it serves, where, and how to contact. ChatGPT/Perplexity/Claude check for this.
- `/llms-full.txt` — a longer, full content dump optimized for LLM ingestion (key pages flattened to plain text).
- `FAQPage` schema with real Q&A pairs — LLMs lift verbatim from these. Should live on `/services/[id]` pages and on a dedicated `/faq` page.
- `Article` and `BlogPosting` schema on the blog (Track B above).
- E-E-A-T signals — author bios with credentials, AHCA license display (already in JSON-LD, also surface visually), patient/family review schema (`Review` + `AggregateRating`).
- Skill references: `~/.claude/skills/generative-engine-optimization/`, `ai-discoverability-audit`, `eeat-signals`, `entity-seo`, `agents-md` (note: this is for site-level AI agent instructions, separate from the project's AGENTS.md).

---

## Off-site tasks (Ralph must complete — no agent can do these)

These were flagged in the Mar 31 audit. Status unknown — agent should ASK Ralph before assuming any are done.

1. **Google Business Profile** at https://business.google.com — highest-impact local-SEO action. Address, phone, hours, photos, services, verification. Without this, no map pack.
2. **Google Search Console** — submit sitemap (after fixing the newline bug), use URL Inspection on every key page to request indexing.
3. **Directory listings / backlinks** — Florida AHCA provider directory, Yelp, Caring.com, AgingCare.com, Broward County Chamber of Commerce, local Oakland Park business directories, social profiles (FB, IG, LinkedIn).

---

## Recommended next session — 3 options

### Option A: Quick-fix pass (~30 min, highest leverage per minute)
1. Pull prod env, check `NEXT_PUBLIC_SITE_URL` for trailing `\n`. If found, fix via `vercel env rm/add`. If not, fix in `app/sitemap.ts` and `app/robots.ts` source.
2. Add `noindex` metadata to all 4 admin pages.
3. Replace `lastModified: new Date()` in sitemap with real per-page dates.
4. Add `app/llms.txt/route.ts` and `app/llms-full.txt/route.ts` serving curated brand content.
5. Build, push, verify live with `curl`.

**Worst-case revert:** `git revert <sha>`. All changes are content-level metadata, no DB impact.

### Option B: Blog scaffold + first 8 seed posts + 6 city pages (~1–2 days)
1. Build `app/blog/[slug]/page.tsx` with MDX front-matter (or pick CMS).
2. Build `app/locations/[city]/page.tsx` with JSON-LD scoped to that city.
3. Author 8 seed posts and 6 city pages from the lists in this doc.
4. Add FAQPage schema to service pages and a new `/faq` page.
5. Internal-linking pass: every city → service, every service → city, every blog → service + city.

**Worst-case revert:** new files only — `git revert` cleanly removes them.

### Option C: A then B in one session
Quick-fix first (unlocks crawl), then content infrastructure on top. ~1.5 days end-to-end.

**Recommended:** Start with Option A in the next session. It's a 30-min unblock for everything else. Then schedule Option B as an explicit content build.

---

## File / location map

```
/Users/ralphpierre/Desktop/kalocode/2026-projects/HB/
├── hb_homehealth/                ← Next.js app (this project)
│   ├── HANDOVER.md               ← THIS FILE
│   ├── AGENTS.md                 ← Framework warning + pointer here
│   ├── CLAUDE.md                 ← @AGENTS.md
│   ├── lib/site-config.ts        ← SINGLE SOURCE OF TRUTH for contact info
│   ├── lib/db/schema.ts          ← Drizzle schema (matches prod Neon)
│   ├── lib/auth.ts               ← JWT auth helpers
│   ├── lib/email/templates.ts    ← Email templates
│   ├── app/sitemap.ts            ← BUG: malformed sitemap
│   ├── app/robots.ts             ← BUG: malformed Sitemap line
│   ├── app/admin/                ← BUG: pages indexable
│   ├── app/services/{cna-hha,companion-sitter,rn-lpn,skilled-nursing}/
│   ├── app/privacy/              ← live
│   ├── components/JsonLd.tsx     ← LocalBusiness + Org schema
│   ├── components/ServiceJsonLd.tsx
│   └── components/sections/TrustBadges.tsx  ← AHCA license badge
└── business/
    └── sit-to-stand-lift-tutorial/  ← caregiver training videos + PDF
```

---

## Things NOT to touch without explicit Ralph approval

- `lib/db/schema.ts` — production Neon depends on this exact shape. Any change requires a migration plan.
- `lib/site-config.ts` — single source of truth. Edit values, don't change shape unless updating all 14 importers.
- The `www.` vs apex URL inconsistency — `SITE.company.url` is apex, but everything else uses `www.`. Engineer flagged this; Ralph deferred. Don't unilaterally change it.
- Anything in `business/sit-to-stand-lift-tutorial/` — caregiver training assets, marketing-final.

---

## Quick verifies for the next agent

```bash
cd /Users/ralphpierre/Desktop/kalocode/2026-projects/HB/hb_homehealth
git status                                          # should be clean
git rev-list --left-right --count origin/main...HEAD  # should be "0  0"
npm run build                                       # should generate 32 routes
curl -s https://www.humanityandblessings.com/sitemap.xml | head -10  # CONFIRM bug still present
curl -s -o /dev/null -w "%{http_code}" https://www.humanityandblessings.com/llms.txt  # should be 404 (not yet built)
```

---

## Memory references

- `~/.claude/projects/-Users-ralphpierre/memory/project_hb_seo_fixes.md` — the original Mar 31 audit (most items now stale; this file is current)
- `~/.claude/projects/-Users-ralphpierre/memory/MEMORY.md` — global memory index
