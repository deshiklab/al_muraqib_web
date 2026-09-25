import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import ProductArt from "@/components/ui/ProductArt";
import ProductCard from "@/components/products/ProductCard";
import ArticleCard from "@/components/ui/ArticleCard";
import { Reveal } from "@/components/ui/Motion";
import { SectionHeading, CtaBand } from "@/components/ui/Sections";
import ProductHero from "@/components/product/ProductHero";
import AnchorNav from "@/components/product/AnchorNav";
import MobileCtaBar from "@/components/layout/MobileCtaBar";
import { getDict, isLocale } from "@/lib/i18n";
import { getProduct, products, relatedInGroup } from "@/lib/data/catalog";
import { articlesByKind, projects } from "@/lib/data/content";
import { productGroups, applications } from "@/lib/data/nav";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = getProduct(slug);
  if (!product) return {};
  const l = locale as Locale;
  return {
    title: `${t(product.name, l)}`,
    description: t(product.pitch, l),
    alternates: { canonical: `/en/products/${slug}` },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);
  const product = getProduct(slug);
  if (!product) notFound();

  const group = productGroups.find((g) => g.slug === product.group);
  const siblings = relatedInGroup(product, 4);
  const boughtWith = product.boughtWith.map(getProduct).filter(Boolean).slice(0, 4);
  const relatedArticles = articlesByKind("blog")
    .concat(articlesByKind("kb"))
    .filter((a) => a.relatedProducts.includes(product.slug))
    .slice(0, 3);
  const usedInProjects = projects.filter((p) => p.products.includes(product.slug)).slice(0, 3);
  const others = products.filter((p) => p.slug !== product.slug && p.group !== product.group).slice(0, 4);

  const anchors = [
    { id: "description", label: d.product.description },
    { id: "features", label: d.product.keyFeatures },
    { id: "specifications", label: d.product.specifications },
    { id: "applications", label: d.product.applications },
    { id: "attributes", label: d.product.attributes },
    { id: "faq", label: d.product.faq },
    { id: "related", label: d.common.relatedProducts },
  ];

  return (
    <>
      {/* Breadcrumb header */}
      <section className="bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <nav className="text-sm text-slate-400 mb-5 flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
            <Link href={`/${l}`} className="hover:text-gold-400">{d.common.home}</Link>
            <span>/</span>
            <Link href={`/${l}/products`} className="hover:text-gold-400">{d.nav.products}</Link>
            <span>/</span>
            <Link href={`/${l}/products?group=${product.group}`} className="hover:text-gold-400">
              {t(group?.name ?? { en: "", ar: "" }, l)}
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">{t(product.name, l)}</span>
          </nav>

          <ProductHero product={product} locale={l} d={d} />
        </div>
      </section>

      {/* Anchor tabs + sections */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <AnchorNav items={anchors} />

          <div className="max-w-4xl pt-10 space-y-14">
            {/* Description */}
            <article id="description" className="scroll-mt-40">
              <h2 className="font-heading font-black text-2xl md:text-3xl mb-5 flex items-center gap-3">
                <span className="w-1.5 h-7 rounded-full bg-gold-500" />
                {d.product.description}
              </h2>
              <div className="prose-alma space-y-4 text-slate-600 leading-relaxed text-[17px]">
                {product.description.map((para, i) => (
                  <p key={i} className={i === 0 && l === "ar" && para === product.description[0] ? "" : ""}>
                    {t(para, l)}
                  </p>
                ))}
              </div>
              {l === "ar" && (
                <p className="mt-3 text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2 inline-block">
                  {d.common.translationNote}
                </p>
              )}
            </article>

            {/* Key features */}
            <section id="features" className="scroll-mt-40">
              <h2 className="font-heading font-black text-2xl md:text-3xl mb-5 flex items-center gap-3">
                <span className="w-1.5 h-7 rounded-full bg-gold-500" />
                {d.product.keyFeatures}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {product.keyFeatures.map((f, i) => (
                  <Reveal key={i} delay={i * 50}>
                    <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-[10px] p-4 h-full">
                      <span className="grid place-items-center w-6 h-6 rounded-full bg-brand-700 text-white shrink-0 mt-0.5">
                        <Icon name="check" className="w-3.5 h-3.5" strokeWidth={3} />
                      </span>
                      <span className="text-sm font-semibold text-navy-900 leading-relaxed">{t(f, l)}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* Specifications */}
            <section id="specifications" className="scroll-mt-40">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h2 className="font-heading font-black text-2xl md:text-3xl flex items-center gap-3">
                  <span className="w-1.5 h-7 rounded-full bg-gold-500" />
                  {d.product.specifications}
                </h2>
                <Link
                  href={`/${l}/get-quotation?product=${product.slug}&source=spec-sheet`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-gold-600 border border-slate-200 rounded-[10px] px-4 py-2 hover:border-gold-500 transition-colors"
                >
                  <Icon name="download" className="w-4 h-4" />
                  {d.common.downloadSpec}
                </Link>
              </div>
              <div className="space-y-5">
                {product.specGroups.map((sg) => (
                  <div key={sg.name.en} className="border border-slate-200 rounded-[12px] overflow-hidden">
                    <p className="bg-navy-900 text-white text-sm font-bold uppercase tracking-wider px-5 py-3">
                      {t(sg.name, l)}
                    </p>
                    <table className="w-full text-sm">
                      <tbody>
                        {sg.rows.map((row, i) => (
                          <tr key={i} className={i % 2 ? "bg-slate-50" : "bg-white"}>
                            <th scope="row" className="text-start font-semibold text-slate-500 px-5 py-3 w-2/5 align-top">
                              {t(row.key, l)}
                            </th>
                            <td className="text-navy-900 font-medium px-5 py-3">{t(row.value, l)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </section>

            {/* Applications */}
            <section id="applications" className="scroll-mt-40">
              <h2 className="font-heading font-black text-2xl md:text-3xl mb-5 flex items-center gap-3">
                <span className="w-1.5 h-7 rounded-full bg-gold-500" />
                {d.product.applications}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {product.applications.map((slug, i) => {
                  const app = applications.find((a) => a.slug === slug);
                  if (!app) return null;
                  return (
                    <Reveal key={slug} delay={i * 50}>
                      <div className="flex flex-col items-center gap-2.5 bg-white border border-slate-200 rounded-[12px] p-4 text-center h-full hover:border-gold-500 transition-colors">
                        <span className="grid place-items-center w-11 h-11 rounded-xl bg-navy-900 text-gold-500">
                          <Icon name={app.icon} className="w-5.5 h-5.5" />
                        </span>
                        <span className="text-xs font-bold text-navy-900 leading-snug">{t(app.name, l)}</span>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </section>

            {/* Attributes */}
            <section id="attributes" className="scroll-mt-40">
              <h2 className="font-heading font-black text-2xl md:text-3xl mb-5 flex items-center gap-3">
                <span className="w-1.5 h-7 rounded-full bg-gold-500" />
                {d.product.attributes}
              </h2>
              <dl className="border border-slate-200 rounded-[12px] divide-y divide-slate-100">
                {product.attributes.map((attr, i) => (
                  <div key={i} className="flex text-sm">
                    <dt className="w-2/5 bg-slate-50 font-semibold text-slate-500 px-5 py-3.5">{t(attr.key, l)}</dt>
                    <dd className="text-navy-900 font-medium px-5 py-3.5">{t(attr.value, l)}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* FAQ */}
            {product.faqs.length > 0 && (
              <section id="faq" className="scroll-mt-40">
                <h2 className="font-heading font-black text-2xl md:text-3xl mb-5 flex items-center gap-3">
                  <span className="w-1.5 h-7 rounded-full bg-gold-500" />
                  {d.product.faq}
                </h2>
                <div className="space-y-3">
                  {product.faqs.map((f, i) => (
                    <details key={i} className="group bg-slate-50 border border-slate-100 rounded-[10px] open:bg-white open:border-brand-600/30">
                      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 font-bold text-navy-900 text-[15px]">
                        {t(f.q, l)}
                        <Icon name="plus" className="w-4.5 h-4.5 text-gold-600 shrink-0 transition-transform group-open:rotate-45" />
                      </summary>
                      <p className="px-5 pb-4 text-slate-600 leading-relaxed text-[15px]">{t(f.a, l)}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>

      {/* Group tabs — siblings */}
      {siblings.length > 0 && (
        <section className="bg-slate-50 py-16 border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow={t(group?.name ?? { en: "", ar: "" }, l)}
              title={l === "en" ? "More in this product group" : "المزيد في هذه المجموعة"}
              subtitle={l === "en" ? "Similar products you can compare and quote together" : "منتجات مشابهة يمكنك مقارنتها وطلب سعرها معاً"}
            />
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {siblings.map((sib, i) => (
                <Reveal key={sib.slug} delay={i * 60}>
                  <ProductCard product={sib} locale={l} quoteLabel={d.common.getQuote} detailsLabel={d.common.details} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bought with / you may also like */}
      <section id="related" className="py-16 scroll-mt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {boughtWith.length > 0 && (
            <>
              <SectionHeading title={d.common.specifiedTogether} subtitle={l === "en" ? "Frequently quoted alongside this product" : "يُطلب عادةً مع هذا المنتج"} />
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {boughtWith.map((bp, i) => bp && (
                  <Reveal key={bp.slug} delay={i * 60}>
                    <ProductCard product={bp} locale={l} quoteLabel={d.common.getQuote} detailsLabel={d.common.details} />
                  </Reveal>
                ))}
              </div>
              <Reveal className="mt-6">
                <Link
                  href={`/${l}/get-quotation?product=${[product.slug, ...product.boughtWith].join(",")}`}
                  className="inline-flex items-center gap-2 bg-navy-900 text-white font-bold px-6 py-3 rounded-[10px] hover:bg-brand-700 transition-colors"
                >
                  <Icon name="file" className="w-4.5 h-4.5" />
                  {d.common.quoteAllTogether}
                </Link>
              </Reveal>
            </>
          )}

          <div className="mt-14">
            <SectionHeading title={d.common.youMayAlsoLike} />
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {others.map((o, i) => (
                <Reveal key={o.slug} delay={i * 60}>
                  <ProductCard product={o} locale={l} quoteLabel={d.common.getQuote} detailsLabel={d.common.details} />
                </Reveal>
              ))}
            </div>
          </div>

          {/* Projects using this product */}
          {usedInProjects.length > 0 && (
            <div className="mt-14">
              <SectionHeading title={d.product.projectsUsing} />
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {usedInProjects.map((proj, i) => (
                  <Reveal key={proj.slug} delay={i * 60}>
                    <Link href={`/${l}/projects/${proj.slug}`} className="group block bg-white border border-slate-200 rounded-[12px] overflow-hidden hover:shadow-soft transition-all h-full">
                      <ProductArt seed={proj.slug} icon="building" kind="installed" label={t(proj.location, l)} className="aspect-[16/9] w-full" />
                      <div className="p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-700">{proj.year} · {t(proj.location, l)}</p>
                        <h3 className="mt-1.5 font-heading font-bold text-navy-900 group-hover:text-brand-700 transition-colors">{t(proj.title, l)}</h3>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-14">
              <SectionHeading title={d.common.relatedArticles} />
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((a, i) => (
                  <Reveal key={a.slug} delay={i * 60}>
                    <ArticleCard article={a} locale={l} href={`/${l}/${a.kind === "blog" ? "blog" : "knowledge-base"}/${a.slug}`} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title={d.product.notListed}
        text={d.home.ctaText}
        button={d.nav.getQuote}
        href={`/${l}/get-quotation?product=${product.slug}`}
        locale={l}
      />

      <MobileCtaBar locale={l} d={d} />
    </>
  );
}
