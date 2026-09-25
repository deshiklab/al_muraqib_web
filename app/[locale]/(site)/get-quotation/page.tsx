import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import RfqWizard from "@/components/rfq/RfqWizard";
import { getDict, isLocale } from "@/lib/i18n";
import { site } from "@/lib/data/site";
import { products } from "@/lib/data/catalog";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale as Locale);
  return { title: d.rfq.title, description: d.rfq.subtitle };
}

export default async function QuotationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);
  const sp = await searchParams;

  const rawProduct = typeof sp.product === "string" ? sp.product : "";
  const initialProducts = rawProduct
    .split(",")
    .map((s) => s.trim())
    .filter((slug) => products.some((p) => p.slug === slug));
  const source = typeof sp.source === "string" ? sp.source : undefined;
  const variant = typeof sp.variant === "string" ? sp.variant : undefined;

  const trust = [
    { icon: "clock" as const, text: l === "en" ? "Response within 1 working day" : "الرد خلال يوم عمل واحد" },
    { icon: "shield" as const, text: l === "en" ? "NDA available for tender documents" : "إمكانية توقيع اتفاقية سرية لوثائق المناقصات" },
    { icon: "file" as const, text: l === "en" ? "Drawings & BOQ kept confidential" : "الرسومات وجدول الكميات تُحفظ بسرية" },
  ];

  return (
    <>
      <section className="bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_80%_10%,#f59e0b_0,transparent_45%),radial-gradient(circle_at_15%_90%,#0369a1_0,transparent_50%)]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14 md:py-16 text-center">
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-500 bg-gold-500/10 ring-1 ring-gold-500/30 rounded-full px-4 py-2">
            <Icon name="file" className="w-4 h-4" />
            {l === "en" ? "Request for Quotation" : "طلب عرض سعر"}
          </p>
          <h1 className="mt-5 font-heading font-black text-white text-4xl md:text-5xl">{d.rfq.title}</h1>
          <p className="mt-4 text-slate-300 text-lg max-w-2xl mx-auto">{d.rfq.subtitle}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {trust.map((x) => (
              <span key={x.text} className="inline-flex items-center gap-1.5 text-sm text-slate-400">
                <Icon name={x.icon} className="w-4 h-4 text-gold-500" />
                {x.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {initialProducts.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-slate-500 font-semibold">
                {l === "en" ? "Requesting quote for:" : "طلب سعر لـ:"}
              </span>
              {initialProducts.map((slug) => (
                <span key={slug} className="inline-flex items-center gap-1.5 bg-brand-700 text-white font-bold rounded-full px-3.5 py-1.5 text-xs">
                  <Icon name="check" className="w-3.5 h-3.5" />
                  {t(products.find((p) => p.slug === slug)?.name ?? { en: slug, ar: slug }, l)}
                </span>
              ))}
              {variant && (
                <span className="inline-flex items-center gap-1.5 bg-navy-900 text-gold-400 font-bold rounded-full px-3.5 py-1.5 text-xs" dir="ltr">
                  <Icon name="ruler" className="w-3.5 h-3.5" />
                  {variant}
                </span>
              )}
            </div>
          )}

          <RfqWizard locale={l} d={d} initialProducts={initialProducts} source={source} />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
            <a href={`tel:${site.phoneIntl}`} className="flex items-center gap-2 hover:text-brand-700 font-semibold">
              <Icon name="phone" className="w-4 h-4 text-brand-700" /> {site.phone}
            </a>
            <a href={`mailto:${site.emails.sales}`} className="flex items-center gap-2 hover:text-brand-700 font-semibold">
              <Icon name="mail" className="w-4 h-4 text-brand-700" /> {site.emails.sales}
            </a>
            <span className="flex items-center gap-2">
              <Icon name="clock" className="w-4 h-4 text-brand-700" />
              {l === "en" ? "Mon–Sat · 8:00–18:00 GST" : "الاثنين–السبت · 8:00–18:00"}
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
