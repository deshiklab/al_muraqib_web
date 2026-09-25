import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Motion";
import { CtaBand } from "@/components/ui/Sections";
import { getDict, isLocale } from "@/lib/i18n";
import { certifications } from "@/lib/data/site";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale as Locale);
  return { title: d.certifications.title, description: d.certifications.intro };
}

export default async function CertificationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);

  return (
    <>
      <section className="bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_80%_15%,#f59e0b_0,transparent_45%),radial-gradient(circle_at_15%_90%,#0369a1_0,transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <nav className="text-sm text-slate-400 mb-4 flex items-center gap-2">
            <Link href={`/${l}`} className="hover:text-gold-400">{d.common.home}</Link>
            <span>/</span>
            <Link href={`/${l}/company/about`} className="hover:text-gold-400">{d.nav.company}</Link>
            <span>/</span>
            <span className="text-white font-semibold">{d.nav.certifications}</span>
          </nav>
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl">{d.certifications.title}</h1>
          <p className="mt-3 max-w-2xl text-slate-300 text-lg">{d.certifications.intro}</p>
        </div>
      </section>

      <section className="py-14 md:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 gap-6">
          {certifications.map((c, i) => (
            <Reveal key={c.code} delay={i * 70}>
              <div className="h-full bg-white border border-slate-200 rounded-[14px] p-6 md:p-7 hover:shadow-soft transition-shadow">
                <span className="grid place-items-center w-14 h-14 rounded-2xl bg-navy-900 text-gold-500">
                  <Icon name="award" className="w-7 h-7" strokeWidth={1.5} />
                </span>
                <h2 className="mt-4 font-heading font-black text-xl text-navy-900">{t(c.title, l)}</h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-slate-400 font-semibold min-w-24">{d.certifications.issuer}:</dt>
                    <dd className="text-navy-900 font-medium">{t(c.issuer, l)}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-slate-400 font-semibold min-w-24">{d.certifications.validity}:</dt>
                    <dd className="text-navy-900 font-medium">{t(c.validity, l)}</dd>
                  </div>
                </dl>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-green-50 text-green-700 ring-1 ring-green-200 rounded-full px-3 py-1.5">
                    <Icon name="checkCircle" className="w-3.5 h-3.5" />
                    {l === "en" ? "Valid" : "سارية"}
                  </span>
                  <Link
                    href={`/${l}/get-quotation?source=certificate-${c.code}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 ring-1 ring-slate-200 rounded-full px-3 py-1.5 hover:ring-brand-600 transition-colors"
                  >
                    <Icon name="download" className="w-3.5 h-3.5" />
                    {l === "en" ? "Request copy" : "طلب نسخة"}
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mx-auto max-w-3xl mt-12 bg-navy-900 rounded-[14px] p-7 text-center">
            <Icon name="shield" className="w-9 h-9 mx-auto text-gold-500" />
            <h2 className="mt-3 font-heading font-black text-white text-xl">
              {l === "en" ? "Tender & authority submission packs" : "حزم المناقصات والجهات الرسمية"}
            </h2>
            <p className="mt-2 text-slate-300 text-sm max-w-xl mx-auto">
              {l === "en"
                ? "Certificates, test reports and material approvals ship with every formal quotation — mention it in your RFQ."
                : "الشهادات وتقارير الاختبار وموافقات المواد تُرفق مع كل عرض سعر رسمي — اذكر ذلك في طلبك."}
            </p>
            <Link
              href={`/${l}/get-quotation`}
              className="mt-5 inline-flex items-center gap-2 bg-gold-500 text-navy-950 font-bold px-6 py-3 rounded-[10px] hover:bg-gold-600 hover:text-white transition-colors"
            >
              <Icon name="file" className="w-4.5 h-4.5" />
              {d.nav.getQuote}
            </Link>
          </div>
        </Reveal>
      </section>

      <CtaBand title={d.home.ctaTitle} text={d.home.ctaText} button={d.home.ctaButton} href={`/${l}/get-quotation`} locale={l} />
    </>
  );
}
