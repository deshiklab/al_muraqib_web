import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogClient, { type BlogRow } from "@/components/blog/BlogClient";
import TitleBackdrop from "@/components/ui/TitleBackdrop";
import { getDict, isLocale } from "@/lib/i18n";
import { articlesByKind } from "@/lib/data/content";
import { getProduct } from "@/lib/data/catalog";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { alternates, ogImages } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return { ...ogImages("/images/backdrops/insights.jpg") };
  const l = locale as Locale;
  const d = getDict(locale as Locale);
  return { title: d.blog.title, description: d.blog.intro, alternates: alternates(l, "/en/blog") };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);
  const posts = articlesByKind("blog");

  const rows: BlogRow[] = posts.map((a) => ({
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
    ...d.blog.filters,
    filterAll: d.blog.filterAll,
  };

  return (
    <>
      <section className="bg-navy-950 relative overflow-hidden">
        <TitleBackdrop src="/images/backdrops/insights.jpg" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_75%_20%,#0284c7_0,transparent_50%),radial-gradient(circle_at_15%_85%,#f59e0b_0,transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <nav className="text-sm text-slate-400 mb-4 flex items-center gap-2">
            <Link href={`/${l}`} className="hover:text-gold-400">{d.common.home}</Link>
            <span>/</span>
            <span className="text-white font-semibold">{d.nav.blog}</span>
          </nav>
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl">{d.blog.title}</h1>
          <p className="mt-3 max-w-2xl text-slate-300 text-lg">{d.blog.intro}</p>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BlogClient rows={rows} locale={l} f={f} />
        </div>
      </section>
    </>
  );
}
