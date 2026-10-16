# AL Muraqib Website — Continuity & Handoff Guide

> Purpose: anyone (human or AI agent) resuming work in a **new session or branch** should
> reach the same standards as the session that built the site. Read this first, work, then
> close out per the Definition of Done.
> Snapshot taken 2026‑10‑16 at commit `c281e61` (36 commits ahead of the repo default branch).

---

## 1. New-session quickstart (copy-paste this into the agent)

```
Repo: deshiklab/al_muraqib_web (Next.js 15 + Tailwind v4 bilingual EN/AR site).
FIRST run:  git fetch origin arena/01a0d89a-al-muraqib-web
            git merge origin/arena/01a0d89a-al-muraqib-web   (or wait for it to be merged to the default branch)
THEN read docs/CONTINUITY.md (this file) and docs/INSTRUCTION-LOG.md end-to-end.
Keep every standing constraint and the Verification Checklist; finish by committing and pushing
to the working branch, and append to docs/INSTRUCTION-LOG.md.
```

If the arena branch has already been merged into the default branch, `git fetch` alone suffices —
never re-clone from an older commit.

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

1. Merge the 36-commit arena branch PR into the default branch (see §7) — pending owner decision.
2. `npm audit`: 3 vulnerabilities — bump when convenient.
3. Lead capture for static hosting (Formspree/Apps Script vs Node host) → re-enables `/api/rfq`.
4. Custom domain `almuraqib.ae` + HTTPS + GA4/GSC secrets; real social/tawk/phone confirmations.
5. Replace AI imagery with client photography (drop files into `public/images/...` per §3 naming).
6. Optional: fully localized article bodies (currently EN bodies with AR notes).

*If this guide and reality disagree, reality wins — then fix this file in the same PR.*
