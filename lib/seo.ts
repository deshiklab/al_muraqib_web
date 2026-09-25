import type { Metadata } from "next";
import type { Locale } from "@/lib/types";

/**
 * Per-locale alternates for a path written in its English form
 * (e.g. "/en/products/hot-press-grp-panel-tank").
 *
 * Returns the canonical URL for the CURRENT locale plus an hreflang pair
 * (EN/AR + x-default → EN), resolved against metadataBase (almuraqib.ae).
 */
export function alternates(locale: Locale, pathEn: string): Metadata["alternates"] {
  const en = pathEn.replace(/^\/ar\b/, "/en");
  const ar = en.replace(/^\/en\b/, "/ar");
  const current = locale === "ar" ? ar : en;
  return {
    canonical: current,
    languages: { en, ar, "x-default": en },
  };
}
