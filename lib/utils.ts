import type { L, Locale } from "./types";

/** Pick a localized value with fallback to English */
export function t(value: L, locale: Locale): string {
  return value[locale] || value.en;
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function formatRefDate(d = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

export function makeRfqRef(): string {
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `RFQ-${formatRefDate()}-${rand}`;
}

/** Deterministic gradient class from a slug (placeholder art direction) */
export function artGradient(seed: string): string {
  const palettes = [
    "from-[#0a2540] via-[#0f172a] to-[#0369a1]",
    "from-[#0f172a] via-[#0369a1] to-[#0284c7]",
    "from-[#0a2540] via-[#0f3a5e] to-[#0284c7]",
    "from-[#0f172a] via-[#0a2540] to-[#0369a1]",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palettes[h % palettes.length];
}

export const waLink = (number: string, message: string) =>
  `https://wa.me/${number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;

/** Analytics stub — pushes to dataLayer when GTM is present */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}
