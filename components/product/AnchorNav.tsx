"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Sticky scrollspy anchor navigation for the product detail sections */
export default function AnchorNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const onScroll = () => {
      const offset = 160;
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= offset) current = item.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  return (
    <nav
      aria-label="Page sections"
      className="sticky top-[120px] lg:top-[108px] z-30 -mx-4 px-4 py-2 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200/70 overflow-x-auto hide-scrollbar"
    >
      <ul className="flex items-center gap-1 min-w-max">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block text-[13px] font-bold px-4 py-2 rounded-full transition-colors whitespace-nowrap",
                active === item.id
                  ? "bg-navy-900 text-white"
                  : "text-slate-500 hover:text-brand-700 hover:bg-white"
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
