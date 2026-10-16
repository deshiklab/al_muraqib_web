import type { Dict } from "./en";
import { en } from "./en";
import { ar } from "./ar";
import { bn } from "./bn";
import type { Locale } from "../types";

export const locales = ["en", "ar", "bn"] as const;

/** Native-language names for the switcher */
export const localeLabels: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  bn: "বাংলা",
};
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDict(locale: Locale): Dict {
  if (locale === "ar") return ar;
  if (locale === "bn") return bn;
  return en;
}

export function dir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export type { Dict };
export { en, ar, bn };
