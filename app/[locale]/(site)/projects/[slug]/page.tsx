import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import ProductArt from "@/components/ui/ProductArt";
import ProductCard from "@/components/products/ProductCard";
import ShareButton from "@/components/projects/ShareButton";
import { Reveal } from "@/components/ui/Motion";
import { CtaBand } from "@/components/ui/Sections";
import { getDict, isLocale } from "@/lib/i18n";
import { projects } from "@/lib/data/content";
import { getProduct } from "@/lib/data/catalog";
import { serviceList } from "@/lib/data/services";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { alternates, ogImages } from "@/lib/seo";
import TitleBackdrop from "@/components/ui/TitleBackdrop";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const l = locale as Locale;
  const proj = projects.find((p) => p.slug === slug);
  if (!proj) return {};
  return {
          ...ogImages(proj.image ?? "/images/backdrops/projects.jpg"),
          title: t(proj.title, l), description: t(proj.scope, l), alternates: alternates(l, `/en/projects/${slug}`) };
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
  const services = (proj.services ?? []).map((id) => serviceList.find((sv) => sv.id === id)).filter(Boolean);

  const overview = [
    { icon: "pin" as const, label: d.projects.facts.location, value: t(proj.location, l) },
    { icon: "building" as const, label: d.projects.facts.client, value: proj.client ? t(proj.client, l) : "—" },
    { icon: "calendar" as const, label: d.projects.facts.year, value: proj.year },
    { icon: "clock" as const, label: d.projects.facts.duration, value: proj.duration ? t(proj.duration, l) : "—" },
    { icon: "layers" as const, label: d.projects.facts.scope, value: t(proj.scope, l) },
    { icon: "star" as const, label: d.projects.facts.value, value: proj.value ? t(proj.value, l) : "—" },
  ];

  const similar = projects
    .filter((p) => p.slug !== proj.slug && (p.sector === proj.sector || p.products.some((x) => proj.products.includes(x))))
    .slice(0, 3);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="bg-navy-950 relative overflow-hidden">
        <TitleBackdrop src={proj.image ?? "/images/backdrops/projects.jpg"} veil="from-navy-950 via-navy-950/75 to-navy-950/60" />
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_85%_15%,#f59e0b_0,transparent_42%),radial-gradient(circle_at_10%_90%,#0369a1_0,transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <nav className="text-[13px] text-slate-400 mb-5 flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
            <Link href={`/${l}`} className="hover:text-gold-400">{d.common.home}</Link>
            <span>/</span>
            <Link href={`/${l}/projects`} className="hover:text-gold-400">{d.nav.projects}</Link>
            <span>/</span>
            <span className="text-white font-semibold">{t(proj.title, l)}</span>
          </nav>

          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-gold-500 bg-gold-500/10 ring-1 ring-gold-500/30 rounded-full px-3.5 py-1.5">
                  <Icon name="building" className="w-3.5 h-3.5" />
                  {sectorLabel}
                </span>
                <span className="text-[11px] font-bold text-slate-400" dir="ltr">
                  {proj.year} · {t(proj.location, l)}
                </span>
              </div>
              <h1 className="mt-4 font-heading font-black text-white text-3xl md:text-[2.6rem] leading-tight text-balance">
                {t(proj.title, l)}
              </h1>
              <p className="mt-3 text-slate-300 text-[16px] leading-relaxed">{t(proj.scope, l)}</p>
              {proj.metrics && proj.metrics.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-3 max-w-xl">
                  {proj.metrics.slice(0, 3).map((m) => (
                    <div key={m.label.en} className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-3 text-center">
                      <p className="font-heading font-black text-gold-400 text-lg md:text-xl leading-none" dir="ltr">
                        {t(m.value, l)}
                      </p>
                      <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-snug">
                        {t(m.label, l)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/${l}/get-quotation?product=${proj.products.join(",")}&source=project-${proj.slug}`}
                  className="inline-flex items-center gap-2 bg-gold-500 text-navy-950 font-bold px-6 py-3 rounded-[10px] hover:bg-gold-600 hover:text-white transition-colors"
                >
                  <Icon name="file" className="w-4.5 h-4.5" />
                  {d.projects.detail.quoteThis}
                </Link>
                <ShareButton locale={l} label={d.projects.detail.share} />
              </div>
            </div>
            <div className="rounded-xl overflow-hidden ring-1 ring-white/10">
              <ProductArt seed={proj.slug} icon="building" kind="installed" label={t(proj.location, l)} className="aspect-[16/10] w-full" src={proj.image} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- At a glance ---------- */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {overview.map((o, i) => (
              <Reveal key={o.label} delay={i * 45}>
                <div className="h-full rounded-[10px] border border-slate-200 bg-slate-50/60 p-4">
                  <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    <Icon name={o.icon} className="w-3.5 h-3.5 text-brand-700" />
                    {o.label}
                  </p>
                  <p className="mt-1.5 font-heading font-bold text-navy-900 text-[14px] leading-snug">{o.value}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {services.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">{d.projects.detail.services}:</span>
              {services.map((sv) => (
                <span key={sv!.id} className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 text-white text-xs font-bold px-3.5 py-1.5">
                  <Icon name="check" className="w-3 h-3 text-gold-400" />
                  {t(sv!.title, l)}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- Case study ---------- */}
      <section className="py-12 md:py-14 bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-6">
          {[
            { key: d.projects.challenge, text: t(proj.challenge, l), icon: "flask" as const },
            { key: d.projects.solution, text: t(proj.solution, l), icon: "tool" as const },
            { key: d.projects.result, text: t(proj.result, l), icon: "star" as const },
          ].map((block, i) => (
            <Reveal key={block.key} delay={i * 90}>
              <div className="relative h-full bg-white rounded-[14px] border border-slate-200 p-6">
                <span className="absolute -top-3 start-6 grid h-7 w-7 place-items-center rounded-full bg-gold-500 font-heading text-[12px] font-black text-navy-950">
                  {i + 1}
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-gold-500">
                  <Icon name={block.icon} className="w-5 h-5" />
                </span>
                <h2 className="mt-4 font-heading font-black text-lg text-navy-900">{block.key}</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-slate-600">{block.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-14 space-y-14">
          {/* ---------- Execution phases ---------- */}
          {proj.phases && proj.phases.length > 0 && (
            <section aria-label={d.projects.detail.phases}>
              <h2 className="font-heading font-black text-xl md:text-2xl flex items-center gap-3">
                <span className="w-1.5 h-6 rounded-full bg-gold-500" />
                {d.projects.detail.phases}
              </h2>
              <ol className="mt-6 relative space-y-6 ps-6 before:absolute before:top-2 before:bottom-2 before:start-[11px] before:w-0.5 before:bg-gradient-to-b before:from-gold-500 before:to-brand-700">
                {proj.phases.map((ph, i) => (
                  <Reveal key={ph.name.en} delay={i * 70}>
                    <li className="relative">
                      <span className="absolute -start-6 top-1 grid h-6 w-6 place-items-center rounded-full bg-navy-900 text-[10px] font-black text-gold-400 ring-4 ring-white" dir="ltr">
                        {i + 1}
                      </span>
                      <div className="rounded-[10px] border border-slate-200 bg-slate-50/60 px-4 py-3">
                        <p className="font-bold text-navy-900 text-[14px]">{t(ph.name, l)}</p>
                        <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{t(ph.desc, l)}</p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </section>
          )}

          {/* ---------- Outcomes ---------- */}
          {proj.metrics && proj.metrics.length > 0 && (
            <section aria-label={d.projects.detail.outcomes}>
              <h2 className="font-heading font-black text-xl md:text-2xl flex items-center gap-3">
                <span className="w-1.5 h-6 rounded-full bg-gold-500" />
                {d.projects.detail.outcomes}
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                {proj.metrics.map((m) => (
                  <div key={m.label.en} className="rounded-[12px] bg-navy-950 text-center px-4 py-6">
                    <p className="font-heading font-black text-gold-400 text-2xl md:text-3xl leading-none" dir="ltr">
                      {t(m.value, l)}
                    </p>
                    <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 leading-snug">{t(m.label, l)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ---------- Gallery ---------- */}
          {usedProducts.length > 0 && (
            <section aria-label={d.projects.detail.gallery}>
              <h2 className="font-heading font-black text-xl md:text-2xl flex items-center gap-3">
                <span className="w-1.5 h-6 rounded-full bg-gold-500" />
                {d.projects.detail.gallery}
              </h2>
              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {usedProducts.map((p, i) => p && (
                  <Reveal key={p.slug} delay={i * 60}>
                    <div className="overflow-hidden rounded-[12px] border border-slate-200">
                      <ProductArt
                        seed={`${proj.slug}-${p.slug}-${i}`}
                        icon="building"
                        kind={(i % 2 === 0 ? "installed" : "product") as "installed" | "product"}
                        label={t(p.name, l)}
                        className="aspect-[4/3] w-full"
                        src={p.image}
                      />
                      <p className="bg-white px-3 py-2 text-[11px] font-bold text-navy-900 truncate">{t(p.name, l)}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {/* ---------- Products used ---------- */}
          {usedProducts.length > 0 && (
            <section aria-label={d.projects.facts.products}>
              <h2 className="font-heading font-black text-xl md:text-2xl flex items-center gap-3">
                <span className="w-1.5 h-6 rounded-full bg-gold-500" />
                {d.projects.facts.products}
              </h2>
              <div className="mt-6 grid sm:grid-cols-2 gap-5">
                {usedProducts.map((p) => p && (
                  <ProductCard key={p.slug} product={p} locale={l} quoteLabel={d.common.getQuote} detailsLabel={d.common.details} />
                ))}
              </div>
            </section>
          )}

          {/* ---------- Similar projects ---------- */}
          {similar.length > 0 && (
            <section aria-label={d.projects.detail.similar}>
              <h2 className="font-heading font-black text-xl md:text-2xl flex items-center gap-3">
                <span className="w-1.5 h-6 rounded-full bg-gold-500" />
                {d.projects.detail.similar}
              </h2>
              <div className="mt-6 grid sm:grid-cols-3 gap-4">
                {similar.map((sp, i) => (
                  <Reveal key={sp.slug} delay={i * 60}>
                    <Link
                      href={`/${l}/projects/${sp.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white transition-all hover:shadow-soft"
                    >
                      <ProductArt seed={sp.slug} icon="building" kind="installed" label={t(sp.location, l)} className="aspect-[16/9] w-full" src={sp.image} />
                      <div className="p-4">
                        <p className="text-[10px] font-black uppercase tracking-wider text-brand-700">
                          {sp.year} · {t(sp.location, l)}
                        </p>
                        <h3 className="mt-1 font-heading font-bold text-navy-900 text-[15px] leading-snug group-hover:text-brand-700 transition-colors">
                          {t(sp.title, l)}
                        </h3>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <CtaBand title={d.projects.cta} text={d.home.ctaText} button={d.nav.getQuote} href={`/${l}/get-quotation`} locale={l} />
    </>
  );
}
