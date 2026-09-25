# Al Muraqib Fiber Glass Industry LLC — Website Redesign / Rebuild
## Research Findings & Complete Delivery Plan

**Status:** Plan for approval (Phase 0 not started)
**Repo:** `deshiklab/al_muraqib_web` — current branch holds the **draft visual design** (static HTML/Tailwind). The production build will **start fresh on a new branch** (see §13 Branch Strategy), keeping the draft as the visual reference.
**Decisions locked with stakeholder:** Next.js + headless CMS · English + Arabic (RTL) · WhatsApp + live chat · Quotation forms integrated with a CRM.

---

## 1. Current State Analysis (almuraqib.ae)

### 1.1 What exists today
| Item | Finding |
|---|---|
| Platform | WordPress (Avada/Fusion sitemaps detected), Contact-Form-7-style forms |
| Nav | Home, Company (About, Certifications), Products (16+ product URLs), Services, Portfolio, Knowledgebase, Contact + Case Studies, Articles, Book a Consultation |
| Blog | `/articles/` exists but is **empty** (placeholder only) |
| Product pages | Thin: 1–2 paragraphs + sidebar inquiry form. No specs tables, no gallery, no variants, no related products |
| Contact form | Has "Reason of Contact" select + **file attachment** (only place upload exists) |
| Maps | Google Maps renders **keyless error** on contact page |
| Content quality | Placeholder images (`*-Placeholder.jpg`), counters render `0`, copyright frozen at "2016–2022", author shown as `super_admin_locksmith`, inconsistent ISO claim (9001:2008 vs 9001:2015) |
| i18n | None — no `hreflang`, no Arabic, no language switcher |
| SEO | Rank Math/Yoast-style titles present on some pages; no structured data; several thin/doorway-ish pages; client logos link to a `bit.ly` link |

### 1.2 Company facts to carry over (verified from live site)
- **Legal name:** Al Muraqib Fiber Glass Industry L.L.C
- **Address:** P.O. Box 2719, Plot 970-972, Al Bataeh Industrial Area, Al Bataeh Municipality, Sharjah, UAE (coords 25.2712191, 55.7300747)
- **Contacts:** +971 6 569 1110 · sales@almuraqib.ae · info@almuraqib.ae
- **Positioning:** GRP/FRP manufacturer since 2016, ISO 9001-certified, in-house design→molding→finishing→installation
- **Sectors:** Construction & infrastructure · Hospitality & leisure · Water & wastewater · Transportation/marine/industrial · Landscaping & architecture
- **Marquee projects:** Royal M Hotel Fujairah, FIVE Luxe JBR, FIVE Sensoria, FIVE JVC, Samana ParkView, Sinyar Nas 3
- **Clients:** ASAK, Fibrex, Progress Construction, Azizi, Penta EMI, NSE
- **Product lines:** Panel tanks (hot/cold press), cylindrical tanks, plunge pools (prefab + bespoke), GRP lining (RCC tanks / steel tanks / manholes-drains-sumps), septic & sewerage tanks, grease trap manhole covers, sand trap buckets, planter boxes, claddings, water features, car shades, trays, bathtubs, custom industrial components
- **Services:** GRP repair & maintenance, GRP lining application, custom fabrication

### 1.3 Draft design in this repo (what we keep as reference)
9 static pages (`index, about, certifications, contact, knowledgebase, pools, portfolio, products, services`) built with **Tailwind CDN + Font Awesome CDN + vanilla JS**. Good bones: mega-menu pattern with promo panel, dark-navy/industrial-gold palette (`#0369a1 / #0284c7 / #f59e0b / #0f172a`), Montserrat headings + Inter body, scroll reveals, counters, portfolio filter, newsletter + inquiry forms. **Gaps:** no product detail template, no blog, no i18n, no backend, CDN Tailwind is not production-grade, forms don't submit anywhere.

---

## 2. Reference Site Analysis

### 2.1 asiaticcomposite.com (India, FRP manufacturer)
**Take:** simple product-grid cataloguing with big product imagery; clear single-page-per-category structure; inquiry entry point in the header.
**Avoid:** dated visual design, no filters, no specs depth, no content marketing.

### 2.2 articalindustries.com (India, FRP manufacturer)
**Take:**
- **Sticky top "Send Inquiry" + floating WhatsApp** with prefilled message — always-on conversion path ✔ (matches client's "quotation focus on every page")
- "Get Product Price list" secondary CTA in header
- **Per-card "Get Quote"** on every product card
- Stats counters, "Why Choose Us" icon grid, **Use Applications icon grid** (pharma, chemical, food…) ✔ maps directly to the client's "Use Application" requirement
- Client logo wall, homepage FAQ block with "View All Questions"
**Avoid:** flat design, thin product detail pages.

### 2.3 jivialcomposite.com (India, GFRP — strongest reference)
**Take:**
- **Product detail completeness:** gallery with thumbnails, long description, **specifications table**, price/MOQ/delivery meta block, **"Get Quote on WhatsApp"** deep link, **"You May Also Like"** carousel, **related blog articles** on product page, brochure download, sticky bottom contact bar (Call · Email · Brochure · Quick Inquiry · WhatsApp)
- **SEO-driven blog:** technical comparison/how-to articles targeting long-tail queries — this is the growth engine to copy
- Breadcrumbs, filter-style product grouping (tabs/sections per family), gallery tab by application (Fencing / Plants / Construction) ✔ matches "Product group tab"
**Avoid:** Drupal-era performance, broken embedded quotation form ("Form not found").

### 2.4 steel-bazar.com product page (client-linked example)
**Take:** tabbed **Description / Attributes** layout, product attributes as key–value table, variant selectors (color/unit/quantity), availability badge, tags, "Get Quote" primary action alongside browse actions.
**Avoid:** cart/checkout mechanics — Al Muraqib is quote-based, not e-commerce.

### 2.5 Feature-by-feature benchmark (target for v1)
| Client requirement | Best reference | Design decision |
|---|---|---|
| Blog | Jivial (technical long-tail articles) | Category/tag/archive + related products |
| Mega menu | Draft design + Jivial grouping | Full-width mega menu w/ promo panel, keyboard accessible |
| Product filter | Jivial groupings + Artical cards | Faceted sidebar filters, URL-synced |
| Project portfolio | Draft + Artical client walls | Filterable case studies with detail pages |
| Quotation focus | Artical sticky CTAs + WhatsApp | Persistent header CTA + per-card/per-product prefill |
| Advance quotation + upload | Existing almuraqib.ae contact (upload) | Multi-step RFQ with attachments → CRM |
| Chat | Jivial/Artical WhatsApp | WhatsApp float + tawk.to live chat |
| Multi-language | (none — our differentiator) | EN/AR switch in top bar, full RTL |
| Knowledge base | Draft knowledgebase page + Jivial blog depth | KB categories → articles → search |
| FAQ | Artical FAQ + schema | Global FAQ + per-product FAQ blocks |
| Product page modules | Jivial + steel-bazar + draft | See §7 full spec |

---

## 3. Goals, Audience & KPIs

**Primary audience:** contractors, developers, consultants/MEP specifiers, facilities & procurement managers in UAE/GCC.
**Primary goal:** generate qualified **quotation requests** (RFQs) with enough detail (files/specs) for sales to price quickly.
**Secondary goals:** organic SEO growth (GRP tank/lining/pool keywords), tender credibility (certifications, projects), Arabic-market reach.

| KPI | Baseline (today) | Target @ 6 months |
|---|---|---|
| RFQs / month | ~unmeasured (no analytics visible) | 40+ with attachments/specs |
| Organic sessions / month | low (thin pages, empty blog) | 3× baseline |
| Core Web Vitals | failing (CDN/legacy) | All green (LCP < 2.5s) |
| Indexed pages (valid) | partial, thin | 100% of sitemap, 0 errors in GSC |
| Arabic sessions | 0 | 15–25% of total |
| Quote-form completion rate | unknown | > 35% started → submitted |

---

## 4. Information Architecture / Sitemap

```
/                                   Home (EN) · /ar (AR)
├── /company/
│   ├── /company/about/             Story, mission/vision, facility, capability stats
│   ├── /company/certifications/    ISO 9001, DM/ESMA approvals, test reports (downloadable)
│   ├── /company/clients/           Client & contractor logos, testimonials
│   └── /company/careers/           (optional, phase 2)
├── /products/                      Catalog home: filters + all groups
│   ├── /products/water-storage-tanks/
│   │   ├── /products/grp-panel-tank/hot-press-grp-panel-tank/
│   │   ├── /products/grp-panel-tank/cold-press-grp-panel-tank/
│   │   └── /products/grp-cylindrical-tank/
│   ├── /products/pools/
│   │   ├── /products/prefabricated-grp-plunge-pools/
│   │   └── /products/bespoke-grp-plunge-pools/
│   ├── /products/lining-systems/
│   │   ├── /products/grp-lining-on-rcc-tank/
│   │   └── /products/grp-lining-on-rcc-manholes-drains-sump-pits/
│   ├── /products/septic-sewerage/   (septic tanks, sewerage tanks, grease trap covers)
│   ├── /products/architectural/     (planters, claddings, water features, trays, bathtubs, car shades)
│   └── /products/sand-trap-bucket/  + custom industrial components
├── /services/
│   ├── /services/grp-lining/
│   ├── /services/grp-repair-maintenance/
│   └── /services/custom-fabrication/
├── /projects/                       Portfolio index (filter: sector × product type)
│   └── /projects/{slug}/            Case study: challenge → solution → gallery → specs → CTA
├── /blog/                           Blog index + /blog/{slug}/ + /blog/category/{slug}/
├── /knowledge-base/                 KB index + /knowledge-base/{category}/ + /knowledge-base/{slug}/
├── /faq/                            Global FAQ (FAQPage schema)
├── /get-quotation/                  ★ Advanced multi-step RFQ (uploads → CRM)
├── /contact/                        Contact details, map, general form
├── /book-a-consultation/            Calendar-style booking request (phase 2 OK)
├── /search/                         Site search (products, blog, KB)
├── /sitemap.xml · /robots.txt · RSS feed
└── Legal: /privacy-policy/ · /terms/
```

URLs **mirror the existing WordPress slugs wherever possible** so 301s are 1:1 and link equity is preserved (§11).

---

## 5. Feature Specifications

### 5.1 Mega menu (header)
- Full-width panel on hover/focus (desktop), accordion drawer (mobile).
- Left promo card (dark navy): headline, blurb, "View all solutions →" CTA (as in draft).
- 3 columns mapped to groups: **Water Storage & Tanks · Pools & Architecture · Protection, Lining & Services** — each with description, up to 6 links, and "View group" footer link.
- Right-edge featured block: rotating promo (e.g., "Download tank brochure" / "DM-approved lining").
- A11y: `aria-expanded`, focus trap, Esc to close, works without hover (click toggle).
- Header also carries: **language switcher (EN|AR)**, phone, search, and persistent **"Get a Quotation"** button (accent color).

### 5.2 Product catalog + filters (`/products/`)
- **Grid/list toggle**, sort (popular, A–Z, newest), results count, "clear all".
- **Facets (left sidebar desktop / bottom-sheet mobile):**
  - Product group (Tanks, Pools, Lining, Septic & Sewerage, Architectural, Custom)
  - Application/industry (potable water, wastewater, hospitality, landscaping, industrial, marine)
  - Capacity / size range (slider or buckets: <10 m³, 10–50, 50–100, 100+)
  - Technology (hot press / cold press / hand lay-up / pultruded)
  - Insulation (insulated / non-insulated)
  - Certification tag (DM approved, ESMA, ISO)
- Filter state **syncs to URL** (`?group=tanks&capacity=50-100`) → shareable, indexable (canonical handling for faceted pages).
- Each card: image, group tag, 2-line pitch, key specs chips (e.g., "1–4 m height · SMC panels"), **"Details" + "Get Quote"** buttons (Artical pattern).
- Empty state → "Can't find it? We custom-fabricate" + RFQ CTA.

### 5.3 Product detail page — full module spec ★
Order of modules (desktop 2-col: main content + sticky right rail):

1. **Breadcrumbs** (`Home > Products > Group > Product`) + group tag.
2. **Gallery (left):** main image + thumbnail strip; zoom-on-hover/lightbox; badges (e.g., "DM Approved"); gallery grouped by tabs if content allows (**Installed / Product / Drawing** — maps to client's "Product Gallery").
3. **Buy-box (right, sticky):** H1, short pitch, **multi-variant selectors** (§5.3a), key fact rows (capacity range, material, standard, lead time), primary **"Request Quotation for this variant"** (prefills RFQ), secondary "Download brochure (PDF)", WhatsApp button with prefilled product name, phone link.
4. **Anchor tabs (scrollspy):** Description · Key Features · Specifications · Applications · Attributes · FAQ · Related.
5. **Product group tabs (for similar products):** tab strip switching between sibling variants/models of the same family (e.g., *Hot Press | Cold Press | Insulated*) — implemented as related-product tabs powered by the `productGroup` relation (client's "Product group tab (for Similar products)").
6. **Description** (rich text, per steel-bazar `#description`).
7. **Key Features** — icon-checklist (2/3/4-col grid).
8. **Technical Specifications** — grouped spec tables (Dimensions, Materials & Construction, Performance, Compliance) with sticky group sub-nav for long tables; "Download spec sheet" per group.
9. **Use Applications** — icon cards linked to application landing pages (Artical pattern).
10. **Product Attributes** — key–value table (steel-bazar pattern: Material, Color, Finish, Weight, Temperature rating, Connection type, Warranty…).
11. **FAQ block** (product-scoped, `FAQPage` schema).
12. **Projects using this product** — 2–3 case-study cards.
13. **"You May Also Like / Bought Together"** — two rows: *Same group* carousel + *Frequently specified together* (e.g., Panel Tank + Lining + Repair service) with a "Quote all together" button that adds every item to one RFQ.
14. **Related blog articles** (Jivial pattern).
15. **Sticky mobile CTA bar:** Call · WhatsApp · Get Quote.

**5.3a Multi-variant model (quote-based, no cart):** tank products get variant axes — *Capacity/Litres, Panel press type, Insulation, Fittings package, Color (architectural products)*. Selecting a variant swaps gallery image, spec deltas, and feeds `variant` into the RFQ payload. Price shown as **"Contact for pricing"** (no public prices unless client supplies).

### 5.4 Projects portfolio
- Index with filter chips: **Sector** (Hospitality, Residential, Infrastructure, Industrial, Municipal) × **Product type**; masonry grid; hover reveals scope + location.
- **Case study detail:** hero gallery, fact bar (location, year, scope, products used, capacity), Challenge → Solution → Result narrative, image gallery/lightbox, "Discuss a similar project" RFQ CTA, related products.
- Homepage pulls 3 featured projects; logos of marquee clients as trust bar.

### 5.5 Quotation system (★ client priority)
**A. Always-on entry points**
- Header button **"Get a Quotation"** (all pages, accent, sticky).
- Per-product / per-variant / per-card buttons that deep-link with context prefilled.
- Floating side tab + WhatsApp float; Artical-style top strip optional.

**B. Advanced RFQ page `/get-quotation/`** — multi-step wizard:
1. **Contact** — name*, company, role, email*, phone*/WhatsApp, country/city, how did you hear (optional).
2. **Products** — searchable multi-select of catalog items with per-item qty/spec note; "Not listed / custom" free-text; **"Quote all together"** can pre-seed from product pages.
3. **Project requirements** — sector, project stage (Tender/Design/Construction/Replacement), location, required-by date, budget band (optional), spec notes.
4. **Attachments ★** — drag & drop upload: DWG, DXF, PDF, XLS/XLSX, CSV, DOC/DOCX, JPG/PNG, ZIP · max 25 MB total, 5 files · progress bar, remove, virus-scan hook, stored privately in object storage (not publicly URL-addressable).
5. **Review & submit** — summary, consent/privacy checkbox, hCaptcha/Turnstile, submit → **reference number `RFQ-YYYYMMDD-XXXX`** on screen + email receipt with copy of details.
- Draft autosave to `localStorage`; back/forward steps; mobile-first; full EN/AR strings.

**C. Backend → CRM**
- API route validates → stores submission (CMS collection `rfq`) → pushes to **CRM** (contact + deal/ticket with attachments) → emails `sales@almuraqib.ae` + auto-reply to customer.
- Fallback path if CRM API down: queue + retry, alert flag in admin.
- Admin view: list/filter RFQs by status (New/Contacted/Quoted/Won/Lost), source product, attachments viewer.
- Tracking: GA4 `generate_lead` event with value placeholder, GTM, UTM capture, WhatsApp referrer attribution.

### 5.6 Chat (both channels)
- **WhatsApp float** (bottom-right): prefilled message including current page URL + product name; locale-aware text (EN/AR); business-hours label.
- **tawk.to live chat** (or equivalent free operator chat): agent dashboard, offline message capture, mobile app; loaded lazily after page interactive to protect CWV; page-context pushed to chat (URL, product viewed).
- Positioning: WhatsApp and chat share a dock (stacked) to avoid clutter; mobile shows single expandable "Chat with us" launcher containing both.
- Optional homepage chatbot kickoff script — deferred to phase 2.

### 5.7 Multi-language (EN + AR) with RTL
- Routing: `/en/...` (default, `x-default`) and `/ar/...`; language switcher in **top bar** (persisted to cookie + `hreflang` alternate tags on every page).
- Framework: `next-intl` (or equivalent) — message files per locale, typed keys; RTL via `dir="rtl"` on `<html>`, Tailwind logical properties (`ms-`, `me-`, `start-`, `end-`), mirrored icons.
- Typography: Inter + Montserrat (EN); **Noto Kufi Arabic / Cairo** for AR; numeral strategy (western digits default — confirm with client).
- Content: all CMS schemas are **locale-aware** (Sanity/PLL/WPML-style `locale` field); nav, mega menu, filters, RFQ wizard, emails, WhatsApp prefill, chat widget, SEO metadata all translated.
- Workflow: draft machine-translation for structure, **human Arabic review** of all launch-critical pages (home, product families, RFQ, contact, about).
- Shared assets (images/drawings) — localized `alt`/captions; separate image variants only when text is baked in.

### 5.8 Knowledge base
- `/knowledge-base/` → categories (Selection Guides, Installation & Maintenance, Standards & Compliance, Troubleshooting, Buying Guides) → articles (rich text, TOC, images, tables, downloadable PDFs).
- **Search** across KB + blog + products (client-side index like Pagefind/Fuse, or Algolia if budget allows); "Was this helpful? 👍👎" feedback; related articles; "Still need help? → RFQ / chat" CTA on every article.
- Articles can attach to products (`relatedProducts`) so they surface on product pages.

### 5.9 FAQ
- Global `/faq/` grouped by topic (Buying, Specifications, Delivery, Warranty, After-sales) — full `FAQPage` JSON-LD.
- Per-product and per-category FAQ blocks (CMS-reusable `faq` documents referenced by pages).
- Artical-style homepage FAQ teaser (4 Qs + "View all").

### 5.10 Blog
- `/blog/` index with featured post, category chips, tag archive, pagination, author box, reading time, related products + related posts on each article, social share, RSS.
- Content plan seeded with Jivial-style long-tail topics adapted to Al Muraqib: comparisons (hot vs cold press), "how to specify a GRP panel tank", "GRP lining vs epoxy for RCC tanks", DM approval guides, plunge pool cost/planning, maintenance schedules, project case-study announcements (§12).

### 5.11 Chat-adjacent utilities
- Site-wide **search** in header (overlay, keyboard `/` shortcut) — results grouped Products / Blog / KB / Pages.
- Newsletter signup (footer) — double opt-in, stored in CMS/ESP.
- Sticky mobile bottom bar on product pages (Call / WhatsApp / Quote).

---

## 6. Technology Architecture

### 6.1 Stack (recommended)
| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | SSG/ISR, React Server Components, route handlers for APIs |
| Styling | **Tailwind CSS** (built, not CDN) + design tokens from draft palette | Radix/shadcn primitives for menus/dialogs/a11y |
| Content | **Headless CMS — Sanity (recommended)**; fallback: WordPress headless w/ ACF | Locale-aware schemas (§7), image CDN, GROQ queries. **Decision point in Phase 0** — client familiarity may favor WP |
| Media | CMS asset pipeline → CDN, automatic WebP/AVIF, next/image | 1500px max, blur placeholders |
| i18n | `next-intl` | EN/AR, RTL |
| Forms/RFQ | Next.js route handlers + Zod validation + Turnstile | File upload → private S3-compatible bucket (e.g. Cloudflare R2) |
| CRM | **HubSpot Free CRM API** *(recommended)* or Zoho (GCC-popular) — confirm in Phase 0 | Contact + deal + note + attachment; fallback: Google Sheets + email |
| Email | Resend/Postmark (transactional) | RFQ notify + auto-reply, newsletter via ESP |
| Chat | WhatsApp `wa.me` deep link + **tawk.to** widget | Lazy-loaded |
| Search | Pagefind/Fuse.js (v1) → Algolia if volume grows | |
| Analytics | GA4 + Google Tag Manager + Search Console; consent mode | Events: `view_item`, `generate_lead`, `phone_click`, `whatsapp_click` |
| Hosting | **Vercel** (or Cloudflare Pages) + R2 for uploads | Edge CDN, preview deployments per PR |
| Repo/CI | GitHub — lint, typecheck, Lighthouse CI, visual regression on key templates | |

### 6.2 Why not the alternatives (summary)
- **Full WordPress theme rebuild:** fastest migration but weakest performance ceiling, plugin-driven security/maintenance burden, harder RTL/i18n quality.
- **Pure static/SSG with markdown:** great speed, but RFQ/CRM, multilingual editing, and non-technical content updates get awkward — content volume (blog + KB + products ×2 languages) justifies a CMS.

### 6.3 Content model (CMS schemas — all fields locale-aware)
```
product          { slug, group*, title, pitch, gallery[], variants[],
                   description, keyFeatures[], specGroups[{name, rows[]}],
                   applications[], attributes[], documents[],
                   faqs[], relatedProducts[], boughtTogether[],
                   projects[], articles[], seo{...} }
productGroup     { slug, title, description, heroImage, order }
variantOption    { axis (press|capacity|insulation|color), value, deltas }
project          { slug, sector, location, year, scope, products[],
                   gallery[], challenge, solution, result, seo }
article (blog)   { slug, category, tags[], body, relatedProducts[], hero, seo }
kbArticle        { slug, category, body, helpfulness, relatedProducts[] }
faq              { scope (site|product|group), question, answer, order }
rfq              { ref, contact, items[], requirements[], files[], status, crmId }
service          { slug, title, body, steps[], cta }
client/testimonial, certification, page (singleton blocks), siteSettings,
navigation (main mega menu), redirect (301 map), newsletterSubscriber
```

---

## 7. Design System Direction (evolving the draft)

- **Palette:** deep industrial navy `#0f172a` / `#0a2540`, primary blue `#0369a1`, steel `#0284c7`, **industrial gold `#f59e0b`** (CTAs & accents), surfaces `#f8fafc`/white — *from the draft; keep, refine contrast to WCAG AA*.
- **Type:** Montserrat (headings, black weights) + Inter (body); Noto Kufi Arabic for AR.
- **Components:** mega menu, sticky header with top utility bar, card system (product/portfolio/article), spec tables, tabs/scrollspy, chips/filters, multi-step form, modal RFQ drawer, footer with quick nav + newsletter + accreditations (all present in draft → rebuild as components).
- **Motion:** keep draft's scroll-reveal/counters but respect `prefers-reduced-motion`; performance-safe (transform/opacity only).
- **Imagery:** upgrade from placeholders — request client photo library (factory, installed projects, product studio shots); interim: generated technical illustrations consistent in style.
- **Draft's flaws to fix in rebuild:** Tailwind CDN → build pipeline; hardcoded `href="#"` socials; non-functional forms; duplicate side inquiry forms; counters showing 0; `bit.ly` client links; missing alt text; map API key.

---

## 8. Conversion Architecture ("quotation focus on every page")

```
Every page
 ├─ Header: [Get a Quotation] (persistent, accent) + phone + WhatsApp
 ├─ Contextual CTA: product cards → "Get Quote" (prefill)
 │                  product page → sticky rail + "Quote this variant"
 │                  project case → "Discuss a similar project"
 │                  KB/blog → "Request pricing / talk to an engineer"
 ├─ Floating: WhatsApp + chat dock (+ desktop side tab "Get a Quote")
 ├─ Mobile: sticky bottom bar (Call · WhatsApp · Quote)
 └─ Exit-intent / scroll-70% modal on catalog pages (once per session): 
      "Need drawings-based pricing? Upload your BOQ →" → /get-quotation/
```
All prefill links carry `?product=&variant=&source=` → captured into RFQ record and CRM source fields.

---

## 9. SEO Plan

### 9.1 Technical
- Next.js SSG/ISR; per-locale metadata; canonical + `hreflang` (en, ar, x-default).
- Structured data: `Organization`, `LocalBusiness` (coords + hours), `BreadcrumbList`, `Product` + `Offer` ("Contact for pricing") on detail pages, `FAQPage`, `Article`/`BlogPosting`, `CreativeWork` for projects, `WebSite` + `SearchAction`.
- XML sitemap (partitioned), robots.txt, RSS, 404 → search, rendered HTML (no client-only content).
- CWV budgets: LCP < 2.5s, CLS < 0.1, INP < 200ms; image/ font (`next/font`) optimization; third-party scripts deferred + consent mode.
- **301 redirect map** from every existing WP URL (§4 mirrors slugs) + retire `bit.ly` links → direct `/projects/` links.

### 9.2 On-page & content
- Keyword map per template: e.g. "GRP panel tank UAE/Saudi", "water tank supplier Sharjah", "GRP lining RCC tank Dubai", "prefabricated plunge pool UAE", "septic tank manufacturer UAE", "GRP cladding supplier".
- Location landing pages (phase 2): Dubai, Sharjah, Abu Dhabi, Ajman + GCC (KSA/Oman/Qatar) service pages.
- Blog cadence: 2–4 technical articles/month (Jivial playbook), internal links to product pages.
- On-page fields (title, meta, OG image, JSON-LD) editable per locale in CMS; preview in admin.

### 9.3 Off-page (recommendations, separate workstream)
- Google Business Profile claimed/optimized (Al Bataeh address + coords), UAE directories, supplier/partner backlinks (ASAK, Fibrex, consultants), project press releases, YouTube project videos embedded on case studies.

---

## 10. Phased Delivery Plan

> Indicative for one full-stack dev + design support, client supplying content/photos/approvals. Total **~10–12 weeks** to launch.

| Phase | Duration | Deliverables |
|---|---|---|
| **0 · Discovery & content audit** | 1 wk | Confirm CMS + CRM choices, analytics/GSC access, content inventory of WP, image inventory, WhatsApp number/tawk accounts, brand assets, this plan approved |
| **1 · IA, wireframes & design system** | 2–3 wks | Final sitemap, low-fi wires for 6 templates, high-fi designs (Home, Products list, Product detail, RFQ, Project case, Blog/KB article) EN + AR RTL, component library |
| **2 · Architecture & scaffold** | 1 wk (overlap) | **Fresh branch** (§13), Next.js scaffold, Tailwind tokens, CMS project + schemas, CI, preview deployments, i18n routing |
| **3 · Core build** | 3–4 wks | Header/mega menu, footer, home, company pages, product list + filters, product detail (all §5.3 modules), i18n + RTL complete |
| **4 · Feature build** | 2–3 wks | RFQ wizard + uploads + CRM/email, portfolio, blog, KB, FAQ, search, chat/WhatsApp, analytics events |
| **5 · Content & translation** | 2 wks (overlap) | Migrate/recreate products (16+), projects (8–12), certifications, clients; blog launch set (6 posts); KB launch set (10 articles); human AR review |
| **6 · SEO, QA, a11y, performance** | 1–2 wks | Schema validation, redirect map, Lighthouse ≥ 95, a11y pass (WCAG 2.2 AA), cross-browser/device QA, load test RFQ pipeline |
| **7 · Launch & hypercare** | 1 wk | DNS cutover, verify 301s + GSC resubmit, monitor RFQ delivery + CRM sync, bugfix window, handover docs + editor training |

**Post-launch backlog:** chatbot, `/book-a-consultation` calendar, location pages, brochure-request microsite, client login/tender docs, cost calculator, review/testimonial module, careers.

---

## 11. Migration & 301 Map (extract)

| Old URL (WordPress) | New URL |
|---|---|
| `/` | `/` |
| `/about-us/` | `/company/about/` |
| `/certifications/` | `/company/certifications/` |
| `/products/` | `/products/` |
| `/products/grp-panel-tank/hot-press-grp-panel-tank/` | same slug (kept) |
| `/products/grp-panel-tank/cold-press-grp-panel-tank/` | same slug (kept) |
| `/products/grp-cylindrical-tank/` | same slug (kept) |
| `/products/grp-lining-on-rcc-tank/` | same slug (kept) |
| `/products/grp-lining-on-rcc-manholes-drains-sump-pits/` | same slug (kept) |
| `/products/sand-trap-bucket/` | same slug (kept) |
| `/products/prefabricated-grp-plunge-pools/`, `/products/bespoke-grp-plunge-pools/` | same (kept) |
| `/services/`, `/services/grp-repair/` | `/services/`, `/services/grp-repair-maintenance/` |
| `/case-studies/` | `/projects/` (+ per-case redirects) |
| `/articles/` | `/blog/` |
| `/knowledgebase/` | `/knowledge-base/` |
| `/contact-us/` | `/contact/` |
| `/book-a-consultation/` | `/book-a-consultation/` (or 301 → RFQ if dropped) |
| `/portfolio/`, `/pools/`, alternate homepage | fold into `/projects/`, `/products/pools/`, `/` |
Full CSV of redirects generated by crawling `almuraqib.ae/sitemap*.xml` in Phase 6 and loaded via CMS `redirect` collection / host rules.

---

## 12. SEO & Content Seed List (launch set)

**Blog (6):** Hot press vs cold press GRP panel tanks · How to size a sectional water tank · GRP lining vs epoxy coating for RCC tanks · Dubai Municipality approval guide for water tanks · Prefabricated vs bespoke plunge pools · GRP tank maintenance checklist.
**KB (10):** Panel tank installation steps · Insulated vs non-insulated panels · Chemical resistance basics · Manhole/sump lining procedure · Sand trap bucket selection · Grease trap cover specs · Winter/summer water temperature control · Leak repair triage · Handling & transport guide · Warranty & after-sales.
**Products:** full spec sheets for all 16+ items — client to provide drawings, test data, brochures.

---

## 13. Git / Branch Strategy (per stakeholder: fresh start)

- Current branch `arena/01a0d89a-al-muraqib-web` keeps the **draft design** untouched as the visual reference.
- Production build starts on a **new branch** (e.g. `website-v2`) created from the default branch when implementation begins — scaffold lives in-repo (`/app`, `/content`, `/cms`), with the draft moved to `draft/` or kept at root until cutover (decision at scaffold time).
- All PRs → preview URLs; `main` = production via Vercel.
- Content entries (products, RFQs) live in the CMS, not in Git.

---

## 14. Risks & Open Questions (resolve in Phase 0)

| # | Item | Default if unanswered |
|---|---|---|
| 1 | Headless CMS: Sanity vs WordPress-headless (client editor familiarity) | Sanity (better locales/structured modeling) |
| 2 | CRM: HubSpot vs Zoho vs Sheets | HubSpot Free |
| 3 | Real product photography, drawings, spec sheets availability | Use styled placeholders + client shoots list |
| 4 | ISO certificate version (9001:2008 vs 2015) and other certs | Show verified scans only |
| 5 | WhatsApp Business number (same as +971 6 569 1110?) & business hours for chat | Use listed office number |
| 6 | Google Business Profile / GA4 / GSC / domain DNS access | Request in Phase 0 kickoff |
| 7 | Arabic translation reviewer | Client nominates; MT draft in interim |
| 8 | Public prices? | "Contact for pricing" everywhere |
| 9 | Newsletter/ESP choice (Brevo/Mailchimp) | Brevo (free tier, EU-friendly) |
| 10 | Hosting account (Vercel under org?) | Confirm before Phase 2 |

---

## 15. Definition of Done (per template)

- [ ] EN + AR versions complete, RTL verified on mobile/tablet/desktop
- [ ] All conversion entry points live (header CTA, contextual CTAs, WhatsApp, chat)
- [ ] RFQ end-to-end test: submit → storage → CRM → email → auto-reply → ref number
- [ ] Schema validated (Rich Results Test), hreflang/canonical correct
- [ ] Lighthouse: Performance ≥ 95 (mobile), A11y ≥ 95, SEO = 100
- [ ] Redirect map verified (no 4xx on top 100 landing pages)
- [ ] Editor trained; content freeze signed off
