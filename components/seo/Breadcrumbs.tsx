import JsonLd from "@/components/seo/JsonLd";
import type { Locale } from "@/lib/types";

const SITE = "https://almuraqib.ae"; // canonical host — crawlers ignore the Pages base path
const HOME: Record<string, string> = { en: "Home", ar: "الرئيسية", bn: "হোম" };

/**
 * Emits schema.org BreadcrumbList matching the visible breadcrumb bars on
 * detail templates. `items` lists everything after Home (name + optional
 * resolvable path); the last entry is the current page.
 */
export default function BreadcrumbJsonLd({
  locale,
  items,
}: {
  locale: Locale;
  items: { name: string; path?: string }[];
}) {
  const all = [{ name: HOME[locale] ?? "Home", path: `/${locale}` }, ...items];
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: all.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          ...(it.path ? { item: `${SITE}${it.path}` } : {}),
        })),
      }}
    />
  );
}
