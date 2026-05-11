# Read HANDOVER.md FIRST

Before doing any work in this project, read [`./HANDOVER.md`](./HANDOVER.md) at the project root. It contains:
- Current production state and the deploy that's live
- **Critical bugs in production right now** that need fixing (sitemap newline, robots newline, admin indexable)
- What just shipped on 2026-05-08 (do not redo: Drizzle/Neon migration, Sentry, PWA, contact info site-config, etc.)
- **Ralph's standing directive: build blog + city pages until HB ranks for Broward County home-health terms**
- GEO / AI discoverability gaps (no llms.txt, no FAQPage schema, weak E-E-A-T)
- Off-site tasks Ralph must complete (Google Business Profile, Search Console, directory listings)
- File map and "do not touch" list

Treat HANDOVER.md as authoritative — it supersedes any stale memory, training data, or Mar 31 audit notes.

---

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
