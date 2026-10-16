import type { IconName, L } from "@/lib/types";

/** “Our Brands” — house labels and partner brands we manufacture with */
export interface Brand {
  id: string;
  logoText: string;
  /** normalized plate at public/images/brands/<logo>.png (see scripts/build-brand-logos.py) */
  logo?: string;
  name: L;
  info: L;
  kind: L;
  icon: IconName;
}

export const brands: Brand[] = [
  {
    id: "al-muraqib-aqua",
    logoText: "AM",
    name: { en: "Al Muraqib Aqua", ar: "المراقب أكوا", bn: "আল মুরাক্বিব অ্যাকুয়া" },
    info: {
      en: "Our house brand for potable & process water storage — panel, cylindrical and hotel tanks.",
      ar: "علامتنا التجارية لخزائن مياه الشرب والعمليات — ألواح وأسوانات وخزائن فنادق.",
      bn: "পানীয় ও প্রক্রিয়া জল সংরক্ষণের আমাদের স্বটী ব্র্যান্ড — প্যানেল, সিলিন্ড্রিক্যাল ও হোটেল ট্যাঙ্ক।",
    },
    kind: { en: "House brand", ar: "علامة المصنع", bn: "হাউস ব্র্যান্ড" },
    icon: "tank",
  },
  {
    id: "al-muraqib-pools",
    logoText: "AP",
    name: { en: "Al Muraqib Pools", ar: "المراقب بولز", bn: "আল মুরাক্বিব পুলস" },
    info: {
      en: "Prefabricated plunge pools and acrylic suites built for five-star hospitality programmes.",
      ar: "مسابح غطس جاهزة وأجنحة أكريليك مُصممة لبرامج الضيافة الفاخرة.",
      bn: "ফাইভ-স্টার হসপিট্যালিটির জন্য তৈরি প্রিফ্যাব্রিকেটেড প্লাঞ্জ পুল ও অ্যাক্রিলিক স্যুট।",
    },
    kind: { en: "House brand", ar: "علامة المصنع", bn: "হাউস ব্র্যান্ড" },
    icon: "pool",
  },
  {
    id: "asak",
    logoText: "ASAK",
    logo: "asak",
    name: { en: "ASAK", ar: "آساك", bn: "এএসএকে" },
    info: {
      en: "Long-standing composite partner — joint delivery of GRP systems across GCC projects.",
      ar: "شريك مركّبات منذ أمد — تنفيذ مشترك لأنظمة GRP عبر مشاريع الخليج.",
      bn: "দীর্ঘমেয়াদি কম্পোজিট অংশীদার — উপসাগর জুড়ে জিআরপি সিস্টেমের যৌথ ডেলিভারি।",
    },
    kind: { en: "Partner", ar: "شريك", bn: "অংশীদার" },
    icon: "layers",
  },
  {
    id: "fibrex",
    logoText: "FIBREX",
    logo: "fibrex",
    name: { en: "Fibrex", ar: "فايبركس", bn: "ফাইব্রেक्स" },
    info: {
      en: "FRP profile supply partner for structural and cladding components in our fabrication.",
      ar: "شريك توريد مقاطع FRP للعناصر الإنشائية والكسوة في تصنيعنا.",
      bn: "কাঠামোগত ও ক্ল্যাডিং উপাদানের জন্য FRP প্রোফাইল সরবরাহকারী অংশীদার।",
    },
    kind: { en: "Material partner", ar: "شريك مواد", bn: "উপকরণ অংশীদার" },
    icon: "tool",
  },
  {
    id: "progress",
    logoText: "PROGRESS",
    logo: "progress",
    name: { en: "Progress Construction", ar: "بروغرس للإنشاءات", bn: "প্রোগ্রেস কনস্ট্রাকশন" },
    info: {
      en: "Turnkey contracting partner — tank farms and pumping stations delivered with us on site.",
      ar: "شريك مقاولات تسليم مفتاح — خزانات ومحطات ضخ نُفذت معهم في الموقع.",
      bn: "টার্নকি কন্ট্রাক্টিং অংশীদার — ট্যাঙ্ক ফার্ম ও পাম্পিং স্টেশন তাদের সাথে সাইটে সম্পন্ন।",
    },
    kind: { en: "Contracting partner", ar: "شريك مقاولات", bn: "কন্ট্রাক্টিং অংশীদার" },
    icon: "building",
  },
  {
    id: "azizi",
    logoText: "AZIZI",
    logo: "azizi",
    name: { en: "Azizi", ar: "عزيزي", bn: "আজিজি" },
    info: {
      en: "Developer partnership — GRP cladding and pool packages across residential towers.",
      ar: "شراكة تطوير — كسوة GRP وباقات مسابح عبر أبراج سكنية.",
      bn: "ডেভেলপার অংশীদারিত্ব — আবাসিক টাওয়ার জুড়ে জিআরপি ক্ল্যাডিং ও পুল প্যাকেজ।",
    },
    kind: { en: "Developer partner", ar: "شريك مطوّر", bn: "ডেভেলপার অংশীদার" },
    icon: "globe",
  },
];
