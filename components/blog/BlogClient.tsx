"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ArticleCard from "@/components/ui/ArticleCard";
import { Reveal } from "@/components/ui/Motion";
import { cn, tl, track } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export type BlogRow = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readingMinutes: number;
  image?: string;
  products: { id: string; label: string }[];
};

const DATE_OPTS = ["newest", "oldest"] as const;

export default function BlogClient({
  rows,
  locale,
  f,
  hrefBase = "blog",
  showFeatured = true,
}: {
  rows: BlogRow[];
  locale: Locale;
  hrefBase?: string;
  showFeatured?: boolean;
  f: {
    search: string;
    category: string;
    products: string;
    sort: string;
    newest: string;
    oldest: string;
    quickest: string;
    deep: string;
    filterAll: string;
    clear: string;
    noResults: string;
    articleOne: string;
    articleMany: string;
    featured: string;
    readGuide: string;
  };
}) {
  const [q, setQ] = useState("");
  const [selCats, setSelCats] = useState<string[]>([]);
  const [selProds, setSelProds] = useState<string[]>([]);
  const [sort, setSort] = useState<(typeof DATE_OPTS)[number] | "quickest" | "deep">("newest");

  const catOptions = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.category, (m.get(r.category) ?? 0) + 1));
    return [...m.entries()].map(([label, count]) => ({ id: label, label, count })).sort((a, b) => b.count - a.count);
  }, [rows]);
  const prodOptions = useMemo(() => {
    const m = new Map<string, { id: string; label: string; count: number }>();
    rows.forEach((r) =>
      r.products.forEach((p) => {
        const e = m.get(p.id) ?? { id: p.id, label: p.label, count: 0 };
        e.count += 1;
        m.set(p.id, e);
      })
    );
    return [...m.values()].sort((a, b) => b.count - a.count);
  }, [rows]);

  const toggle =
    <T extends string[]>(sel: T, set: (v: T) => void) =>
    (id: T[number]) =>
      set((sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]) as T);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = rows.filter((r) => {
      if (selCats.length && !selCats.includes(r.category)) return false;
      if (selProds.length && !selProds.some((p) => r.products.some((rp) => rp.id === p))) return false;
      if (needle) {
        const hay = `${r.title} ${r.excerpt} ${r.category} ${r.products.map((p) => p.label).join(" ")}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    out = [...out].sort((a, b) =>
      sort === "oldest"
        ? a.date.localeCompare(b.date)
        : sort === "quickest"
          ? a.readingMinutes - b.readingMinutes
          : sort === "deep"
            ? b.readingMinutes - a.readingMinutes
            : b.date.localeCompare(a.date)
    );
    return out;
  }, [rows, q, selCats, selProds, sort]);

  const activeCount = selCats.length + selProds.length + (q.trim() ? 1 : 0);
  const clearAll = () => {
    setQ("");
    setSelCats([]);
    setSelProds([]);
  };

  const chips: { key: string; label: string; remove: () => void }[] = [
    ...(q.trim() ? [{ key: "q", label: `“${q.trim()}”`, remove: () => setQ("") }] : []),
    ...selCats.map((id) => ({ key: `c-${id}`, label: id, remove: () => toggle(selCats, setSelCats)(id) })),
    ...selProds.map((id) => ({
      key: `p-${id}`,
      label: prodOptions.find((o) => o.id === id)?.label ?? id,
      remove: () => toggle(selProds, setSelProds)(id),
    })),
  ];

  const base = process.env.NEXT_PUBLIC_BASE ?? "";
  const featured = showFeatured && activeCount === 0 && sort === "newest" ? filtered[0] : null;
  const grid = featured ? filtered.slice(1) : filtered;

  return (
    <div>
      {/* ---------- Filter panel ---------- */}
      <div className="relative z-10 -mt-12 mb-8 rounded-[14px] border border-slate-200 bg-white p-4 shadow-dropdown sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[10px] border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus-within:border-brand-700 focus-within:bg-white transition-colors">
            <Icon name="search" className="w-4 h-4 shrink-0 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={f.search}
              aria-label={f.search}
              className="w-full bg-transparent text-sm text-navy-900 outline-none placeholder:text-slate-400"
            />
            {q ? (
              <button type="button" onClick={() => setQ("")} aria-label="Clear" className="text-slate-400 hover:text-navy-900 cursor-pointer">
                <Icon name="close" className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </label>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="blog-sort">{f.sort}</label>
            <select
              id="blog-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-navy-900 outline-none focus:border-brand-700 cursor-pointer"
            >
              <option value="newest">{f.newest}</option>
              <option value="oldest">{f.oldest}</option>
              <option value="quickest">{f.quickest}</option>
              <option value="deep">{f.deep}</option>
            </select>
          </div>
        </div>

        {/* facet rows */}
        <div className="mt-3.5 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 me-1">{f.category}</span>
            <button
              type="button"
              onClick={() => setSelCats([])}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer",
                selCats.length === 0 ? "border-navy-900 bg-navy-900 text-white" : "border-slate-200 bg-white text-slate-500 hover:border-brand-600"
              )}
            >
              {f.filterAll}
            </button>
            {catOptions.map((o) => {
              const on = selCats.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    toggle(selCats, setSelCats)(o.id);
                    track("blog_filter", { facet: "category", id: o.id, on: !on });
                  }}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5",
                    on ? "border-brand-700 bg-brand-700 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-brand-600"
                  )}
                >
                  {o.label}
                  <span className={cn("text-[10px]", on ? "text-white/70" : "text-slate-400")}>{o.count}</span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 me-1">{f.products}</span>
            <button
              type="button"
              onClick={() => setSelProds([])}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer",
                selProds.length === 0 ? "border-navy-900 bg-navy-900 text-white" : "border-slate-200 bg-white text-slate-500 hover:border-brand-600"
              )}
            >
              {f.filterAll}
            </button>
            {prodOptions.map((o) => {
              const on = selProds.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    toggle(selProds, setSelProds)(o.id);
                    track("blog_filter", { facet: "product", id: o.id, on: !on });
                  }}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5",
                    on ? "border-gold-500 bg-gold-500 text-navy-950" : "border-slate-200 bg-white text-slate-600 hover:border-gold-500"
                  )}
                >
                  {o.label}
                  <span className={cn("text-[10px]", on ? "text-navy-950/60" : "text-slate-400")}>{o.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* chips + count */}
        {(chips.length > 0 || activeCount > 0) && (
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500">{filtered.length} {filtered.length === 1 ? f.articleOne : f.articleMany}</span>
            {chips.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={c.remove}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-semibold ps-3 pe-2 py-1.5 transition-colors cursor-pointer"
              >
                {c.label}
                <Icon name="close" className="w-3 h-3" />
              </button>
            ))}
            {activeCount > 0 && (
              <button type="button" onClick={clearAll} className="text-xs font-black text-brand-700 hover:underline ms-1 cursor-pointer">
                {f.clear}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ---------- Featured guide (only in default view) ---------- */}
      {featured && (
        <Reveal>
          <Link
            href={`/${locale}/${hrefBase}/${featured.slug}`}
            className="group grid md:grid-cols-2 bg-navy-950 rounded-[16px] overflow-hidden border border-navy-800 hover:shadow-dropdown transition-all mb-10"
          >
            <div className="relative min-h-[220px] md:min-h-[300px] overflow-hidden">
              {featured.image ? (
                <span
                  aria-hidden
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.04]"
                  style={{ backgroundImage: `url("${base}${featured.image}")` }}
                />
              ) : null}
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-navy-950 via-navy-950/40 to-transparent md:via-navy-950/25" />
              <span className="absolute top-4 start-4 inline-flex items-center gap-1.5 bg-gold-500 text-navy-950 text-[10px] font-black uppercase tracking-[0.14em] rounded-full px-3 py-1.5">
                <Icon name="award" className="w-3 h-3" />
                {f.featured}
              </span>
            </div>
            <div className="p-6 md:p-9 flex flex-col justify-center">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gold-500">
                {featured.category} · {featured.readingMinutes} {tl(locale, "min", "دقيقة")}
              </p>
              <h3 className="mt-3 font-heading font-black text-white text-2xl md:text-[28px] leading-snug group-hover:text-gold-400 transition-colors">
                {featured.title}
              </h3>
              <p className="mt-3 text-slate-300 leading-relaxed line-clamp-3">{featured.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-bold text-sm text-white group-hover:gap-3 transition-all">
                {f.readGuide}
                <Icon name="arrowRight" className="w-4 h-4 flip-x" />
              </span>
            </div>
          </Link>
        </Reveal>
      )}

      {/* ---------- Results ---------- */}
      {grid.length === 0 && !featured ? (
        <div className="rounded-[14px] border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
          <Icon name="search" className="w-8 h-8 mx-auto text-slate-300" />
          <p className="mt-3 font-bold text-slate-500">{f.noResults}</p>
          {activeCount > 0 && (
            <button type="button" onClick={clearAll} className="mt-3 text-sm font-black text-brand-700 hover:underline cursor-pointer">
              {f.clear}
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grid.map((r, i) => {
            const articleLike = {
              slug: r.slug,
              kind: (hrefBase === "blog" ? "blog" : "kb") as "blog" | "kb",
              category: { en: r.category },
              title: { en: r.title },
              excerpt: { en: r.excerpt },
              date: r.date,
              readingMinutes: r.readingMinutes,
              relatedProducts: [],
              body: [],
              image: r.image,
            };
            return (
              <Reveal key={r.slug} delay={(i % 6) * 60}>
                <ArticleCard article={articleLike as never} locale={locale} href={`/${locale}/${hrefBase}/${r.slug}`} />
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
