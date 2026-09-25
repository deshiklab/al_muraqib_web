import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import ArticleCard from "@/components/ui/ArticleCard";
import HelpfulWidget from "@/components/ui/HelpfulWidget";
import ProductCard from "@/components/products/ProductCard";
import { Reveal } from "@/components/ui/Motion";
import { CtaBand } from "@/components/ui/Sections";
import { getDict, isLocale } from "@/lib/i18n";
import { articles, articlesByKind } from "@/lib/data/content";
import { getProduct } from "@/lib/data/catalog";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { alternates } from "@/lib/seo";

export function generateStaticParams() {
  return articles.filter((a) => a.kind === "kb").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const l = locale as Locale;
  const doc = articles.find((a) => a.slug === slug && a.kind === "kb");
  if (!doc) return {};
  return { title: t(doc.title, l), description: t(doc.excerpt, l), alternates: alternates(l, `/en/knowledge-base/${slug}`) };
}

export default async function KbArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);
  const doc = articles.find((a) => a.slug === slug && a.kind === "kb");
  if (!doc) notFound();

  const date = new Date(doc.date).toLocaleDateString(l === "ar" ? "ar-AE" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const others = articlesByKind("kb").filter((a) => a.slug !== doc.slug).slice(0, 3);
  const linkedProducts = doc.relatedProducts.map(getProduct).filter(Boolean).slice(0, 2);

  return (
    <>
      <section className="bg-navy-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <nav className="text-sm text-slate-400 mb-5 flex flex-wrap items-center gap-2">
            <Link href={`/${l}`} className="hover:text-gold-400">{d.common.home}</Link>
            <span>/</span>
            <Link href={`/${l}/knowledge-base`} className="hover:text-gold-400">{d.nav.knowledgeBase}</Link>
            <span>/</span>
            <span className="text-white/80 line-clamp-1">{t(doc.title, l)}</span>
          </nav>
          <span className="inline-flex text-[11px] font-black uppercase tracking-[0.18em] text-gold-500 bg-gold-500/10 ring-1 ring-gold-500/30 rounded-full px-3.5 py-1.5">
            {t(doc.category, l)}
          </span>
          <h1 className="mt-4 font-heading font-black text-white text-3xl md:text-5xl leading-tight">{t(doc.title, l)}</h1>
          <div className="mt-5 flex items-center gap-4 text-sm text-slate-400">
            <time>{date}</time>
            <span className="flex items-center gap-1.5">
              <Icon name="clock" className="w-4 h-4" /> {doc.readingMinutes} {d.common.min}
            </span>
          </div>
        </div>
      </section>

      <article className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-5 text-[17px] leading-relaxed text-slate-700">{doc.body.map((para, i) => <p key={i}>{para}</p>)}</div>
          {l === "ar" && (
            <p className="mt-6 text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2 inline-block">{d.common.translationNote}</p>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100">
            <HelpfulWidget locale={l} labels={{ q: d.kb.helpful, thanks: d.kb.thanks }} />
          </div>

          {linkedProducts.length > 0 && (
            <div className="mt-10">
              <h2 className="font-heading font-black text-xl mb-5">{d.common.relatedProducts}</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {linkedProducts.map((p) => p && (
                  <ProductCard key={p.slug} product={p} locale={l} quoteLabel={d.common.getQuote} detailsLabel={d.common.details} />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <section className="pb-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading font-black text-2xl mb-6">{d.common.relatedArticles}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {others.map((a, i) => (
              <Reveal key={a.slug} delay={i * 60}>
                <ArticleCard article={a} locale={l} href={`/${l}/knowledge-base/${a.slug}`} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={d.home.ctaTitle} text={d.home.ctaText} button={d.home.ctaButton} href={`/${l}/get-quotation`} locale={l} />
    </>
  );
}
