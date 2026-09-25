import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { Reveal, Counter } from "@/components/ui/Motion";
import { SectionHeading, CtaBand } from "@/components/ui/Sections";
import ProductCard from "@/components/products/ProductCard";
import ArticleCard from "@/components/ui/ArticleCard";
import ProductArt from "@/components/ui/ProductArt";
import { getDict } from "@/lib/i18n";
import { productGroups } from "@/lib/data/nav";
import { products } from "@/lib/data/catalog";
import { articlesByKind, projects } from "@/lib/data/content";
import { site, clients, sectors, certifications } from "@/lib/data/site";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const d = getDict(l);
  const p = `/${l}`;
  const isAr = l === "ar";

  const featured = products.filter((x) => x.featured);
  const latest = articlesByKind("blog").slice(0, 3);
  const featuredProjects = projects.slice(0, 3);

  const whyIcons = ["award", "tool", "truck", "clock", "shield", "users"] as const;

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative min-h-[86vh] lg:min-h-[92vh] flex items-center overflow-hidden bg-navy-950">
        {/* layered gradient art */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-[#072a45]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_75%_30%,#0284c7_0,transparent_50%),radial-gradient(circle_at_20%_85%,#f59e0b_0,transparent_35%)]" />
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-[size:48px_48px] text-white" />
        {/* decorative tank outline */}
        <svg viewBox="0 0 400 300" className="absolute end-[-60px] bottom-10 w-[520px] text-gold-500/15 hidden lg:block" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="40" y="60" width="320" height="200" rx="16" />
          <path d="M40 110h320M40 160h320M40 210h320M140 60v200M240 60v200" />
          <circle cx="340" cy="80" r="14" />
        </svg>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-28 w-full">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-500 bg-gold-500/10 ring-1 ring-gold-500/30 rounded-full px-4 py-2">
              <Icon name="shield" className="w-4 h-4" />
              {d.home.heroEyebrow}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 font-heading font-black text-white text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl max-w-4xl text-balance">
              {d.home.heroTitle1}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                {d.home.heroTitle2}
              </span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-2xl text-lg md:text-xl text-slate-300 leading-relaxed">{d.home.heroText}</p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link
                href={`${p}/get-quotation`}
                className="inline-flex items-center justify-center gap-2.5 bg-gold-500 text-navy-950 font-bold text-base px-8 py-4 rounded-[10px] hover:bg-gold-600 hover:text-white transition-colors"
              >
                <Icon name="file" className="w-5 h-5" />
                {d.home.heroCta1}
              </Link>
              <Link
                href={`${p}/products`}
                className="inline-flex items-center justify-center gap-2.5 bg-white/10 backdrop-blur-sm text-white font-bold text-base px-8 py-4 rounded-[10px] ring-1 ring-white/20 hover:bg-white hover:text-navy-900 transition-colors"
              >
                {d.home.heroCta2}
                <Icon name="arrowRight" className="w-5 h-5 flip-x" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
              {["ISO 9001:2015", isAr ? "معتمد من بلدية دبي" : "DM Approved", isAr ? "ESMA / ECAS" : "ESMA Compliant", isAr ? "صُنع في الإمارات" : "Made in UAE"].map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5">
                  <Icon name="checkCircle" className="w-4 h-4 text-gold-500" />
                  {b}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="bg-navy-900 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { label: d.home.statsEstablished, value: site.stats.established, raw: true },
            { label: d.home.statsClients, value: null, counter: site.stats.clients, suffix: "+" },
            { label: d.home.statsProjects, value: null, counter: site.stats.projects, suffix: "+" },
            { label: isAr ? "دول نصدّر إليها" : "GCC export markets", value: isAr ? "٥+" : "5+", raw: true },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div>
                <p className="font-heading font-black text-4xl md:text-5xl text-gold-500">
                  {s.raw ? s.value : <Counter to={s.counter!} suffix={s.suffix} />}
                </p>
                <p className="mt-1.5 text-xs md:text-sm uppercase tracking-wider text-slate-400 font-semibold">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ PRODUCT GROUPS ============ */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={isAr ? "حلولنا" : "Our Solutions"}
            title={d.home.groupsTitle}
            subtitle={d.home.groupsSubtitle}
            center
          />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productGroups.map((g, i) => (
              <Reveal key={g.slug} delay={i * 70}>
                <Link
                  href={`${p}/products?group=${g.slug}`}
                  className="group block h-full bg-white border border-slate-200 rounded-[12px] p-6 hover:shadow-soft hover:border-brand-600/40 transition-all"
                >
                  <span className="grid place-items-center w-14 h-14 rounded-xl bg-navy-900 text-gold-500 group-hover:bg-brand-700 group-hover:text-white transition-colors">
                    <Icon name={g.icon} className="w-7 h-7" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-4 font-heading font-bold text-lg text-navy-900 group-hover:text-brand-700 transition-colors">
                    {t(g.name, l)}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{t(g.description, l)}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 group-hover:gap-2.5 transition-all">
                    {d.common.viewAll}
                    <Icon name="arrowRight" className="w-4 h-4 flip-x" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="pb-20 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow={isAr ? "مختارات" : "Spotlight"} title={d.home.featuredTitle} subtitle={d.home.featuredSubtitle} />
            <Reveal>
              <Link
                href={`${p}/products`}
                className="inline-flex items-center gap-2 text-sm font-bold text-navy-900 hover:text-brand-700 border-b-2 border-gold-500 pb-1"
              >
                {d.common.viewAll}
                <Icon name="arrowRight" className="w-4 h-4 flip-x" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.concat(products.filter((x) => !x.featured)).slice(0, 4).map((prod, i) => (
              <Reveal key={prod.slug} delay={i * 70}>
                <ProductCard product={prod} locale={l} quoteLabel={d.common.getQuote} detailsLabel={d.common.details} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY US + CERTS ============ */}
      <section className="bg-white py-20 md:py-24 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow={isAr ? "لماذا نحن" : "Our edge"} title={d.home.whyTitle} subtitle={d.home.whySubtitle} />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {d.home.whyItems.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="flex gap-4 h-full bg-slate-50 rounded-[12px] p-5 border border-slate-100">
                  <span className="shrink-0 grid place-items-center w-11 h-11 rounded-lg bg-gold-500 text-navy-950">
                    <Icon name={whyIcons[i]} className="w-5.5 h-5.5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-navy-900 text-[15px]">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-500 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {certifications.map((c) => (
                <span
                  key={c.code}
                  className="inline-flex items-center gap-2 bg-navy-900 text-white text-xs font-bold px-4 py-2.5 rounded-full"
                >
                  <Icon name="award" className="w-4 h-4 text-gold-500" />
                  {t(c.title, l)}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ FEATURED PROJECTS ============ */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow={isAr ? "أعمالنا" : "Track record"} title={d.home.projectsTitle} subtitle={d.home.projectsSubtitle} />
            <Reveal>
              <Link
                href={`${p}/projects`}
                className="inline-flex items-center gap-2 text-sm font-bold text-navy-900 hover:text-brand-700 border-b-2 border-gold-500 pb-1"
              >
                {d.home.projectsCta}
                <Icon name="arrowRight" className="w-4 h-4 flip-x" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((proj, i) => (
              <Reveal key={proj.slug} delay={i * 80}>
                <Link
                  href={`${p}/projects/${proj.slug}`}
                  className="group block h-full bg-white rounded-[12px] border border-slate-200 overflow-hidden hover:shadow-soft transition-all"
                >
                  <ProductArt
                    seed={proj.slug}
                    icon="building"
                    label={t(proj.location, l)}
                    kind="installed"
                    className="aspect-[16/10] w-full"
                  />
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-brand-700">
                      <Icon name="pin" className="w-3.5 h-3.5" />
                      {t(proj.location, l)} · {proj.year}
                    </div>
                    <h3 className="mt-2 font-heading font-bold text-navy-900 group-hover:text-brand-700 transition-colors leading-snug">
                      {t(proj.title, l)}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">{t(proj.scope, l)}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTORS ============ */}
      <section className="bg-navy-900 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-center text-gold-500 text-[11px] font-black uppercase tracking-[0.22em] mb-7">
              {d.home.sectorsTitle}
            </p>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {sectors.map((s, i) => (
              <Reveal key={s.slug} delay={i * 50}>
                <span className="inline-flex items-center gap-2 text-white/90 bg-white/5 ring-1 ring-white/10 rounded-full px-5 py-2.5 text-sm font-semibold hover:ring-gold-500/50 transition-colors">
                  <Icon name={["building", "star", "droplet", "truck", "leaf"][i] as "building"} className="w-4 h-4 text-gold-500" />
                  {t(s.name, l)}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CLIENTS ============ */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading title={d.home.clientsTitle} subtitle={d.home.clientsText} center />
          <div className="mt-10 flex flex-wrap justify-center items-center gap-5 md:gap-10">
            {clients.map((c, i) => (
              <Reveal key={c.name} delay={i * 60}>
                <span className="grid place-items-center h-14 px-6 rounded-lg bg-slate-50 ring-1 ring-slate-200/70 font-heading font-black text-slate-400 tracking-widest text-sm hover:text-brand-700 hover:ring-brand-600/30 transition-all">
                  {c.logoText}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LATEST ARTICLES ============ */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow={isAr ? "مدونتنا" : "From the factory floor"} title={d.home.articlesTitle} subtitle={d.home.articlesSubtitle} />
            <Reveal>
              <Link
                href={`${p}/blog`}
                className="inline-flex items-center gap-2 text-sm font-bold text-navy-900 hover:text-brand-700 border-b-2 border-gold-500 pb-1"
              >
                {d.home.articlesCta}
                <Icon name="arrowRight" className="w-4 h-4 flip-x" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {latest.map((a, i) => (
              <Reveal key={a.slug} delay={i * 70}>
                <ArticleCard article={a} locale={l} href={`${p}/blog/${a.slug}`} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <CtaBand
        title={d.home.ctaTitle}
        text={d.home.ctaText}
        button={d.home.ctaButton}
        href={`${p}/get-quotation`}
        locale={l}
      />
    </>
  );
}
