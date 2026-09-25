import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { CtaBand } from "@/components/ui/Sections";
import { getDict, isLocale } from "@/lib/i18n";
import { products } from "@/lib/data/catalog";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale as Locale);
  return { title: d.faq.title, description: d.faq.intro };
}

/** Product FAQs grouped under "specs" + site-level FAQs */
const siteFaqs: Record<string, { q: { en: string; ar: string }; a: { en: string; ar: string } }[]> = {
  buying: [
    {
      q: { en: "How do I get a quotation?", ar: "كيف أحصل على عرض سعر؟" },
      a: {
        en: "Use the Get a Quotation page — describe your requirement and attach drawings or a BOQ. Our engineering team responds within one working day. You can also reach us on WhatsApp or by phone.",
        ar: "استخدم صفحة طلب عرض سعر — صِف متطلباتك وأرفق الرسومات أو جدول الكميات. يرد فريقنا خلال يوم عمل واحد. يمكنك التواصل عبر واتساب أو الهاتف أيضاً.",
      },
    },
    {
      q: { en: "Do you publish prices online?", ar: "هل تنشرون الأسعار على الإنترنت؟" },
      a: {
        en: "GRP products are configured to project requirements, so pricing is quoted per project. Share your dimensions and quantities and we will issue a firm offer.",
        ar: "تُسوَّق منتجات GRP حسب متطلبات المشروع، لذا يُسعَّر كل مشروع على حدة. أرسل الأبعاد والكميات وسنصدر عرضاً رسمياً.",
      },
    },
    {
      q: { en: "Is there a minimum order quantity?", ar: "هل هناك حد أدنى للطلب؟" },
      a: {
        en: "No MOQ for standard products — we supply single units for villas and bulk packages for towers.",
        ar: "لا حد أدنى للمنتجات القياسية — نورّد قطعة واحدة للفلل والباقات الضخمة للأبراج.",
      },
    },
  ],
  delivery: [
    {
      q: { en: "Which areas do you deliver to?", ar: "ما المناطق التي توصلون إليها؟" },
      a: {
        en: "All seven Emirates, plus export to GCC countries (Oman, Qatar, Saudi Arabia and others) on request.",
        ar: "جميع الإمارات، إضافة إلى التصدير لدول الخليج (عُمان وقطر والسعودية وغيرها) عند الطلب.",
      },
    },
    {
      q: { en: "How fast can a panel tank be installed?", ar: "ما سرعة تركيب الخزان الألواحي؟" },
      a: {
        en: "Common residential and plant-room sizes install in less than one day; larger configurations phase over a few days.",
        ar: "المقاسات السكنية وغرف المعدات الشائعة تُركَّب في أقل من يوم؛ والأكبر على مراحل خلال أيام.",
      },
    },
  ],
  after: [
    {
      q: { en: "What warranty do you offer?", ar: "ما الضمان المقدم؟" },
      a: {
        en: "Panel tanks: 24 months against manufacturing defects. Pool shells: 10 years structural. Lining workmanship: 24 months. Full terms are issued with each quotation.",
        ar: "خزانات الألواح: 24 شهراً ضد عيوب التصنيع. أجسام المسابح: 10 سنوات إنشائية. تنفيذ البطانات: 24 شهراً. الشروط الكاملة مع كل عرض سعر.",
      },
    },
    {
      q: { en: "Do you offer repair and maintenance?", ar: "هل تقدمون خدمة الإصلاح والصيانة؟" },
      a: {
        en: "Yes — our services team handles GRP repair, re-lining and planned maintenance across the UAE.",
        ar: "نعم — فريقنا ينفذ إصلاح GRP وإعادة البطانات والصيانة المجدولة في كل الإمارات.",
      },
    },
  ],
};

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);

  const productFaqs = products.flatMap((p) =>
    p.faqs.map((f) => ({ product: p, ...f }))
  );

  const groups: { title: string; items: { q: string; a: string }[] }[] = [
    {
      title: d.faq.groups.buying,
      items: siteFaqs.buying.map((x) => ({ q: t(x.q, l), a: t(x.a, l) })),
    },
    {
      title: d.faq.groups.specs,
      items: productFaqs.slice(0, 6).map((x) => ({
        q: `${t(x.q, l)} — ${t(x.product.name, l)}`,
        a: t(x.a, l),
      })),
    },
    {
      title: d.faq.groups.delivery,
      items: siteFaqs.delivery.map((x) => ({ q: t(x.q, l), a: t(x.a, l) })),
    },
    {
      title: d.faq.groups.after,
      items: siteFaqs.after.map((x) => ({ q: t(x.q, l), a: t(x.a, l) })),
    },
  ];

  return (
    <>
      <section className="bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_80%_20%,#0369a1_0,transparent_50%),radial-gradient(circle_at_10%_85%,#f59e0b_0,transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <nav className="text-sm text-slate-400 mb-4 flex items-center gap-2">
            <Link href={`/${l}`} className="hover:text-gold-400">{d.common.home}</Link>
            <span>/</span>
            <span className="text-white font-semibold">{d.nav.faq}</span>
          </nav>
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl">{d.faq.title}</h1>
          <p className="mt-3 max-w-2xl text-slate-300 text-lg">{d.faq.intro}</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          {groups.map((g) => (
            <div key={g.title}>
              <h2 className="font-heading font-black text-2xl mb-5 flex items-center gap-3">
                <span className="w-1.5 h-7 rounded-full bg-gold-500" />
                {g.title}
              </h2>
              <div className="space-y-3">
                {g.items.map((item, i) => (
                  <details
                    key={i}
                    className="group bg-white border border-slate-200 rounded-[10px] open:border-brand-600/40 open:shadow-soft"
                  >
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 font-bold text-navy-900 text-[15px]">
                      {item.q}
                      <Icon name="plus" className="w-4.5 h-4.5 text-gold-600 shrink-0 transition-transform group-open:rotate-45" />
                    </summary>
                    <p className="px-5 pb-4 text-slate-600 leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBand title={d.faq.cta} text={d.home.ctaText} button={d.nav.getQuote} href={`/${l}/get-quotation`} locale={l} />
    </>
  );
}
