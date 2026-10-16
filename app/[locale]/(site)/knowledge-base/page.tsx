import TitleBackdrop from "@/components/ui/TitleBackdrop";
import BlogClient from "@/components/blog/BlogClient";
import { getProduct } from "@/lib/data/catalog";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Motion";
import { getDict, isLocale } from "@/lib/i18n";
import { articlesByKind } from "@/lib/data/content";
import { t, tl } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { alternates, ogImages } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return { ...ogImages("/images/backdrops/insights.jpg"),};
  const l = locale as Locale;
  const d = getDict(locale as Locale);
  return { title: d.kb.title, description: d.kb.intro, alternates: alternates(l, "/en/knowledge-base") };
}

export default async function KnowledgeBasePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);
  const items = articlesByKind("kb");

  const rows = items.map((a) => ({
    slug: a.slug,
    title: t(a.title, l),
    excerpt: t(a.excerpt, l),
    category: t(a.category, l),
    date: a.date,
    readingMinutes: a.readingMinutes,
    image: a.image,
    products: a.relatedProducts
      .map(getProduct)
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) => ({ id: p.slug, label: t(p.name, l) })),
  }));

  const f = {
    ...d.kb.filters,
    filterAll: d.kb.filterAll,
  };


  return (
    <>
      <section className="bg-navy-950 relative overflow-hidden">
        <TitleBackdrop src="/images/backdrops/insights.jpg" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_80%_15%,#0369a1_0,transparent_50%),radial-gradient(circle_at_10%_90%,#f59e0b_0,transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <nav className="text-sm text-slate-400 mb-4 flex items-center gap-2">
            <Link href={`/${l}`} className="hover:text-gold-400">{d.common.home}</Link>
            <span>/</span>
            <span className="text-white font-semibold">{d.nav.knowledgeBase}</span>
          </nav>
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl">{d.kb.title}</h1>
          <p className="mt-3 max-w-2xl text-slate-300 text-lg">{d.kb.intro}</p>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BlogClient rows={rows} locale={l} hrefBase="knowledge-base" f={f} />
          <Reveal>
            <div className="mt-12 bg-navy-900 rounded-[14px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-start">
              <div>
                <h2 className="font-heading font-black text-white text-xl md:text-2xl">{d.faq.title}</h2>
                <p className="mt-1 text-slate-300 text-sm">{d.faq.intro}</p>
              </div>
              <Link
                href={`/${l}/faq`}
                className="inline-flex items-center gap-2 bg-gold-500 text-navy-950 font-bold px-6 py-3 rounded-[10px] hover:bg-gold-600 hover:text-white transition-colors shrink-0"
              >
                {tl(l, "Browse FAQ", "تصفح الأسئلة")}
                <Icon name="arrowRight" className="w-4 h-4 flip-x" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
