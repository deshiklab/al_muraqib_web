"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { site } from "@/lib/data/site";
import { t, track, waLink } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

/**
 * Chat dock: WhatsApp float + tawk.to live chat (enabled when
 * NEXT_PUBLIC_TAWK_PROPERTY_ID is set). The launcher is always visible and the
 * panel opens on every viewport (previously the mobile launcher hid itself
 * without showing anything). Sits above the mobile sticky CTA bar.
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

  return (
    <div className="fixed bottom-20 md:bottom-5 end-5 z-40 flex flex-col items-end gap-3 print:hidden">
      {open && (
        <div
          role="dialog"
          aria-label={label}
          className="relative bg-white rounded-xl shadow-dropdown border border-slate-100 p-4 w-72 max-w-[calc(100vw-40px)] space-y-2 animate-[megaIn_0.18s_ease-out]"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-navy-900 text-sm">{label}</p>
              <p className="text-xs text-slate-500">{d.chat.businessHours}</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={d.nav.close}
              className="p-1 -m-1 text-slate-400 hover:text-navy-900 transition-colors cursor-pointer"
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { where: "dock" })}
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold text-sm py-2.5 rounded-lg hover:bg-[#1ebe5b] transition-colors"
          >
            <Icon name="whatsapp" className="w-4.5 h-4.5" />
            {d.common.whatsapp}
          </a>
          <a
            href={`tel:${site.phoneIntl}`}
            onClick={() => track("phone_click", { where: "dock" })}
            className="flex items-center justify-center gap-2 w-full bg-navy-900 text-white font-bold text-sm py-2.5 rounded-lg hover:bg-brand-700 transition-colors"
          >
            <Icon name="phone" className="w-4 h-4" />
            {d.common.callUs}
          </a>
          {site.tawkPropertyId ? (
            <button
              onClick={() => {
                const api = (window as unknown as { Tawk_API?: { maximize?: () => void } }).Tawk_API;
                api?.maximize?.();
                track("livechat_open");
              }}
              className="flex items-center justify-center gap-2 w-full bg-gold-500 text-navy-950 font-bold text-sm py-2.5 rounded-lg hover:bg-gold-600 transition-colors cursor-pointer"
            >
              <Icon name="chat" className="w-4 h-4" />
              {d.common.liveChat}
            </button>
          ) : null}
        </div>
      )}

      <div className="flex flex-col gap-2.5 items-end">
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
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { where: "float" })}
          aria-label={d.common.whatsapp}
          className="grid place-items-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-dropdown hover:bg-[#1ebe5b] transition-colors ring-2 ring-white/60"
        >
          <Icon name="whatsapp" className="w-7 h-7" />
        </a>
      </div>
    </div>
  );
}
