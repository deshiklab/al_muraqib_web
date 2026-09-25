import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogClient from "@/components/products/CatalogClient";
import { getDict, isLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { alternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const l = locale as Locale;
  const d = getDict(locale as Locale);
  return {
    title: d.products.title,
    description: d.products.intro,
    alternates: alternates(l, "/en/products"),
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);

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
          <CatalogClient locale={l} d={d} />
        </div>
      </section>
    </>
  );
}
