# SEO, Digital Marketing & Performance Plan — AL Muraqib Website

Grounded audit of this repo (not generic advice). Split into **Shipped**, **Next tier (code)**, and **Operations (non-code)**.

---

## A. Shipped — already live (as of `@` this commit)

### SEO / marketing foundations
| Item | Where | Notes |
|---|---|---|
| Per-locale `generateMetadata` on 17 routes | every page | unique titles/descriptions EN·AR·BN |
| Canonical + hreflang (en/ar/bn + x-default) | `lib/seo.ts` `alternates()` | resolved against `metadataBase` = almuraqib.ae |
| Per-section OG images | `lib/seo.ts` `ogImages()` | 1200×630 branded cards |
| `og:locale` + `alternateLocale` | `app/[locale]/layout.tsx` | en_US / ar_AE / bn_BD — correct share previews |
| robots.txt + full sitemap (3 locales × core/products/projects/blog/KB) | `app/robots.ts`, `app/sitemap.ts` | `force-static` → exports to `out/` |
| JSON-LD: Organization (+PostalAddress), WebSite, Product, BlogPosting, TechArticle | layout + detail pages | org `@id` referenced by articles/products |
| **FAQPage schema** | `/[locale]/faq` | built from the same rendered Q&A groups → eligible for FAQ rich results |
| **BreadcrumbList schema** | product, blog & KB detail pages | matches visible breadcrumbs incl. localized “Home” |
| Hidden developer attribution | layout meta + footer comment | `creator`/`developer`/`credits` + HTML comment every page |
| GA4 drop-in | layout `<head>` | fires only when `NEXT_PUBLIC_GA_ID` is set at build |
| theme-color, apple-touch-icon, branded favicon | layout + `app/*.png` | navy #07101f mobile chrome |
| Fully bilingual/RTL | `lib/i18n/*` | doubles the indexable surface for GCC Arabic search |

### Performance
| Item | Win |
|---|---|
| **Fonts self-hosted** via `@fontsource` (subset woff2 compiled into the CSS bundle) | removed a render-blocking third-party stylesheet + 2 preconnects; browsers fetch only needed subsets (~20–25 KB each); no Google dependency (privacy/China-GCC reliability bonus) |
| **LCP chain on home**: `<link rel=preload as=image fetchpriority=high>` for slide 1 + `fetchPriority`/`width`/`height` on the first slide `<img>`, lazy+async for the rest | hero starts at first byte, no layout shift |
| `images:opt` pipeline (sharp: ≤1600px, mozjpeg q72, PNG quantization) — 13.1 MB → 6.8 MB once, enforced repo-wide | smallest payload per image in class |
| Zero UI/framework bloat: no component kit, no animation library (104–112 kB First-Load JS incl. React itself) | home ships ~111 kB / ~34 kB gzip |
| Static export (no server), immutable hashed assets, same-origin everything | edge-cache friendly, TTFB = Pages CDN |
| `loading=lazy` + `decoding=async` on below-fold imagery incl. brand plates | LCP-only bandwidth |

---

## B. Next tier (code, when the next session picks it up)

1. **Measure before/after with PageSpeed Insights** — run the CrUX/lab numbers into the table; target LCP < 2.0 s on 4G, CLS < 0.05 (already structurally safe via size hints), TBT < 100 ms (small JS, should pass).
2. ✅ **AVIF/WebP pre-bakes for the export** — `npm run images:avif` (`scripts/emit-avif.mjs`) emits `.avif` (q52) + `.webp` (q66) beside `public/hero/*.jpg`; `HeroSlider` negotiates via `<picture>` with the JPEG as fallback, and the head `<link rel=preload>` points at the AVIF. LCP frame 96→54 KB. Backdrops stay CSS backgrounds (no negotiation there); re-run the script after any hero image swap.
3. ✅ Partial: — skip; per-locale OG cards — a small PIL pass in `build-brand-assets.py`-style generator; improves CTR when content is shared in GCC WhatsApp/LinkedIn where most of the audience lives.
4. ✅ **RSS shipped** — `npm run feed` (`scripts/build-feed.py`) parses `content.ts` → `public/feed.xml` (12 items, per-item atom:link hreflang alternates en/ar/bn). Autodiscovery `<link rel=alternate type=application/rss+xml>` rendered in the layout `<head>` (metadata `alternates.types` does NOT survive page-level `alternates` overrides — Next replaces the whole object; keep it as a literal tag). Re-run `npm run feed` whenever articles change, same rule as images. **Submit the feed to Bing/IndexNow when the domain is live.**
5. ✅ **`llms.txt`** shipped at `public/llms.txt` (company brief, key pages, contacts — keep it in sync when sections are added). `sitemap-news` still only if news-eligible later.
6. **Offer schema on product pages** — still blocked on approved price ranges. Added meanwhile: ✅ **Service schema** (3 blocks on /[locale]/services with areaServed + `#anchor` URLs), Organization now carries **areaServed (GCC), contactPoint (sales, trilingual), geo (Al Bataeh centroid — refine when GBP pins)** and **`sameAs` is placeholder-filtered**: bare roots like facebook.com/ are excluded automatically, so real handles start flowing into schema the moment `site.socials` is updated (they're currently bare platform URLs — the footer icons link nowhere useful too; fix as part of the data round).
7. ✅ **GA4 event layer** — `generate_lead` (all three RFQ paths, with `ref`/`files`/`via`/`locale`), `whatsapp_click`, `phone_click`, `cta_quote_click {where}`, `blog_filter` engagement already fire through `track()`. Completed now: `file_download {file: "company-profile", where}` on the About CTA + footer link via `components/ui/TrackLink.tsx`. Remaining: declare these as conversions in the GA4 property when `NEXT_PUBLIC_GA_ID` is issued.
8. **Real product photography** swap (standing item) — genuine images materially improve both engagement and image-search performance.
9. **404 → route links** are fine; add the sitemap link in the not-found view for crawlers.

## C. Operations / digital-marketing checklist (non-code)

1. **Connect `almuraqib.ae`** (CNAME → deshiklab.github.io + HTTPS on Pages, or migrate host): canonical URLs already assume the apex domain — until it's attached, all hreflang/canonical/sitemap point at an unclaimed host. This is the single biggest lever left.
2. **Search Console** property (domain) + `NEXT_PUBLIC_GSC_SITE_VERIFICATION` is already wired; submit `sitemap.xml`. **Bing Webmaster** (imports GSC) — GCC still indexes via Bing for enterprise queries.
3. **Google Business Profile** for P.O. Box 2719 / Al Bataeh, Sharjah: categories (Fibreglass fabricator, Water tank supplier), photos from `public/images/installed/`, WhatsApp link = the RFQ number. GBP + this site's LocalBusiness/Organization schema reinforce each other for “GRP tank supplier Sharjah” SERPs.
4. **LinkedIn company page + `og:image` testing** via Post Inspector; the branded share card exists — verify Arabic RTL renders acceptably (LinkedIn truncates; the lockup is image-based so it's safe).
5. **UTM convention** for every outbound campaign (`?utm_source=whatsapp&utm_medium=directory&utm_campaign=grptanks`) + one landing parameter (`?product=`) — the RFQ drawer already captures `source`/`sourceUrl` into the lead payload, so campaign attribution lands with the lead.
6. **Content cadence:** blog + KB listings already have search/facet UX built for growth; 2 technical posts/month targeting spec-language queries (“GRP panel tank UAE standard”, “plunge pool rooftop load”) compounds fastest for this vertical.
7. **Review/directory seeds**: Yellow Pages AE, Construction Week online, dubizone — NAP-consistent links back (name/address/phone matching the schema block exactly).
8. **Email deliverability** once lead capture lands (open item): SPF/DKIM on the sending domain, reply-to = sales@.
9. **Revalidation loop:** quarterly — `gh run list` (deploy health), PSI, Search Console coverage + link report; append outcomes to `INSTRUCTION-LOG.md` so AI sessions inherit the marketing memory too.

---

*Rule from `docs/CONTINUITY.md` applies: this file is the marketing/perf counterpart of the build system — update it in the same PR as the change it describes.*
