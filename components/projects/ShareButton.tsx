"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { tl, track } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export default function ShareButton({
  locale,
  label,
  copiedLabel,
}: {
  locale: Locale;
  label: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        const url = typeof window !== "undefined" ? window.location.href : "";
        navigator.clipboard?.writeText(url);
        setCopied(true);
        track("project_share", { locale });
        setTimeout(() => setCopied(false), 1800);
      }}
      className={`inline-flex items-center gap-2 rounded-[10px] border px-6 py-3 font-bold transition-colors cursor-pointer ${
        copied ? "border-gold-500 text-gold-400" : "border-white/25 text-white hover:border-gold-500 hover:text-gold-400"
      }`}
    >
      <Icon name={copied ? "check" : "share"} className="w-4.5 h-4.5" />
      {copied ? copiedLabel ?? tl(locale, "Link copied", "تم النسخ!") : label}
    </button>
  );
}
