import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import ProductArt from "@/components/ui/ProductArt";
import ProductCard from "@/components/products/ProductCard";
import { Reveal } from "@/components/ui/Motion";
import { CtaBand } from "@/components/ui/Sections";
import { getDict, isLocale } from "@/lib/i18n";
import { projects } from "@/lib/data/content";
import { getProduct } from "@/lib/data/catalog";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { alternates } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const l = locale as Locale;
  const proj = projects.find((p) => p.slug === slug);
  if (!proj) return {};
  return { title: t(proj.title, l), description: t(proj.scope, l), alternates: alternates(l, `/en/projects/${slug}`) };
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);
  const proj = projects.find((p) => p.slug === slug);
  if (!proj) notFound();

  const usedProducts = proj.products.map(getProduct).filter(Boolean);
  const sectorLabel = d.projects.sectors[proj.sector as keyof typeof d.projects.sectors] ?? proj.sector;

  const facts = [
    { icon: "pin" as const, label: d.projects.facts.location, value: t(proj.location, l) },
    { icon: "calendar" as const, label: d.projects.facts.year, value: proj.year },
    { icon: "layers" as const, label: d.projects.facts.scope, value: t(proj.scope, l) },
  ];

  return (
    <>
      <section className="bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <nav className="text-sm text-slate-400 mb-5 flex flex-wrap items-center gap-2">
            <Link href={`/${l}`} className="hover:text-gold-400">{d.common.home}</Link>
            <span>/</span>
            <Link href={`/${l}/projects`} className="hover:text-gold-400">{d.nav.projects}</Link>
            <span>/</span>
            <span className="text-white font-semibold">{t(proj.title, l)}</span>
          </nav>

          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-gold-500 bg-gold-500/10 ring-1 ring-gold-500/30 rounded-full px-3.5 py-1.5">
                <Icon name="building" className="w-3.5 h-3.5" />
                {sectorLabel}
              </span>
              <h1 className="mt-4 font-heading font-black text-white text-3xl md:text-5xl leading-tight">{t(proj.title, l)}</h1>
              <p className="mt-4 text-slate-300 text-lg">{t(proj.scope, l)}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/${l}/get-quotation?product=${proj.products.join(",")}`}
                  className="inline-flex items-center gap-2 bg-gold-500 text-navy-950 font-bold px-6 py-3 rounded-[10px] hover:bg-gold-600 hover:text-white transition-colors"
                >
                  <Icon name="file" className="w-4.5 h-4.5" />
                  {d.projects.cta}
                </Link>
              </div>
            </div>
            <ProductArt seed={proj.slug} icon="building" kind="installed" label={t(proj.location, l)} className="aspect-[16/10] w-full rounded-xl ring-1 ring-white/10" />
          </div>

          {/* fact bar */}
          <dl className="mt-10 grid sm:grid-cols-3 gap-4">
            {facts.map((f) => (
              <div key={String(f.label)} className="bg-white/5 ring-1 ring-white/10 rounded-[10px] p-4">
                <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <Icon name={f.icon} className="w-4 h-4 text-gold-500" />
                  {f.label}
                </dt>
                <dd className="mt-1.5 font-heading font-bold text-white text-[15px]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
          {[
            { key: d.projects.challenge, text: t(proj.challenge, l), icon: "flask" as const },
            { key: d.projects.solution, text: t(proj.solution, l), icon: "tool" as const },
            { key: d.projects.result, text: t(proj.result, l), icon: "star" as const },
          ].map((block, i) => (
            <Reveal key={block.key} delay={i * 80}>
              <div className="flex gap-5">
                <span className="shrink-0 grid place-items-center w-12 h-12 rounded-xl bg-navy-900 text-gold-500">
                  <Icon name={block.icon} className="w-6 h-6" />
                </span>
                <div>
                  <h2 className="font-heading font-black text-xl md:text-2xl">{block.key}</h2>
                  <p className="mt-2 text-slate-600 leading-relaxed text-[17px]">{block.text}</p>
                </div>
              </div>
            </Reveal>
          ))}

          {usedProducts.length > 0 && (
            <Reveal>
              <div className="pt-6 border-t border-slate-100">
                <h2 className="font-heading font-black text-xl mb-5">{d.projects.facts.products}</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {usedProducts.map((p) => p && (
                    <ProductCard key={p.slug} product={p} locale={l} quoteLabel={d.common.getQuote} detailsLabel={d.common.details} />
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <CtaBand title={d.projects.cta} text={d.home.ctaText} button={d.nav.getQuote} href={`/${l}/get-quotation`} locale={l} />
    </>
  );
}
