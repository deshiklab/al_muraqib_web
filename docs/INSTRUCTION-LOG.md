# AL Muraqib Website — Instruction Log

A chronological record of every instruction given to the Arena agent to build this project, from kickoff to final polish. Where the original wording is preserved it is quoted; entries marked *(summary)* were condensed by session history. The matching git commits (pushed to `arena/01a0d89a-al-muraqib-web`) are linked for each phase.

---

## Standing constraints (given early, apply throughout)

| # | Instruction | Status |
|---|---|---|
| S1 | The proposal is generated **by BITSCOL** — PDF contact block: Belal Ahmed, CTO, Uttara Dhaka, sales@bitscol.com, +880 1711 853769. Pricing in **BDT**, budget tier ~$1k ≈ ৳1 lakh. | Done (`6b085df`) |
| S2 | Follow the structure of the **BITSCOL "Website Development Proposal" PDF** (Google Drive) — phases, 40/30/30 payment split, timeline table. | Done — `docs/` proposal in all 4 formats |
| S3 | Proposal files must be **committed** to the public repo under `docs/` (reversed an earlier "stay uncommitted" instruction). | Done — do not remove |
| S4 | Site must work as a **static GitHub Pages export** — no server-dependent assets, all images local files. | Verified each phase |
| S5 | The quick-quote side tab must sit on the **physical right edge** ("in the left… move it to right") even in Arabic RTL. | Done (`right-0`, not `end-0`) |
| S6 | Get-quote UX: **modal-style quick flow** for header/action buttons; full wizard kept for product-context deep links (`?product=&variant=`). Later refined to an app-style drawer. | Done |

---

## Phase 0 — Kickoff *(summary)*
> Build the AL Muraqib Fiber Glass (GRP products, Sharjah/UAE) marketing website — Next.js, bilingual **English + Arabic with full RTL**, modeled on the live reference site **almuraqib.ae** and its competitors: product catalog (GRP panel tanks, cylindrical tanks, plunge pools, RCC lining, septic tanks, planters, sand traps), projects/portfolio, services, contact + RFQ "Get a Quotation" flow, hosted as a static site on GitHub Pages (deshiklab.github.io/al_muraqib_web).

Also in this phase: the RFQ form contract (FormData name/email/phone/notes/files×5 ≤25MB → `{ok, ref}` with per-locale copy).
**Commits:** `3503f8c` (turns 1–2), `6b085df` (proposal PDF/DOCX/MD/TXT).

## Phase 1 — Quote UX & interactions *(summary)*
> Refine the quotation experience: quick-quote modal over the full wizard from the header button and action buttons; the floating side tab on the physical right edge; product-context deep links into the full wizard; WhatsApp fallback for the static deployment (`NEXT_PUBLIC_STATIC_EXPORT=1`).

**Commits:** `2555f3c` (turn 3), `66b1c6d` (turn 4).

## Phase 2 — Projects module, Bengali, Brands *(summary)*
> Advanced Projects filtering — sector / products / services multi-select + search + sort + removable chips; enriched project detail pages. Add **Bengali (bn)** as a third locale with a language-switcher dropdown (bn = full UI translation, data falls back to English). Add an **"Our Brands"** section on the home page (ASAK, Fibrex, Progress, Azizi, Penta EMR, NSE…).

**Commit:** `6f043d5`.

## Phase 3 — Fixes + image rollout *(verbatim)*
> "Fix the language drop-down menu index problem (it went under the menubar)
> Rename the **Fast quote into Quick Quote (Also apply to the buttons in the menu and side action button)**
> Generate all possible images (Products, Backgrounds, CTA Background, Page Title Backgrounds, Projects,)"

Delivered: stacking-context fix (`z-[60]` utility bar, dropdown `z-[90]`, opens upward in the drawer); "Quick Quote" labels in EN/AR/BN; image system built as a fallback-safe CSS-background layer (missing file = branded gradient art, zero JS). 9 product photos + 1 project photo this turn (platform limit: 10 images/turn).
**Commit:** `c19626a`.

## Phase 4 — Continue images
> "Next" → *(continue the remaining images)*

Generated: CTA band aerial, 7 remaining project photos (Royal M lining, FIVE Sensoria, Samana tank farm, Sinyar septic, Fujairah port, Azizi cladding, Progress), products + projects backdrops; fixed stray nested-folder write + server snapshot issue.
**Commit:** `e0e9530`.

## Phase 5 — Final backdrops
> "next"

Generated services / insights / contact / about backdrops (insights shared by Blog, Knowledge Base, FAQ). Full static-export sanity pass (all images land in `out/`, `/al_muraqib_web` prefix, `lang="bn"` pages).
**Commit:** `f98ddbe`.

## Phase 6 — Audit request
> "Check if any other image/background left to generate / set. Find out what's next?"

Found the last silent gap: article covers. Wired `Article.image` (card layer + detail hero via `TitleBackdrop`) and generated **6 editorial covers** (blog ×3, KB ×3). Reported the full 33-asset ledger + roadmap (form backend, real assets, PR, SEO polish).
**Commit:** `0234b4e`.

## Phase 7 — Product gallery photos + SEO
> "Start 4, also add all products Installed and Drawings photo"

Item 4 (SEO polish): satwide **JSON-LD** (Organization+WebSite; Product / BlogPosting / TechArticle), **per-page OG images** on 14 pages, **GA4** + **Search Console** env hooks, `.env.example`.
Gallery: `ProductHero` resolves a photo per tab — `/images/installed/<slug>.jpg` and `/images/drawings/<slug>.jpg`; generated **9 installed site photos** + 1 drawing sheet proof.
**Commits:** `22de7a5`, `946f063`.

## Phase 8 — Continue + homepage fix
> "continue — image generated but missing in homepage **Excellence Recognized Across Projects section.**"

Wired `src={proj.image}` into the homepage featured-project tiles (en/ar/bn). Generated the remaining **8 shop-drawing sheets** — full set: 9 products × (product + installed + drawing) = 27 gallery photos.
**Commit:** `b66e540`.

## Phase 9 — Re-audit
> "check again if any place is missing images"

Audited every `ProductArt` (9 sites) and `TitleBackdrop` (13 pages) usage against disk. Fixed 2 remainders: product-page "used in these projects" tiles now use project photos; legal pages got a hero backdrop. Result: zero unreferenced files, zero missing files, 48/48 serve 200.
**Commit:** `ac98bf7`.

## Phase 10 — Roadmap
> "What's Next?"

Answered: ① merge/PR, ② launch almuraqib.ae (DNS, real socials/tawk IDs, GA4+GSC secrets), ③ lead-capture backend decision (Formspree vs Node host), ④ image weight, ⑤ drop-in real client assets later.

## Phase 11 — Image optimization *(verbatim)*
> "start 4"

Added `sharp` + reusable **`npm run images:opt`** (`scripts/optimize-images.mjs`): ≤1600px, mozjpeg q72 progressive, PNG quantization, only-overwrite-if-smaller. Result: **13.1 MB → 6.8 MB (−48%)**; OG card 1.17 MB → 124 KB. Quality visually verified on worst cases.
**Commit:** `174df1b` (current HEAD).

---

## Phase 6 — Insights, Knowledge Base, Profile & brand identity *(summary)*
> ① Advanced search & filters for Blog listing and Knowledge Base listing (shared `BlogClient`:
> search, facets, sort, chips, featured hero — localized EN/AR/BN). ② Improved the single KB article
> page (reading progress, product jump-nav, share/WhatsApp rail, helpful widget, prev/next,
> related products). ③ Generate a Company Profile PDF with English **and** Arabic in the same
> document using the website's design & colours (products, services, content overview, contact,
> brands). ④ Add a profile download button and a CTA section on the About page.

Built `scripts/build-company-profile.py` (reportlab + arabic-reshaper + Amiri/Montserrat, auto-downloads
fonts; regenerates on demand — the PDF is a derived asset, never hand-edited). 5-page bilingual profile
visually QA'd page by page (pypdfium2 renders). Download entry: About-page CTA panel + footer link,
both `NEXT_PUBLIC_BASE`-prefixed and verified inside the Pages export. `scripts/build-brand-assets.py` added
later for the same derive-don't-hand-edit rule.
**Commits:** `2e40896` (blog filters + 6 posts), `4e20423` (KB filters, KB rails rewrite, PDF + CTAs).

> ⑤ Apply the official Al Muraqib lattice-house logo to the website (user supplied the master PNG).
> ⑥ "Make the logo (images/brand/logo-mark-white.png) little zoom out."

Master stored at `public/images/brand/logo.png`; all derivatives (white/navy mark & lockup variants,
`app/icon.png`, `apple-icon.png`, new 1200×630 `og-card.png`) generated by
`scripts/build-brand-assets.py`; old shield SVGs removed from header/footer/favicon; PDF cover re-cut.
Zoom-out applied per feedback (header/footer mark `w-8`, no scale-up).
**Commits:** `e383a5f`, `c281e61`.

> ⑦ "For further development/update, if we use another session/branch, what can we do to keep the
> consistency of the work?"

Answered structurally: `docs/CONTINUITY.md` (handoff guide: quickstart prompt, source-of-truth map,
runbook, traps, verification checklist, branch/PR strategy) + this log kept current + push-every-turn
discipline + open PR `arena/… → default branch` so future clones contain the full state.
**Commits:** this one.

---

## Phase 7 addendum — Hidden developer attribution *(verbatim)*
> "Put The hidden credit of BITSCOL inside the code of every page (This will not reveal to the public) on the footer credit will be visible to public."

Implemented in the two shared components so **every rendered page** carries it:
1. `app/[locale]/layout.tsx` → metadata `creator` (`<meta name="creator" content="BITSCOL — https://www.bitscol.com">`)
   plus `other` tags (`developer`, `developer-url`, `credits`) in every `<head>`.
2. `components/layout/Footer.tsx` → an HTML comment
   `<!-- Designed & Developed by BITSCOL — https://www.bitscol.com -->` emitted inside a
   `<span aria-hidden hidden>` — invisible on screen, permanent in view-source.
Public, visible credit remains the footer bottom-bar link (Phase 7). The 404/not-found shell uses the
root layout and intentionally has no footer; all `(site)` routes verified EN + AR.
**Commits:** (this one).

---

## Phase 8 — SEO, marketing & performance hardening *(verbatim)*
> "What can be done to make the site SEO and Digital Marketing friendly? How to make the site load faster and improve performance?"

Audited the repo state (17 generateMetadata routes, alternates/hreflang, JSON-LD stack, robots/sitemap force-static, 104–112 kB First-Load JS).
**Shipped in this pass:** (1) Google Fonts removed — five @fontsource packages self-host subsetted woff2 via globals.css @imports (kills the render-blocking third-party CSS; ~24 kB per subset, same-origin, immutable); (2) home LCP chain — preload `<link>` + `fetchPriority="high"` + width/height on slide 1, lazy/async on the rest; (3) FAQPage JSON-LD on /faq from the rendered groups; (4) `components/seo/Breadcrumbs.tsx` BreadcrumbList wired into product/blog/KB detail (localized Home label incl. AR); (5) `theme-color` #07101f viewport export, `og:locale`+`alternateLocale`.
Plan doc: **`docs/SEO-PERFORMANCE-PLAN.md`** — Shipped / Next-tier (AVIF prebakes, per-locale OG cards, RSS, GA4 events incl. generate_lead, Offer schema) / Operations (connect almuraqib.ae first!, GSC submit, GBP, UTM convention, content cadence, directory links).
tsc clean, build green, export gate pending→pass, verified by curl: 0 googleapis refs, font woff2 200 font/woff2, fetchPriority on hero img, both schemas present EN+AR.

---

## Phase 8 addendum — next tier shipped *(repeat of the same ask → executed the plan's queue)*
> "What can be done to make the site SEO and Digital Marketing friendly? How to make the site load faster and improve performance?"

Implemented from `docs/SEO-PERFORMANCE-PLAN.md` §B: (1) **AVIF/WebP hero** — new `scripts/emit-avif.mjs` (sharp, idempotent) + `npm run images:avif`; HeroSlider → `<picture>` (avif/webp/jpeg) with `display:contents`, preload retargeted to `.avif`; LCP frame 96→54 KB, all three slides −37% avg; (2) **`file_download` tracking** — new `components/ui/TrackLink.tsx` (dataLayer.push + passthrough anchor), wired on the Company-Profile CTA (about) + footer link with `where` param; noted that `generate_lead`/`whatsapp_click`/`cta_quote_click`/`blog_filter` were already firing via `track()`; (3) **`public/llms.txt`** site brief for AI answer engines. tsc clean, build green, export gate: out/hero contains all 3 variants + llms.txt; server re-verified (picture×3, preload .avif 200 image/avif, jpg fallback intact). Plan doc flipped items 2/5/7 to shipped with re-run instructions.

---

## Phase 8 addendum 2 — wave 3 of SEO *(verbatim)*
> "What else can be done for SEO?"

Shipped: (1) **Service JSON-LD** ×3 on the services page (from the SERVICES blocks themselves: name/desc/anchor URL, areaServed GCC, provider @id org); (2) **Organization enrichment** — areaServed 6 countries, contactPoint (sales; EN/AR/BN; phone+email), geo centroid (Al Bataeh), and a **placeholder-safe `sameAs`** filter (bare facebook.com/-style roots are dropped; real profile URLs auto-join the schema); (3) **dateModified** on BlogPosting + TechArticle; (4) **RSS**: `scripts/build-feed.py` → `public/feed.xml` (12 items, per-item hreflang atom links; `npm run feed` after content changes) + head autodiscovery link — implemented as a literal layout `<head>` tag because Next **replaces** (not merges) parent `alternates` when a page defines its own (caught during verification); (5) sitemap/feed confirmed live (120 URLs; feed 200 application/xml; out/ gate green). Plan doc updated (remaining: GA conversions declaration, domain, GBP, per-locale OG cards, Offer schema pending prices).

---

## Phase 9 — CMS & lead platform plan *(verbatim)*
> "Make a plan if we want to develop a CMS to manage/update the contents and information of this website, also include lead capture and basic lead management, chat & messaging linked with lead management, blog and knowledge base management."

Delivered as **`docs/CMS-PLATFORM-PLAN.md`** (draft v1): hybrid architecture — **Payload CMS 3 + Postgres on a small VPS embedded in this repo, public site stays the GitHub Pages static export** (publish → repository_dispatch → content:pull → rebuild). Covers: full collection model mirroring `lib/types.ts` (articles/products/projects/site-settings/media with the localized `L` pattern + upload-hook image pipeline), lead pipeline reviving the existing validated `/api/rfq` contract with dedupe/status/timeline/CSV + Turnstile, tawk→lead webhook bridge + WhatsApp deep-link (Phase 4 Cloud API with ToS guard, Chatwoot swap option), editorial workflow with preview tokens and git content ledger, security/backup/monitoring runbook, 4 phases with acceptance gates and BDT estimates (P1 leads ৳1.0–1.25L → P3 content ৳0.8–1.1L; ops ৳10.5–16k/mo), risks, and 7 open questions gating Phase 0. No code changes this turn.

---

## Phase 10 — Next-session preparation *(verbatim)*
> "We will start next update work in another session with another branch. Prepare for that, so that goes as planned smoothly."

Actions: dependency debt cleared — `npm audit fix` bumped next 15.5.26→**15.5.28**, plus `overrides.postcss=8.5.28` (Next-vendored 8.4.31 was the remaining XSS/file-read pair) → **0 vulnerabilities**, CSS pipeline diff-checked (14 woff2, export gate green). Deploy automation de-forked: both `pages.yml` and `deploy-preview.yml` now also trigger on the default branch (post-merge), other branches via `workflow_dispatch` (comment in file documents it). CONTINUITY.md snapshot/quickstart/roadmap rewritten for a new-session/new-branch start (base-tip rule, deploy command, updated open list incl. CMS plan pointer); PR #3 title/body refreshed with 48-commit scope + handover notes; **squash-merged into the default branch** per owner decision — trunk is now the start point for new sessions.

---

## Known open items (not yet instructed)
1. PR → base branch / merge to main.
2. Custom domain `almuraqib.ae` + real social links, tawk.to IDs, phone/WhatsApp confirmation.
3. RFQ lead capture for static hosting (Formspree/Apps-Script vs Node host) — Pages build currently falls back to WhatsApp/`mailto`.
4. Replace AI imagery with real client photography when supplied — filenames are the contract (`public/images/<group>/<slug>.jpg`).

*Generated 2026‑10‑16 by the Arena agent from session history; earlier turns were summarized by the platform, later quotes are verbatim.*
