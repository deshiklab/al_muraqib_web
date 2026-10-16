# AL Muraqib — CMS & Lead Platform Development Plan

**Prepared by BITSCOL · draft v1 · 2026-10-17**
Scope: a content management system for the website's content & information, lead capture with basic lead management, chat/messaging linked to the lead record, and blog + Knowledge Base editorial control.

This plan is written against the **actual codebase** (`deshiklab/al_muraqib_web`, branch state at `e0c96f5`), not a greenfield.

---

## 1. Goals & non-goals

**Goals**
- G1 — Client-side editors (blog, KB, products, projects, services, site info, certifications, brands, media) without touching code or Git.
- G2 — Lead capture from every existing funnel (RFQ wizard, Quick Quote drawer, contact form, quote side-tab) persisted, deduplicated, notified, and manageable (status pipeline, notes, export).
- G3 — Chat & messaging connected to leads: web chat and WhatsApp conversations traceable to the same lead record.
- G4 — Zero SEO/visual regression: identical URLs, schema, hreflang, sitemap/feed freshness preserved automatically.
- G5 — Keep the current free, fast, reliable GitHub Pages static delivery for the public site.

**Non-goals (this phase)**
- Quotation/invoice PDF generation, accounting, inventory/ERP sync.
- Full CRM automation/drip marketing (hooks are designed so a later Zoho/HubSpot push is a webhook away).
- Multi-site/multi-brand tenancy.

---

## 2. Current state (what we build on)

| Asset | File | Notes for reuse |
|---|---|---|
| Content types | `lib/types.ts` — `Article {slug, kind, category:L, title:L, excerpt:L, date, readingMinutes, image?, relatedProducts[], body[]}`, `L = {en, ar[, bn]}` | CMS schema mirrors 1:1; localized field pairs already the house pattern |
| Content data | `lib/data/content.ts`, `catalog.ts`, `services.ts`, `brands.ts`, `site.ts` | Seeded into the DB by an import script; becomes build-time snapshot |
| RFQ intake | `app/api/rfq/route.ts` (109 lines) + `app/api/contact/route.ts` | Already validates: 5 files/25 MB, MIME+extension allowlist (`.dwg/.dxf/.xlsx/…`), generates refs (`makeRfqRef`). Currently **inert on Pages** (fs writes) — becomes the lead endpoint |
| Forms UI | `components/rfq/RfqWizard.tsx`, `QuickQuoteDrawer.tsx`, `ContactForm.tsx` | Already emit `source`, `sourceUrl`, locale + `track("generate_lead")` — extend payload, no UI rework |
| Chat | `components/layout/ChatDock.tsx` — tawk.to embed gated by `site.tawkPropertyId`, WhatsApp deep-links, `waLink()` helper | Tawk webhook + optional Chatwoot (below) |
| Media pipeline | `scripts/optimize-images.mjs` (sharp), `scripts/emit-avif.mjs`, brand generators | Ported to CMS upload hooks (auto ≤1600px q72 + avif/webp companions) |
| SEO layer | `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`, `scripts/build-feed.py`, JSON-LD everywhere | Sitemap/feed pull from the content snapshot → publish rebuilds keep them current |
| Delivery | Static export → GitHub Pages (`pages.yml` on push) | **Kept**; gains a `repository_dispatch` trigger |

---

## 3. Architecture decision

### Recommended: **D — Hybrid Payload CMS + Postgres, Pages delivery retained**

One repo, one deployable: the existing Next.js app gains `/admin` (Payload CMS 3, MIT, embedded), a Postgres DB, and object storage for uploads. The public site **remains the static export on GitHub Pages**.

```
Editor ──▶ VPS (Docker: Next+Payload admin, Postgres, MinIO/R2)
             │  publish event (webhook, auth'd)
             ▼
        GitHub repository_dispatch ──▶ Pages workflow:
             1. npm run content:pull   (CMS API → .content/*.json, typed)
             2. npm run feed && sitemap build step
             3. NEXT_PUBLIC_STATIC_EXPORT=1 npm run build && publish out/
             ▼
        https://almuraqib.ae (static, free, fast)   ← unchanged for visitors
```

- **Why Payload 3:** open-source (no per-seat USD licensing for a client this size), native App-Router embedding (same Next version), Lexical rich-text editor, relations (Articles↔Products), live preview tokens, CSV export, access control, file uploads with sharp transform hooks, **webhooks on afterChange** to fire the rebuild, and the same DB holds `leads`. Admin UI is English; content fields are per-locale — matching our `L` shape.
- **Why hybrid over always-dynamic:** keeps today's reliability profile (no runtime DB dependency on the public edge, free CDN hosting, existing workflow/security posture). Publish latency ≈ 2–3 min (build). A per-page **“Preview” link** (draft render served from the VPS app) removes the pain; Phase 4 can flip to SSR-on-VPS if instant publish becomes a requirement.

### Alternatives considered

| Option | Verdict |
|---|---|
| A. SaaS headless (Sanity/Contentful) + webhook rebuild | Fastest content module; weak for leads (custom infra anyway), per-editor USD subscriptions forever, vendor lock. Only if client insists on zero self-hosting. |
| B. WordPress + export bridge | Cheap editors' familiarity; two sources of truth forever, plugin security burden, i18n messy. Rejected. |
| C. Fully dynamic Next on Vercel/Cloudflare | Best DX; ongoing hosting cost + we lose the Pages posture the site was engineered around. Becomes “Phase 4 mode switch” naturally (same app can serve SSR). |

---

## 4. Data model (Payload collections)

**Content (mirrors existing types; all text fields are localized tabs `en | ar (| bn)`):**
- `articles` — kind `blog|kb`, category, title, excerpt, `body` (Lexical rich text replacing plain `string[]` — keeps JSON-LD/paragraph render parity via serializer), cover image, related products (relation → `products`), status `draft|scheduled|published`, publishDate, readingMinutes (auto wordcount ÷ 200), SEO fields (title override/description, default = excerpt).
- `products` — slug, name/pitch/description, image+gallery (upload hooks run the existing ≤1600px/q72/AVIF pipeline), variants/options blocks, specs table repeater, FAQs repeater (feeds the existing FAQ strip + BlogPosting/Product JSON-LD).
- `projects` — full current shape (scope/challenge/solution/result/client/value/duration/metrics repeaters) → powers Projects grid **and** the PDF “delivered projects” table.
- `services`, `brands` (incl. logo upload), `certifications`, `site-settings` (single: contacts, hours, socials — fixes the placeholder-URL gap automatically, address, stats, tawk id, GA id), `pages-content` for home hero slides / about copy / CTA strings not already covered, `media` library (alt-text required — SEO rule enforced at upload).
- **Publish flow:** status + optional future `publishAt` (cron); afterChange hook → GitHub `repository_dispatch` → export build → Pages. `content:pull` regenerates `.content/*.json` typed to the same `lib/data` interfaces → **zero changes in page components**; build fails loudly on schema drift (acceptance gate).

**Leads & messaging:**
- `leads` — ref (`makeRfqRef`), `type: rfq|quick_quote|contact|chat|whatsapp_call|walk_in`, contact{name, company, email, phone}, locale, status `new→contacted→qualified→quoted→won|lost|stale`, products[] + notes + files (reuses RFQ upload validation), source/utm/landingUrl (already in today's form payload), consent flag, assignee, timeline[] (status changes, notes, chat refs, email message-ids), nextAction{due, text}, dedupe key `normalized(phone) or email` (matches within 30 days → link as repeat, badge on create).
- `chat_sessions` — provider `tawk|whatsapp|chatwoot`, external id, transcript URL (link, not stored text, in Phase 1), linked lead (resolved by phone/email), startedBy, firstResponseAt.
- Views/UX (built on Payload list config + one custom dashboard widget): default list = status board filters (Today / New this week / Stale >14d / Awaiting me), CSV/XLSX export (all fields + timeline), dashboard cards: leads by month, by source, by status (conversion %), top products requested, median first-response time.

**Notifications & capture hardening:**
- On create → email to sales@ (Resend/SES, template incl. ref + files link) + optional **WhatsApp Cloud API** template ping to the owner number (requires approved template; Phase 4 — manual wa.me reminder in Phase 1); new-lead sound/badge in admin.
- Anti-spam: Cloudflare **Turnstile** on all three public forms (free; invisible), honeypot field, per-IP rate limit (upstash-free: in-memory + DB cap), same validation as current route. Public submit endpoint: `/api/rfq` extended (backwards compatible) — this also revives contact POST.

---

## 5. Chat ↔ lead linkage (design)

1. **Phase 1 — tawk.to bridge:** enable tawk **Offline Form + “email me” webhooks** → `POST /api/ingest/tawk` creates `lead(type: chat)`; a `chat_sessions` row links the transcript URL. Live-chat visitors who share a phone/email get matched into their lead within 30 days.
2. **Phase 2 — context handoff:** on any lead card, buttons: *“WhatsApp this lead”* (wa.me deep link prefilled with ref + one-line context from the browser, works from desktop) and *“Copy brief”* (structured summary for sales). QR on the site “Reference your quote: RFQ-xxxx” — visitors quoting refs auto-link.
3. **Phase 3 (optional swap) — Chatwoot self-hosted** in the same Docker network: unified inbox for web widget + WhatsApp Business API + email; its `inbox` + `conversation` APIs mirror 1:1 into `chat_sessions`, contact matching is native. Choose this when they're ready to stop paying for tawk *and* want WhatsApp threads in one place. (tawk is free-tier adequate today; Chatwoot = upgrade, not requirement.)
4. **WhatsApp Cloud API inbound (Phase 4):** webhook from Meta → match sender phone → comment on lead timeline. *Note: requires the business's FB Business Manager + approved message templates for outbound; strict ToS — never automated first contact.*

---

## 6. Blog & KB editing workflow (the day-to-day)

1. New article → EN tab (title, excerpt, Lexical body, cover upload — auto-compressed + AVIF/WebP emitted; alt required) → AR tab (paste or inline translate; **RTL live-preview toggle** shows the real article page chrome) → related products → schedule or publish.
2. Preview: draft token opens a rendered preview from the VPS app (same components) before publish.
3. On publish: rebuild fires → `npm run feed` step + sitemap regeneration run inside the Pages workflow → new URL, BlogPosting/TechArticle schema, hreflang trio (AR/BN auto-fallback per current rules) and RSS item land together. **Editor never touches Git; SEO rules stay code-enforced.**
4. Bulk import: initial migration script seeds the DB from current `lib/data/*` (idempotent upsert by slug). Also kept for future one-off TS↔DB restores (git stays the backup ledger for content: each Pages build commits `.content/*.json` to a `content-snapshots` branch — free history + rollback).

---

## 7. Hosting, security, ops

- **VPS:** 2 vCPU/4 GB (Hetzner/DO Singapore ~$12–24/mo). Docker compose: `app` (this repo), `postgres` + nightly `pg_dump` → R2/Backblaze (offsite), `minio` (or direct Cloudflare R2) for lead files & uploads (files are already capped 25 MB; virus-scan gate: `clamav` optional Phase 4), `caddy` (TLS). Unattended-upgrades, fail2ban, SSH-key-only, UFW. Backups tested by a documented restore once per quarter.
- **Admin surface:** `/admin` on the VPS host only (DNS `cms.almuraqib.ae` or port-forward path) — never on the Pages origin; payload rate-limited; TOTP 2FA on for all users (Payload native). Roles: `admin` (all + settings + users), `editor` (content publish), `sales` (leads only: status/notes, no content). 30-day idle sessions.
- **Data protection:** consent checkbox persisted with timestamp; leads auto-anonymized after **24 months** inactivity (cron; documented in privacy policy update); TLS everywhere; no card data ever.
- **Monitoring:** uptime ping on `/api/health` (DB+storage probe), GitHub workflow failure → email via the same Resend key; weekly digest of failed rebuilds.

---

## 8. Delivery phases, acceptance & estimate (BDT; 1 USD ≈ ৳120)

> Rates follow the standing BITSCOL proposal basis (website line was ~$1k ≈ ৳1 lakh). All phases include code review, QA on the verification checklist from `docs/CONTINUITY.md`, docs update, and handover training (1 session, recorded, EN/AR).

| Phase | Scope | Calendar | One-time |
|---|---|---|---|
| **0 — Discovery & sign-off** | Schema freeze (this doc + field-by-field), hosting/DNS decisions, roles matrix, Turnstile/Resend/WhatsApp accounts inventory | 3–5 days | ৳20,000 (credited to P1) |
| **1 — Leads & capture** *(highest value first)* | VPS + Docker + Postgres + storage; Payload embedded; `leads` + capture endpoints (extend `/api/rfq` contract), Turnstile, dedupe, email notifications, admin lead inbox w/ status+timeline, CSV export, deploy + health/backup automation. **End state: forms work on the hosted app even before content migration.** | 2–3 weeks | ৳1,00,000–1,25,000 |
| **2 — Blog & KB CMS** | `articles` collection + upload hooks (image pipeline) + reading-time/slug rules, preview token, publish → repository_dispatch rebuild (`content:pull` + feed/sitemap steps), seed migration for 12 existing articles, tawk→lead webhook bridge (§5.1), chat_sessions linking | 3–4 weeks | ৳1,25,000–1,50,000 |
| **3 — Catalog & site content** | `products`, `projects`, `services`, `brands`, `certifications`, `site-settings`, media library, dashboard widgets + saved views, roles/2FA hardening, git snapshot ledger, PDF-profile regeneration command wired to CMS data (one button: `npm run profile:pdf` on VPS), editor runbook (EN/AR) | 2–3 weeks | ৳80,000–1,10,000 |
| **4 — Messaging uplift (optional)** | WhatsApp Business API outbound pings + inbound timeline sync, Chatwoot swap option, scheduled publish cron hardening, decision to go always-dynamic SSR (retires the rebuild step) | quote on demand | ৳60,000+ |

**Recurring:** infra ৳2,500–4,000/mo (VPS+storage+email within free tiers) + maintenance/security updates retainer ৳8,000–12,000/mo (recommended; includes restore test + uptime).
**Payment structure:** 40/30/30 per standing BITSCOL terms, phased gates.

**Acceptance gates (per phase, added to `docs/INSTRUCTION-LOG.md`):** P1 — a test RFQ with 3 files (incl. `.dwg`) from the live Pages form → lead visible in admin within 60 s with email received, dedupe badge on re-submit, CSV contains the row. P2 — publish an AR-toggled article in <5 min total; `/en/blog/<slug>` live, feed.xml + sitemap.xml include it; preview works pre-publish; rebuild failure blocks publish with editor-visible error. P3 — every string audit passes (`content:pull` diff = zero between DB and old TS on seed day); roles verified; backup restore rehearsal logged.

---

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Publish ≠ instant (2–3 min rebuild window) | Preview links; manual “rebuild now” button; Phase 4 SSR mode decision |
| WhatsApp automation = ToS breach / number ban | Phase-1 is manual wa.me only; Cloud API strictly opt-in + approved templates; no unsolicited outbound |
| VPS self-management burden | Caddy+Docker hardened compose, unattended-upgrades, quarterly restore test in retainer, full IaC in `deploy/` folder committed to this repo |
| Schema drift between CMS and site code | Types generated from one source (`lib/types.ts` remains canonical; `content:pull` fails the build on mismatch — CI gate) |
| Editors break SEO habits (empty alt, deleted slugs) | Required media alt, slug-change guard with redirect-note, AR-emptiness warning (publish allowed, flagged) |
| Lead file abuse | Existing MIME+extension+size validation, Turnstile, per-IP cap, storage quota alert |
| Vendor/key-person lock-in | MIT stack (Payload/Postgres/R2), schema doc = §4, git content ledger — exportable any time |

## 10. Open questions for Al Muraqib (answers gate Phase 0 → 1)

1. Who owns Arabic translation — in-house with CMS dual-pane, or our vendor flow (import/export CSV)?
2. Users & roles: confirm names for admin/editor/sales, 2FA tolerance.
3. Existing CRM (Zoho/Sheets)? If yes, Phase 1 adds a push-webhook instead of the status board.
4. WhatsApp: is the business number under a Meta Business Manager account? (gates Phase 4)
5. Hosting preference: our-managed VPS (recommended), client-owned VPS, or Vercel/Cloudflare budget acceptance.
6. Data retention policy confirmation (24-month auto-anonymize OK?).
7. Approve the 40/30/30 split with Phase-1 acceptance as the gate to P2 start.

---

*Kept honest by the continuity rule (`docs/CONTINUITY.md`): update this document in the same PR as any architectural change.*
