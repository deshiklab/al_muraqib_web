"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { cn, track } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export interface Applied {
  group: string[];
  tech: string[];
  size: string[];
  cert: string[];
  insulation: string;
  sort: string;
}

export interface Counts {
  group: Record<string, number>;
  tech: Record<string, number>;
  size: Record<string, number>;
  cert: Record<string, number>;
}

const FACET_KEYS = ["group", "tech", "size", "cert"] as const;
type FacetKey = (typeof FACET_KEYS)[number];

export default function CatalogShell({
  locale,
  d,
  applied,
  onApplied,
  counts,
  total,
  labels,
  children,
}: {
  locale: Locale;
  d: Dict;
  applied: Applied;
  onApplied: (next: Applied) => void;
  counts: Counts;
  total: number;
  labels: Record<FacetKey, string> & { insulation: string; sort: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const optLabel = (key: FacetKey, val: string) =>
    key === "group"
      ? d.products.groups[val as keyof typeof d.products.groups] ?? val
      : d.products.options[val as keyof typeof d.products.options] ?? val;

  const navigate = (next: Applied) => {
    // State-driven filtering + URL kept shareable via replaceState — works in
    // both the server build and the static (GitHub Pages) export.
    onApplied(next);
    const qs = new URLSearchParams();
    if (next.group.length) qs.set("group", next.group.join(","));
    if (next.tech.length) qs.set("tech", next.tech.join(","));
    if (next.size.length) qs.set("size", next.size.join(","));
    if (next.cert.length) qs.set("cert", next.cert.join(","));
    if (next.insulation) qs.set("insulation", next.insulation);
    if (next.sort && next.sort !== "featured") qs.set("sort", next.sort);
    const q = qs.toString();
    window.history.replaceState(null, "", `${pathname}${q ? `?${q}` : ""}`);
    track("catalog_filter", { ...next });
  };

  const toggle = (key: FacetKey, val: string) => {
    const cur = new Set(applied[key]);
    cur.has(val) ? cur.delete(val) : cur.add(val);
    navigate({ ...applied, [key]: [...cur] });
  };

  const clearAll = () =>
    navigate({ group: [], tech: [], size: [], cert: [], insulation: "", sort: applied.sort });

  const activeChips: { key: FacetKey | "insulation"; val: string }[] = [
    ...FACET_KEYS.flatMap((k) => applied[k].map((v) => ({ key: k, val: v }))),
    ...(applied.insulation ? [{ key: "insulation" as const, val: applied.insulation }] : []),
  ];

  const sidebar = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-black text-lg text-navy-900 flex items-center gap-2">
          <Icon name="filter" className="w-4.5 h-4.5 text-gold-600" />
          {d.common.filters}
        </h2>
        {activeChips.length > 0 && (
          <button onClick={clearAll} className="text-xs font-bold text-brand-700 hover:text-gold-600 cursor-pointer">
            {d.common.clearAll}
          </button>
        )}
      </div>

      <FacetGroup
        title={labels.group}
        options={Object.keys(d.products.groups).map((g) => ({
          value: g,
          label: d.products.groups[g as keyof typeof d.products.groups],
          count: counts.group[g] ?? 0,
          checked: applied.group.includes(g),
          onToggle: () => toggle("group", g),
        }))}
      />
      <FacetGroup
        title={labels.tech}
        options={["hot-press", "cold-press", "hand-layup"].map((v) => ({
          value: v,
          label: d.products.options[v as keyof typeof d.products.options],
          count: counts.tech[v] ?? 0,
          checked: applied.tech.includes(v),
          onToggle: () => toggle("tech", v),
        }))}
      />
      <FacetGroup
        title={labels.size}
        options={["compact", "medium", "large"].map((v) => ({
          value: v,
          label: d.products.options[v as keyof typeof d.products.options],
          count: counts.size[v] ?? 0,
          checked: applied.size.includes(v),
          onToggle: () => toggle("size", v),
        }))}
      />
      <FacetGroup
        title={labels.insulation}
        options={["insulated", "non-insulated", "n/a"].map((v) => ({
          value: v,
          label: d.products.options[v as keyof typeof d.products.options],
          count: -1,
          checked: applied.insulation === v,
          onToggle: () => navigate({ ...applied, insulation: applied.insulation === v ? "" : v }),
        }))}
      />
      <FacetGroup
        title={labels.cert}
        options={["dm", "esma", "iso"].map((v) => ({
          value: v,
          label: d.products.options[v as keyof typeof d.products.options],
          count: counts.cert[v] ?? 0,
          checked: applied.cert.includes(v),
          onToggle: () => toggle("cert", v),
        }))}
      />
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[270px_1fr] lg:gap-8">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 bg-white border border-slate-200 rounded-[12px] p-5">{sidebar}</div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[65] flex" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-navy-950/60" onClick={() => setMobileOpen(false)} />
          <div className="relative mt-auto w-full bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto p-5 pb-8">
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <span className="font-bold text-navy-900">{d.common.filters}</span>
              <button onClick={() => setMobileOpen(false)} aria-label={d.nav.close} className="p-2 cursor-pointer">
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>
            {sidebar}
            <button
              onClick={() => setMobileOpen(false)}
              className="mt-5 w-full bg-navy-900 text-white font-bold py-3 rounded-[10px] cursor-pointer"
            >
              {d.common.applyFilters} ({total})
            </button>
          </div>
        </div>
      )}

      {/* Main column */}
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 bg-white border border-slate-200 rounded-[10px] px-4 py-2.5 text-sm font-bold text-navy-900 cursor-pointer"
          >
            <Icon name="filter" className="w-4 h-4" />
            {d.common.filters}
            {activeChips.length > 0 && (
              <span className="bg-gold-500 text-navy-950 rounded-full text-[11px] px-1.5">{activeChips.length}</span>
            )}
          </button>

          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2 flex-1">
              {activeChips.map((chip) => (
                <button
                  key={`${chip.key}-${chip.val}`}
                  onClick={() =>
                    chip.key === "insulation"
                      ? navigate({ ...applied, insulation: "" })
                      : toggle(chip.key, chip.val)
                  }
                  className="inline-flex items-center gap-1.5 bg-navy-900 text-white text-xs font-semibold rounded-full ps-3 pe-2 py-1.5 cursor-pointer hover:bg-brand-700"
                >
                  {chip.key === "group"
                    ? d.products.groups[chip.val as keyof typeof d.products.groups]
                    : chip.key === "insulation"
                      ? d.products.options[chip.val as keyof typeof d.products.options]
                      : d.products.options[chip.val as keyof typeof d.products.options]}
                  <Icon name="close" className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}

          <div className="ms-auto flex items-center gap-3">
            <span className="text-sm text-slate-500">
              <b className="text-navy-900">{total}</b> {d.products.count}
            </span>
            <select
              value={applied.sort}
              onChange={(e) => navigate({ ...applied, sort: e.target.value })}
              className="bg-white border border-slate-200 rounded-[10px] px-3 py-2 text-sm font-semibold text-navy-900 outline-none cursor-pointer"
              aria-label={d.common.sortBy}
            >
              <option value="featured">{d.common.sortFeatured}</option>
              <option value="newest">{d.common.sortNewest}</option>
              <option value="az">{d.common.sortAZ}</option>
            </select>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

function FacetGroup({ title, options }: { title: string; options: { value: string; label: string; count: number; checked: boolean; onToggle: () => void }[] }) {
  return (
    <fieldset className="border-t border-slate-100 pt-4">
      <legend className="sr-only">{title}</legend>
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400 mb-2.5">{title}</p>
      <ul className="space-y-1.5">
        {options.map((o) => (
          <li key={o.value}>
            <label
              className={cn(
                "flex items-center gap-2.5 text-sm rounded-lg px-2 py-1.5 -mx-2 cursor-pointer transition-colors",
                o.checked ? "bg-brand-700/5 text-brand-700 font-semibold" : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <input
                type="checkbox"
                checked={o.checked}
                onChange={o.onToggle}
                className="sr-only peer"
              />
              <span
                className={cn(
                  "grid place-items-center w-4 h-4 rounded border transition-colors shrink-0",
                  o.checked ? "bg-brand-700 border-brand-700 text-white" : "border-slate-300 bg-white"
                )}
              >
                {o.checked && <Icon name="check" className="w-3 h-3" strokeWidth={3} />}
              </span>
              <span className="flex-1">{o.label}</span>
              {o.count >= 0 && <span className="text-xs text-slate-400">{o.count}</span>}
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
