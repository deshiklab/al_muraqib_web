import TitleBackdrop from "@/components/ui/TitleBackdrop";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { Reveal, Counter } from "@/components/ui/Motion";
import { SectionHeading, CtaBand } from "@/components/ui/Sections";
import { getDict, isLocale } from "@/lib/i18n";
import { site, certifications } from "@/lib/data/site";
import { projects } from "@/lib/data/content";
import { t, tl } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { alternates, ogImages } from "@/lib/seo";
import TrackLink from "@/components/ui/TrackLink";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return { ...ogImages("/images/backdrops/about.jpg"),};
  const l = locale as Locale;
  const d = getDict(locale as Locale);
  return { title: d.about.title, description: d.about.lead, alternates: alternates(l, "/en/company/about") };
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
        <TitleBackdrop src="/images/backdrops/about.jpg" />
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
            { label: tl(l, "In-house disciplines", "تخصصات داخلية"), value: tl(l, "4", "٤") },
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
              eyebrow={tl(l, "Our facility", "منشأتنا")}
              title={tl(l, "Everything under one roof in Sharjah", "كل شيء تحت سقف واحد في الشارقة")}
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
              <Link
                key={proj.slug}
                href={`/${l}/projects/${proj.slug}`}
                className="group relative block rounded-[12px] overflow-hidden aspect-[4/5] bg-navy-900"
                aria-label={t(proj.title, l)}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.06]"
                  style={{
                    backgroundImage: `url("${(process.env.NEXT_PUBLIC_BASE ?? "") + "/images/projects/" + proj.slug + ".jpg"}")`,
                  }}
                />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/35 to-navy-950/10" />
                <span className="relative h-full flex flex-col items-center justify-end text-center p-4">
                  <Icon name="building" className="w-7 h-7 text-gold-400" />
                  <p className="mt-2 text-sm font-bold text-white">{t(proj.location, l)}</p>
                  <p className="text-[11px] text-slate-300">{t(proj.title, l)} · {proj.year}</p>
                </span>
              </Link>
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

      {/* Company profile download */}
      <section className="py-14 md:py-16 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[16px] bg-navy-950 text-white p-7 md:p-10 grid lg:grid-cols-[minmax(0,1fr)_auto] gap-8 lg:gap-14 items-center">
              <span aria-hidden className="absolute -end-16 -top-16 w-64 h-64 rounded-full bg-gold-500/10" />
              <span aria-hidden className="absolute -end-24 top-10 w-64 h-64 rounded-full border border-white/5" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-gold-500 bg-gold-500/10 ring-1 ring-gold-500/30 rounded-full px-3.5 py-1.5">
                  <Icon name="download" className="w-3.5 h-3.5" />
                  {tl(l, "Official downloads", "تحميلات رسمية")}
                </span>
                <h2 className="mt-4 font-heading font-black text-3xl md:text-4xl leading-tight">
                  {tl(l, "Company Profile 2026", "الملف التعريفي للشركة ٢٠٢٦")}
                </h2>
                <p className="mt-3 max-w-xl text-slate-300 leading-relaxed">
                  {tl(l,
                    "Everything in one bilingual PDF — who we are, the nine product families, services, selected projects, certifications, brand partners and contact details. English and Arabic side by side.",
                    "كل شيء في ملف PDF ثنائي اللغة — من نحن، عائلات المنتجات التسع، الخدمات، أبرز المشاريع، الشهادات، شركاء العلامات ومعلومات التواصل. الإنجليزية والعربية جنبًا إلى جنب.")}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold">
                  {[
                    tl(l, "9 product families", "٩ عائلات منتجات"),
                    tl(l, "Selected projects", "مشاريع مختارة"),
                    tl(l, "Quality & compliance", "الجودة والامتثال"),
                    tl(l, "EN + AR", "إنجليزي + عربي"),
                  ].map((b) => (
                    <span key={b} className="rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1.5 text-slate-300">{b}</span>
                  ))}
                </div>
              </div>
              <div className="relative flex flex-col items-stretch gap-3 min-w-[220px]">
                <TrackLink
                  href={`${process.env.NEXT_PUBLIC_BASE ?? ""}/company-profile.pdf`}
                  download
                  event="file_download"
                  params={{ file: "company-profile", where: "about_cta" }}
                  className="inline-flex items-center justify-center gap-2.5 bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-sm rounded-[12px] px-7 py-3.5 transition-colors"
                >
                  <Icon name="download" className="w-4.5 h-4.5" />
                  {tl(l, "Download the PDF", "تحميل ملف الشركة")}
                </TrackLink>
                <p className="text-center text-xs text-slate-400">
                  {tl(l, "5 pages · A4 · updated 2026", "٥ صفحات · A4 · محدّث ٢٠٦")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand title={d.home.ctaTitle} text={d.home.ctaText} button={d.home.ctaButton} href={`/${l}/get-quotation`} locale={l} />
    </>
  );
}
