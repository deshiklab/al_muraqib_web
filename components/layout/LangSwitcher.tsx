"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { cn, track } from "@/lib/utils";
import { localeLabels, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

/**
 * Top-bar language menu — globe trigger + dropdown of all supported locales
 * (English / العربية / বাংলা). Persists choice in the locale cookie and
 * swaps the path prefix in place, mirroring the old pill toggle.
 */
export default function LangSwitcher({
  locale,
  variant = "topbar",
}: {
  locale: Locale;
  variant?: "topbar" | "solid";
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const switchTo = (next: Locale) => {
    if (next === locale) return setOpen(false);
    document.cookie = `locale=${next};path=/;max-age=31536000;samesite=lax`;
    track("language_switch", { to: next });
    setOpen(false);
    // usePathname() excludes basePath (Pages-safe); router.push re-adds it
    const rest = pathname.replace(new RegExp(`^/${locale}`), "") || "/";
    router.push(`/${next}${rest}`);
  };

  const triggerCls =
    variant === "topbar"
      ? "text-slate-300 hover:text-white ring-1 ring-white/15 bg-white/10"
      : "text-navy-900 hover:bg-slate-200 ring-1 ring-slate-300 bg-slate-100";

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={locale === "ar" ? "اللغة" : locale === "bn" ? "ভাষা" : "Language"}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide transition-colors",
          triggerCls
        )}
      >
        <Icon name="globe" className="h-3.5 w-3.5 text-gold-500" />
        {locale}
        <Icon name="chevronDown" className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full end-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-dropdown"
          dir="ltr"
        >
          {locales.map((loc) => (
            <button
              key={loc}
              type="button"
              role="menuitemradio"
              aria-checked={loc === locale}
              onClick={() => switchTo(loc)}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-start text-[13px] font-bold transition-colors",
                loc === locale ? "bg-navy-900 text-white" : "text-navy-900 hover:bg-slate-50"
              )}
            >
              <span>{localeLabels[loc]}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider",
                  loc === locale ? "bg-gold-500 text-navy-950" : "bg-slate-100 text-slate-500"
                )}
              >
                {loc}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
