import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/lib/i18n";
import { projects } from "@/lib/data/content";
import { serviceList } from "@/lib/data/services";
import { getProduct } from "@/lib/data/catalog";
import { t } from "@/lib/utils";
import { CtaBand } from "@/components/ui/Sections";
import ProjectsClient from "@/components/projects/ProjectsClient";
import type { ProjectRow } from "@/components/projects/ProjectsClient";
import type { Locale } from "@/lib/types";
import { alternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const l = locale as Locale;
  const d = getDict(l);
  return { title: d.projects.title, description: d.projects.intro, alternates: alternates(l, "/en/projects") };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);

  const sectorKeys = [...new Set(projects.map((p) => p.sector))];
  const sectors = sectorKeys.map((k) => ({
    id: k,
    label: d.projects.sectors[k as keyof typeof d.projects.sectors] ?? k,
  }));

  const usedProductSlugs = [...new Set(projects.flatMap((p) => p.products))];
  const productOptions = usedProductSlugs
    .map((slug) => getProduct(slug))
    .filter(Boolean)
    .map((p) => ({ id: p!.slug, label: t(p!.name, l) }));

  const serviceOptions = serviceList.map((sv) => ({ id: sv.id, label: t(sv.title, l) }));

  const rows: ProjectRow[] = projects.map((p) => ({
    slug: p.slug,
    title: t(p.title, l),
    sector: p.sector,
    sectorLabel: d.projects.sectors[p.sector as keyof typeof d.projects.sectors] ?? p.sector,
    location: t(p.location, l),
    year: p.year,
    scope: t(p.scope, l),
    client: p.client ? t(p.client, l) : undefined,
    products: p.products,
    productNames: p.products.map((slug) => {
      const prod = getProduct(slug);
      return prod ? t(prod.name, l) : slug;
    }),
    services: p.services ?? [],
    serviceNames: (p.services ?? []).map(
      (id) => t(serviceList.find((sv) => sv.id === id)?.title ?? { en: id }, l)
    ),
  }));

  return (
    <>
      <section className="bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_85%_25%,#0369a1_0,transparent_50%),radial-gradient(circle_at_10%_85%,#f59e0b_0,transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <nav className="text-sm text-slate-400 mb-4 flex items-center gap-2" aria-label="Breadcrumb">
            <Link href={`/${l}`} className="hover:text-gold-400">{d.common.home}</Link>
            <span>/</span>
            <span className="text-white font-semibold">{d.nav.projects}</span>
          </nav>
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl">{d.projects.title}</h1>
          <p className="mt-3 max-w-2xl text-slate-300 text-lg">{d.projects.intro}</p>
        </div>
      </section>

      <section className="pb-14 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProjectsClient
            locale={l}
            rows={rows}
            sectors={sectors}
            productOptions={productOptions}
            serviceOptions={serviceOptions}
            d={d}
          />
        </div>
      </section>

      <CtaBand title={d.projects.cta} text={d.home.ctaText} button={d.nav.getQuote} href={`/${l}/get-quotation`} locale={l} />
    </>
  );
}
