"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { track } from "@/lib/utils";
import { useQuoteModal } from "@/components/rfq/QuoteModalProvider";
import type { Dict } from "@/lib/i18n";

/**
 * Desktop vertical quote tab — pinned to the physical right edge, gold
 * gradient pill with idle nudge + ping dot; hover widens it with a shine
 * sweep. Opens the right-side quote app-drawer via useQuoteModal().
 */
export function SideTab({ d }: { d: Dict }) {
  const quote = useQuoteModal();
  return (
    <div className="hidden md:flex fixed top-1/2 right-0 z-40 -translate-y-1/2 print:hidden">
      <button
        type="button"
        onClick={() => quote.open("side_tab")}
        aria-label={d.chat.quoteTab}
        className="group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-l-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-600 py-6 ps-3 pe-2.5 text-navy-950 shadow-[0_10px_30px_-8px_rgba(245,158,11,0.55)] ring-1 ring-gold-600/40 transition-[translate,scale,box-shadow] duration-300 ease-out motion-safe:animate-[tabNudge_5.5s_ease-in-out_infinite] hover:-translate-x-1.5 hover:scale-[1.04] hover:shadow-[0_12px_38px_-6px_rgba(245,158,11,0.75)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:animate-[shineSweep_0.8s_ease-out]"
        />
        <span className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy-950 text-gold-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
          <Icon name="file" className="h-3.5 w-3.5" />
        </span>
        <span className="relative rotate-180 text-[11px] font-black uppercase leading-none tracking-[0.22em] [writing-mode:vertical-rl]">
          {d.chat.quoteTab}
        </span>
        <span aria-hidden="true" className="absolute -top-0.5 left-3.5 grid place-items-center">
          <span className="absolute h-3 w-3 rounded-full bg-white/70 motion-safe:animate-ping" />
          <span className="relative h-2 w-2 rounded-full bg-navy-950 ring-2 ring-white" />
        </span>
      </button>
    </div>
  );
}

export function BackToTop({ d }: { d: Dict }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={d.common.backToTop}
      className={`fixed bottom-20 md:bottom-5 start-5 z-40 grid place-items-center w-11 h-11 rounded-full bg-white text-navy-900 shadow-dropdown border border-slate-200 hover:text-brand-700 transition-all cursor-pointer ${
        show ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-3"
      }`}
    >
      <Icon name="arrowUp" className="w-5 h-5" />
    </button>
  );
}

/** Thin gold reading-progress line pinned to the top of the viewport (RTL-aware) */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min((window.scrollY / max) * 100, 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed top-0 inset-x-0 h-[3px] z-[60] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="scroll-progress h-full w-full transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${pct / 100})` }}
      />
    </div>
  );
}
