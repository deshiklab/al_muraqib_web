# Al Muraqib Fiber Glass Industry — Website

Modern Next.js rebuild of [almuraqib.ae](https://almuraqib.ae): bilingual (EN/AR + RTL), 
product catalog with faceted filters, product detail templates, 5-step RFQ wizard with 
file upload, projects portfolio, blog, knowledge base, FAQ, WhatsApp + live chat dock, 
persistent quotation CTA, SEO-friendly routing.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · typed i18n dictionaries (EN/AR).

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Other commands:

```bash
npm run build      # production build (77 static pages)
npm start          # serve the production build
npx tsc --noEmit   # type-check
```

Requires Node.js 18.18+ (Node 20/22 recommended).

## Static export (GitHub Pages)

```bash
NEXT_PUBLIC_STATIC_EXPORT=1 npm run build   # → out/  (basePath /al_muraqib_web)
node scripts/static-index.cjs               # locale-aware / index redirect
```

Deployed automatically by `.github/workflows/pages.yml` on every push to the
main working branch → `https://deshiklab.github.io/al_muraqib_web/`.
One-time setup: **Settings → Pages → Source: “GitHub Actions”**.

Static-build differences: API routes don't exist, so the RFQ/contact forms
hand the request to **WhatsApp** (auto-composed message with a generated
reference number) instead of `POST /api/*`.

## Routes (quick tour)

| Route | What it shows |
|---|---|
| `/en`, `/ar` | Home — EN, Arabic RTL (top-bar language switch) |
| `/en/products` | Catalog with facet filters (group, technology, size, insulation, certification) |
| `/en/products/hot-press-grp-panel-tank` | Full product template: gallery, variants, specs, features, applications, FAQ, related |
| `/en/get-quotation` | 5-step RFQ wizard (draft save + file upload → reference number) |
| `/en/projects` · `/en/blog` · `/en/knowledge-base` · `/en/faq` | Portfolio, blog, KB, FAQ |
| `/en/about` · `/en/certifications` · `/en/services` · `/en/contact` | Company pages |

## Configuration (optional env)

Create `.env.local` if needed:

```
NEXT_PUBLIC_TAWK_PROPERTY_ID=     # enable tawk.to live chat (chat dock works without it)
NEXT_PUBLIC_GA_ID=                # Google Analytics
```

RFQ/contact submissions are appended to `.data/rfq.jsonl` / `.data/contact.jsonl` 
(gitignored) by the route handlers in `app/api/*` — swap these for your CRM endpoint in production.

## Content & i18n

- Copy lives in `lib/i18n/en.ts` + `lib/i18n/ar.ts` (EN is the type source)
- Catalog, projects, articles: `lib/data/*.ts` (structured for a headless CMS migration)
- Design tokens & animations: `app/globals.css`

## Docs

- `docs/WEBSITE-REDESIGN-PLAN.md` — research, sitemap, module specs, 301 map, timeline
- `docs/DEVELOPMENT-PLAN.md` — design spec, features, WBS, 6-sprint schedule
- `draft/` — original static draft (visual reference)
