"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { site } from "@/lib/data/site";
import { track, waLink } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

/**
 * Chat dock — a single launcher button. The panel keeps the three contact
 * channels together: WhatsApp, Chatbot (tawk.to live chat when configured)
 * and Call us. Sits above the mobile sticky CTA bar.
 */
export default function ChatDock({ locale, d }: { locale: Locale; d: Dict }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!site.tawkPropertyId) return;
    // tawk.to embed — loaded lazily after interactive
    const w = window as unknown as { Tawk_API?: unknown; Tawk_LoadStart?: unknown };
    w.Tawk_API = w.Tawk_API || {};
    w.Tawk_LoadStart = new Date();
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://embed.tawk.to/${site.tawkPropertyId}/default`;
    s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    document.head.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);

  const waUrl = waLink(site.whatsapp, d.chat.whatsappMsg);
  const label = d.chat.dockLabel;
  const chatLabel =
    locale === "en" ? "Chatbot" : "شات بوت";

  const chatOptions = (
    <>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          track("whatsapp_click", { where: "dock" });
          setOpen(false);
        }}
        className="flex items-center gap-2.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-navy-900 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-colors"
      >
        <span className="grid place-items-center w-8 h-8 rounded-full bg-[#25D366] text-white shrink-0">
          <Icon name="whatsapp" className="w-4.5 h-4.5" />
        </span>
        {d.common.whatsapp}
      </a>
      {site.tawkPropertyId ? (
        <button
          type="button"
          onClick={() => {
            const api = (window as unknown as { Tawk_API?: { maximize?: () => void } }).Tawk_API;
            api?.maximize?.();
            track("livechat_open");
            setOpen(false);
          }}
          className="flex items-center gap-2.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-navy-900 hover:border-gold-500 hover:bg-gold-500/10 transition-colors cursor-pointer"
        >
          <span className="grid place-items-center w-8 h-8 rounded-full bg-navy-900 text-gold-500 shrink-0">
            <Icon name="chat" className="w-4 h-4" />
          </span>
          {chatLabel}
        </button>
      ) : (
        <Link
          href={`/${locale}/contact`}
          onClick={() => {
            track("livechat_open", { via: "contact_page" });
            setOpen(false);
          }}
          className="flex items-center gap-2.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-navy-900 hover:border-gold-500 hover:bg-gold-500/10 transition-colors"
        >
          <span className="grid place-items-center w-8 h-8 rounded-full bg-navy-900 text-gold-500 shrink-0">
            <Icon name="chat" className="w-4 h-4" />
          </span>
          {chatLabel}
        </Link>
      )}
      <a
        href={`tel:${site.phoneIntl}`}
        onClick={() => {
          track("phone_click", { where: "dock" });
          setOpen(false);
        }}
        className="flex items-center gap-2.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-navy-900 hover:border-brand-700 hover:bg-brand-700/5 transition-colors"
      >
        <span className="grid place-items-center w-8 h-8 rounded-full bg-brand-700 text-white shrink-0">
          <Icon name="phone" className="w-4 h-4" />
        </span>
        {d.common.callUs}
      </a>
    </>
  );

  return (
    <div className="fixed bottom-20 md:bottom-5 end-5 z-40 flex flex-col items-end gap-3 print:hidden">
      {open && (
        <div
          role="dialog"
          aria-label={label}
          className="relative bg-white rounded-xl shadow-dropdown border border-slate-100 p-4 w-72 max-w-[calc(100vw-40px)] space-y-2 animate-[megaIn_0.18s_ease-out]"
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="font-bold text-navy-900 text-sm">{label}</p>
              <p className="text-xs text-slate-500">{d.chat.businessHours}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={d.nav.close}
              className="p-1 -m-1 text-slate-500 hover:text-navy-900 transition-colors cursor-pointer"
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          </div>
          {chatOptions}
        </div>
      )}

      <button
        onClick={() => {
          setOpen(!open);
          track("chat_launcher_toggle");
        }}
        aria-label={label}
        aria-expanded={open}
        className="grid place-items-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-navy-900 text-gold-500 shadow-dropdown hover:bg-brand-700 hover:text-white transition-colors cursor-pointer ring-2 ring-gold-500/40"
      >
        <Icon name={open ? "close" : "chat"} className="w-6 h-6" />
      </button>
    </div>
  );
}
