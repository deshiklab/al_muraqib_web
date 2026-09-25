import type { MegaColumn, ProductGroup, Application } from "../types";

/** Mega-menu columns (Products) */
export const megaColumns: MegaColumn[] = [
  {
    eyebrow: { en: "01 · Water Storage", ar: "01 · تخزين المياه" },
    title: { en: "Tanks", ar: "الخزانات" },
    desc: {
      en: "Sectional and cylindrical GRP storage systems.",
      ar: "أنظمة تخزين GRP الألواحية والأسطوانية.",
    },
    links: [
      { label: { en: "Hot Press Panel Tanks", ar: "خزانات ألواحية بالضغط الساخن" }, href: "/products/hot-press-grp-panel-tank" },
      { label: { en: "Cold Press Panel Tanks", ar: "خزانات ألواحية بالضغط البارد" }, href: "/products/cold-press-grp-panel-tank" },
      { label: { en: "GRP Cylindrical Tanks", ar: "خزانات GRP أسطوانية" }, href: "/products/grp-cylindrical-tank" },
    ],
    viewAll: { label: { en: "Water Storage Tanks", ar: "خزانات تخزين المياه" }, href: "/products?group=water-tanks" },
  },
  {
    eyebrow: { en: "02 · Pools & Architecture", ar: "02 · مسابح وعمارة" },
    title: { en: "Leisure & Design", ar: "الترفيه والتصميم" },
    desc: {
      en: "Premium GRP solutions for hospitality and architectural projects.",
      ar: "حلول GRP عالية الجودة للمشاريع الضيافية والمعمارية.",
    },
    links: [
      { label: { en: "Prefabricated Plunge Pools", ar: "مسابح غطس جاهزة" }, href: "/products/prefabricated-grp-plunge-pools" },
      { label: { en: "Bespoke Plunge Pools", ar: "مسابح غطس مخصصة" }, href: "/products/bespoke-grp-plunge-pools" },
      { label: { en: "GRP Planter Boxes", ar: "صناديق زراعة GRP" }, href: "/products/grp-planter-box" },
    ],
    viewAll: { label: { en: "Pools & Leisure", ar: "المسابح والترفيه" }, href: "/products?group=pools" },
  },
  {
    eyebrow: { en: "03 · Protection & Services", ar: "03 · حماية وخدمات" },
    title: { en: "Lining & Systems", ar: "البطانات والأنظمة" },
    desc: {
      en: "Lining, septic systems, repair and custom fabrication.",
      ar: "البطانات وأنظمة الصرف والإصلاح والتصنيع المخصص.",
    },
    links: [
      { label: { en: "GRP Lining on RCC Tanks", ar: "بطانة GRP لخزانات الخرسانة" }, href: "/products/grp-lining-on-rcc-tank" },
      { label: { en: "GRP Septic Tanks", ar: "خزانات GRP للمخلفات" }, href: "/products/grp-septic-tank" },
      { label: { en: "GRP Sand Trap Buckets", ar: "دلاء فخّار الرمل GRP" }, href: "/products/grp-sand-trap-bucket" },
    ],
    viewAll: { label: { en: "Lining & Protection", ar: "البطانات والحماية" }, href: "/products?group=lining" },
  },
];

export const productGroups: ProductGroup[] = [
  {
    slug: "water-tanks",
    name: { en: "Water Storage Tanks", ar: "خزانات تخزين المياه" },
    short: { en: "Tanks", ar: "الخزانات" },
    description: {
      en: "Sectional panel and cylindrical tanks for potable and industrial water — 1 m to 4 m heights, any footprint.",
      ar: "خزانات ألواحية وأسطوانية لمياه الشرب والصناعات — ارتفاعات من 1 إلى 4 م بأي مساحة.",
    },
    icon: "tank",
  },
  {
    slug: "pools",
    name: { en: "Pools & Leisure", ar: "المسابح والترفيه" },
    short: { en: "Pools", ar: "المسابح" },
    description: {
      en: "Prefabricated and bespoke GRP plunge pools for hotels, residences and rooftops.",
      ar: "مسابح غطس GRP جاهزة ومخصصة للفنادق والمساكن والأسطح.",
    },
    icon: "pool",
  },
  {
    slug: "lining",
    name: { en: "Lining & Protection", ar: "البطانات والحماية" },
    short: { en: "Lining", ar: "البطانات" },
    description: {
      en: "Seamless GRP lining converting RCC and steel tanks into hygienic, leak-proof storage.",
      ar: "بطانات GRP متصلة تحوّل الخزانات الخرسانية والصلبة إلى تخزين صحي محكم.",
    },
    icon: "layers",
  },
  {
    slug: "septic",
    name: { en: "Septic & Sewerage", ar: "المخلفات والصرف الصحي" },
    short: { en: "Septic", ar: "المخلفات" },
    description: {
      en: "GRP septic and sewerage tanks plus grease trap manhole covers.",
      ar: "خزانات GRP للمخلفات والصرف الصحي وأغطية فتحات مصائد الدهون.",
    },
    icon: "droplet",
  },
  {
    slug: "architectural",
    name: { en: "Architectural & Landscaping", ar: "المعماري والتشجير" },
    short: { en: "Architectural", ar: "معماري" },
    description: {
      en: "Planters, claddings, water features and bespoke decorative elements.",
      ar: "صناديق زراعة وكسوات ونوافير مائية وعناصر زخرفية مخصصة.",
    },
    icon: "leaf",
  },
  {
    slug: "specialty",
    name: { en: "Specialty Products", ar: "منتجات متخصصة" },
    short: { en: "Specialty", ar: "مخصص" },
    description: {
      en: "Sand trap buckets, trays, bathtubs, car shades and custom industrial parts.",
      ar: "دلاء رملية وصواني وأحواض وظلال سيارات وأجزاء صناعية مخصصة.",
    },
    icon: "bucket",
  },
];

export const applications: Application[] = [
  { slug: "potable-water", name: { en: "Potable Water", ar: "مياه الشرب" }, icon: "droplet" },
  { slug: "wastewater", name: { en: "Wastewater & Sewage", ar: "مياه الصرف والمجارٍ" }, icon: "droplet" },
  { slug: "hospitality", name: { en: "Hotels & Hospitality", ar: "الفنادق والضيافة" }, icon: "building" },
  { slug: "residential", name: { en: "Residential Towers", ar: "الأبراج السكنية" }, icon: "building" },
  { slug: "landscaping", name: { en: "Landscaping", ar: "التشجير والمناظر" }, icon: "leaf" },
  { slug: "industrial", name: { en: "Industrial Plants", ar: "المنشآت الصناعية" }, icon: "flask" },
  { slug: "infrastructure", name: { en: "Infrastructure", ar: "البنية التحتية" }, icon: "truck" },
  { slug: "marine", name: { en: "Marine & Coastal", ar: "البحرية والسواحل" }, icon: "globe" },
];
