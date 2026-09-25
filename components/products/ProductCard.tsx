import Link from "next/link";
import Icon from "@/components/ui/Icon";
import ProductArt from "@/components/ui/ProductArt";
import { productGroups } from "@/lib/data/nav";
import { t } from "@/lib/utils";
import type { Locale, Product } from "@/lib/types";

export default function ProductCard({
  product,
  locale,
  quoteLabel,
  detailsLabel,
}: {
  product: Product;
  locale: Locale;
  quoteLabel: string;
  detailsLabel: string;
}) {
  const group = productGroups.find((g) => g.slug === product.group);

  return (
    <article className="group bg-white rounded-[12px] border border-slate-200/80 overflow-hidden hover:shadow-soft hover:border-brand-600/40 transition-all flex flex-col">
      <Link href={`/${locale}/products/${product.slug}`} className="relative block overflow-hidden">
        <ProductArt
          seed={product.slug}
          icon={group?.icon ?? "tank"}
          label={t(product.name, locale)}
          className="aspect-[4/3] w-full transition-transform duration-500 ease-out group-hover:scale-[1.05]"
        />
        {product.featured && (
          <span className="absolute top-3 start-3 bg-gold-500 text-navy-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
            ★ {locale === "en" ? "Featured" : "مميز"}
          </span>
        )}
        <span className="absolute bottom-3 start-3 bg-navy-950/70 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          {t(productGroups.find((g) => g.slug === product.group)?.name ?? { en: "", ar: "" }, locale)}
        </span>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link href={`/${locale}/products/${product.slug}`}>
          <h3 className="font-heading font-bold text-navy-900 text-base leading-snug group-hover:text-brand-700 transition-colors line-clamp-2">
            {t(product.name, locale)}
          </h3>
        </Link>
        <p className="mt-1.5 text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">
          {t(product.pitch, locale)}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.keyFacts.slice(0, 2).map((f) => (
            <span
              key={f.label.en}
              className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-600 rounded-full px-2.5 py-1"
            >
              {t(f.label, locale)}: {t(f.value, locale)}
            </span>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <Link
            href={`/${locale}/products/${product.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-bold text-navy-900 border border-slate-200 rounded-[10px] py-2 hover:border-brand-700 hover:text-brand-700 transition-colors"
          >
            {detailsLabel}
            <Icon name="arrowRight" className="w-3.5 h-3.5 flip-x" />
          </Link>
          <Link
            href={`/${locale}/get-quotation?product=${product.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-bold bg-gold-500 text-navy-950 rounded-[10px] py-2 hover:bg-gold-600 hover:text-white transition-colors"
          >
            <Icon name="file" className="w-3.5 h-3.5" />
            {quoteLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
