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

const core = [
  "/en",
  "/ar",
  "/en/products",
  "/ar/products",
  "/en/projects",
  "/ar/projects",
  "/en/blog",
  "/ar/blog",
  "/en/knowledge-base",
  "/ar/knowledge-base",
  "/en/faq",
  "/ar/faq",
  "/en/company/about",
  "/ar/company/about",
  "/en/company/certifications",
  "/ar/company/certifications",
  "/en/services",
  "/ar/services",
  "/en/contact",
  "/ar/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    entry("/en", 1, "weekly"),
    entry("/ar", 1, "weekly"),
    ...core.filter((p) => p !== "/en" && p !== "/ar").map((p) => entry(p)),
    ...products.flatMap((p) => [
      entry(`/en/products/${p.slug}`, 0.9),
      entry(`/ar/products/${p.slug}`, 0.9),
    ]),
    ...projects.flatMap((p) => [
      entry(`/en/projects/${p.slug}`, 0.6),
      entry(`/ar/projects/${p.slug}`, 0.6),
    ]),
    ...articles.flatMap((a) => {
      const kind = a.kind === "blog" ? "blog" : "knowledge-base";
      return [
        entry(`/en/${kind}/${a.slug}`, 0.6, "yearly"),
        entry(`/ar/${kind}/${a.slug}`, 0.6, "yearly"),
      ];
    }),
  ];
}
