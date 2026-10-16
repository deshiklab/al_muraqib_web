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

## Known open items (not yet instructed)
1. PR → base branch / merge to main.
2. Custom domain `almuraqib.ae` + real social links, tawk.to IDs, phone/WhatsApp confirmation.
3. RFQ lead capture for static hosting (Formspree/Apps-Script vs Node host) — Pages build currently falls back to WhatsApp/`mailto`.
4. Replace AI imagery with real client photography when supplied — filenames are the contract (`public/images/<group>/<slug>.jpg`).

*Generated 2026‑10‑16 by the Arena agent from session history; earlier turns were summarized by the platform, later quotes are verbatim.*
