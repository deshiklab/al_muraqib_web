import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ui/ArticleCard";
import { Reveal } from "@/components/ui/Motion";
import { getDict, isLocale } from "@/lib/i18n";
import { articlesByKind } from "@/lib/data/content";
import type { Locale } from "@/lib/types";
import { alternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
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

  return (
    <>
      <section className="bg-navy-950 relative overflow-hidden">
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

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 6) * 60}>
                <ArticleCard article={a} locale={l} href={`/${l}/blog/${a.slug}`} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
