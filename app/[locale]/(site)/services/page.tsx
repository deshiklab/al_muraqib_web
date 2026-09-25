import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Motion";
import { CtaBand } from "@/components/ui/Sections";
import { getDict, isLocale } from "@/lib/i18n";
import { t } from "@/lib/utils";
import type { IconName, Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale as Locale);
  return { title: d.nav.services, description: d.meta.tagline };
}

const SERVICES: {
  id: string;
  icon: IconName;
  title: { en: string; ar: string };
  desc: { en: string; ar: string };
  bullets: { en: string[]; ar: string[] };
}[] = [
  {
    id: "lining",
    icon: "layers",
    title: { en: "GRP Lining Application", ar: "تنفيذ بطانات GRP" },
    desc: {
      en: "In-situ GRP lining for RCC water tanks, manholes, drains and sump pits — leak-proof and DM-compliant.",
      ar: "بطانة GRP في الموقع لخزانات الخرسانة والفتحات والمصارف — محكمة ومتوافقة مع بلدية دبي.",
    },
    bullets: {
      en: ["Abrasive surface preparation", "2–3 mm potable-grade laminate", "Phased works with bypass planning", "Warranty on workmanship"],
      ar: ["تحضير سطحي بالتفريغ", "جلد بسماكة 2–3 مم معتمد للشرب", "أعمال على مراحل مع تخطيط التوريد المؤقت", "ضمان على التنفيذ"],
    },
  },
  {
    id: "repair",
    icon: "tool",
    title: { en: "GRP Repair & Maintenance", ar: "إصلاح وصيانة GRP" },
    desc: {
      en: "Leak repair, panel replacement, gasket renewal and planned maintenance for existing GRP assets.",
      ar: "إصلاح التسرّب واستبدال الألواح وتجديد الحشوات والصيانة المجدولة لموجودات GRP.",
    },
    bullets: {
      en: ["Condition survey & report", "Emergency leak response", "Panel & fitting replacement", "Annual maintenance contracts"],
      ar: ["فحص حالة وتقرير", "استجابة طارئة للتسرب", "استبدال ألواح وتجهيزات", "عقود صيانة سنوية"],
    },
  },
  {
    id: "fabrication",
    icon: "flask",
    title: { en: "Custom Fabrication", ar: "تصنيع حسب الطلب" },
    desc: {
      en: "One-off GRP components — trays, enclosures, ducts, covers and special shapes from your drawings.",
      ar: "أجزاء GRP مفردة — صواني وأغلفة مجاري وأغطية وأشكال خاصة من رسوماتك.",
    },
    bullets: {
      en: ["Shop drawings for approval", "In-house mold fabrication", "Any color / gel-coat finish", "Prototype to volume production"],
      ar: ["رسومات مصنع للموافقة", "تصنيع قوالب داخلي", "أي لون وتشطيب", "من النموذج إلى الإنتاج الضخم"],
    },
  },
];

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);

  return (
    <>
      <section className="bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_85%_15%,#0369a1_0,transparent_50%),radial-gradient(circle_at_10%_90%,#f59e0b_0,transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <nav className="text-sm text-slate-400 mb-4 flex items-center gap-2">
            <Link href={`/${l}`} className="hover:text-gold-400">{d.common.home}</Link>
            <span>/</span>
            <span className="text-white font-semibold">{d.nav.services}</span>
          </nav>
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl">
            {l === "en" ? "Contracting & Services" : "المقاولات والخدمات"}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300 text-lg">
            {l === "en"
              ? "Lining, repair and custom fabrication — executed by our own crews across the UAE."
              : "البطانات والإصلاح والتصنيع المخصص — تنفيذ فرقنا الخاصة في كل الإمارات."}
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
          {SERVICES.map((svc, i) => (
            <Reveal key={svc.id} delay={i * 80}>
              <div
                id={svc.id}
                className="scroll-mt-32 grid md:grid-cols-[auto_1fr] gap-6 bg-white border border-slate-200 rounded-[14px] p-6 md:p-8 hover:shadow-soft transition-shadow"
              >
                <span className="grid place-items-center w-16 h-16 rounded-2xl bg-navy-900 text-gold-500 md:shrink-0">
                  <Icon name={svc.icon} className="w-8 h-8" strokeWidth={1.5} />
                </span>
                <div>
                  <h2 className="font-heading font-black text-2xl md:text-3xl">{t(svc.title, l)}</h2>
                  <p className="mt-2 text-slate-600 leading-relaxed text-[17px] max-w-3xl">{t(svc.desc, l)}</p>
                  <ul className="mt-4 grid sm:grid-cols-2 gap-2.5">
                    {svc.bullets[l].map((b: string) => (
                      <li key={b} className="flex items-start gap-2 text-sm font-semibold text-navy-900">
                        <Icon name="checkCircle" className="w-4.5 h-4.5 text-brand-700 mt-0.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/${l}/get-quotation?source=service-${svc.id}`}
                    className="mt-5 inline-flex items-center gap-2 bg-gold-500 text-navy-950 font-bold text-sm px-6 py-3 rounded-[10px] hover:bg-gold-600 hover:text-white transition-colors"
                  >
                    <Icon name="file" className="w-4 h-4" />
                    {d.common.requestQuote}
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand title={d.home.ctaTitle} text={d.home.ctaText} button={d.home.ctaButton} href={`/${l}/get-quotation`} locale={l} />
    </>
  );
}
