"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ProductArt from "@/components/ui/ProductArt";
import { productGroups } from "@/lib/data/nav";
import { site } from "@/lib/data/site";
import { cn, t, tl, track, waLink } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";
import type { GalleryItem, Locale, Product, VariantAxis } from "@/lib/types";

const TABS: { kind: GalleryItem["kind"]; key: keyof Dict["product"] }[] = [
  { kind: "product", key: "tabsProduct" },
  { kind: "installed", key: "tabsInstalled" },
  { kind: "drawing", key: "tabsDrawing" },
];

/** Compact multi-select dropdown for one variant axis (Sizes, Finish, …). */
function AxisDropdown({
  axis,
  selected,
  onToggle,
  locale,
  d,
}: {
  axis: VariantAxis;
  selected: string[];
  onToggle: (optId: string) => void;
  locale: Locale;
  d: Dict;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const chosen = axis.options.filter((o) => selected.includes(o.id));

  return (
    <div ref={wrap} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border bg-white px-2.5 py-1.5 text-start transition-colors",
          open ? "border-brand-700 ring-1 ring-brand-700/20" : "border-slate-200 hover:border-brand-600"
        )}
      >
        <span className="min-w-0">
          <span className="block text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
            {t(axis.label, locale)}
          </span>
          <span className="block truncate text-[11.5px] font-bold text-navy-900">
            {chosen.length
              ? chosen.map((o) => t(o.label, locale)).join(" · ")
              : d.product.notSelected}
          </span>
        </span>
        <Icon
          name="chevronDown"
          className={cn("w-3.5 h-3.5 shrink-0 text-slate-400 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute top-full start-0 z-30 mt-1 max-h-56 w-full min-w-[190px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-dropdown">
          {axis.options.map((opt) => {
            const on = selected.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onToggle(opt.id)}
                aria-pressed={on}
                className="flex w-full cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 text-start transition-colors hover:bg-slate-50"
              >
                <span
                  className={cn(
                    "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border-2 transition-colors",
                    on ? "border-brand-700 bg-brand-700 text-white" : "border-slate-300 bg-white"
                  )}
                >
                  {on && <Icon name="check" className="h-2.5 w-2.5" strokeWidth={4} />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-bold leading-snug text-navy-900">{t(opt.label, locale)}</span>
                  {opt.note && (
                    <span className="block text-[10px] leading-snug text-slate-400">{t(opt.note, locale)}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProductHero({
  product,
  locale,
  d,
}: {
  product: Product;
  locale: Locale;
  d: Dict;
}) {
  const group = productGroups.find((g) => g.slug === product.group);
  const [kind, setKind] = useState<GalleryItem["kind"]>("product");
  const [variants, setVariants] = useState<Record<string, string[]>>(() =>
    Object.fromEntries((product.variantAxes ?? []).map((a) => [a.id, a.options[0]?.id ? [a.options[0].id] : []]))
  );
  const [mode, setMode] = useState<"config" | "area">("config");
  const [dims, setDims] = useState({ l: "", w: "", h: "" });
  const [copied, setCopied] = useState(false);

  const galleryItems = product.gallery.filter((g) => g.kind === kind);
  const activeItems = galleryItems.length ? galleryItems : product.gallery;
  const [imgIdx, setImgIdx] = useState(0);
  const current = activeItems[Math.min(imgIdx, activeItems.length - 1)];

  /* Surface-area query: open-top box — floor + side walls */
  const area = useMemo(() => {
    const l = parseFloat(dims.l);
    const w = parseFloat(dims.w);
    const h = parseFloat(dims.h);
    if (!(l > 0) || !(w > 0) || !(h > 0)) return null;
    return { v: l * w + 2 * (l + w) * h, dims: `${l}×${w}×${h}m` };
  }, [dims]);

  const variantQuery = useMemo(() => {
    if (mode === "area") {
      return area ? `area:${area.v.toFixed(1)}m2 (${area.dims})` : "";
    }
    return Object.entries(variants)
      .flatMap(([axisId, opts]) => opts.map((o) => `${axisId}:${o}`))
      .join(",");
  }, [mode, variants, area]);

  const quoteHref = `/${locale}/get-quotation?product=${product.slug}${variantQuery ? `&variant=${encodeURIComponent(variantQuery)}` : ""}`;
  const waMsg = `${d.chat.whatsappMsg} — ${t(product.name, locale)} (${site.url}/${locale}/products/${product.slug})${variantQuery ? ` [${variantQuery}]` : ""}`;

  const hasAxes = (product.variantAxes?.length ?? 0) > 0;

  return (
    <div className="grid items-center lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] gap-6 lg:gap-10">
      {/* ---------- Gallery ---------- */}
      <div>
        <div className="bg-white border border-slate-200 rounded-[12px] overflow-hidden">
          <ProductArt
            seed={`${product.slug}-${current.kind}`}
            icon={group?.icon ?? "tank"}
            label={t(current.caption, locale)}
            kind={current.kind}
            className="aspect-[4/3] w-full"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {TABS.map((tab) => {
            const has = product.gallery.some((g) => g.kind === tab.kind);
            if (!has) return null;
            return (
              <button
                key={tab.kind}
                onClick={() => {
                  setKind(tab.kind);
                  setImgIdx(0);
                  track("product_gallery_tab", { kind: tab.kind, slug: product.slug });
                }}
                className={cn(
                  "text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors cursor-pointer",
                  kind === tab.kind
                    ? "bg-navy-900 border-navy-900 text-white"
                    : "bg-white border-slate-200 text-slate-500 hover:border-brand-600 hover:text-brand-700"
                )}
              >
                {d.product[tab.key] as string}
              </button>
            );
          })}
          <span className="ms-auto text-xs text-slate-400 flex items-center gap-1.5">
            <Icon name="image" className="w-4 h-4" />
            {imgIdx + 1} / {activeItems.length}
          </span>
        </div>

        {activeItems.length > 1 && (
          <div className="mt-2.5 grid grid-cols-4 gap-2">
            {activeItems.map((item, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                aria-label={t(item.caption, locale)}
                className={cn(
                  "rounded-lg overflow-hidden border-2 transition-colors cursor-pointer",
                  i === imgIdx ? "border-gold-500" : "border-transparent hover:border-slate-300"
                )}
              >
                <ProductArt
                  seed={`${product.slug}-${item.kind}-${i}`}
                  icon={group?.icon ?? "tank"}
                  kind={item.kind}
                  className="aspect-[4/3] w-full"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Buy box (compact, aligned with the image) ---------- */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <Link
            href={`/${locale}/products?group=${product.group}`}
            className="text-[11px] font-black uppercase tracking-[0.16em] text-brand-500 bg-brand-500/10 rounded-full px-3 py-1.5 hover:bg-brand-700 hover:text-white transition-colors"
          >
            {t(group?.name ?? { en: "", ar: "" }, locale)}
          </Link>
          {product.certifications.includes("dm") && (
            <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-gold-500 text-navy-950 rounded-full px-3 py-1.5">
              <Icon name="shield" className="w-3.5 h-3.5" />
              {d.product.badgeDm}
            </span>
          )}
        </div>

        <h1 className="font-heading font-black text-2xl md:text-[1.75rem] leading-tight text-white text-balance">
          {t(product.name, locale)}
        </h1>
        <p className="mt-2 text-slate-300 leading-snug text-[14.5px] line-clamp-2">{t(product.pitch, locale)}</p>

        {/* Configure: variant pickers + surface-area query, one compact card */}
        {hasAxes && (
          <div className="mt-4 rounded-[12px] border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-gold-400">
                <Icon name="ruler" className="w-3.5 h-3.5" />
                {d.product.variantSelect}
              </p>
              <div className="flex rounded-full bg-navy-950/60 p-0.5 ring-1 ring-white/10" role="tablist" aria-label={d.product.areaQuery.title}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "config"}
                  onClick={() => setMode("config")}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors cursor-pointer",
                    mode === "config" ? "bg-gold-500 text-navy-950" : "text-slate-300 hover:text-white"
                  )}
                >
                  {d.product.areaQuery.byOptions}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "area"}
                  onClick={() => setMode("area")}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors cursor-pointer",
                    mode === "area" ? "bg-gold-500 text-navy-950" : "text-slate-300 hover:text-white"
                  )}
                >
                  {d.product.areaQuery.title}
                </button>
              </div>
            </div>

            {mode === "config" ? (
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                {product.variantAxes!.map((axis) => (
                  <AxisDropdown
                    key={axis.id}
                    axis={axis}
                    locale={locale}
                    d={d}
                    selected={variants[axis.id] ?? []}
                    onToggle={(optId) => {
                      setVariants((v) => {
                        const cur = v[axis.id] ?? [];
                        const next = cur.includes(optId) ? cur.filter((x) => x !== optId) : [...cur, optId];
                        return { ...v, [axis.id]: next };
                      });
                      track("product_variant_select", { slug: product.slug, axis: axis.id, opt: optId });
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-2.5">
                <div className="flex items-end gap-1.5">
                  {(["l", "w", "h"] as const).map((k, i) => (
                    <div key={k} className="flex min-w-0 flex-1 items-end gap-1.5">
                      {i > 0 && <span className="pb-2.5 text-[11px] font-bold text-slate-400">×</span>}
                      <label className="block min-w-0 flex-1">
                        <span className="block text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 mb-1">
                          {d.product.areaQuery.dims[k]}
                        </span>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          inputMode="decimal"
                          dir="ltr"
                          value={dims[k]}
                          onChange={(e) => setDims({ ...dims, [k]: e.target.value })}
                          placeholder={d.product.areaQuery.ph[k]}
                          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[12px] font-semibold text-navy-900 outline-none focus:border-brand-700 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </label>
                    </div>
                  ))}
                  <span className="pb-2 text-[10px] font-bold text-slate-400">m</span>
                </div>
                <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-snug">
                  {area ? (
                    <>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 text-navy-950 px-2.5 py-1 font-black" dir="ltr">
                        ≈ {area.v.toFixed(1)} m²
                      </span>
                      <span className="text-slate-300">{d.product.areaQuery.result}</span>
                    </>
                  ) : (
                    <span className="text-slate-400">{d.product.areaQuery.hint}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Key facts — one tight row under the card */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {product.keyFacts.map((f) => (
            <div key={f.label.en} className="min-w-0 rounded-lg border border-white/10 bg-white/95 px-2.5 py-1.5">
              <p className="truncate text-[9px] font-black uppercase tracking-wider text-slate-500">{t(f.label, locale)}</p>
              <p className="truncate font-heading font-bold text-navy-900 text-[12px] leading-snug" title={t(f.value, locale)}>
                {t(f.value, locale)}
              </p>
            </div>
          ))}
        </div>

        {/* CTAs — single row: quote · brochure · whatsapp · share */}
        <div className="mt-3.5 grid grid-cols-4 gap-2">
          <Link
            href={quoteHref}
            onClick={() => track("cta_product_quote", { slug: product.slug, variant: variantQuery })}
            title={hasAxes ? d.product.quoteThisVariant : d.common.requestQuote}
            className="flex flex-col items-center justify-center gap-1 rounded-[10px] bg-gold-500 px-1 py-2.5 text-center text-navy-950 shadow-[0_10px_25px_-12px_rgba(245,158,11,0.8)] transition-colors hover:bg-gold-600 hover:text-white"
          >
            <Icon name="file" className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wide leading-none">{d.common.getQuote}</span>
          </Link>
          <Link
            href={`/${locale}/get-quotation?product=${product.slug}&source=brochure`}
            className="flex flex-col items-center justify-center gap-1 rounded-[10px] border border-white/25 px-1 py-2.5 text-center text-white transition-colors hover:border-gold-500 hover:text-gold-400"
          >
            <Icon name="download" className="w-4 h-4" />
            <span className="truncate px-0.5 text-[10px] font-black uppercase leading-none">{tl(locale, "Brochure", "الكتالوج")}</span>
          </Link>
          <a
            href={waLink(site.whatsapp, waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { where: "product", slug: product.slug })}
            className="flex flex-col items-center justify-center gap-1 rounded-[10px] bg-[#25D366] px-1 py-2.5 text-center text-white transition-colors hover:bg-[#1ebe5b]"
          >
            <Icon name="whatsapp" className="w-4 h-4" />
            <span className="truncate px-0.5 text-[10px] font-black uppercase leading-none">{d.common.whatsapp}</span>
          </a>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(`${site.url}/${locale}/products/${product.slug}`);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-[10px] border px-1 py-2.5 text-center transition-colors",
              copied ? "border-gold-500 text-gold-400" : "border-white/25 text-white hover:border-gold-500 hover:text-gold-400"
            )}
          >
            <Icon name={copied ? "check" : "share"} className="w-4 h-4" />
            <span className="truncate px-0.5 text-[10px] font-black uppercase leading-none">
              {copied ? (tl(locale, "Copied!", "تم النسخ!")) : tl(locale, "Share", "مشاركة")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
