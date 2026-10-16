"use client";

import { useEffect, useState } from "react";

/**
 * Reading progress for long-form content: a gold bar + percentage label.
 * Measures how far the reader has scrolled through the element with `targetId`.
 */
export default function ReadingProgress({
  targetId,
  labelText,
}: {
  targetId: string;
  labelText: string;
}) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setPct(total > 8 ? Math.min(100, Math.max(0, Math.round((-r.top / total) * 100))) : 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gold-500 rounded-full transition-[width] duration-150"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">{labelText} · {pct}%</p>
    </div>
  );
}
