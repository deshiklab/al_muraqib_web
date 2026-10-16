# Al Muraqib Website v2 — Complete Development Plan
## Design Specification · Feature List · Build Plan

**Companion to:** `docs/WEBSITE-REDESIGN-PLAN.md` (research, IA, SEO, migration)
**Decisions locked:** Next.js + headless CMS (Sanity default, WP-headless fallback) · EN + AR (RTL) · WhatsApp + live chat (tawk.to) · RFQ forms → CRM (HubSpot default, Zoho fallback)
**Timeline:** 12 weeks / 6 sprints → launch. Draft design in this repo = visual reference; build starts on a fresh branch (§9.1).

---

# PART A — DESIGN PLAN

## A1. Design Principles

1. **Quote-first** — every screen has a visible next step toward an RFQ (never more than one scroll from a CTA).
2. **Industrial credibility** — spec-sheet clarity, certifications, project proof; no consumer-ecommerce vibes (no cart, no prices unless supplied).
3. **Bilingual by design** — layouts designed once, verified in EN **and** AR RTL at every breakpoint.
4. **Fast & accessible** — WCAG 2.2 AA, CWV green on mobile; motion respects `prefers-reduced-motion`.
5. **Content-driven** — every block is a CMS component, not a hardcoded page section.

## A2. Design Tokens (evolved from draft)

### Color
| Token | Value | Usage |
|---|---|---|
| `--navy-900` | `#0f172a` | Dark sections, footer, headings on light |
| `--navy-800` | `#0a2540` | Mega-menu promo panel, cards on dark |
| `--blue-700` | `#0369a1` | Primary brand, links, primary buttons |
| `--blue-600` | `#0284c7` | Hover/secondary blue |
| `--gold-500` | `#f59e0b` | Accent: RFQ CTAs, highlights, badges |
| `--gold-600` | `#d97706` | Accent hover |
| `--slate-50` | `#f8fafc` | Page background |
| `--white` | `#ffffff` | Surfaces/cards |
| `--gray-700/500/200/100` | Tailwind slate scale | Body text, meta, borders, dividers |
| `--success / --danger / --warning` | `#16a34a` / `#dc2626` / `#d97706` | Form states, stock/approval badges |

Rules: body text ≥ 4.5:1 contrast; gold never on white for text (backgrounds/badges only); primary RFQ buttons = gold on navy or navy on gold.

### Typography
| Role | EN | AR |
|---|---|---|
| Headings | Montserrat 700–900 | Noto Kufi Arabic 700–900 |
| Body | Inter 400–600 | Noto Kufi Arabic 400–600 |
| Data/mono (spec values) | IBM Plex Mono | same |

Scale: `12 · 14 · 16 · 18 · 20 · 24 · 30 · 36 · 48 · 60` px (mobile → desktop H1 36→60). Line-height body 1.65, headings 1.15. Loaded via `next/font` (self-hosted, `font-display: swap`).

### Spacing, Shape, Elevation
- 4-pt grid: `4 8 12 16 24 32 48 64 96 128`.
- Container: `max-w-7xl` (1280px), gutters 16/24/32 px; reading width for articles 760px.
- Radius: cards/inputs `12px`, buttons `10px`, chips `999px`, images `12px`.
- Shadows: `soft: 0 10px 40px -10px rgba(0,0,0,.08)` (cards), `dropdown: 0 20px 50px -12px rgba(0,0,0,.25)`.
- Breakpoints: `sm 640 · md 768 · lg 1024 · xl 1280`.

### Iconography & Imagery
- Line icons: Lucide (tree-shaken, 1.5px stroke); feature checklists in gold on navy tiles.
- Product images: 1:1 cards, 4:3 gallery, uniform light-gray studio background; WebP/AVIF, ≤1500px, blur placeholder.
- Photos: factory/process shots for About; installed-project hero shots for case studies; technical line-drawings as gallery tab fallback where photos missing.
- Hero style: full-bleed photo + navy gradient scrim + white Montserrat-black headline + gold CTA.

## A3. Motion

- Scroll reveal: fade-up 16px, 500ms ease-out, once (IntersectionObserver) — inherited from draft.
- Hover: cards lift 4px/200ms; buttons color-shift 150ms; images scale 1.03.
- Counters (stats) animate on view; tabs underline slides 250ms; mega menu fades+slides 180ms.
- Skeletons for RFQ step transitions; all motion disabled under `prefers-reduced-motion`.

## A4. Global Layout Components (component library)

| # | Component | Notes |
|---|---|---|
| 1 | Top utility bar | Email · phone · socials · **EN\|AR switcher** (persistent) |
| 2 | Main header | Logo · mega menu · search (`/` shortcut) · **gold "Get a Quotation"** · mobile hamburger |
| 3 | Mega menu (desktop) | Full-width: 3 link columns + navy promo card + featured/download block; keyboard + focus-trap |
| 4 | Mobile drawer nav | Accordion groups, sticky CTA + language at bottom |
| 5 | Footer | 4 col: brand/newsletter · quick nav · product groups · accreditations; legal row; socials |
| 6 | Chat dock | WhatsApp float + tawk.to (stacked/mobile unified launcher) |
| 7 | Desktop side tab | Fixed right edge "Get a Quote" (gold, vertical) |
| 8 | Mobile sticky bar | Call · WhatsApp · Quote (product & category pages) |
| 9 | Exit-intent modal | Once/session, catalog pages: "Upload your BOQ →" |
| 10 | Search overlay | Global, grouped results (Products/Blog/KB/Pages) |
| 11 | Breadcrumbs | JSON-LD + visual |
| 12 | Card: Product | Image, group chip, title, spec chips, Details + **Get Quote** |
| 13 | Card: Project | Hover overlay: sector, location, scope |
| 14 | Card: Article | Hero, category, date, reading time |
| 15 | Chip / filter pill / facet checkbox group | Multi-select with count + clear |
| 16 | Spec table | Grouped rows, sticky sub-nav, downloadable spec sheet |
| 17 | Tabs / scrollspy anchor nav | Product page sections |
| 18 | Gallery + lightbox | Thumbs, zoom, badge slot, tab grouping |
| 19 | Variant selector | Segmented buttons/dropdowns, delta labels |
| 20 | Multi-step form wizard | Steps, progress bar, validation summary, review |
| 21 | File dropzone | Drag&drop, progress, per-file remove, type/size rules |
| 22 | CTA bands (dark/gold) | "We're waiting to help" pattern from draft |
| 23 | Stats counters | Established / clients / projects |
| 24 | Logo walls | Clients & accreditations (marquee optional) |
| 25 | Testimonial/quote block | Client + project attribution |
| 26 | FAQ accordion | Global + scoped reuse |
| 27 | Related rails | "You may also like" / "Specified together" / "Related articles" carousels |
| 28 | Newsletter form | Inline + footer, double opt-in |
| 29 | Callout / notice | Info, warning, download (brochure) |
| 30 | Empty state | "Can't find it? We custom-fabricate → RFQ" |
| 31 | Toasts | Success/error (RFQ ref #, copy-to-clipboard) |
| 32 | Skip-link, focus ring, reduced-motion guard | A11y baseline |

## A5. Page Designs (template layouts)

### A5.1 Home
```
[Top bar][Header w/ mega menu + gold RFQ CTA]
Hero: photo + navy scrim — H1 "Leading GRP & FRP Manufacturers in the UAE",
      sub, [Get a Quotation][Browse Products], trust line (ISO · Since 2016 · DM/ESMA)
Stats strip: Established / Clients / Projects (animated)
Product groups: 3×2 image tiles (Tanks · Pools · Lining · Septic · Architectural · Custom)
Featured products rail (6 cards)
"Why Al Muraqib" icon grid (6) + certifications badges
Projects: 3 featured case cards + [View all projects]
Sectors served: icon chips (5)
Clients logo wall (auto-marquee)
Knowledge/insights: 3 latest blog cards
CTA band (navy): "Upload drawings, get pricing" → /get-quotation
[Footer + newsletter][Chat dock][Side tab]
```

### A5.2 Products index (catalog)
```
Breadcrumbs · H1 + intro · search-within · sort
[sidebar facets (desktop) / bottom-sheet (mobile)] | [grid 3-col cards + pagination]
Applied-filter chips row · results count · empty state → RFQ
Sticky mobile: filter button + CTA
```

### A5.3 Product detail ★ (see plan §5.3 for full module list)
```
Breadcrumbs + group chip
[Gallery (thumbs/tabs)] [Buy-box: H1, pitch, variant selectors, key facts,
                          gold "Request Quotation for this variant",
                          Download brochure, WhatsApp]
Anchor tabs: Description | Features | Specs | Applications | Attributes | FAQ | Related
Product-group tabs (sibling variants) + "Bought together (quote all)" row
Description → Key features (icon grid) → Spec tables (grouped) →
Applications (icon cards → landing pages) → Attributes KV table →
FAQ accordion → Projects using it (cards) → Related carousel → Related articles
[Sticky mobile bar: Call · WhatsApp · Quote]
```

### A5.4 Get-quotation (RFQ wizard)
```
Header (compact) + stepper: 1 Contact → 2 Products → 3 Project → 4 Files → 5 Review
Left: step content (see plan §5.5B) · Right: summary card (items, files, context)
Footer: Back / Continue · autosave note · privacy + consent · Turnstile
Success: green panel, RFQ ref (copy), "what happens next" timeline, WhatsApp option
```

### A5.5 Projects index / case study
Index: filter chips (sector × product) + masonry cards → detail:
Hero image · fact bar (location/year/scope/products/capacity) · Challenge→Solution→Result ·
gallery lightbox · "Discuss a similar project" CTA band · related products.

### A5.6 Blog & KB (article template)
Category chip · H1 · meta (date, author, reading time) · hero ·
on-this-page TOC (KB) · rich body (tables, callouts, figures) ·
share row (RTL-aware) · related products + related articles ·
"Need pricing?" CTA · feedback widget (KB: 👍👎).

### A5.7 Company (About / Certifications / Clients), FAQ, Contact, Search, 404, Legal
- **About:** story timeline, mission/vision cards (draft pattern), facility gallery, stats, capability grid.
- **Certifications:** badge grid → lightbox scans with number/validity, download buttons, compliance table.
- **Contact:** details + working map (key) + reason-based form (Quotation/Support/General) + attachment + WhatsApp.
- **Search results:** grouped tabs, instant filter, zero-state suggestions.
- **404:** search box + popular links + RFQ CTA.

### A5.8 Responsive & RTL rules
- Mobile-first; breakpoints per A2. Mega menu → accordion drawer; facets → bottom sheet; buy-box → static block under gallery; sticky mobile CTA bar on transactional pages.
- RTL: logical properties everywhere (`ms/me/start/end`), mirrored chevrons/arrows, gallery LTR only for product photos, tables scroll-x with start-aligned headers, forms validated per-direction.

---

# PART B — FEATURE LIST (master checklist)

**P0 = launch blocker · P1 = fast-follow (≤1 month) · P2 = later**

## B1. Global / Navigation
| P | Feature |
|---|---|
| P0 | Top utility bar: email, phone, socials |
| P0 | **Multi-language switcher EN\|AR in top bar** (cookie + hreflang + RTL flip) |
| P0 | Sticky header with scroll state (transparent→solid on hero, from draft) |
| P0 | **Mega menu** (3 columns + promo panel + featured block, a11y keyboard support) |
| P0 | Mobile drawer nav (accordion, sticky CTAs) |
| P0 | Persistent header **"Get a Quotation"** button |
| P0 | Global search overlay (products/blog/KB/pages, `/` shortcut) |
| P0 | Footer: quick nav, product groups, newsletter, accreditations, legal, socials |
| P0 | Back-to-top, current-year auto, 404 page |
| P1 | Breadcrumbs on all inner pages (visual + JSON-LD) |
| P1 | Recently viewed products (localStorage) |
| P2 | Dark/light preference (likely skip) |

## B2. Home
| P | Feature |
|---|---|
| P0 | Hero + dual CTA + trust line |
| P0 | Animated stats counters (draft pattern, fixed) |
| P0 | Product group tiles, featured products rail |
| P0 | Why-us icon grid, certifications badges, client logo wall |
| P0 | Featured projects (3), latest blog (3), dark RFQ CTA band |
| P1 | Testimonials carousel, sectors chips, process timeline (Design→Mold→Install) |
| P2 | Video background hero, award/press strip |

## B3. Catalog & Filters
| P | Feature |
|---|---|
| P0 | Products index with card grid, pagination, sort |
| P0 | **Faceted filters:** group, application, capacity/size, technology, insulation, certification (URL-synced) |
| P0 | Applied-filter chips, clear all, results count |
| P0 | Mobile bottom-sheet filters |
| P0 | Product-card **"Get Quote"** button (prefill context) |
| P0 | Empty state → custom-fabrication RFQ CTA |
| P1 | Search-within-results, view toggle (grid/list), "popular" sort via analytics |
| P1 | Compare up to 3 products (spec table diff) |
| P2 | Price-band filter (if prices ever public), saved filters (share URLs only for now) |

## B4. Product Detail ★
| P | Feature |
|---|---|
| P0 | **Product gallery** (thumbs, lightbox, zoom, badges, tab-grouped Installed/Product/Drawings) |
| P0 | **Multi-variant selectors** (capacity, press, insulation, color…) feeding specs + RFQ payload |
| P0 | Sticky buy-box: key facts, **"Request Quotation for this variant"**, brochure download, WhatsApp deep-link |
| P0 | **Product group tabs** (sibling variants/models switcher) |
| P0 | Anchor/scrollspy tabs across sections |
| P0 | **Description** (rich) |
| P0 | **Key Features** icon checklist |
| P0 | **Technical Specifications** (grouped tables + download spec sheet) |
| P0 | **Use Applications** (icon cards → application landing pages) |
| P0 | **Product Attributes** key–value table |
| P0 | **"You May Also Like"** + **"Specified/bought together"** with **"Quote all together"** |
| P0 | Product FAQ block (FAQPage schema), related projects, related blog articles |
| P0 | Mobile sticky bar (Call · WhatsApp · Quote), breadcrumbs |
| P1 | 360°/video slot, drawing viewer (PDF embed), share button, print/PDF spec sheet |
| P1 | Enquiry counter ("Downloaded 120× this month" — only if real) |
| P2 | CAD/BIM download gated by RFQ, product availability/lead-time indicator |

## B5. Quotation System ★
| P | Feature |
|---|---|
| P0 | **Multi-step RFQ wizard**: Contact → Products → Project requirements → **File upload** → Review |
| P0 | **Requirements upload:** DWG/DXF/PDF/XLS/DOC/IMG/ZIP · 5 files · 25 MB · progress · private storage |
| P0 | Context prefill from any page/product/variant/project (query params) |
| P0 | Validation (Zod) + Turnstile captcha + honeypot |
| P0 | Reference number `RFQ-YYYYMMDD-XXXX` + on-screen success + email receipt |
| P0 | **CRM integration** (HubSpot default): contact + deal + note + attachment sync, retry queue |
| P0 | Sales email notification + customer auto-reply (EN/AR) |
| P0 | localStorage draft autosave; back/forward steps |
| P0 | RFQ management view in CMS (status: New/Contacted/Quoted/Won/Lost, attachments) |
| P1 | Exit-intent / scroll-depth modal on catalog pages (once/session) |
| P1 | "Quote all together" seeding from bought-together row |
| P1 | WhatsApp handoff after submit (send summary to sales chat) |
| P2 | Calendly-style booking on `/book-a-consultation`, RFQ SLA reminders, quote PDF generator |

## B6. Chat & Contact
| P | Feature |
|---|---|
| P0 | **WhatsApp float** with prefilled locale + page/product context |
| P0 | **tawk.to live chat** (lazy-loaded, offline capture, page-context push) |
| P0 | Unified mobile chat launcher; business-hours label |
| P0 | Contact page: details, working map (API key), reason form + attachment, WhatsApp |
| P1 | Chat/WhatsApp click events to GA4; canned intro by landing page |
| P2 | Chatbot decision-tree (product finder), offline form fallback in widget |

## B7. Projects / Portfolio
| P | Feature |
|---|---|
| P0 | Index with **filter chips** (sector × product type), masonry grid |
| P0 | Case-study detail: fact bar, challenge/solution/result, gallery lightbox |
| P0 | "Discuss a similar project" RFQ CTA; featured projects on home |
| P1 | Map view of UAE projects, before/after slider |
| P2 | Client logo → case study cross-links, PDF capability statement |

## B8. Blog
| P | Feature |
|---|---|
| P0 | Index: featured post, category chips, cards, pagination |
| P0 | Article: hero, author, date, reading time, rich body, share, related products/posts |
| P0 | Categories + tags archives, RSS, per-locale metadata |
| P0 | CMS authoring (draft/schedule/preview) |
| P1 | Table of contents, code/figure blocks, estimated-read progress bar |
| P2 | Comments (likely skip → WhatsApp share), content scoring |

## B9. Knowledge Base & FAQ
| P | Feature |
|---|---|
| P0 | KB index → categories → articles (TOC, tables, downloads) |
| P0 | **Search** across KB+blog+products |
| P0 | Per-product & global **FAQ** accordions with FAQPage schema |
| P0 | "Was this helpful? 👍👎" feedback → analytics |
| P0 | Article CTAs: RFQ / chat / related product |
| P1 | Attach KB articles to products (`relatedProducts`), "most viewed" rail |
| P2 | AI-assisted article search (embedding-based) |

## B10. CMS / Admin
| P | Feature |
|---|---|
| P0 | All schemas (product, group, variant, project, article, kb, faq, rfq, client, certification, nav, redirect, settings) **with EN/AR locale fields** |
| P0 | Role-based users (Admin/Editor/Viewer), scheduled publish, preview |
| P0 | Media library w/ alt text per locale; image optimization pipeline |
| P0 | **301 redirect manager** (CSV import) |
| P0 | RFQ inbox + status workflow |
| P1 | Editorial guidelines/desk-check fields (SEO score, missing-locale warnings) |
| P2 | Webhooks to ERP/WhatsApp Business API |

## B11. SEO & Analytics
| P | Feature |
|---|---|
| P0 | Per-locale titles/meta/OG, canonical, hreflang (en/ar/x-default) |
| P0 | JSON-LD: Organization, LocalBusiness, Breadcrumb, Product+Offer, FAQ, Article, WebSite |
| P0 | Sitemap.xml (partitioned), robots.txt, RSS |
| P0 | 301 map from legacy WP URLs |
| P0 | GA4 + GTM + GSC; consent mode; events: `view_item`, `generate_lead`, `phone_click`, `whatsapp_click`, `file_download` |
| P0 | Server-rendered content (no client-only copy) |
| P1 | OG image generation per article, internal-link suggestions |
| P2 | Schema for videos, live rank tracking dashboard |

## B12. Non-functional
| P | Requirement |
|---|---|
| P0 | Lighthouse mobile ≥ 95 perf / ≥95 a11y / 100 SEO (CI gate via Lighthouse CI) |
| P0 | CWV: LCP < 2.5s, CLS < 0.1, INP < 200ms |
| P0 | WCAG 2.2 AA (axe-core clean on templates), keyboard + SR testing |
| P0 | EN + AR visual QA on iOS Safari, Android Chrome, desktop |
| P0 | Security: rate-limited APIs, file-type sniffing, private upload URLs, Zod validation, CSP headers, Turnstile |
| P0 | Uptime monitoring + error tracking (Sentry) + backup of CMS content |
| P1 | i18n completeness report (missing-translation dashboard) |
| P1 | Load test RFQ endpoint (100 concurrent) |

---

# PART C — DEVELOPMENT PLAN

## C1. Architecture Overview

```
Browser (EN/AR, RTL)
   │
   ▼
Next.js App Router (Vercel edge)
   ├── SSG: all marketing pages (revalidate ISR on CMS webhook)
   ├── Route Handlers (API):
   │     POST /api/rfq        — multipart: validate → R2 storage → CMS record
   │     │                        → CRM (HubSpot) → email (Resend) → queue/retry
   │     POST /api/newsletter — double opt-in
   │     POST /api/feedback   — KB helpfulness
   │     GET  /api/search     — index query (v1: Pagefind/Fuse)
   │     POST /api/revalidate — CMS webhook (secret)
   │     GET  /api/health
   ├── next-intl middleware: /en/* · /ar/* (x-default → en)
   └── next/image optimizer → Sanity CDN / R2
CMS (Sanity) ── editorial content, schemas, webhooks, managed content
Chat: wa.me link + tawk.to (3rd-party, lazy) · Analytics: GA4/GTM
```

### C2. Repository structure (fresh branch `website-v2`)
```
/
├── app/
│   ├── [locale]/
│   │   ├── (site)/            # layout: header, footer, chat dock, side tab
│   │   │   ├── page.tsx                    Home
│   │   │   ├── products/page.tsx           Catalog (+ [slug] group + detail)
│   │   │   ├── services/…  projects/…  blog/…  knowledge-base/…
│   │   │   ├── company/…    faq/  contact/  get-quotation/  search/  404
│   │   │   └── legal/…
│   │   └── layout.tsx         # dir/lang, fonts
│   ├── api/…                  # route handlers (§C1)
│   ├── sitemap.ts  robots.ts  opengraph-image.tsx
├── components/                # ui/ forms/ layout/ modules/ (A4 library)
├── content/                   # i18n message files (en.json, ar.json)
├── lib/                       # sanity client, crm, storage, zod schemas, utils
├── sanity/                    # schemas/ (B10), sanity.config, desk structure
├── styles/                    # tokens.css, tailwind config
├── tests/                     # vitest units · playwright e2e+visual · a11y
├── docs/                      # plan docs (this + research plan)
└── .github/workflows/         # ci.yml: lint, typecheck, test, lighthouse
```

### C3. Key data flows
- **RFQ:** client wizard → `POST /api/rfq` (Zod + Turnstile + size/type check) → R2 private object (uuid keys) → Sanity `rfq` doc → HubSpot contact/deal (custom props: ref, products, locale, source URL) → Resend emails (sales + customer) → returns `RFQ-…` ref. Failure → BullMQ/queue retry + Sentry alert; CRM payload cached for manual replay.
- **Publish:** editor publishes in Sanity → webhook → `revalidateTag` → ISR page refresh (<60s) + sitemap ping.
- **Locale:** every Sanity doc carries `locale` variants (`title.en`, `title.ar`); UI strings in `content/*.json`; missing AR falls back to EN + logs to i18n report (P1).

## C4. Work Breakdown (WBS + estimates in dev-days)

| WS | Scope | Tasks | Est. |
|---|---|---|---|
| **WS0 Discovery & setup** | Access, accounts, decisions, inventory | CRM/CMS accounts, DNS/GA/GSC/GitHub/Vercel, WP content export, photo inventory | 4 |
| **WS1 Design** | A2–A5 | Tokens, component library, 12 templates hi-fi (EN+AR RTL), handoff specs | 15 |
| **WS2 Frontend foundation** | Shell | Next scaffold, Tailwind tokens, fonts, next-intl routing, header/mega/drawer/footer, search overlay, chat dock, side tab, back-top | 12 |
| **WS3 CMS & content model** | B10 | Sanity project, all schemas, locales, desk structure, roles, webhooks, redirect import | 10 |
| **WS4 Home + company pages** | B2 | Home modules (23 comps), About, Certifications, Clients, Contact (form+map) | 8 |
| **WS5 Catalog + product detail ★** | B3, B4 | Facets/URL state, cards, pagination; detail: gallery, variants, tabs, specs, features, applications, attributes, related rails, mobile bar | 16 |
| **WS6 RFQ + integrations ★** | B5, B6 | Wizard UI, dropzone, API pipeline, CRM sync, emails, RFQ inbox, WhatsApp/tawk, exit modal, analytics events | 14 |
| **WS7 Portfolio / Blog / KB / FAQ** | B7–B9 | Indexes, article templates, filters, feedback, schemas (FAQ/Article) | 12 |
| **WS8 SEO / i18n QA / a11y / perf** | B11, B12 | Metadata/hreflang/sitemaps/redirects, AR pass, axe+SR testing, image/font tuning, Lighthouse CI, Sentry | 10 |
| **WS9 Content entry + translation** | Plan §12 | 16+ products, 8–12 projects, 6 blogs, 10 KB, clients/certs; human AR review *(client-assisted)* | 12* |
| **WS10 Launch** | — | 301s, DNS, GSC, monitoring, editor training, handover docs | 5 |
| | | **Total dev (excl. client-assisted*)** | **~104 d** |

Parallel track: WS1 design runs ahead of WS2–WS7; WS9 begins once WS3 schemas freeze (from week 6).

## C5. Sprint Plan (2-week sprints, 12 weeks)

| Sprint | Weeks | Milestone / Demo | Exit criteria |
|---|---|---|---|
| **S0** | 1–2 | 🔹 Phase-0 sign-off + design tokens + wires | CMS/CRM/hosting decisions closed, sitemap & wires approved, repos/accounts created |
| **S1** | 3–4 | 🔹 Hi-fi designs (Home, Catalog, Product, RFQ) EN+AR · 🔹 scaffold live (shell, mega menu, i18n routing) on preview URL | Design QA pass (incl. RTL), shell a11y keyboard-tested, CI green |
| **S2** | 5–6 | 🔹 Home + Company pages + Contact · 🔹 **CMS schemas frozen** + first content entered | Content models approved; 100% template coverage in design; preview deployments per PR |
| **S3** | 7–8 | 🔹 Catalog + filters + **Product detail (all modules)** | Variant→RFQ prefill works; spec tables render from CMS; mobile product page complete |
| **S4** | 9–10 | 🔹 **RFQ wizard E2E** (upload→CRM→email→ref#) · 🔹 Portfolio · 🔹 Chat/WhatsApp live | E2E test green incl. failure/retry; CRM test objects verified by sales |
| **S5** | 11–12 | 🔹 Blog + KB + FAQ + search · 🔹 content complete · 🔹 **LAUNCH** | All P0 features (Part B) checked · Lighthouse gates · AR review signed · redirects verified · training done |

**Go/No-Go launch gate:** P0 checklist (Part B) 100%, no Critical/High bugs, RFQ pipeline tested with real CRM record, top-100 legacy URLs return correct 301s, client sign-off on EN+AR content.

## C6. QA & Quality Gates (every sprint)
- **CI:** ESLint + TypeScript strict + unit tests (Zod/business logic) + Playwright smoke (home, product, RFQ happy-path) + axe-core per template + Lighthouse CI budgets.
- **Visual regression:** screenshot diff on 6 key templates × (en/ar × mobile/desktop).
- **Manual matrix:** Safari iOS, Chrome Android, Firefox/Edge desktop; RTL mirror checks; form edge cases (oversize file, bad type, double submit, offline).
- **Content QA:** broken links, missing alt/meta (CMS warnings), hreflang validity.

## C7. Environments & CI/CD
| Env | URL | Purpose |
|---|---|---|
| Preview | `pr-*.site.vercel.app` | Every PR (staging CMS dataset) |
| Staging | `staging.*` | Client UAT + translation review |
| Production | `almuraqib.ae` | DNS via Vercel, ISR + webhook revalidation |

Deploy = merge to `main` (blocked on green CI). Rollback = Vercel instant revert; CMS content versioned (dataset snapshots daily).

## C8. Team & Responsibilities
| Role | Allocation | Owns |
|---|---|---|
| Full-stack dev (lead) | 100% × 12 wks | WS2–WS8, WS10 |
| UI designer | 60% × 6 wks | WS1, RTL variants, assets |
| Content/SEO writer | 40% × 6 wks (from wk 5) | WS9 EN copy, metadata, blog/KB |
| Arabic reviewer (client-side) | ~1 wk effort | AR translation QA |
| Client stakeholder | weekly demo | decisions, photos, certs, approvals |

## C9. Risk Register (delta beyond research plan §14)
| Risk | Mitigation |
|---|---|
| Product spec data incomplete (no drawings/test data) | Start with placeholder structure in S3; chase list in S0; launch with "engineering data on request" where needed |
| CRM API friction (auth, fields) | Isolate adapter interface; Sheets fallback ready; verified in S0 with test deal |
| Arabic quality slip | Human review gate in S5; i18n report; fallback-to-EN logging |
| Photo library thin | Shot-list delivered S0; interim consistent illustrations |
| Scope creep (compare, calculators, portal) | P1/P2 backlog locked; change requests go to post-launch |
| Third-party script cost to CWV (tawk/GA) | Lazy-load, consent mode, perf budget in CI |

## C10. Post-launch Backlog (P1/P2 recap)
Compare tool · exit-intent (P1) · Booking calendar · Chatbot product finder · Location landing pages (Dubai/SHJ/AUH + GCC) · CAD downloads gated by RFQ · Quote PDF generator · Video hero · Client login for tender docs · Cost calculator · ERP/WhatsApp Business API webhooks.

---

### Quick reference — deliverable checklist per phase
- **S0** decisions doc, sitemap, wires, asset/access inventory
- **S1** design system + 12 hi-fi templates (EN/AR), scaffold + shell
- **S2** CMS schemas, home/company/contact, content entry starts
- **S3** catalog + product detail complete
- **S4** RFQ→CRM pipeline, portfolio, chat
- **S5** blog/KB/FAQ/search, content complete, SEO/QA, **launch + training**
