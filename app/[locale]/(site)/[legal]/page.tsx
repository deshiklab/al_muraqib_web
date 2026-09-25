import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const PAGES = ["privacy-policy", "terms"] as const;
type LegalSlug = (typeof PAGES)[number];

export function generateStaticParams() {
  return PAGES.map((legal) => ({ legal }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; legal: string }>;
}): Promise<Metadata> {
  const { locale, legal } = await params;
  if (!isLocale(locale) || !PAGES.includes(legal as LegalSlug)) return {};
  const d = getDict(locale as Locale);
  return { title: legal === "privacy-policy" ? d.footer.privacy : d.footer.terms };
}

const copy: Record<LegalSlug, { en: string[]; ar: string[] }> = {
  "privacy-policy": {
    en: [
      "Al Muraqib Fiber Glass Industry L.L.C respects your privacy. Information submitted through this website — including quotation requests, contact forms and uploaded project files — is used solely to respond to your inquiry and prepare pricing.",
      "Uploaded drawings and specifications are treated as confidential project information, stored securely, and shared only with the internal engineering and sales teams working on your request.",
      "We do not sell or rent personal data. Analytics data is collected in aggregated form to improve the website. You may request deletion of your submitted data at any time by emailing info@almuraqib.ae.",
      "This page may be updated from time to time; the latest version always appears here.",
    ],
    ar: [
      "تحترم المراقّب لصناعة الألياف الزجاجية ذ.م.م خصوصيتك. المعلومات المُرسلة عبر هذا الموقع — بما فيها طلبات عرض السعر ونماذج التواصل والملفات المرفوعة — تُستخدم فقط للرد على استفسارك وإعداد التسعير.",
      "تُعامَل الرسومات والمواصفات المرفوعة كمعلومات سرية للمشروع، وتُخزَّن بأمان ولا تُشارك إلا مع فرق الهندسة والمبيعات الداخلية العاملة على طلبك.",
      "لا نبيع أو نؤجّر البيانات الشخصية. تُجمع بيانات التحليلات بشكل مجمّع لتحسين الموقع. يمكنك طلب حذف بياناتك في أي وقت عبر info@almuraqib.ae.",
      "قد تُحدَّث هذه الصفحة من وقت لآخر؛ وآخر نسخة تظهر هنا دائماً.",
    ],
  },
  terms: {
    en: [
      "Content on this website is provided for general information about our GRP products and services. Product specifications are indicative and are confirmed per project in the formal quotation.",
      "Quotations issued by Al Muraqib are governed by the commercial terms stated in that document, including validity, payment and warranty conditions.",
      "All trademarks, images and text on this site belong to Al Muraqib Fiber Glass Industry L.L.C or are used with permission.",
      "By submitting an RFQ you agree to be contacted about your request in line with our Privacy Policy.",
    ],
    ar: [
      "محتوى هذا الموقع لأغراض عامة عن منتجاتنا وخدمات GRP. المواصفات الفنية إرشادية ويُؤكَّد المشروع في عرض السعر الرسمي.",
      "تُنظَّم عروض الأسعار الصادرة عن المراقّب بالشروط التجارية الواردة فيه، بما فيها صلاحية العرض وشروط الدفع والضمان.",
      "جميع العلامات التجارية والصور والنصوص على هذا الموقع مملوكة للمراقّب لصناعة الألياف الزجاجية ذ.م.م أو مستخدمة بإذن.",
      "بإرسال طلب عرض سعر فإنك توافق على التواصل معك وفق سياسة الخصوصية.",
    ],
  },
};

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; legal: string }>;
}) {
  const { locale, legal } = await params;
  if (!isLocale(locale) || !PAGES.includes(legal as LegalSlug)) notFound();
  const l = locale as Locale;
  const d = getDict(l);

  const title = legal === "privacy-policy" ? d.footer.privacy : d.footer.terms;

  return (
    <>
      <section className="bg-navy-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-sm text-slate-400 mb-4 flex items-center gap-2">
            <Link href={`/${l}`} className="hover:text-gold-400">{d.common.home}</Link>
            <span>/</span>
            <span className="text-white font-semibold">{title}</span>
          </nav>
          <h1 className="font-heading font-black text-white text-4xl">{title}</h1>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 text-[17px] leading-relaxed text-slate-700">
          {copy[legal as LegalSlug][l].map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} {d.meta.siteName}</p>
        </div>
      </section>
    </>
  );
}
