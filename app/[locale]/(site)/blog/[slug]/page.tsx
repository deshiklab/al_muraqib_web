import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import ArticleCard from "@/components/ui/ArticleCard";
import TitleBackdrop from "@/components/ui/TitleBackdrop";
import JsonLd, { absUrl } from "@/components/seo/JsonLd";
import BreadcrumbJsonLd from "@/components/seo/Breadcrumbs";
import ProductCard from "@/components/products/ProductCard";
import ShareButton from "@/components/projects/ShareButton";
import ReadingProgress from "@/components/blog/ReadingProgress";
import { Reveal } from "@/components/ui/Motion";
import { CtaBand } from "@/components/ui/Sections";
import { getDict, isLocale } from "@/lib/i18n";
import { articles, articlesByKind } from "@/lib/data/content";
import { getProduct } from "@/lib/data/catalog";
import { site } from "@/lib/data/site";
import { t, tl } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { alternates, ogImages } from "@/lib/seo";

export function generateStaticParams() {
  return articles.filter((a) => a.kind === "blog").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const l = locale as Locale;
  const post = articles.find((a) => a.slug === slug && a.kind === "blog");
  if (!post) return {};
  return {
          ...ogImages(post.image ?? "/images/backdrops/insights.jpg"),
    title: t(post.title, l),
    description: t(post.excerpt, l),
    alternates: alternates(l, `/en/blog/${slug}`),
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);
  const post = articles.find((a) => a.slug === slug && a.kind === "blog");
  if (!post) notFound();

  const date = new Date(post.date).toLocaleDateString(l === "ar" ? "ar-AE" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const list = articlesByKind("blog");
  const idx = list.findIndex((a) => a.slug === post.slug);
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
  const related = list.filter((a) => a.slug !== post.slug).slice(0, 3);
  const linkedProducts = post.relatedProducts.map(getProduct).filter(Boolean).slice(0, 4);
  const waText = encodeURIComponent(`${d.chat.whatsappMsg} — ${t(post.title, l)} (${site.url}/${l}/blog/${post.slug})`);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="bg-navy-950 relative overflow-hidden">
        <TitleBackdrop src={post.image ?? "/images/backdrops/insights.jpg"} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <nav className="text-sm text-slate-400 mb-5 flex flex-wrap items-center gap-2">
            <Link href={`/${l}`} className="hover:text-gold-400">{d.common.home}</Link>
            <span>/</span>
            <Link href={`/${l}/blog`} className="hover:text-gold-400">{d.nav.blog}</Link>
            <span>/</span>
            <span className="text-white/80 line-clamp-1">{t(post.title, l)}</span>
          </nav>
          <div className="max-w-3xl">
            <span className="inline-flex text-[11px] font-black uppercase tracking-[0.18em] text-gold-500 bg-gold-500/10 ring-1 ring-gold-500/30 rounded-full px-3.5 py-1.5">
              {t(post.category, l)}
            </span>
            <h1 className="mt-4 font-heading font-black text-white text-3xl md:text-5xl leading-tight">{t(post.title, l)}</h1>
            <p className="mt-4 text-slate-300 text-lg leading-relaxed">{t(post.excerpt, l)}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-400">
              <time className="flex items-center gap-1.5">
                <Icon name="pin" className="w-4 h-4 text-gold-500" />
                {date}
              </time>
              <span className="flex items-center gap-1.5">
                <Icon name="clock" className="w-4 h-4 text-gold-500" /> {post.readingMinutes} {d.common.min}
              </span>
              <span className="h-5 w-px bg-white/15" aria-hidden />
              <ShareButton locale={l} label={tl(l, "Copy link", "نسخ الرابط")} copiedLabel={tl(l, "Copied ✓", "تم النسخ ✓")} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Body: rails + article ---------- */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[minmax(0,1fr)] xl:grid-cols-[210px_minmax(0,680px)_300px] gap-10 xl:gap-12 items-start">
          {/* Left rail */}
          <aside className="hidden xl:block sticky top-28 space-y-5" aria-label={tl(l, "Article info", "معلومات المقال")}>
            <ReadingProgress targetId="blog-article" labelText={tl(l, "Reading progress", "تقدم القراءة")} />
            <div className="rounded-[12px] border border-slate-200 bg-slate-50 p-4 space-y-2.5 text-sm">
              <p className="font-heading font-black text-navy-900 text-xs uppercase tracking-wider">{tl(l, "In this guide", "في هذا الدليل")}</p>
              <p className="flex items-center justify-between gap-2 text-slate-600">
                <span>{tl(l, "Category", "التصنيف")}</span>
                <span className="font-bold text-navy-900">{t(post.category, l)}</span>
              </p>
              <p className="flex items-center justify-between gap-2 text-slate-600">
                <span>{tl(l, "Published", "تاريخ النشر")}</span>
                <span className="font-bold text-navy-900">{post.date}</span>
              </p>
              <p className="flex items-center justify-between gap-2 text-slate-600">
                <span>{tl(l, "Read time", "وقت القراءة")}</span>
                <span className="font-bold text-navy-900">{post.readingMinutes} {d.common.min}</span>
              </p>
              <Link href={`/${l}/blog`} className="mt-3.5 flex items-center gap-1.5 font-bold text-brand-700 hover:gap-2.5 transition-all text-xs">
                <Icon name="arrowRight" className="w-3.5 h-3.5 rotate-180 rtl:rotate-0" />
                {tl(l, "All articles", "كل المقالات")}
              </Link>
            </div>
            {linkedProducts.length > 0 && (
              <nav className="rounded-[12px] border border-slate-200 p-4 space-y-2.5 text-sm" aria-label={tl(l, "Jump to products", "انتقل إلى المنتجات")}>
                <p className="font-heading font-black text-navy-900 text-xs uppercase tracking-wider">{d.common.relatedProducts}</p>
                {linkedProducts.map((p) => p && (
                  <a key={p.slug} href="#related-products" className="flex items-center gap-2 text-slate-600 hover:text-brand-700 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" aria-hidden />
                    <span className="line-clamp-1 font-semibold">{t(p.name, l)}</span>
                  </a>
                ))}
              </nav>
            )}
          </aside>

          {/* Article */}
          <article id="blog-article" className="min-w-0 space-y-5 text-[17px] leading-[1.85] text-slate-700">
            {post.body.map((para, i) =>
              i === 0 ? (
                <p key={i} className="text-lg md:text-xl font-semibold text-navy-900 leading-relaxed border-s-4 border-gold-500 ps-4">
                  {para}
                </p>
              ) : (
                <p key={i}>{para}</p>
              )
            )}
            {l === "ar" && (
              <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 inline-block">{d.common.translationNote}</p>
            )}

            {/* Prev / next */}
            <nav className="mt-12 grid sm:grid-cols-2 gap-4" aria-label={tl(l, "More articles", "مقالات أخرى")}>
              {prev ? (
                <Link href={`/${l}/blog/${prev.slug}`} className="group rounded-[12px] border border-slate-200 p-4 hover:border-brand-700 hover:shadow-soft transition-all">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Icon name="arrowRight" className="w-3 h-3 rotate-180 rtl:rotate-0" /> {tl(l, "Previous", "السابق")}
                  </span>
                  <span className="mt-1.5 block font-heading font-bold text-navy-900 group-hover:text-brand-700 transition-colors line-clamp-2">{t(prev.title, l)}</span>
                </Link>
              ) : <span className="hidden sm:block" />}
              {next && (
                <Link href={`/${l}/blog/${next.slug}`} className="group rounded-[12px] border border-slate-200 p-4 hover:border-brand-700 hover:shadow-soft transition-all sm:text-end">
                  <span className={`text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 ${l === "ar" ? "" : "sm:justify-end"}`}>
                    {tl(l, "Next", "التالي")} <Icon name="arrowRight" className="w-3 h-3" />
                  </span>
                  <span className="mt-1.5 block font-heading font-bold text-navy-900 group-hover:text-brand-700 transition-colors line-clamp-2">{t(next.title, l)}</span>
                </Link>
              )}
            </nav>
          </article>

          {/* Right rail */}
          <aside className="hidden xl:block sticky top-28 space-y-6" aria-label={tl(l, "Explore", "استكشف")}>
            <div className="rounded-[14px] bg-navy-900 text-white p-6 relative overflow-hidden">
              <span className="absolute -end-8 -bottom-8 w-32 h-32 rounded-full bg-gold-500/10" aria-hidden />
              <Icon name="chat" className="w-8 h-8 text-gold-400" />
              <h3 className="mt-3 font-heading font-black text-lg leading-snug relative">{tl(l, "Questions about this topic?", "أسئلة حول هذا الموضوع؟")}</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed relative">
                {tl(l, "Our engineers spec these systems daily — send the line and you’ll get a configured answer.", "مهندسونا يجهّزون هذه الأنظمة يوميًا — أرسل التفاصيل وستحصل على رد مُجهّز.")}
              </p>
              <Link href={`/${l}/get-quotation?source=blog-${post.slug}`} className="relative mt-4 flex items-center justify-center gap-2 bg-gold-500 text-navy-950 font-black text-sm rounded-[10px] px-4 py-2.5 hover:bg-gold-400 transition-colors">
                {d.nav.getQuote}
                <Icon name="arrowRight" className="w-4 h-4 flip-x" />
              </Link>
              <a href={`https://wa.me/${site.phoneIntl.replace(/[^\d]/g, "")}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="relative mt-2.5 flex items-center justify-center gap-2 border border-white/20 text-white font-bold text-sm rounded-[10px] px-4 py-2.5 hover:border-[#25D366] hover:text-[#25D366] transition-colors">
                <Icon name="whatsapp" className="w-4 h-4" />
                {tl(l, "Continue on WhatsApp", "تابع على واتساب")}
              </a>
            </div>
            <div className="rounded-[12px] border border-slate-200 p-5">
              <p className="font-heading font-black text-navy-900 text-xs uppercase tracking-wider">{tl(l, "Keep reading", "واصل القراءة")}</p>
              <div className="mt-3 space-y-4">
                {related.map((a) => (
                  <Link key={a.slug} href={`/${l}/blog/${a.slug}`} className="group flex gap-3 items-start">
                    <span className="w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br from-navy-800 to-brand-700 grid place-items-center text-gold-400 group-hover:from-brand-700 transition-colors">
                      <Icon name="chat" className="w-4 h-4" />
                    </span>
                    <span>
                      <span className="block text-[13px] font-bold text-navy-900 leading-snug line-clamp-2 group-hover:text-brand-700 transition-colors">{t(a.title, l)}</span>
                      <span className="mt-0.5 block text-[11px] text-slate-400">{a.readingMinutes} {d.common.min}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------- Related products — big, 2 per row ---------- */}
      {linkedProducts.length > 0 && (
        <section id="related-products" className="scroll-mt-28 py-4 pb-14 bg-slate-50 border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-7">
              <span className="w-1.5 h-7 rounded-full bg-gold-500" aria-hidden />
              <h2 className="font-heading font-black text-2xl text-navy-900">{d.common.relatedProducts}</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
              {linkedProducts.map((p, i) => p && (
                <Reveal key={p.slug} delay={i * 70}>
                  <ProductCard product={p} locale={l} quoteLabel={d.common.getQuote} detailsLabel={d.common.details} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- More from the blog ---------- */}
      <section className="pb-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-7">
            <span className="w-1.5 h-7 rounded-full bg-gold-500" aria-hidden />
            <h2 className="font-heading font-black text-2xl text-navy-900">{d.blog.relatedPosts}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((a, i) => (
              <Reveal key={a.slug} delay={i * 60}>
                <ArticleCard article={a} locale={l} href={`/${l}/blog/${a.slug}`} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={d.home.ctaTitle} text={d.home.ctaText} button={d.home.ctaButton} href={`/${l}/get-quotation`} locale={l} />
          <BreadcrumbJsonLd
            locale={l}
            items={[
              { name: d.nav.blog, path: `/${l}/blog` },
              { name: t(post.title, l) },
            ]}
          />
          <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: t(post.title, l),
            description: t(post.excerpt, l),
            datePublished: post.date,
            image: absUrl(post.image ?? "/images/backdrops/insights.jpg"),
            inLanguage: l,
            author: { "@id": "https://almuraqib.ae/#organization" },
            publisher: { "@id": "https://almuraqib.ae/#organization" },
            mainEntityOfPage: absUrl(`/${l}/blog/${post.slug}`),
          }}
        />
  </>
  );
}
