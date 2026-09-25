import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import ArticleCard from "@/components/ui/ArticleCard";
import { Reveal } from "@/components/ui/Motion";
import { getDict, isLocale } from "@/lib/i18n";
import { articlesByKind } from "@/lib/data/content";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { alternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
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

  const cats = [
    { id: "selection", icon: "ruler" as const },
    { id: "installation", icon: "tool" as const },
    { id: "standards", icon: "shield" as const },
    { id: "troubleshooting", icon: "search" as const },
  ] as const;

  return (
    <>
      <section className="bg-navy-950 relative overflow-hidden">
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

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {cats.map((c, i) => (
              <Reveal key={c.id} delay={i * 60}>
                <div className="bg-white border border-slate-200 rounded-[12px] p-5 hover:border-gold-500 hover:shadow-soft transition-all h-full">
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-navy-900 text-gold-500">
                    <Icon name={c.icon} className="w-5.5 h-5.5" />
                  </span>
                  <p className="mt-3 font-bold text-navy-900 text-sm">{d.kb.categories[c.id]}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {items.filter((a) => {
                      const catEn = a.category.en.toLowerCase();
                      if (c.id === "selection") return catEn.includes("selection");
                      if (c.id === "installation") return catEn.includes("installation");
                      if (c.id === "standards") return catEn.includes("standards");
                      return false;
                    }).length || "—"}{" "}
                    {l === "en" ? "articles" : "مقالات"}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 6) * 60}>
                <ArticleCard article={a} locale={l} href={`/${l}/knowledge-base/${a.slug}`} />
              </Reveal>
            ))}
          </div>

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
                {l === "en" ? "Browse FAQ" : "تصفح الأسئلة"}
                <Icon name="arrowRight" className="w-4 h-4 flip-x" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
