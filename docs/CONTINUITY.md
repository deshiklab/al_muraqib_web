# AL Muraqib Website — Continuity & Handoff Guide

> Purpose: anyone (human or AI agent) resuming work in a **new session or branch** should
> reach the same standards as the session that built the site. Read this first, work, then
> close out per the Definition of Done.
> Snapshot taken **2026-10-17** after PR #3 (48-commit arena line) was **squash-merged into the default branch** —
> the default branch is now the source of truth. `arena/01a0d89a-al-muraqib-web` remains this session's push target
> and holds the per-turn history that the squash collapsed (INSTRUCTION-LOG.md is the narrative either way).

---

## 1. New-session quickstart (copy-paste this into the agent)

```
Repo: deshiklab/al_muraqib_web (Next.js 15.5 + Tailwind v4 bilingual EN/AR site, static export → GitHub Pages).
The 48-commit build line is merged to the default branch (squash of PR #3). A NEW session/branch starts from it:
    git fetch origin && git checkout <new-branch> origin/almuraqib-frontend-site-10384899349809002369
THEN read docs/CONTINUITY.md (this file) + docs/INSTRUCTION-LOG.md end-to-end; for CMS work also
docs/CMS-PLATFORM-PLAN.md. Keep every standing constraint and the §6 Verification Checklist; finish by
committing + pushing to your working branch and appending to docs/INSTRUCTION-LOG.md.
Deploy: pushes to arena/default auto-deploy Pages; other branches deploy manually —
    gh workflow run pages.yml --ref <your-branch>
```

If the arena branch has already been merged into the default branch, `git fetch origin main-branch && git reset --hard`
there suffices — never re-clone from the old static-HTML base commit.

## 2. Why continuity is fragile here (learned the hard way)

- **The sandbox is disposable.** `node_modules`, pip packages, `~/.profile-assets`, and even the
  preview server die between turns. Only **git** persists. → Commit + push at the end of every work turn.
- **A sandbox reset can roll `HEAD` back to the branch base** while the working tree keeps newer files.
  Recovery: `git fetch origin <branch> && git reset --hard <pushed-sha>` (untracked new files survive;
  re-run asset generators **after** any reset — a regeneration done before it gets clobbered).
- GitHub Pages deploys from pushes to `arena/01a0d89a-al-muraqib-web` via `.github/workflows/pages.yml`.
  A new session on a different branch **won't deploy** until it merges into that branch (or the branch is
  retargeted).

## 3. Source-of-truth map (edit here, everything else derives)

| Domain | File | What consumes it |
|---|---|---|
| Company facts (name, contact, address, stats, certifications) | `lib/data/site.ts` | Header/footer, contact, JSON-LD, **PDF cover/contact page** |
| Products (slug, name/pitch EN+AR, images) | `lib/data/catalog.ts` | Product pages, quote wizard, KB cross-links, **PDF portfolio** |
| Projects | `lib/data/projects.ts` | Projects grid, **PDF delivered-projects table** |
| Services / brands | `lib/data/services.ts`, `lib/data/brands.ts` | Services page, bands, **PDF** |
| Blog & KB articles | `lib/data/content.ts` (+ article bodies in md-ish structures) | listings via `components/blog/BlogClient.tsx`, rails detail pages |
| All UI copy | `lib/i18n/en.ts`, `ar.ts`, `bn.ts` | every page; keys must stay in sync across the three |
| Design tokens | `app/globals.css` `@theme` (navy‑950 `#07101f`, navy‑900 `#0f172a`, brand‑700 `#0369a1`, gold‑500 `#f59e0b`) | site + PDF script reuses exact hexes |
| Logo master | `public/images/brand/logo.png` | regenerate ALL brand derivatives via script (below) |

**Rule:** never hand-edit derived outputs (`public/company-profile.pdf`, `app/icon.png`,
`public/og-card.png`, `images/brand/*.png`) — edit the generator or the master and regenerate.

## 4. Runbook

```bash
npm ci                                              # sandbox may start empty; always assume so
npm run dev          # or: node_modules/.bin/next start -H 0.0.0.0 -p 3000
npx tsc --noEmit                                    # must be clean
npm run build                                       # must be green (run STANDALONE, never chained with pkill)
NEXT_PUBLIC_BASE=/al_muraqib_web NEXT_PUBLIC_STATIC_EXPORT=1 npm run build   # GitHub Pages gate → out/
npm run images:opt                                  # ⚠ re-compresses ALL of public/: commit its churn
                                                    #   in the same commit, or scope to a dir via /tmp copy
```

Regenerators (self-provisioning — they download what they need):

```bash
pip install --break-system-packages pillow numpy                              # brand assets
python3 scripts/build-brand-assets.py        # mark/lockup variants, icon.png, apple-icon.png, og-card.png
pip install --break-system-packages reportlab arabic-reshaper python-bidi pypdfium2
python3 scripts/build-company-profile.py     # bilingual Company Profile PDF (fonts auto-download)
```

## 5. Conventions & known traps (each one actually bit us)

1. **`NEXT_PUBLIC_BASE` prefix on every `public/` URL**: `const base = process.env.NEXT_PUBLIC_BASE ?? ""`.
   Missing prefix = broken images/logos on GitHub Pages. `next start` needs a rebuild/restart after new
   `public/` **directories** (files in existing dirs are picked up).
2. **Server→Client props must be serializable** — no functions passed to `"use client"` components
   (that's why `BlogClient`'s `f` prop carries `articleOne/articleMany` strings, not a `results(n)` fn).
3. **i18n**: add every key to `en`, `ar` **and** `bn`; `tl(locale, en, ar)` is the inline fallback helper.
4. **RTL**: the quote side-tab uses physical `right-0` (not `end-0`) per standing instruction. Tailwind v4:
   `!mt-x` is inert — use `space-y`/padding instead. Any content child of `TitleBackdrop` needs `relative`.
5. **Imagery policy (standing):** every section with a data-backed photo must render the real image
   (no vector fallback) — audits check BOTH `src` in JSX and the file on disk. File names are the contract:
   `public/images/<group>/<slug>.jpg`.
6. **PDF Arabic**: every Arabic literal passes `ar()` (= `get_display(arabic_reshaper.reshape(t))`), any run
   containing reshaped text must use the `Ku`/`KuB` fonts (Amiri) — other fonts silently drop U+FExx forms.
7. **Brand logo**: line art is recolored by alpha-tint variants (`logo-mark-white` for navy chips,
   `-navy` for light surfaces). Header/footer mark: `w-8 h-8` inside the `w-11` chip (intentionally not
   scaled up — keep the 1200-wide export from clipping).
8. **`grep -c` on minified HTML counts lines** — use `grep -o … | wc -l` when verifying SSR output.

## 6. Verification checklist (before calling anything done)

- [ ] `npx tsc --noEmit` clean; `npm run build` green.
- [ ] Static-export gate green; `out/` contains new public assets; prefixed URLs present in `out/en/index.html`.
- [ ] Preview server restarted on the fresh build; key routes `curl` 200 (EN **and** AR for anything copy-related).
- [ ] New imagery: renders in built HTML, file exists, optimized.
- [ ] `gh run list` — Pages workflow succeeded for the pushed commit (live at
      https://deshiklab.github.io/al_muraqib_web/).
- [ ] `docs/INSTRUCTION-LOG.md` gained a dated entry; `git push` done; working tree clean.

## 7. Branch & PR strategy

- Treat `arena/01a0d89a-al-muraqib-web` as the **dev trunk** (it is what Pages deploys).
- New sessions/branches: `git merge origin/arena/01a0d89a-al-muraqib-web` at the START, and open a PR
  back into it at the END. Small batches ≥ daily; never let a side branch age.
- A PR **arena/… → default branch** keeps future Arena clones complete; re-target `.github/workflows/pages.yml`
  (both workflows list branches) at the same time if the default branch should become the trunk.
- Don't force-push a shared branch; append commits instead.

## 8. Open roadmap (as of snapshot)

Done at snapshot: PR #3 pending-owner-merge (see below) · npm audit → **0 vulnerabilities** (next 15.5.28 + `overrides.postcss=8.5.28` — do not remove the override unless Next vendors patched postcss); RSS feed + Service/org/dateModified schema shipped.
Remaining, ordered by leverage:
1. ✅ PR #3 squash-merged 2026-10-17 — trunk is the base for all new branches.
2. **Custom domain `almuraqib.ae`** + HTTPS + GA4/GSC secrets (`NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GSC_SITE_VERIFICATION` read by the layout at build); submit `/sitemap.xml` (120 URLs) + `/feed.xml` to GSC/Bing. Canonical/hreflang/sitemap all already point at this domain.
3. **CMS & lead platform** — `docs/CMS-PLATFORM-PLAN.md` v1 awaiting client answers (§10 open questions gate Phase 0).
4. Real social URLs in `lib/data/site.ts` (footer placeholders also gate Organization `sameAs` — the filter auto-publishes once real), tawk property id, phone confirmations.
5. Client photography swap (filenames are the contract, §3) + brand-logo approvals.
6. Optional: fully localized AR/BN article bodies; per-locale OG cards (Arabic shaping blocker — see INSTRUCTION-LOG phase 9).

*If this guide and reality disagree, reality wins — then fix this file in the same PR.*
