"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { track } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

/** Desktop vertical side tab → RFQ + back-to-top button */
export function SideTab({ locale, d }: { locale: Locale; d: Dict }) {
  return (
    <Link
      href={`/${locale}/get-quotation`}
      onClick={() => track("cta_side_tab")}
      className="hidden md:flex fixed top-1/2 -translate-y-1/2 end-0 z-40 items-center gap-2 bg-gold-500 text-navy-950 font-bold text-sm ps-2.5 pe-4 py-4 rounded-s-xl shadow-soft hover:bg-gold-600 hover:text-white transition-colors [writing-mode:vertical-rl] rotate-180"
    >
      <Icon name="file" className="w-4 h-4 rotate-180" />
      {d.chat.quoteTab}
    </Link>
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
