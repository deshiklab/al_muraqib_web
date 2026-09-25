"use client";

import { useEffect, useState } from "react";
import CatalogShell, { type Applied, type Counts } from "@/components/products/CatalogShell";
import ProductCard from "@/components/products/ProductCard";
import { Reveal } from "@/components/ui/Motion";
import { products } from "@/lib/data/catalog";
import { t } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

/**
 * Client-side catalog: filters, facet counts and sorting are computed in the
 * browser (URL stays shareable via replaceState). This keeps the catalog fully
 * functional in the static export build, where the server has no chance to
 * re-render for query params.
 */

const EMPTY: Applied = { group: [], tech: [], size: [], cert: [], insulation: "", sort: "featured" };

const split = (v: string | null): string[] => (!v ? [] : v.split(",").filter(Boolean));

export default function CatalogClient({ locale, d }: { locale: Locale; d: Dict }) {
  const l = locale;
  const [applied, setApplied] = useState<Applied>(EMPTY);

  // Hydrate filters from the URL after mount (matches SSR snapshot, then applies)
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setApplied({
      group: split(sp.get("group")),
      tech: split(sp.get("tech")),
      size: split(sp.get("size")),
      cert: split(sp.get("cert")),
      insulation: sp.get("insulation") ?? "",
      sort: sp.get("sort") || "featured",
    });
  }, []);

  const passes = (p: (typeof products)[number], except: string[] = []) =>
    (except.includes("group") || !applied.group.length || applied.group.includes(p.group)) &&
    (except.includes("tech") || !applied.tech.length || applied.tech.includes(p.technology)) &&
    (except.includes("size") || !applied.size.length || applied.size.some((s) => p.sizeBuckets.includes(s))) &&
    (except.includes("cert") || !applied.cert.length || applied.cert.some((c) => p.certifications.includes(c))) &&
    (except.includes("insulation") || !applied.insulation || p.insulation === applied.insulation);

  let list = products.filter((p) => passes(p));
  if (applied.sort === "az") list = [...list].sort((a, b) => t(a.name, l).localeCompare(t(b.name, l)));
  else if (applied.sort === "newest") list = [...list].reverse();
  else list = [...list].sort((a, b) => Number(b.featured ?? 0) - Number(a.featured ?? 0));

  const countWith = (except: string[], fn: (p: (typeof products)[number]) => boolean) =>
    products.filter((p) => passes(p, except) && fn(p)).length;

  const counts: Counts = {
    group: Object.fromEntries(
      Object.keys(d.products.groups).map((g) => [g, countWith(["group"], (p) => p.group === g)])
    ),
    tech: Object.fromEntries(
      ["hot-press", "cold-press", "hand-layup"].map((tech) => [tech, countWith(["tech"], (p) => p.technology === tech)])
    ),
    size: Object.fromEntries(
      ["compact", "medium", "large"].map((size) => [
        size,
        countWith(["size"], (p) => p.sizeBuckets.includes(size)),
      ])
    ),
    cert: Object.fromEntries(
      ["dm", "esma", "iso"].map((c) => [c, countWith(["cert"], (p) => p.certifications.includes(c))])
    ),
  };

  const labels: { group: string; tech: string; size: string; cert: string; insulation: string; sort: string } = {
    group: d.products.facets.group,
    tech: d.products.facets.technology,
    size: d.products.facets.size,
    cert: d.products.facets.certifications,
    insulation: d.products.facets.insulation,
    sort: d.common.sortBy,
  };

  return (
    <CatalogShell locale={l} d={d} applied={applied} onApplied={setApplied} counts={counts} total={list.length} labels={labels}>
      {list.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-[12px] p-10 text-center">
          <p className="font-heading font-black text-xl text-navy-900">{d.common.emptyTitle}</p>
          <p className="mt-2 text-slate-500">{d.common.emptyText}</p>
          <a
            href={`/${l}/get-quotation`}
            className="inline-flex mt-5 items-center gap-2 bg-gold-500 text-navy-950 font-bold px-6 py-3 rounded-[10px] hover:bg-gold-600 hover:text-white transition-colors"
          >
            {d.nav.getQuote}
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {list.map((prod, i) => (
            <Reveal key={prod.slug} delay={(i % 6) * 50}>
              <ProductCard
                product={prod}
                locale={l}
                quoteLabel={d.common.getQuote}
                detailsLabel={d.common.details}
              />
            </Reveal>
          ))}
        </div>
      )}
    </CatalogShell>
  );
}
