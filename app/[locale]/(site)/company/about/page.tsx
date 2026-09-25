import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { Reveal, Counter } from "@/components/ui/Motion";
import { SectionHeading, CtaBand } from "@/components/ui/Sections";
import { getDict, isLocale } from "@/lib/i18n";
import { site, certifications } from "@/lib/data/site";
import { projects } from "@/lib/data/content";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale as Locale);
  return { title: d.about.title, description: d.about.lead };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);

  const values = d.home.whyItems.slice(0, 4);

  return (
    <>
      <section className="bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_80%_20%,#0369a1_0,transparent_50%),radial-gradient(circle_at_15%_85%,#f59e0b_0,transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <nav className="text-sm text-slate-400 mb-4 flex items-center gap-2">
            <Link href={`/${l}`} className="hover:text-gold-400">{d.common.home}</Link>
            <span>/</span>
            <Link href={`/${l}/company/about`} className="hover:text-gold-400">{d.nav.about}</Link>
          </nav>
          <p className="text-gold-500 text-[11px] font-black uppercase tracking-[0.22em]">{d.about.eyebrow}</p>
          <h1 className="mt-3 font-heading font-black text-white text-4xl md:text-5xl">{d.about.title}</h1>
          <p className="mt-4 max-w-3xl text-slate-300 text-lg leading-relaxed">{d.about.lead}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { label: d.home.statsEstablished, value: site.stats.established as string | number },
            { label: d.home.statsClients, counter: site.stats.clients },
            { label: d.home.statsProjects, counter: site.stats.projects },
            { label: l === "en" ? "In-house disciplines" : "تخصصات داخلية", value: l === "en" ? "4" : "٤" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 70}>
              <div>
                <p className="font-heading font-black text-4xl text-gold-500">
                  {"counter" in s && s.counter ? <Counter to={s.counter} suffix="+" /> : (s.value as string)}
                </p>
                <p className="mt-1.5 text-xs uppercase tracking-wider text-slate-400 font-semibold">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          {[
            { title: d.about.missionTitle, text: d.about.mission, icon: "star" as const },
            { title: d.about.visionTitle, text: d.about.vision, icon: "eye" as const },
          ].map((mv, i) => (
            <Reveal key={mv.title} delay={i * 90}>
              <div className="h-full bg-navy-900 rounded-[14px] p-7 md:p-9 relative overflow-hidden">
                <span className="absolute -end-8 -bottom-8 w-40 h-40 rounded-full bg-gold-500/10" />
                <span className="grid place-items-center w-12 h-12 rounded-xl bg-gold-500 text-navy-950">
                  <Icon name={mv.icon} className="w-6 h-6" />
                </span>
                <h2 className="mt-5 font-heading font-black text-white text-2xl">{mv.title}</h2>
                <p className="mt-3 text-slate-300 leading-relaxed relative">{mv.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={d.about.valuesTitle} center />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 70}>
                <div className="h-full bg-white border border-slate-200 rounded-[12px] p-5 hover:border-gold-500 transition-colors">
                  <span className="grid place-items-center w-10 h-10 rounded-lg bg-brand-700/10 text-brand-700">
                    <Icon name={(["award", "tool", "truck", "shield"] as const)[i]} className="w-5 h-5" />
                  </span>
                  <h3 className="mt-3 font-bold text-navy-900 text-[15px]">{v.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Facility strip */}
      <section className="bg-white border-y border-slate-100 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <SectionHeading
              eyebrow={l === "en" ? "Our facility" : "منشأتنا"}
              title={l === "en" ? "Everything under one roof in Sharjah" : "كل شيء تحت سقف واحد في الشارقة"}
              subtitle={t(site.address, l)}
            />
            <ul className="mt-6 space-y-2.5">
              {(l === "en"
                ? ["Design & shop-drawing studio", "Molding & pressing units", "Finishing & gel-coat bay", "Assembly yard & dispatch"]
                : ["وحدة التصميم والرسومات", "وحدات الصبّ والضغط", "منطقة التشطيب وطلاء الجل", "ساحة التجميع والشحن"]
              ).map((x) => (
                <li key={x} className="flex items-center gap-2.5 font-semibold text-navy-900 text-[15px]">
                  <Icon name="checkCircle" className="w-5 h-5 text-gold-600" />
                  {x}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/${l}/company/certifications`}
                className="inline-flex items-center gap-2 border-2 border-slate-200 font-bold text-sm px-5 py-2.5 rounded-[10px] hover:border-brand-700 hover:text-brand-700 transition-colors"
              >
                <Icon name="award" className="w-4 h-4" />
                {d.nav.certifications}
              </Link>
              <Link
                href={`/${l}/projects`}
                className="inline-flex items-center gap-2 bg-navy-900 text-white font-bold text-sm px-5 py-2.5 rounded-[10px] hover:bg-brand-700 transition-colors"
              >
                {d.home.projectsCta}
                <Icon name="arrowRight" className="w-4 h-4 flip-x" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {projects.slice(0, 2).map((proj) => (
              <div key={proj.slug} className="bg-slate-100 rounded-[12px] aspect-[4/5] grid place-items-center text-center p-4">
                <div>
                  <Icon name="building" className="w-8 h-8 mx-auto text-brand-700" />
                  <p className="mt-2 text-xs font-bold text-navy-900">{t(proj.location, l)}</p>
                  <p className="text-[11px] text-slate-500">{proj.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications teaser */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center gap-3">
          {certifications.map((c) => (
            <span key={c.code} className="inline-flex items-center gap-2 bg-navy-900 text-white text-xs font-bold px-4 py-2.5 rounded-full">
              <Icon name="award" className="w-4 h-4 text-gold-500" />
              {t(c.title, l)}
            </span>
          ))}
        </div>
      </section>

      <CtaBand title={d.home.ctaTitle} text={d.home.ctaText} button={d.home.ctaButton} href={`/${l}/get-quotation`} locale={l} />
    </>
  );
}
