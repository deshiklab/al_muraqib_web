import type { Dict } from "./en";
import { en } from "./en";
import { ar } from "./ar";
import type { Locale } from "../types";

export const locales = ["en", "ar"] as const;
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDict(locale: Locale): Dict {
  return locale === "ar" ? ar : en;
}

export function dir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export type { Dict };
export { en, ar };
