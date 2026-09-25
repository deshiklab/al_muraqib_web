import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import ContactForm from "@/components/rfq/ContactForm";
import { getDict, isLocale } from "@/lib/i18n";
import { site } from "@/lib/data/site";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { alternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const l = locale as Locale;
  const d = getDict(locale as Locale);
  return { title: d.contact.title, description: d.contact.intro, alternates: alternates(l, "/en/contact") };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const d = getDict(l);

  const mapSrc = `https://www.google.com/maps?q=${site.coords.lat},${site.coords.lng}&z=14&output=embed`;

  return (
    <>
      <section className="bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_85%_20%,#0369a1_0,transparent_50%),radial-gradient(circle_at_10%_85%,#f59e0b_0,transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <nav className="text-sm text-slate-400 mb-4 flex items-center gap-2">
            <Link href={`/${l}`} className="hover:text-gold-400">{d.common.home}</Link>
            <span>/</span>
            <span className="text-white font-semibold">{d.nav.contact}</span>
          </nav>
          <h1 className="font-heading font-black text-white text-4xl md:text-5xl">{d.contact.title}</h1>
          <p className="mt-3 max-w-2xl text-slate-300 text-lg">{d.contact.intro}</p>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_1.1fr] gap-10">
          {/* Details */}
          <div className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-[12px] p-6">
              <h2 className="font-heading font-black text-xl mb-4 flex items-center gap-2.5">
                <span className="w-1.5 h-6 rounded-full bg-gold-500" />
                {l === "en" ? "Reach us" : "تواصل معنا"}
              </h2>
              <div className="space-y-4">
                <a href={`mailto:${site.emails.sales}`} className="flex items-start gap-3.5 group">
                  <span className="grid place-items-center w-10 h-10 rounded-lg bg-brand-700/10 text-brand-700 group-hover:bg-brand-700 group-hover:text-white transition-colors">
                    <Icon name="mail" className="w-5 h-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">{d.contact.emailUs}</span>
                    <span className="block font-bold text-navy-900 group-hover:text-brand-700" dir="ltr">{site.emails.sales}</span>
                  </span>
                </a>
                <a href={`tel:${site.phoneIntl}`} className="flex items-start gap-3.5 group">
                  <span className="grid place-items-center w-10 h-10 rounded-lg bg-brand-700/10 text-brand-700 group-hover:bg-brand-700 group-hover:text-white transition-colors">
                    <Icon name="phone" className="w-5 h-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">{d.contact.callUs}</span>
                    <span className="block font-bold text-navy-900 group-hover:text-brand-700" dir="ltr">{site.phone}</span>
                  </span>
                </a>
                <div className="flex items-start gap-3.5">
                  <span className="grid place-items-center w-10 h-10 rounded-lg bg-brand-700/10 text-brand-700">
                    <Icon name="pin" className="w-5 h-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">{d.contact.visit}</span>
                    <span className="block font-bold text-navy-900 leading-relaxed">{t(site.address, l)}</span>
                  </span>
                </div>
                <div className="flex items-start gap-3.5">
                  <span className="grid place-items-center w-10 h-10 rounded-lg bg-brand-700/10 text-brand-700">
                    <Icon name="clock" className="w-5 h-5" />
                  </span>
                  <span className="font-semibold text-navy-900">{d.contact.hours}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[12px] overflow-hidden border border-slate-200 bg-slate-100">
              <iframe
                title="Al Muraqib location map"
                src={mapSrc}
                className="w-full h-[300px] grayscale-[0.2]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-slate-200 rounded-[14px] p-6 md:p-8 shadow-soft">
            <h2 className="font-heading font-black text-2xl mb-1">{d.contact.formTitle}</h2>
            <p className="text-sm text-slate-500 mb-6">
              {l === "en" ? "For quotations use our dedicated RFQ page for faster turnaround." : "لعروض الأسعار استخدم صفحة طلب عرض السعر للحصول على رد أسرع."}
            </p>
            <ContactForm locale={l} d={d} />
            <Link
              href={`/${l}/get-quotation`}
              className="mt-5 flex items-center justify-center gap-2 w-full bg-gold-500 text-navy-950 font-bold py-3.5 rounded-[10px] hover:bg-gold-600 hover:text-white transition-colors"
            >
              <Icon name="file" className="w-5 h-5" />
              {d.nav.getQuote}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
