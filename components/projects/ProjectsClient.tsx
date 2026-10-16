"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ProductArt from "@/components/ui/ProductArt";
import { Reveal } from "@/components/ui/Motion";
import { cn, track } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import type { Dict } from "@/lib/i18n";

export type ProjectRow = {
  slug: string;
  image?: string;
  title: string;
  sector: string;
  sectorLabel: string;
  location: string;
  year: string;
  scope: string;
  client?: string;
  products: string[];
  productNames: string[];
  services: string[];
  serviceNames: string[];
};

type Opt = { id: string; label: string };

/** Checkbox multi-select popover (shared UX with the product configurator). */
function MultiSelect({
  label,
  options,
  selected,
  onToggle,
  selectedWord,
  alignEnd,
}: {
  label: string;
  options: Opt[];
  selected: string[];
  onToggle: (id: string) => void;
  selectedWord: string;
  alignEnd?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const summary =
    selected.length === 0
      ? label
      : selected.length === 1
        ? options.find((o) => o.id === selected[0])?.label ?? label
        : `${selected.length} ${selectedWord}`;

  return (
    <div ref={wrap} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={cn(
          "inline-flex w-full items-center justify-between gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-colors cursor-pointer",
          selected.length
            ? "border-brand-700 bg-brand-700 text-white"
            : "border-slate-200 bg-white text-slate-600 hover:border-brand-600"
        )}
      >
        <span className="truncate">{summary}</span>
        <Icon name="chevronDown" className={cn("w-3 h-3 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div
          className={cn(
            "absolute top-full z-30 mt-1.5 max-h-64 w-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-dropdown",
            alignEnd ? "end-0" : "start-0"
          )}
        >
          {options.map((o) => {
            const on = selected.includes(o.id);
            return (
              <button
                key={o.id}
                type="button"
                role="menuitemcheckbox"
                aria-checked={on}
                onClick={() => onToggle(o.id)}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-start text-[12.5px] font-semibold text-navy-900 transition-colors hover:bg-slate-50"
              >
                <span
                  className={cn(
                    "grid h-4 w-4 shrink-0 place-items-center rounded border-2 transition-colors",
                    on ? "border-brand-700 bg-brand-700 text-white" : "border-slate-300"
                  )}
                >
                  {on && <Icon name="check" className="h-2.5 w-2.5" strokeWidth={4} />}
                </span>
                <span className="min-w-0 truncate">{o.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProjectsClient({
  locale,
  rows,
  sectors,
  productOptions,
  serviceOptions,
  d,
}: {
  locale: Locale;
  rows: ProjectRow[];
  sectors: Opt[];
  productOptions: Opt[];
  serviceOptions: Opt[];
  d: Dict;
}) {
  const f = d.projects.filters;
  const [q, setQ] = useState("");
  const [selSectors, setSelSectors] = useState<string[]>([]);
  const [selProducts, setSelProducts] = useState<string[]>([]);
  const [selServices, setSelServices] = useState<string[]>([]);
  const [sort, setSort] = useState<"newest" | "oldest" | "az">("newest");
  const [adv, setAdv] = useState(false);

  const toggle = (arr: string[], set: (v: string[]) => void) => (id: string) =>
    set(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = rows.filter((r) => {
      if (needle) {
        const hay = `${r.title} ${r.location} ${r.client ?? ""} ${r.scope}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (selSectors.length && !selSectors.includes(r.sector)) return false;
      if (selProducts.length && !selProducts.some((p) => r.products.includes(p))) return false;
      if (selServices.length && !selServices.some((sv) => r.services.includes(sv))) return false;
      return true;
    });
    out = [...out].sort((a, b) =>
      sort === "az" ? a.title.localeCompare(b.title) : sort === "oldest" ? a.year.localeCompare(b.year) : b.year.localeCompare(a.year)
    );
    return out;
  }, [q, selSectors, selProducts, selServices, sort, rows]);

  const activeCount = selSectors.length + selProducts.length + selServices.length + (q.trim() ? 1 : 0);
  const clearAll = () => {
    setQ("");
    setSelSectors([]);
    setSelProducts([]);
    setSelServices([]);
  };

  const chips: { key: string; label: string; remove: () => void }[] = [
    ...(q.trim() ? [{ key: "q", label: `“${q.trim()}”`, remove: () => setQ("") }] : []),
    ...selSectors.map((id) => ({ key: `s-${id}`, label: sectors.find((o) => o.id === id)?.label ?? id, remove: () => toggle(selSectors, setSelSectors)(id) })),
    ...selProducts.map((id) => ({ key: `p-${id}`, label: productOptions.find((o) => o.id === id)?.label ?? id, remove: () => toggle(selProducts, setSelProducts)(id) })),
    ...selServices.map((id) => ({ key: `v-${id}`, label: serviceOptions.find((o) => o.id === id)?.label ?? id, remove: () => toggle(selServices, setSelServices)(id) })),
  ];

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
              aria-label={f.heading}
              className="w-full bg-transparent text-sm text-navy-900 outline-none placeholder:text-slate-400"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {/* quick sector chips */}
            <button
              type="button"
              onClick={() => setSelSectors([])}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-bold transition-colors cursor-pointer",
                selSectors.length === 0
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:border-brand-600"
              )}
            >
              {d.projects.filterAll}
            </button>
            {sectors.map((o) => {
              const on = selSectors.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    toggle(selSectors, setSelSectors)(o.id);
                    track("projects_filter", { facet: "sector", id: o.id, on: !on });
                  }}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-bold transition-colors cursor-pointer",
                    on ? "border-navy-900 bg-navy-900 text-white" : "border-slate-200 bg-white text-slate-500 hover:border-brand-600"
                  )}
                >
                  {o.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setAdv(!adv)}
              aria-expanded={adv}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer",
                adv || selProducts.length + selServices.length > 0
                  ? "border-gold-500 bg-gold-500 text-navy-950"
                  : "border-slate-200 bg-white text-slate-500 hover:border-gold-500"
              )}
            >
              <Icon name="filter" className="w-3.5 h-3.5" />
              {f.advanced}
              {selProducts.length + selServices.length > 0 && (
                <span className="rounded-full bg-navy-900 px-1.5 text-[10px] text-white">{selProducts.length + selServices.length}</span>
              )}
            </button>
          </div>
        </div>

        {adv && (
          <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{f.products}</p>
              <MultiSelect
                label={f.products}
                options={productOptions}
                selected={selProducts}
                onToggle={toggle(selProducts, setSelProducts)}
                selectedWord={f.selected}
              />
            </div>
            <div className="lg:col-span-1">
              <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{f.services}</p>
              <MultiSelect
                label={f.services}
                options={serviceOptions}
                selected={selServices}
                onToggle={toggle(selServices, setSelServices)}
                selectedWord={f.selected}
              />
            </div>
            <div className="lg:col-span-1">
              <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{f.sort}</p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="w-full cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-navy-900 outline-none focus:border-brand-700"
              >
                <option value="newest">{f.newest}</option>
                <option value="oldest">{f.oldest}</option>
                <option value="az">{f.az}</option>
              </select>
            </div>
          </div>
        )}

        {/* result meta row */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-bold text-navy-900">
            {filtered.length} <span className="font-medium text-slate-500">/ {rows.length} {f.projects}</span>
          </span>
          {chips.length > 0 && <span className="text-slate-300">·</span>}
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={c.remove}
              aria-label={`${f.chips}: ${c.label}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-navy-900 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
            >
              {c.label}
              <Icon name="close" className="w-3 h-3" />
            </button>
          ))}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="ms-auto font-bold text-brand-700 hover:text-gold-700 transition-colors cursor-pointer"
            >
              {f.clear}
            </button>
          )}
        </div>
      </div>

      {/* ---------- Results ---------- */}
      {filtered.length === 0 ? (
        <div className="rounded-[14px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <p className="text-slate-500 font-semibold">{f.noResults}</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-4 rounded-[10px] bg-navy-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700 transition-colors cursor-pointer"
          >
            {f.clear}
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r, i) => (
            <Reveal key={r.slug} delay={(i % 6) * 60}>
              <Link
                href={`/${locale}/projects/${r.slug}`}
                className="group block h-full bg-white rounded-[12px] border border-slate-200 overflow-hidden hover:shadow-soft transition-all"
              >
                <div className="relative">
                  <ProductArt seed={r.slug} icon="building" kind="installed" label={r.location} className="aspect-[16/10] w-full" src={r.image} />
                  <span className="absolute top-3 start-3 rounded-full bg-navy-950/80 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gold-400 backdrop-blur-sm">
                    {r.sectorLabel}
                  </span>
                  <span className="absolute top-3 end-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-black text-navy-900" dir="ltr">
                    {r.year}
                  </span>
                </div>
                <div className="p-5">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-700">
                    <Icon name="pin" className="w-3.5 h-3.5" />
                    {r.location}
                    {r.client && <span className="text-slate-400 normal-case font-semibold">· {r.client}</span>}
                  </p>
                  <h2 className="mt-2 font-heading font-bold text-navy-900 group-hover:text-brand-700 transition-colors leading-snug">
                    {r.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">{r.scope}</p>
                  {(r.serviceNames.length > 0 || r.productNames.length > 0) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {r.serviceNames.slice(0, 3).map((sv) => (
                        <span key={sv} className="rounded-full bg-navy-900/5 px-2 py-0.5 text-[10px] font-bold text-navy-800">
                          {sv}
                        </span>
                      ))}
                      {r.productNames.slice(0, 2).map((pn) => (
                        <span key={pn} className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[10px] font-bold text-gold-700">
                          {pn}
                        </span>
                      ))}
                      {r.productNames.length > 2 && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                          +{r.productNames.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 group-hover:gap-2.5 transition-all">
                    {d.projects.viewCase}
                    <Icon name="arrowRight" className="w-4 h-4 flip-x" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
