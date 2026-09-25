import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogShell, { type Applied, type Counts } from "@/components/products/CatalogShell";
import ProductCard from "@/components/products/ProductCard";
import { Reveal } from "@/components/ui/Motion";
import { getDict, isLocale } from "@/lib/i18n";
import { products } from "@/lib/data/catalog";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale as Locale);
  return {
    title: d.products.title,
    description: d.products.intro,
  };
}

const split = (v: string | string[] | undefined): string[] =>
  !v ? [] : (Array.isArray(v) ? v : v.split(",")).filter(Boolean);

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);
  const sp = await searchParams;

  const applied: Applied = {
    group: split(sp.group),
    tech: split(sp.tech),
    size: split(sp.size),
    cert: split(sp.cert),
    insulation: typeof sp.insulation === "string" ? sp.insulation : "",
    sort: typeof sp.sort === "string" && sp.sort ? sp.sort : "featured",
  };

  const passes = (p: (typeof products)[number], except: string[] = []) =>
    (except.includes("group") || !applied.group.length || applied.group.includes(p.group)) &&
    (except.includes("tech") || !applied.tech.length || applied.tech.includes(p.technology)) &&
    (except.includes("size") || !applied.size.length || applied.size.some((s) => p.sizeBuckets.includes(s))) &&
    (except.includes("cert") || !applied.cert.length || applied.cert.some((c) => p.certifications.includes(c))) &&
    (except.includes("insulation") ||
      !applied.insulation ||
      p.insulation === applied.insulation);

  let list = products.filter((p) => passes(p));
  if (applied.sort === "az") list = [...list].sort((a, b) => t(a.name, l).localeCompare(t(b.name, l)));
  else if (applied.sort === "newest") list = [...list].reverse();
  else list = [...list].sort((a, b) => Number(b.featured ?? 0) - Number(a.featured ?? 0));

  // Facet counts (each facet ignores its own selection)
  const countWith = (except: string[], fn: (p: (typeof products)[number]) => boolean) =>
    products.filter((p) => passes(p, except) && fn(p)).length;
  const counts: Counts = {
    group: Object.fromEntries(
      Object.keys(d.products.groups).map((g) => [g, countWith(["group"], (p) => p.group === g)])
    ),
    tech: Object.fromEntries(
      ["hot-press", "cold-press", "hand-layup"].map((tech) => [tech, countWith(["tech"], (p) => p.technology === tech)])
    ),
    size: Object.fromEntries(
      ["compact", "medium", "large"].map((size) => [
        size,
        countWith(["size"], (p) => p.sizeBuckets.includes(size)),
      ])
    ),
    cert: Object.fromEntries(
      ["dm", "esma", "iso"].map((c) => [c, countWith(["cert"], (p) => p.certifications.includes(c))])
    ),
  };

  return (
    <>
      {/* Page header */}
      <section className="bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_80%_20%,#0369a1_0,transparent_55%),radial-gradient(circle_at_10%_90%,#f59e0b_0,transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <nav className="text-sm text-slate-400 mb-4 flex items-center gap-2" aria-label="Breadcrumb">
            <a href={`/${l}`} className="hover:text-gold-400">{d.common.home}</a>
            <span>/</span>
            <span className="text-white font-semibold">{d.nav.products}</span>
          </nav>
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl">{d.products.title}</h1>
          <p className="mt-3 max-w-2xl text-slate-300 text-lg">{d.products.intro}</p>
        </div>
      </section>

      <section className="py-10 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CatalogShell
            locale={l}
            d={d}
            applied={applied}
            counts={counts}
            total={list.length}
            labels={{
              group: d.products.facets.group,
              tech: d.products.facets.technology,
              size: d.products.facets.size,
              cert: d.products.facets.certifications,
              insulation: d.products.facets.insulation,
              sort: d.common.sortBy,
            }}
          >
            {list.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-[12px] p-10 text-center">
                <p className="font-heading font-black text-xl text-navy-900">{d.common.emptyTitle}</p>
                <p className="mt-2 text-slate-500">{d.common.emptyText}</p>
                <a
                  href={`/${l}/get-quotation`}
                  className="inline-flex mt-5 items-center gap-2 bg-gold-500 text-navy-950 font-bold px-6 py-3 rounded-[10px] hover:bg-gold-600 hover:text-white transition-colors"
                >
                  {d.nav.getQuote}
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {list.map((prod, i) => (
                  <Reveal key={prod.slug} delay={(i % 6) * 50}>
                    <ProductCard
                      product={prod}
                      locale={l}
                      quoteLabel={d.common.getQuote}
                      detailsLabel={d.common.details}
                    />
                  </Reveal>
                ))}
              </div>
            )}
          </CatalogShell>
        </div>
      </section>
    </>
  );
}
