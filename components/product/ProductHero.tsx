"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ProductArt from "@/components/ui/ProductArt";
import { productGroups } from "@/lib/data/nav";
import { site } from "@/lib/data/site";
import { t, track, cn, waLink } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";
import type { GalleryItem, Locale, Product } from "@/lib/types";

const TABS: { kind: GalleryItem["kind"]; key: keyof Dict["product"] }[] = [
  { kind: "product", key: "tabsProduct" },
  { kind: "installed", key: "tabsInstalled" },
  { kind: "drawing", key: "tabsDrawing" },
];

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
  const [variants, setVariants] = useState<Record<string, string>>(() =>
    Object.fromEntries((product.variantAxes ?? []).map((a) => [a.id, a.options[0]?.id ?? ""]))
  );
  const [copied, setCopied] = useState(false);

  const galleryItems = product.gallery.filter((g) => g.kind === kind);
  const activeItems = galleryItems.length ? galleryItems : product.gallery;
  const [imgIdx, setImgIdx] = useState(0);
  const current = activeItems[Math.min(imgIdx, activeItems.length - 1)];

  const variantQuery = useMemo(
    () =>
      Object.entries(variants)
        .map(([k, v]) => `${k}:${v}`)
        .join(","),
    [variants]
  );
  const quoteHref = `/${locale}/get-quotation?product=${product.slug}${variantQuery ? `&variant=${variantQuery}` : ""}`;
  const waMsg = `${d.chat.whatsappMsg} — ${t(product.name, locale)} (${site.url}/${locale}/products/${product.slug})`;

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
      {/* ---------- Gallery ---------- */}
      <div>
        <div className="bg-white border border-slate-200 rounded-[12px] overflow-hidden">
          <ProductArt
            seed={`${product.slug}-${current.kind}`}
            icon={group?.icon ?? "tank"}
            label={t(current.caption, locale)}
            kind={current.kind}
            className="aspect-square w-full"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
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
                  "text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border transition-colors cursor-pointer",
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
          <div className="mt-3 grid grid-cols-4 gap-3">
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
                  className="aspect-square w-full"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Buy box ---------- */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Link
            href={`/${locale}/products?group=${product.group}`}
            className="text-[11px] font-black uppercase tracking-[0.16em] text-brand-700 bg-brand-700/10 rounded-full px-3 py-1.5 hover:bg-brand-700 hover:text-white transition-colors"
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

        <h1 className="font-heading font-black text-3xl md:text-4xl leading-tight text-navy-900 text-balance">
          {t(product.name, locale)}
        </h1>
        <p className="mt-3 text-slate-600 leading-relaxed text-[17px]">{t(product.pitch, locale)}</p>

        {/* Variants */}
        {product.variantAxes && product.variantAxes.length > 0 && (
          <div className="mt-6 space-y-4 bg-slate-50 border border-slate-100 rounded-[12px] p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400 flex items-center gap-2">
              <Icon name="ruler" className="w-4 h-4 text-gold-600" />
              {d.product.variantSelect}
            </p>
            {product.variantAxes.map((axis) => (
              <div key={axis.id}>
                <p className="text-sm font-bold text-navy-900 mb-2">{t(axis.label, locale)}</p>
                <div className="flex flex-wrap gap-2">
                  {axis.options.map((opt) => {
                    const active = variants[axis.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setVariants((v) => ({ ...v, [axis.id]: opt.id }));
                          track("product_variant_select", { slug: product.slug, axis: axis.id, opt: opt.id });
                        }}
                        className={cn(
                          "px-4 py-2 rounded-[10px] text-sm font-bold border-2 transition-all cursor-pointer",
                          active
                            ? "border-brand-700 bg-brand-700 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-brand-600"
                        )}
                        aria-pressed={active}
                      >
                        {t(opt.label, locale)}
                        {opt.note && (
                          <span className={cn("block text-[10px] font-medium", active ? "text-white/70" : "text-slate-400")}>
                            {t(opt.note, locale)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Key facts */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {product.keyFacts.map((f) => (
            <div key={f.label.en} className="bg-white border border-slate-200 rounded-[10px] p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t(f.label, locale)}</p>
              <p className="mt-1 font-heading font-bold text-navy-900 text-[15px]">{t(f.value, locale)}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-6 space-y-3">
          <Link
            href={quoteHref}
            onClick={() => track("cta_product_quote", { slug: product.slug, variant: variantQuery })}
            className="flex items-center justify-center gap-2.5 w-full bg-gold-500 text-navy-950 font-bold text-[15px] py-4 rounded-[10px] hover:bg-gold-600 hover:text-white transition-colors shadow-[0_10px_25px_-12px_rgba(245,158,11,0.8)]"
          >
            <Icon name="file" className="w-5 h-5" />
            {product.variantAxes?.length ? d.product.quoteThisVariant : d.common.requestQuote}
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/${locale}/get-quotation?product=${product.slug}&source=brochure`}
              className="flex items-center justify-center gap-2 border-2 border-slate-200 text-navy-900 font-bold text-sm py-3 rounded-[10px] hover:border-brand-700 hover:text-brand-700 transition-colors"
            >
              <Icon name="download" className="w-4 h-4" />
              {d.common.downloadBrochure}
            </Link>
            <a
              href={waLink(site.whatsapp, waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { where: "product", slug: product.slug })}
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-sm py-3 rounded-[10px] hover:bg-[#1ebe5b] transition-colors"
            >
              <Icon name="whatsapp" className="w-4 h-4" />
              {d.common.whatsapp}
            </a>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <a href={`tel:${site.phoneIntl}`} className="flex items-center gap-1.5 hover:text-brand-700 font-semibold">
              <Icon name="phone" className="w-4 h-4" /> {site.phone}
            </a>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(`${site.url}/${locale}/products/${product.slug}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              }}
              className="flex items-center gap-1.5 hover:text-brand-700 font-semibold cursor-pointer"
            >
              <Icon name={copied ? "check" : "share"} className="w-4 h-4" />
              {copied ? (locale === "en" ? "Copied!" : "تم النسخ!") : locale === "en" ? "Share" : "مشاركة"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
