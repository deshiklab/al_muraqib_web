"use client";

import { useEffect, useState } from "react";
import type { Dict } from "@/lib/i18n";

/**
 * Light/dark theme toggle. State lives on <html class="dark"> — set before
 * paint by the inline script in the root layout (no flash) and persisted in
 * localStorage("alm-theme"). Falls back to the OS preference.
 */
export default function ThemeToggle({ d }: { d: Dict }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("alm-theme", next ? "dark" : "light");
    } catch {
      /* private mode */
    }
    setDark(next);
  };

  const label = dark ? d.common.themeToLight : d.common.themeToDark;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="p-1.5 rounded-full hover:bg-white/10 text-current hover:text-gold-500 transition-colors cursor-pointer"
    >
      <span className="relative block w-[18px] h-[18px]">
        {/* Sun (shown in light theme) */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          className={`absolute inset-0 w-[18px] h-[18px] transition-opacity duration-200 ${dark ? "opacity-0" : "opacity-100"}`}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
        {/* Moon (shown in dark theme) */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`absolute inset-0 w-[18px] h-[18px] transition-opacity duration-200 ${dark ? "opacity-100" : "opacity-0"}`}
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      </span>
    </button>
  );
}
