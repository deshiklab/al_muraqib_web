import type { Article, Project } from "../types";

export const projects: Project[] = [
  {
    slug: "five-luxe-jbr-plunge-pools",
    title: { en: "FIVE Luxe JBR — Prefabricated Plunge Pools", ar: "FIVE Luxe JBR — مسابح غطس جاهزة" },
    sector: "hospitality",
    location: { en: "Dubai, UAE", ar: "دبي، الإمارات" },
    year: "2024",
    products: ["prefabricated-grp-plunge-pools"],
    scope: { en: "Supply & install — 40 prefabricated plunge pools", ar: "توريد وتركيب — 40 بركة غطس جاهزة" },
    challenge: {
      en: "The developer needed 40 balcony pools delivered and commissioned inside a live-construction handover schedule with zero tolerance for wet works.",
      ar: "احتاج المطوّر 40 بركة على البلكونات ضمن جدول تسليم حي دون أي سماح لأعمال رطبة.",
    },
    solution: {
      en: "Factory-finished GRP shells with pre-plumbed skimmers were craned to each terrace and commissioned within hours of landing.",
      ar: "أجسام GRP مشطّبة في المصنع مع أنابيب جاهزة رُفعت لكل تراس وشُغّلت خلال ساعات.",
    },
    result: {
      en: "All 40 pools handed over on schedule; zero leakage defects in post-handover inspection.",
      ar: "سُلّمت الأربعون بركة في موعدها؛ صفر عيوب تسرب بعد التسليم.",
    },
  },
  {
    slug: "royal-m-hotel-fujairah-lining",
    title: { en: "Royal M Hotel, Fujairah — Tank Lining", ar: "فندق رويال م، الفجيرة — بطانة خزانات" },
    sector: "hospitality",
    location: { en: "Fujairah, UAE", ar: "الفجيرة، الإمارات" },
    year: "2023",
    products: ["grp-lining-on-rcc-tank"],
    scope: { en: "GRP lining — RCC potable tanks, 2 × 250 m³", ar: "بطانة GRP — خزانا مياه شرب خرسانيان 2 × 250 م³" },
    challenge: {
      en: "Existing concrete tanks showed seepage and bacterial growth, risking guest-room supply compliance.",
      ar: "أظهرت الخزانات الحالية تسرّباً ونمواً بكتيرياً أعاد خطر الامتثال لخدمة الغرف.",
    },
    solution: {
      en: "Abrasive preparation followed by 3 mm seamless potable-grade GRP lining, applied in phased shutdowns.",
      ar: "تحضير بالتفريغ ثم بطانة GRP متصلة بسماكة 3 مم معتمدة، على مراحل دون إيقاف شامل.",
    },
    result: {
      en: "Leak-free storage, DM-compliant water service, completed during low-occupancy window.",
      ar: "تخزين بلا تسرب وخدمة مياه متوافقة مع بلدية دبي، ضمن فترة إشغال منخفضة.",
    },
  },
  {
    slug: "five-sensoria-rooftop-pools",
    title: { en: "FIVE Sensoria — Rooftop Plunge Pools", ar: "FIVE Sensoria — مسابح على السطح" },
    sector: "residential",
    location: { en: "Dubai, UAE", ar: "دبي، الإمارات" },
    year: "2024",
    products: ["prefabricated-grp-plunge-pools", "bespoke-grp-plunge-pools"],
    scope: { en: "Mix of standard & bespoke rooftop pools", ar: "مزيج من المسابح القياسية والمخصصة" },
    challenge: {
      en: "Structural load limits on the roof slab ruled out conventional concrete pools.",
      ar: "حدود الحمولة الإنشائية للسطح منعت المسابح الخرسانية التقليدية.",
    },
    solution: {
      en: "Lightweight GRP shells engineered to the slab's load budget, with integrated plant compartments.",
      ar: "أجسام GRP خفيفة مصممة ضمن حمولة السطح مع غرف معدات مدمجة.",
    },
    result: {
      en: "Premium pool amenity delivered without structural strengthening works.",
      ar: "خدمة بركة فاخرة دون أي تعزيز إنشائي.",
    },
  },
  {
    slug: "samana-parkview-water-storage",
    title: { en: "Samana ParkView — Panel Water Tanks", ar: "Samana ParkView — خزانات ألواحية" },
    sector: "residential",
    location: { en: "Dubai, UAE", ar: "دبي، الإمارات" },
    year: "2023",
    products: ["hot-press-grp-panel-tank"],
    scope: { en: "Hot press panel tanks — domestic & fire reserve", ar: "خزانات ألواحية بالضغط الساخن — استخدام منزلي واحتياطي حريق" },
    challenge: {
      en: "High-rise domestic supply needed DM-approved storage with tight plant-room footprints.",
      ar: "احتاجت مياه الأبراج السكنية لتخزين معتمد بلدية دبي ضمن مساحات غرف ضيقة.",
    },
    solution: {
      en: "Configured panel tanks matching the plant-room grid, insulated against rooftop heat loads.",
      ar: "خزانات ألواحية بتنسيق مطابق لغرف المعدات، معزولة عن حرارة السطح.",
    },
    result: {
      en: "Full capacity installed in under two days; certification pack accepted first submission.",
      ar: "السعة الكاملة خلال أقل من يومين؛ واعتُمدت وثائق الاعتماد من المحاولة الأولى.",
    },
  },
  {
    slug: "sinyar-nas-3-septic",
    title: { en: "Sinyar Nas 3 — Septic & Sewerage System", ar: "سينيار ناس 3 — نظام مخلفات وصرف" },
    sector: "residential",
    location: { en: "Dubai, UAE", ar: "دبي، الإمارات" },
    year: "2022",
    products: ["grp-septic-tank"],
    scope: { en: "Multi-chamber septic & sewerage tanks", ar: "خزانات مخلفات وصرف متعددة الغرف" },
    challenge: {
      en: "Below-ground packages had to carry vehicular loads above while staying serviceable.",
      ar: "يجب أن تتحمّل حزم الأعمدة أحمال المركبات وتبقى قابلة للخدمة.",
    },
    solution: {
      en: "B125-rated GRP tanks with integrated inspection chambers, delivered ready to drop in.",
      ar: "خزانات GRP بفئة B125 مع غرف فحص مدمجة، جاهزة للدفن.",
    },
    result: {
      en: "Passed authority inspection first time; no rework.",
      ar: "اجتاز فحص الجهة من أول مرة؛ دون إعادة عمل.",
    },
  },
  {
    slug: "fujairah-port-sand-trap",
    title: { en: "Fujairah Beach — Sand Trap Buckets", ar: "شاطئ الفجيرة — دلاء فخّار الرمل" },
    sector: "infrastructure",
    location: { en: "Fujairah, UAE", ar: "الفجيرة، الإمارات" },
    year: "2023",
    products: ["grp-sand-trap-bucket"],
    scope: { en: "Custom GRP sand trap buckets — public beach", ar: "دلاء رملية GRP مخصصة — شاطئ عام" },
    challenge: {
      en: "Steel boxes at the existing beach corroded within two seasons of salt exposure.",
      ar: "صدئت صناديق الحديد في الشاطئ الحالي خلال موسمين من الملح.",
    },
    solution: {
      en: "UV-stable GRP buckets with lifting points, produced to the municipality's dimensions.",
      ar: "دلاء GRP مقاومة للأشعة مع نقاط رفع، بمقاسات البلدية.",
    },
    result: {
      en: "Zero corrosion after a full summer season; replacement cycle extended beyond 10 years.",
      ar: "صفر تآكل بعد موسم صيف كامل؛ وطُوّرت دورة الاستبدال لأكثر من 10 سنوات.",
    },
  },
  {
    slug: "azizi-towers-cladding",
    title: { en: "Azizi Development — GRP Cladding Elements", ar: "أزيزي — عناصر كسوة GRP" },
    sector: "construction",
    location: { en: "Dubai, UAE", ar: "دبي، الإمارات" },
    year: "2022",
    products: ["grp-planter-box"],
    scope: { en: "Decorative cladding & planter elements", ar: "عناصر كسوة وزراعة زخرفية" },
    challenge: {
      en: "Facade elements needed a stone look without the weight penalty on cantilevers.",
      ar: "احتاجت عناصر الواجهة مظهر حجري دون وزن زائد على البلاطات الكابولية.",
    },
    solution: {
      en: "Custom-molded GRP elements with stone-texture gel coat, half the weight of precast.",
      ar: "عناصر GRP مصبوبة بنسيج حجري، بنصف وزن الخرسانة مسبقة الصب.",
    },
    result: {
      en: "Facade installed on schedule; elements still crack-free after two years.",
      ar: "الواجهة رُكّبت في موعدها؛ والعناصر سليمة بعد سنتين.",
    },
  },
  {
    slug: "progress-construction-tanks",
    title: { en: "Progress Construction — Tank Farm Retrofit", ar: "بروجريس — تجديد مجموعة خزانات" },
    sector: "industrial",
    location: { en: "Sharjah, UAE", ar: "الشارقة، الإمارات" },
    year: "2024",
    products: ["grp-lining-on-rcc-tank", "cold-press-grp-panel-tank"],
    scope: { en: "Lining + replacement tanks for industrial water", ar: "بطانة + خزانات بديلة لمياه صناعية" },
    challenge: {
      en: "Aging RCC tanks were leaking into the yard while plant operations continued non-stop.",
      ar: "كانت خزانات RCC القديمة تسرّب داخل الساحة بينما تعمل المنشأة دون توقف.",
    },
    solution: {
      en: "Phased lining of standing tanks plus cold press replacements staged around production.",
      ar: "بطانة تدريجية للخزانات القائمة مع بدائل ضغط بارد على مراحل حول الإنتاج.",
    },
    result: {
      en: "Zero unplanned downtime; leak reports closed permanently.",
      ar: "صفر توقف غير مخطط؛ وأُغلقت بلاغات التسرّب نهائياً.",
    },
  },
];

export const articles: Article[] = [
  {
    slug: "hot-press-vs-cold-press-panel-tanks",
    kind: "blog",
    category: { en: "Comparisons", ar: "مقارنات" },
    title: { en: "Hot Press vs Cold Press GRP Panel Tanks", ar: "مقارنة الخزانات الألواحية: الضغط الساخن والبارد" },
    excerpt: {
      en: "Both store water safely — but they are manufactured very differently. Here is how to specify the right one.",
      ar: "كلاهما يخزن المياه بأمان — لكن طريقة تصنيعهما مختلفة. إليك كيف تحدد الأنسب.",
    },
    date: "2026-08-12",
    readingMinutes: 6,
    relatedProducts: ["hot-press-grp-panel-tank", "cold-press-grp-panel-tank"],
    body: [
      "Hot press panels compression-mold Sheet Molding Compound at around 150 °C. The heat activates the catalyst and produces a panel with very uniform density and strength — the reason hot press is the default for potable water and large municipal tanks.",
      "Cold press panels are roller-pressed from pre-impregnated GRP sheet. They are more economical to produce, which shows in the final price, and are perfectly suited to secondary water, irrigation and sheltered installations.",
      "Rule of thumb: specify hot press where the tank is large, potable, or written into a consultant's specification; specify cold press where budget rules and duty is moderate.",
      "Both share the same bolted modular system, EPDM gaskets and fittings set — so a future upgrade path always exists.",
    ],
  },
  {
    slug: "how-to-size-grp-panel-tank",
    kind: "blog",
    category: { en: "Selection Guides", ar: "أدلة الاختيار" },
    title: { en: "How to Size a GRP Panel Water Tank", ar: "كيف تحسب حجم خزان GRP الألواحي" },
    excerpt: {
      en: "Peak demand, reserve hours and footprint — the three numbers that decide your tank before anything else.",
      ar: "الذروة وساعات الاحتياط والمساحة — الأرقام الثلاثة التي تحدد خزانك قبل أي شيء آخر.",
    },
    date: "2026-07-28",
    readingMinutes: 5,
    relatedProducts: ["hot-press-grp-panel-tank", "grp-cylindrical-tank"],
    body: [
      "Start with occupancy: people × litres per person per day gives daily demand. Multiply by your required reserve (typically 6–12 hours for residential towers, 24 hours for hospitals).",
      "Then check the footprint. Panel tanks build in 500 or 1000 mm modules, so the base must accept a rectangular grid — measure the plant room before promising a capacity.",
      "Finally, height. Tanks build from 1 m to 4 m; every extra metre buys capacity but increases floor load — confirm the slab rating with your structural engineer.",
      "Send these three numbers in your RFQ and we can configure the tank in one pass.",
    ],
  },
  {
    slug: "grp-lining-vs-epoxy-rcc-tanks",
    kind: "blog",
    category: { en: "Comparisons", ar: "مقارنات" },
    title: { en: "GRP Lining vs Epoxy Coating for RCC Tanks", ar: "بطانة GRP مقابل طلاء الإيبوكسي لخزانات RCC" },
    excerpt: {
      en: "Both waterproof concrete tanks — but their service life and crack-bridging behavior differ sharply.",
      ar: "كلاهما يعزل الخرسانة — لكن عمري الخدمة وقدرة تجاوز الشقوق تختلفان جوهرياً.",
    },
    date: "2026-07-10",
    readingMinutes: 7,
    relatedProducts: ["grp-lining-on-rcc-tank"],
    body: [
      "Epoxy coatings are thin-film systems (typically 0.3–1 mm). They rely on perfect substrate preparation and can telegraph new cracks from the concrete beneath.",
      "GRP lining is a laminated barrier of 2–3 mm with glass reinforcement — it bridges hairline movement and is not dependent on a perfect bond to the substrate over its full area.",
      "For potable service in the Gulf, where tanks see thermal cycling and chlorides, GRP lining is the specification more consultants reach for — and it is what Dubai Municipality guidance anticipates for rehabilitated tanks.",
      "The trade-off is cost and duration: lining is a larger work package than a coating. If your tank is sound and small, epoxy may still make sense.",
    ],
  },
  {
    slug: "panel-tank-installation-guide",
    kind: "kb",
    category: { en: "Installation & Maintenance", ar: "التركيب والصيانة" },
    title: { en: "Panel Tank Installation: 7 Steps to a Leak-Free Build", ar: "تركيب الخزان الألواحي: 7 خطوات لتركيب محكم" },
    excerpt: {
      en: "From base flatness to final hydrotest — the sequence our crews follow on every site.",
      ar: "من استواء الأساس إلى اختبار الضغط النهائي — التسلسل الذي نلتزم به في كل موقع.",
    },
    date: "2026-06-20",
    readingMinutes: 8,
    relatedProducts: ["hot-press-grp-panel-tank", "cold-press-grp-panel-tank"],
    body: [
      "1. Verify base flatness (typically ±3 mm over 3 m) and cleanliness — grit or wire under a panel is the most common cause of future leaks.",
      "2. Lay the gasket ring and assemble the first course of panels hand-tight, working from a corner.",
      "3. Bolt in diagonal sequence to even pressure; never impact-wrench a single bolt home first.",
      "4. Raise subsequent courses with mechanical assistance above 2 m; check plumb at every course.",
      "5. Fit fittings — inlet, outlet, overflow, drain, manhole — with new gaskets, never reused.",
      "6. Fill slowly with water while watching every joint; torque any seepage points and retest.",
      "7. Hydrotest to specified level, document, then hand over with care instructions.",
    ],
  },
  {
    slug: "water-tank-maintenance-checklist",
    kind: "kb",
    category: { en: "Installation & Maintenance", ar: "التركيب والصيانة" },
    title: { en: "GRP Water Tank Maintenance Checklist", ar: "قائمة صيانة خزان مياه GRP" },
    excerpt: {
      en: "A quarterly 15-minute inspection that protects a 25-year service life.",
      ar: "فحص ربع سنوي مدته 15 دقيقة يحمي عمراً افتراضياً يبلغ 25 سنة.",
    },
    date: "2026-06-02",
    readingMinutes: 4,
    relatedProducts: ["hot-press-grp-panel-tank", "grp-cylindrical-tank"],
    body: [
      "Exterior: check for panel staining, bolt corrosion and gasket squeeze-out; repaint exposed steelwork annually.",
      "Interior (with tank offline): inspect laminate for blisters or cracks, verify gasket condition, flush sediment from the floor low-point.",
      "Fittings: exercise valves, clean strainers, test overflow by filling to the weir.",
      "Document each visit — a simple log dramatically simplifies warranty claims later.",
    ],
  },
  {
    slug: "dm-potable-water-approval-guide",
    kind: "kb",
    category: { en: "Standards & Compliance", ar: "المعايير والاعتمادات" },
    title: { en: "Dubai Municipality Potable Water Approvals: What Specifiers Ask For", ar: "اعتمادات بلدية دبي لمياه الشرب: ما يطلبه المستشارون" },
    excerpt: {
      en: "Material certificates, test reports and the paperwork that speeds authority submission.",
      ar: "شهادات المواد والتقارير والوثائق التي تسرّع اعتماد الجهات.",
    },
    date: "2026-05-15",
    readingMinutes: 6,
    relatedProducts: ["hot-press-grp-panel-tank", "grp-lining-on-rcc-tank"],
    body: [
      "For potable service, authorities look for material approvals on the resin and reinforcement, plus manufacturing under a certified quality system.",
      "Expect to submit: product data sheets, potable-contact test reports, manufacturer declaration, and — for lined tanks — application method statements.",
      "We keep a current approval pack for our standard products; mention 'DM approval' in your RFQ and it ships with the quotation.",
    ],
  },
];

export function articlesByKind(kind: "blog" | "kb"): Article[] {
  return articles.filter((a) => a.kind === kind).sort((a, b) => b.date.localeCompare(a.date));
}
