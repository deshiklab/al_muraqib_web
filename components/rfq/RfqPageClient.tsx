"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import RfqWizard from "@/components/rfq/RfqWizard";
import { products } from "@/lib/data/catalog";
import { t } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

type Query = { initialProducts: string[]; source?: string; variant?: string };

/**
 * RFQ wizard host: parses ?product=&source=&variant= from the URL client-side
 * after mount, so the page can be fully statically exported (no server
 * searchParams). The wizard mounts only after parsing, keeping preselection intact.
 */
export default function RfqPageClient({ locale, d }: { locale: Locale; d: Dict }) {
  const [q, setQ] = useState<Query | null>(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const raw = sp.get("product") ?? "";
    const initialProducts = raw
      .split(",")
      .map((s) => s.trim())
      .filter((slug) => products.some((p) => p.slug === slug));
    setQ({
      initialProducts,
      source: sp.get("source") ?? undefined,
      variant: sp.get("variant") ?? undefined,
    });
  }, []);

  if (!q) {
    return (
      <div
        className="min-h-[460px] rounded-[16px] bg-white border border-slate-200 animate-pulse"
        aria-hidden="true"
      />
    );
  }

  return (
    <>
      {q.initialProducts.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-500 font-semibold">
            {locale === "en" ? "Requesting quote for:" : "طلب سعر لـ:"}
          </span>
          {q.initialProducts.map((slug) => (
            <span key={slug} className="inline-flex items-center gap-1.5 bg-brand-700 text-white font-bold rounded-full px-3.5 py-1.5 text-xs">
              <Icon name="check" className="w-3.5 h-3.5" />
              {t(products.find((p) => p.slug === slug)?.name ?? { en: slug, ar: slug }, locale)}
            </span>
          ))}
          {q.variant && (
            <span className="inline-flex items-center gap-1.5 bg-navy-900 text-gold-400 font-bold rounded-full px-3.5 py-1.5 text-xs" dir="ltr">
              <Icon name="ruler" className="w-3.5 h-3.5" />
              {q.variant}
            </span>
          )}
        </div>
      )}

      <RfqWizard locale={locale} d={d} initialProducts={q.initialProducts} source={q.source} />
    </>
  );
}
