"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { site } from "@/lib/data/site";
import { track } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

/** Sticky bottom action bar (product/category pages, mobile) */
export default function MobileCtaBar({ locale, d }: { locale: Locale; d: Dict }) {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] print:hidden">
      <div className="grid grid-cols-3">
        <a
          href={`tel:${site.phoneIntl}`}
          onClick={() => track("phone_click", { where: "sticky_bar" })}
          className="flex flex-col items-center gap-0.5 py-2.5 text-navy-900 font-semibold text-[11px]"
        >
          <Icon name="phone" className="w-5 h-5 text-brand-700" />
          {d.common.callUs}
        </a>
        <a
          href={`https://wa.me/${site.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { where: "sticky_bar" })}
          className="flex flex-col items-center gap-0.5 py-2.5 text-navy-900 font-semibold text-[11px] border-x border-slate-100"
        >
          <Icon name="whatsapp" className="w-5 h-5 text-[#25D366]" />
          {d.common.whatsapp}
        </a>
        <Link
          href={`/${locale}/get-quotation`}
          onClick={() => track("cta_sticky_bar")}
          className="flex flex-col items-center gap-0.5 py-2.5 bg-gold-500 text-navy-950 font-bold text-[11px]"
        >
          <Icon name="file" className="w-5 h-5" />
          {d.common.getQuote}
        </Link>
      </div>
    </div>
  );
}
