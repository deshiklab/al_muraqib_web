export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { products } from "@/lib/data/catalog";
import { projects, articles } from "@/lib/data/content";

const BASE = "https://almuraqib.ae";
const NOW = new Date();

const entry = (
  path: string,
  priority = 0.7,
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" = "monthly"
): MetadataRoute.Sitemap[number] => ({
  url: `${BASE}${path}`,
  lastModified: NOW,
  changeFrequency,
  priority,
});

const LOCALES = ["en", "ar", "bn"] as const;

const corePaths = [
  "",
  "/products",
  "/projects",
  "/blog",
  "/knowledge-base",
  "/faq",
  "/company/about",
  "/company/certifications",
  "/services",
  "/contact",
  "/get-quotation",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...LOCALES.flatMap((loc) =>
      corePaths.map((cp) =>
        entry(`/${loc}${cp}`, cp === "" ? 1 : 0.7, cp === "" ? "weekly" : "monthly")
      )
    ),
    ...LOCALES.flatMap((loc) =>
      products.map((p) => entry(`/${loc}/products/${p.slug}`, 0.9))
    ),
    ...LOCALES.flatMap((loc) =>
      projects.map((p) => entry(`/${loc}/projects/${p.slug}`, 0.6))
    ),
    ...LOCALES.flatMap((loc) =>
      articles.flatMap((a) => {
        const kind = a.kind === "blog" ? "blog" : "knowledge-base";
        return [entry(`/${loc}/${kind}/${a.slug}`, 0.6, "yearly")];
      })
    ),
  ];
}
