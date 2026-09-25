import type { Certification, L } from "../types";

export const site = {
  name: "Al Muraqib Fiber Glass Industry L.L.C",
  nameShort: "Al Muraqib",
  url: "https://almuraqib.ae",
  phone: "+971 6 569 1110",
  phoneIntl: "+97165691110",
  whatsapp: "97165691110",
  emails: { sales: "sales@almuraqib.ae", info: "info@almuraqib.ae" },
  address: {
    en: "P.O. Box 2719, Plot 970-972, Al Bataeh Industrial Area, Al Bataeh Municipality, Sharjah, UAE",
    ar: "ص.ب 2719، قطعة 970-972، المنطقة التجارية للبطيح، بلدية البطيح، الشارقة، الإمارات",
  } as L,
  coords: { lat: 25.2712191, lng: 55.7300747 },
  socials: [
    { icon: "facebook" as const, href: "https://www.facebook.com/" },
    { icon: "instagram" as const, href: "https://www.instagram.com/" },
    { icon: "linkedin" as const, href: "https://www.linkedin.com/" },
    { icon: "youtube" as const, href: "https://www.youtube.com/" },
  ],
  stats: { established: "2016", clients: 120, projects: 450 },
  /** tawk.to live chat — fill env NEXT_PUBLIC_TAWK_PROPERTY_ID to enable */
  tawkPropertyId: process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID ?? "",
};

export const clients: { name: string; logoText: string }[] = [
  { name: "ASAK", logoText: "ASAK" },
  { name: "Fibrex", logoText: "FIBREX" },
  { name: "Progress Construction", logoText: "PROGRESS" },
  { name: "Azizi", logoText: "AZIZI" },
  { name: "Penta EMR", logoText: "PENTA" },
  { name: "NSE", logoText: "NSE" },
];

export const certifications: Certification[] = [
  {
    code: "iso-9001",
    title: { en: "ISO 9001:2015 — Quality Management", ar: "ISO 9001:2015 — إدارة الجودة" },
    issuer: { en: "Certified body — QMS", ar: "جهة معايرة معتمدة — نظام إدارة الجودة" },
    validity: { en: "Valid — recertification on schedule", ar: "سارية — إعادة الاعتماد حسب الجدول" },
  },
  {
    code: "dm-approval",
    title: { en: "Dubai Municipality — Potable Water Approval", ar: "بلدية دبي — اعتماد مياه الشرب" },
    issuer: { en: "Dubai Municipality", ar: "بلدية دبي" },
    validity: { en: "Materials approved for potable service", ar: "مواد معتمدة للاستخدام في مياه الشرب" },
  },
  {
    code: "esma",
    title: { en: "ESMA / ECAS Compliance", ar: "الهيئة الإماراتية للمواصفات والمقاييس ECAS" },
    issuer: { en: "MoIAT / ESMA", ar: "وزارة الصناعة والتقنية المتقدمة" },
    validity: { en: "Product conformity maintained", ar: "مطابقة المنتج مستمرة" },
  },
  {
    code: "material-tests",
    title: { en: "Material & Load Test Reports", ar: "تقارير اختبارات المواد والأحمال" },
    issuer: { en: "Third-party laboratories", ar: "مختبرات طرف ثالث" },
    validity: { en: "Available on request for tenders", ar: "متاحة عند الطلب للمناقصات" },
  },
];

export const sectors: { slug: string; name: L }[] = [
  { slug: "construction", name: { en: "Construction & Infrastructure", ar: "الإنشاءات والبنية التحتية" } },
  { slug: "hospitality", name: { en: "Hospitality & Leisure", ar: "الضيافة والترفيه" } },
  { slug: "water", name: { en: "Water & Wastewater", ar: "المياه والصرف الصحي" } },
  { slug: "transport", name: { en: "Transportation & Marine", ar: "النقل والبحرية" } },
  { slug: "landscape", name: { en: "Landscaping & Architecture", ar: "التشجير والعمارة" } },
];
