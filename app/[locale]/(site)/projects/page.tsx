import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import ProductArt from "@/components/ui/ProductArt";
import { Reveal } from "@/components/ui/Motion";
import { CtaBand } from "@/components/ui/Sections";
import { getDict, isLocale } from "@/lib/i18n";
import { projects } from "@/lib/data/content";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { alternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const l = locale as Locale;
  const d = getDict(locale as Locale);
  return { title: d.projects.title, description: d.projects.intro, alternates: alternates(l, "/en/projects") };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);

  const sectorFilters = [...new Set(projects.map((p) => p.sector))];

  return (
    <>
      <section className="bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_85%_25%,#0369a1_0,transparent_50%),radial-gradient(circle_at_10%_85%,#f59e0b_0,transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <nav className="text-sm text-slate-400 mb-4 flex items-center gap-2">
            <Link href={`/${l}`} className="hover:text-gold-400">{d.common.home}</Link>
            <span>/</span>
            <span className="text-white font-semibold">{d.nav.projects}</span>
          </nav>
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl">{d.projects.title}</h1>
          <p className="mt-3 max-w-2xl text-slate-300 text-lg">{d.projects.intro}</p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* sector chips (static overview — P1: URL-synced filter) */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-navy-900 text-white rounded-full px-4 py-2">
              {d.projects.filterAll}
            </span>
            {sectorFilters.map((s) => (
              <span key={s} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-500 rounded-full px-4 py-2">
                {d.projects.sectors[s as keyof typeof d.projects.sectors] ?? s}
              </span>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj, i) => (
              <Reveal key={proj.slug} delay={(i % 6) * 60}>
                <Link
                  href={`/${l}/projects/${proj.slug}`}
                  className="group block h-full bg-white rounded-[12px] border border-slate-200 overflow-hidden hover:shadow-soft transition-all"
                >
                  <ProductArt seed={proj.slug} icon="building" kind="installed" label={t(proj.location, l)} className="aspect-[16/10] w-full" />
                  <div className="p-5">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                      <span className="text-brand-700 flex items-center gap-1.5">
                        <Icon name="pin" className="w-3.5 h-3.5" />
                        {t(proj.location, l)}
                      </span>
                      <span className="text-slate-400">{proj.year}</span>
                    </div>
                    <h2 className="mt-2 font-heading font-bold text-navy-900 group-hover:text-brand-700 transition-colors leading-snug">
                      {t(proj.title, l)}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">{t(proj.scope, l)}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 group-hover:gap-2.5 transition-all">
                      {l === "en" ? "View case study" : "عرض دراسة الحالة"}
                      <Icon name="arrowRight" className="w-4 h-4 flip-x" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={d.projects.cta} text={d.home.ctaText} button={d.nav.getQuote} href={`/${l}/get-quotation`} locale={l} />
    </>
  );
}
