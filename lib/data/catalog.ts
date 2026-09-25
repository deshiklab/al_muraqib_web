import type { Product } from "../types";

export const products: Product[] = [
  {
    slug: "hot-press-grp-panel-tank",
    group: "water-tanks",
    featured: true,
    name: {
      en: "Hot Press GRP Panel Tank",
      ar: "خزان GRP ألواحي بالضغط الساخن",
    },
    pitch: {
      en: "SMC compression-molded panels for the most demanding potable water duty — consistent thickness, high strength, DM approved.",
      ar: "ألواح مضغوطة بتقنية SMC لأصعب تطبيقات مياه الشرب — سماكة متسقة وقوة عالية ومعتمد من بلدية دبي.",
    },
    description: [
      {
        en: "Hot press panels are made by pressing Sheet Molding Compound (SMC) in a compression machine: the SMC is cut, placed in the mold, then pressed at 150 °C until the catalyst hardens it. The result is a panel with extremely consistent density, surface finish and mechanical strength — the premium choice for sectional water tanks.",
        ar: "تُصنع الألواح الساخنة بضغط مادة تشكيل الألواح (SMC) في ماكينة ضغط: تُقصّ المادة وتوضع في القالب ثم تُضغط عند 150 مئوية حتى يتصلّب المحفّز. النتيجة ألواح متقاربة في الكثافة والسطح والقوة الميكانيكية — الخيار الأمثل للخزانات الألواحية.",
      },
      {
        en: "Tanks are assembled from basic panel sizes to any footprint, with heights from 1 m to 4 m. Insulated variants add a foam core enclosed by panel and fiber skin to keep stored water at a stable temperature through Gulf summers.",
        ar: "يُجمَّع الخزان من مقاسات ألواح أساسية لأي مساحة، بارتفاعات من 1 إلى 4 م. البدائل المعزولة تضيف نواة رغوية محاطة باللوح وألياف لتثبيت درجة حرارة المياه صيفاً في الخليج.",
      },
    ],
    keyFeatures: [
      { en: "SMC compression molding — uniform mechanical properties", ar: "ضغط SMC — خصائص ميكانيكية متجانسة" },
      { en: "Potable-water-approved materials (DM / ESMA)", ar: "مواد معتمدة لمياه الشرب (بلدية دبي / ESMA)" },
      { en: "Modular assembly — any footprint, 1–4 m heights", ar: "تجميع معياري — أي مساحة، ارتفاع 1–4 م" },
      { en: "Insulated or non-insulated panel options", ar: "ألواح معزولة أو غير معزولة" },
      { en: "Installed in under a day for common sizes", ar: "تركيب خلال يوم للمقاسات الشائعة" },
      { en: "Full range of fittings: inlet, outlet, overflow, manhole", ar: "كامل التجهيزات: دخول، خروج، فيضان، فتحة صيانة" },
    ],
    specGroups: [
      {
        name: { en: "Dimensions & Configuration", ar: "الأبعاد والتكوين" },
        rows: [
          { key: { en: "Tank height", ar: "ارتفاع الخزان" }, value: { en: "1 m – 4 m", ar: "1 م – 4 م" } },
          { key: { en: "Standard panel", ar: "اللوح القياسي" }, value: { en: "500 × 500 mm / 1000 × 1000 mm", ar: "500 × 500 مم / 1000 × 1000 مم" } },
          { key: { en: "Capacity range", ar: "نطاق السعة" }, value: { en: "1 m³ – 2,000+ m³", ar: "1 م³ – أكثر من 2,000 م³" } },
          { key: { en: "Footprint", ar: "المساحة" }, value: { en: "Any rectangular configuration", ar: "أي تخطيط مستطيل" } },
        ],
      },
      {
        name: { en: "Materials & Construction", ar: "المواد والبناء" },
        rows: [
          { key: { en: "Panel material", ar: "مادة اللوح" }, value: { en: "Sheet Molding Compound (SMC), hot pressed at 150 °C", ar: "SMC مضغوط ساخناً عند 150 مئوية" } },
          { key: { en: "Fasteners", ar: "الوصلات" }, value: { en: "Stainless steel bolts, EPDM gasket", ar: "مسامير ستانلس ستيل، حشوة EPDM" } },
          { key: { en: "Insulation", ar: "العزل" }, value: { en: "Optional: PUF foam core with GRP skin", ar: "اختياري: رغوة PUD مع غلاف GRP" } },
          { key: { en: "Finish", ar: "التشطيب" }, value: { en: "Smooth gel-coated interior", ar: "داخلي مصقول بطبقة جل" } },
        ],
      },
      {
        name: { en: "Performance & Compliance", ar: "الأداء والامتثال" },
        rows: [
          { key: { en: "Service", ar: "الاستخدام" }, value: { en: "Potable water, process water, fire reserve", ar: "مياه شرب، مياه صناعية، احتياطي حريق" } },
          { key: { en: "Approvals", ar: "الاعتمادات" }, value: { en: "Dubai Municipality potable approval, ESMA", ar: "اعتماد بلدية دبي، ESMA" } },
          { key: { en: "Design life", ar: "العمر الافتراضي" }, value: { en: "25+ years with standard maintenance", ar: "أكثر من 25 سنة مع صيانة اعتيادية" } },
        ],
      },
    ],
    applications: ["potable-water", "hospitality", "residential", "industrial"],
    attributes: [
      { key: { en: "Technology", ar: "التقنية" }, value: { en: "Hot press (SMC)", ar: "ضغط ساخن (SMC)" } },
      { key: { en: "Insulation", ar: "العزل" }, value: { en: "Insulated / Non-insulated", ar: "معزول / غير معزول" } },
      { key: { en: "Color", ar: "اللون" }, value: { en: "White / Grey (gel coat)", ar: "أبيض / رمادي (طلاء جل)" } },
      { key: { en: "Warranty", ar: "الضمان" }, value: { en: "24 months against manufacturing defects", ar: "24 شهراً ضد عيوب التصنيع" } },
    ],
    faqs: [
      {
        q: { en: "What is the difference between hot press and cold press panels?", ar: "ما الفرق بين الألواح الساخنة والباردة؟" },
        a: {
          en: "Hot press panels are compression-molded under heat, giving higher and more uniform strength — preferred for potable water and large tanks. Cold press panels are roll-pressed and more economical for smaller or secondary-duty tanks.",
          ar: "الألواح الساخنة تُضغط بالحرارة فتكتسب قوة أعلى وأكثر تجانساً — وتُفضّل لمياه الشرب والخزانات الكبيرة. الباردة تُبَرْمَر بأقل كلفة للخزانات الصغيرة أو الثانوية.",
        },
      },
      {
        q: { en: "How long does installation take?", ar: "كم يستغرق التركيب؟" },
        a: {
          en: "Most common sizes install in less than one day with our crew. Larger configurations are phased panel-by-panel without stopping building services.",
          ar: "تُركَّب المقاسات الشائعة في أقل من يوم بطاقمنا. أما الأكبر فتُنفَّذ على مراحل دون إيقاف الخدمات.",
        },
      },
    ],
    gallery: [
      { kind: "product", caption: { en: "Hot press panel tank — full assembly", ar: "خزان ألواحي بالضغط الساخن — تجميع كامل" } },
      { kind: "installed", caption: { en: "Rooftop installation — residential tower", ar: "تركيب على السطح — برج سكني" } },
      { kind: "drawing", caption: { en: "Typical tank layout drawing", ar: "رسم تخطيطي نموذجي للخزان" } },
    ],
    variantAxes: [
      {
        id: "insulation",
        label: { en: "Panel type", ar: "نوع اللوح" },
        options: [
          { id: "non-insulated", label: { en: "Non-insulated", ar: "غير معزول" } },
          { id: "insulated", label: { en: "Insulated (PUF core)", ar: "معزول (نواة PUF)" }, note: { en: "Stable water temperature", ar: "حرارة مياه ثابتة" } },
        ],
      },
      {
        id: "panel",
        label: { en: "Panel size", ar: "مقاس اللوح" },
        options: [
          { id: "500", label: { en: "500 × 500 mm", ar: "500 × 500 مم" } },
          { id: "1000", label: { en: "1000 × 1000 mm", ar: "1000 × 1000 مم" } },
        ],
      },
    ],
    keyFacts: [
      { label: { en: "Capacity", ar: "السعة" }, value: { en: "1 – 2,000+ m³", ar: "1 – 2,000+ م³" } },
      { label: { en: "Height", ar: "الارتفاع" }, value: { en: "1 – 4 m", ar: "1 – 4 م" } },
      { label: { en: "Standard", ar: "المعيار" }, value: { en: "DM / ESMA approved", ar: "معتمد DM / ESMA" } },
      { label: { en: "Lead time", ar: "مدة التوريد" }, value: { en: "2–4 weeks", ar: "2–4 أسابيع" } },
    ],
    relatedProducts: ["cold-press-grp-panel-tank", "grp-cylindrical-tank", "grp-lining-on-rcc-tank"],
    boughtWith: ["grp-lining-on-rcc-tank", "grp-septic-tank"],
    technology: "hot-press",
    sizeBuckets: ["medium", "large"],
    insulation: "insulated",
    certifications: ["dm", "esma", "iso"],
  },
  {
    slug: "cold-press-grp-panel-tank",
    group: "water-tanks",
    name: { en: "Cold Press GRP Panel Tank", ar: "خزان GRP ألواحي بالضغط البارد" },
    pitch: {
      en: "Economical sectional tanks for general water storage — same modular flexibility, fast delivery.",
      ar: "خزانات ألبية اقتصادية لتخزين المياه العام — نفس المرونة المعيارية مع توريد سريع.",
    },
    description: [
      {
        en: "Cold press panels are produced by roller-pressing fiber-reinforced sheets, then punching and finishing the bolt holes. They offer excellent value for potable and non-potable storage where the ultra-uniform strength of hot press is not required.",
        ar: "تُصنع الألواح الباردة ببرمْر الألواح المقوّاة بالألياف ثم تخريم وتشطيب ثقوب المسامير. توفّر قيمة ممتازة لتخزين المياه دون الحاجة لقوة الضغط الساخن الفائقة.",
      },
      {
        en: "Assembled with the same bolted modular system as our hot press range, cold press tanks are ideal for secondary circuits, irrigation, fire reserve and industrial water duties.",
        ar: "يُجمَّع بنفس نظام المسامير المعياري المستخدم في الخزانات الساخنة، وهو مثالي للمدارات الثانوية والري واحتياطي الحريق والمياه الصناعية.",
      },
    ],
    keyFeatures: [
      { en: "Cost-effective sectional storage", ar: "تخزين ألواحي بتكلفة اقتصادية" },
      { en: "Bolted assembly — expandable later", ar: "تجميع مسمّر — قابل للتوسّع" },
      { en: "Heights 1–4 m, any footprint", ar: "ارتفاعات 1–4 م بأي مساحة" },
      { en: "Fast delivery for standard sizes", ar: "توريد سريع للمقاسات القياسية" },
      { en: "Suited to sheltered installations", ar: "مناسب للتركيبات المظللة" },
    ],
    specGroups: [
      {
        name: { en: "Dimensions & Configuration", ar: "الأبعاد والتكوين" },
        rows: [
          { key: { en: "Tank height", ar: "ارتفاع الخزان" }, value: { en: "1 m – 4 m", ar: "1 م – 4 م" } },
          { key: { en: "Capacity range", ar: "نطاق السعة" }, value: { en: "1 m³ – 1,500 m³", ar: "1 م³ – 1,500 م³" } },
          { key: { en: "Panel sizes", ar: "مقاسات الألواح" }, value: { en: "500 / 1000 mm modules", ar: "وحدات 500 / 1000 مم" } },
        ],
      },
      {
        name: { en: "Materials & Compliance", ar: "المواد والامتثال" },
        rows: [
          { key: { en: "Panel material", ar: "مادة اللوح" }, value: { en: "GRP sheet, roller pressed", ar: "لوح GRP مبرمر" } },
          { key: { en: "Gasket", ar: "الحشوة" }, value: { en: "EPDM, food-grade compatible", ar: "EPDM مطابق للاستخدام الغذائي" } },
          { key: { en: "Approvals", ar: "الاعتمادات" }, value: { en: "ISO 9001 manufactured", ar: "تصنيع وفق ISO 9001" } },
        ],
      },
    ],
    applications: ["potable-water", "wastewater", "industrial", "infrastructure"],
    attributes: [
      { key: { en: "Technology", ar: "التقنية" }, value: { en: "Cold press", ar: "ضغط بارد" } },
      { key: { en: "Insulation", ar: "العزل" }, value: { en: "Non-insulated", ar: "غير معزول" } },
      { key: { en: "Warranty", ar: "الضمان" }, value: { en: "18 months", ar: "18 شهراً" } },
    ],
    faqs: [
      {
        q: { en: "Can a cold press tank be upgraded later?", ar: "هل يمكن ترقية الخزان البارد لاحقاً؟" },
        a: {
          en: "Yes — panels are modular, so a tank can be raised or extended by adding panels, provided the foundation and fittings allow.",
          ar: "نعم — الألواح معيارية، فيمكن رفع الخزان أو توسيعه بإضافة ألواح بشرط موافقة الأساس والتجهيزات.",
        },
      },
    ],
    gallery: [
      { kind: "product", caption: { en: "Cold press tank — panel detail", ar: "خزان ضغط بارد — تفصيل اللوح" } },
      { kind: "installed", caption: { en: "Plant room installation", ar: "تركيب في غرفة المعدات" } },
      { kind: "drawing", caption: { en: "Typical arrangement", ar: "تخطيط نموذجي" } },
    ],
    variantAxes: [
      {
        id: "panel",
        label: { en: "Panel size", ar: "مقاس اللوح" },
        options: [
          { id: "500", label: { en: "500 × 500 mm", ar: "500 × 500 مم" } },
          { id: "1000", label: { en: "1000 × 1000 mm", ar: "1000 × 1000 مم" } },
        ],
      },
    ],
    keyFacts: [
      { label: { en: "Capacity", ar: "السعة" }, value: { en: "1 – 1,500 m³", ar: "1 – 1,500 م³" } },
      { label: { en: "Height", ar: "الارتفاع" }, value: { en: "1 – 4 m", ar: "1 – 4 م" } },
      { label: { en: "Lead time", ar: "مدة التوريد" }, value: { en: "1–3 weeks", ar: "1–3 أسابيع" } },
    ],
    relatedProducts: ["hot-press-grp-panel-tank", "grp-cylindrical-tank", "grp-septic-tank"],
    boughtWith: ["hot-press-grp-panel-tank"],
    technology: "cold-press",
    sizeBuckets: ["medium", "large"],
    insulation: "non-insulated",
    certifications: ["iso"],
  },
  {
    slug: "grp-cylindrical-tank",
    group: "water-tanks",
    featured: true,
    name: { en: "GRP Cylindrical Tank", ar: "خزان GRP أسطواني" },
    pitch: {
      en: "Seamless filament-wound cylindrical tanks — compact footprint, no leakage paths, ideal for rooftop and plant rooms.",
      ar: "خزانات أسطوانية ملفوفة بلا وصلات — مساحة صغيرة بلا مسارات تسرّب، مثالية للأسطح وغرف المعدات.",
    },
    description: [
      {
        en: "Cylindrical GRP tanks are filament-wound as a single seamless body, eliminating panel joints entirely. Their round section is naturally efficient: even wall stress, minimal material, no corner leakage paths.",
        ar: "تُلفّ الخزانات الأسطوانية كجسم واحد متصل بلا وصلات ألواح. الشكل الدائري مفيد طبيعياً: توزيع إجهاد متساوٍ وخامة أقل وبدون زوايا تسرّب.",
      },
      {
        en: "Supplied with flat or domed tops, steel support cradles and full fittings set — commonly used on rooftops, in basements and as break tanks.",
        ar: "تُورَّد بأسطح مسطحة أو قبب وحوامل صندوقية وطقم تجهيزات كامل — تُستخدم شائعاً على الأسس والأقبية وكخزانات فصل.",
      },
    ],
    keyFeatures: [
      { en: "Seamless filament-wound body — no joints", ar: "جسم ملفوف متصل — بلا وصلات" },
      { en: "Compact circular footprint", ar: "مساحة دائرية موفّرة" },
      { en: "Domed or flat top options", ar: "أسطح قببية أو مسطحة" },
      { en: "Lightweight — easy rooftop handling", ar: "خفيف — سهل النقل للأسطح" },
      { en: "UV-stable exterior gel coat", ar: "طلاء جل خارجي مقاوم للأشعة" },
    ],
    specGroups: [
      {
        name: { en: "Dimensions", ar: "الأبعاد" },
        rows: [
          { key: { en: "Diameter", ar: "القطر" }, value: { en: "1.5 m – 6 m", ar: "1.5 م – 6 م" } },
          { key: { en: "Height", ar: "الارتفاع" }, value: { en: "1.5 m – 4 m", ar: "1.5 م – 4 م" } },
          { key: { en: "Capacity", ar: "السعة" }, value: { en: "3 m³ – 100+ m³", ar: "3 م³ – 100+ م³" } },
        ],
      },
      {
        name: { en: "Construction", ar: "البناء" },
        rows: [
          { key: { en: "Process", ar: "التصنيع" }, value: { en: "Filament winding, epoxy/polyester resin", ar: "لفّ الألياف، راتنج إيبوكسي/بوليستر" } },
          { key: { en: "Support", ar: "الدعم" }, value: { en: "GRP cradle or steel ring base", ar: "قاعدة GRP أو حلقة صندوقية" } },
          { key: { en: "Fittings", ar: "التجهيزات" }, value: { en: "Inlet, outlet, overflow, drain, manhole", ar: "دخول، خروج، فيضان، تصريف، فتحة" } },
        ],
      },
    ],
    applications: ["potable-water", "residential", "industrial", "infrastructure"],
    attributes: [
      { key: { en: "Technology", ar: "التقنية" }, value: { en: "Filament wound", ar: "لفّ ألياف" } },
      { key: { en: "Color", ar: "اللون" }, value: { en: "Grey / Blue", ar: "رمادي / أزرق" } },
      { key: { en: "Warranty", ar: "الضمان" }, value: { en: "24 months", ar: "24 شهراً" } },
    ],
    faqs: [
      {
        q: { en: "Panel tank or cylindrical tank — which should I choose?", ar: "خزان ألواحي أم أسطواني — أيهما أختار؟" },
        a: {
          en: "Choose cylindrical for compact seamless storage (rooftops, plant rooms). Choose panel tanks for large capacities and rectangular spaces where every square metre counts.",
          ar: "اختر الأسطواني لتخزين متصل مدمج (أسطح وغرف معدات). اختر الألواحي للسعات الكبيرة والمساحات المستطيلة.",
        },
      },
    ],
    gallery: [
      { kind: "product", caption: { en: "Cylindrical tank with dome top", ar: "خزان أسطواني بسقف قببي" } },
      { kind: "installed", caption: { en: "Rooftop cluster", ar: "مجموعة على السطح" } },
      { kind: "drawing", caption: { en: "Cradle base detail", ar: "تفصيل القاعدة" } },
    ],
    keyFacts: [
      { label: { en: "Capacity", ar: "السعة" }, value: { en: "3 – 100+ m³", ar: "3 – 100+ م³" } },
      { label: { en: "Diameter", ar: "القطر" }, value: { en: "1.5 – 6 m", ar: "1.5 – 6 م" } },
      { label: { en: "Lead time", ar: "مدة التوريد" }, value: { en: "2–3 weeks", ar: "2–3 أسابيع" } },
    ],
    relatedProducts: ["hot-press-grp-panel-tank", "cold-press-grp-panel-tank", "grp-lining-on-rcc-tank"],
    boughtWith: ["hot-press-grp-panel-tank"],
    technology: "hand-layup",
    sizeBuckets: ["compact", "medium"],
    insulation: "n/a",
    certifications: ["iso", "dm"],
  },
  {
    slug: "prefabricated-grp-plunge-pools",
    group: "pools",
    featured: true,
    name: { en: "Prefabricated GRP Plunge Pools", ar: "مسابح غطس GRP جاهزة" },
    pitch: {
      en: "Factory-finished pools craned into place in one day — for hotels, rooftops and villas on tight schedules.",
      ar: "مسابح مصنّعة ومشطّبة في المصنع وتُرفع بالوناقة في يوم واحد — للفنادق والأسطح والفلل بجداول زمنية ضيقة.",
    },
    description: [
      {
        en: "Our prefabricated plunge pools arrive as a complete shell with gel-coat finish, skimmer, returns and plumbing pre-installed. They are craned onto prepared bases and commissioned within hours — no wet trades, no long curing on site.",
        ar: "تصل مسابحنا الجاهزة كجسم كامل مع طلاء جل ومصافٍ ومخرجات وأنابيب مركّبة مسبقاً. تُرفع بالوناقة على أساس جاهز وتُشغَّل خلال ساعات — بلا أعمال رطبة أو فترات تصلّب طويلة.",
      },
      {
        en: "Standard sizes from 3 × 2 m to 5 × 3 m with optional LED lighting, heat pump connections and automated cover rollers — the fastest path to a premium pool.",
        ar: "مقاسات قياسية من 3 × 2 م إلى 5 × 3 م مع إضاءة LED ووصلات مضخة حرارة وآلية تغطية — أسرع طريق لبركة فاخرة.",
      },
    ],
    keyFeatures: [
      { en: "Installed and commissioned in one day", ar: "تركيب وتشغيل في يوم واحد" },
      { en: "UV-stable gel coat — 8 color options", ar: "طلاء جل مقاوم للأشعة — 8 ألوان" },
      { en: "Pre-plumbed: skimmer, returns, drain", ar: "أنابيب جاهزة: مصافٍ، مخرجات، تصريف" },
      { en: "Optional LED lighting & heat pump kit", ar: "إضاءة LED وطقم مضخة حرارة اختيارية" },
      { en: "Craned onto any prepared base", ar: "تُرفع بالوناقة على أي أساس جاهز" },
    ],
    specGroups: [
      {
        name: { en: "Sizes", ar: "المقاسات" },
        rows: [
          { key: { en: "Small", ar: "صغير" }, value: { en: "3.0 × 2.0 × 1.4 m — ~7,500 L", ar: "3.0 × 2.0 × 1.4 م — ~7,500 لتر" } },
          { key: { en: "Medium", ar: "متوسط" }, value: { en: "4.0 × 2.5 × 1.5 m — ~13,500 L", ar: "4.0 × 2.5 × 1.5 م — ~13,500 لتر" } },
          { key: { en: "Large", ar: "كبير" }, value: { en: "5.0 × 3.0 × 1.5 m — ~21,000 L", ar: "5.0 × 3.0 × 1.5 م — ~21,000 لتر" } },
        ],
      },
      {
        name: { en: "Technical", ar: "فني" },
        rows: [
          { key: { en: "Shell", ar: "الجسم" }, value: { en: "GRP, 8–12 mm laminate with integrated flange", ar: "GRP، جلد 8–12 مم مع حافة مدمجة" } },
          { key: { en: "Fittings", ar: "التجهيزات" }, value: { en: "ABS skimmer, inlets, LED niche, drain", ar: "مصاف ABS، مداخل، حافة LED، تصريف" } },
          { key: { en: "Warranty", ar: "الضمان" }, value: { en: "Shell: 10 years structural", ar: "الجسم: 10 سنوات إنشائية" } },
        ],
      },
    ],
    applications: ["hospitality", "residential", "landscaping"],
    attributes: [
      { key: { en: "Technology", ar: "التقنية" }, value: { en: "Pre-preg / hand lay-up", ar: "تركيب يدوي معتمد" } },
      { key: { en: "Colors", ar: "الألوان" }, value: { en: "8 gel-coat finishes", ar: "8 ألوان طلاء جل" } },
      { key: { en: "Installation", ar: "التركيب" }, value: { en: "1 day after base handover", ar: "يوم واحد بعد تسليم الأساس" } },
    ],
    faqs: [
      {
        q: { en: "Do I need a crane?", ar: "هل أحتاج وناقة؟" },
        a: {
          en: "Yes — pools are lifted as a single shell. We coordinate the crane during handover; site access only needs to allow a 25-tonne mobile crane or equivalent.",
          ar: "نعم — تُرفع البركة كجسم واحد. ننسّق الوناكة عند التسليم؛ ويكفي السماح بوادج 25 طناً أو ما يعادلها.",
        },
      },
      {
        q: { en: "Can it be built into a deck?", ar: "هل يمكن دمجها في سطح خشبي؟" },
        a: {
          en: "Yes — the flange is designed to be decked flush, leaving only the skimmer and one return visible.",
          ar: "نعم — الحافة مصممة لتُركَّب متراصّة مع السطح، ولا يظهر إلا المصاف والمخرج.",
        },
      },
    ],
    gallery: [
      { kind: "product", caption: { en: "Prefabricated shell — studio", ar: "الجسم الجاهز — استوديو" } },
      { kind: "installed", caption: { en: "FIVE Sensoria installation", ar: "تركيب في FIVE Sensoria" } },
      { kind: "drawing", caption: { en: "Typical plan & section", ar: "مخطط وقطاع نموذجي" } },
    ],
    variantAxes: [
      {
        id: "size",
        label: { en: "Size", ar: "المقاس" },
        options: [
          { id: "small", label: { en: "3 × 2 m", ar: "3 × 2 م" } },
          { id: "medium", label: { en: "4 × 2.5 m", ar: "4 × 2.5 م" } },
          { id: "large", label: { en: "5 × 3 m", ar: "5 × 3 م" } },
        ],
      },
      {
        id: "color",
        label: { en: "Finish", ar: "اللون" },
        options: [
          { id: "white", label: { en: "White", ar: "أبيض" } },
          { id: "sand", label: { en: "Sand", ar: "رملي" } },
          { id: "grey", label: { en: "Grey", ar: "رمادي" } },
          { id: "black", label: { en: "Black", ar: "أسود" } },
        ],
      },
    ],
    keyFacts: [
      { label: { en: "Sizes", ar: "المقاسات" }, value: { en: "3×2 – 5×3 m", ar: "3×2 – 5×3 م" } },
      { label: { en: "Volume", ar: "الحجم" }, value: { en: "7,500 – 21,000 L", ar: "7,500 – 21,000 لتر" } },
      { label: { en: "Install", ar: "التركيب" }, value: { en: "1 day", ar: "يوم واحد" } },
      { label: { en: "Shell warranty", ar: "ضمان الجسم" }, value: { en: "10 years", ar: "10 سنوات" } },
    ],
    relatedProducts: ["bespoke-grp-plunge-pools", "grp-planter-box"],
    boughtWith: ["grp-planter-box"],
    technology: "hand-layup",
    sizeBuckets: ["compact", "medium"],
    insulation: "n/a",
    certifications: ["iso"],
  },
  {
    slug: "bespoke-grp-plunge-pools",
    group: "pools",
    name: { en: "Bespoke GRP Plunge Pools", ar: "مسابح غطس GRP مخصصة" },
    pitch: {
      en: "Any shape, any depth — engineered one-off pools for landmark hospitality and residential projects.",
      ar: "أي شكل وأي عمق — مسابح مصممة لمشاريع ضيادية وسكنية استثنائية.",
    },
    description: [
      {
        en: "For projects where a standard shell will not do, our engineering team designs bespoke GRP pools from your architect's drawings — curves, infinity edges, integrated seating and plant compartments included.",
        ar: "حيث لا يكفي الجسم القياسي، يصمم فريقنا مسابح GRP مخصصة من رسومات المعماري — منحنيات وحواف لا نهائية ومقاعد وغرف معدات مدمجة.",
      },
      {
        en: "Molds are produced in-house, giving full control over laminate schedule, fittings placement and finish — with shop drawings issued for consultant approval before production.",
        ar: "تُصنَع القوالب داخل المنشأة مع تحكم كامل في جدول التقوية ومواضع التجهيزات والتشطيب — مع إرسال رسومات المصنع لموافقة المستشار قبل الإنتاج.",
      },
    ],
    keyFeatures: [
      { en: "Designed from architect's drawings", ar: "تصميم من رسومات المعماري" },
      { en: "Free-form shapes, infinity edges", ar: "أشكال حرة وحواف لا نهائية" },
      { en: "In-house mold fabrication", ar: "تصنيع قوالب داخلي" },
      { en: "Shop drawings for consultant approval", ar: "رسومات مصنع للموافقة الاستشارية" },
      { en: "Integrated steps, seating, plant rooms", ar: "درجات ومقاعد وغرف معدات مدمجة" },
    ],
    specGroups: [
      {
        name: { en: "Scope", ar: "النطاق" },
        rows: [
          { key: { en: "Shapes", ar: "الأشكال" }, value: { en: "Rectangular, curved, free-form", ar: "مستطيل، منحني، حر" } },
          { key: { en: "Depth", ar: "العمق" }, value: { en: "0.9 m – 2.0 m", ar: "0.9 م – 2.0 م" } },
          { key: { en: "Typical lead time", ar: "مدة التوريد المعتادة" }, value: { en: "4 – 8 weeks", ar: "4 – 8 أسابيع" } },
        ],
      },
      {
        name: { en: "Engineering", ar: "الهندسة" },
        rows: [
          { key: { en: "Design", ar: "التصميم" }, value: { en: "FEA-checked laminate schedule", ar: "جدول تقوية مفحوص بالعناصر المحدودة" } },
          { key: { en: "Approvals", ar: "الاعتمادات" }, value: { en: "Consultant / authority submittals", ar: "عرض على الاستشاري والجهات" } },
        ],
      },
    ],
    applications: ["hospitality", "residential"],
    attributes: [
      { key: { en: "Technology", ar: "التقنية" }, value: { en: "Custom hand lay-up", ar: "صبّ يدوي مخصص" } },
      { key: { en: "MOQ", ar: "أدنى كمية" }, value: { en: "One unit", ar: "قطعة واحدة" } },
    ],
    faqs: [
      {
        q: { en: "How long from design to handover?", ar: "كم من التصميم حتى التسليم؟" },
        a: {
          en: "Typically 4–8 weeks depending on shape complexity and approval cycles.",
          ar: "عادة 4–8 أسابيع حسب تعقيد الشكل ودورات الاعتماد.",
        },
      },
    ],
    gallery: [
      { kind: "product", caption: { en: "Bespoke pool — mold stage", ar: "بركة مخصصة — مرحلة القالب" } },
      { kind: "installed", caption: { en: "Hotel infinity edge", ar: "حافة لا نهائية بفندق" } },
      { kind: "drawing", caption: { en: "GA drawing", ar: "رسم تنفيذي" } },
    ],
    keyFacts: [
      { label: { en: "Shapes", ar: "الأشكال" }, value: { en: "Unlimited", ar: "غير محدودة" } },
      { label: { en: "Depth", ar: "العمق" }, value: { en: "0.9 – 2.0 m", ar: "0.9 – 2.0 م" } },
      { label: { en: "Lead time", ar: "مدة التوريد" }, value: { en: "4–8 weeks", ar: "4–8 أسابيع" } },
    ],
    relatedProducts: ["prefabricated-grp-plunge-pools", "grp-planter-box"],
    boughtWith: ["prefabricated-grp-plunge-pools"],
    technology: "hand-layup",
    sizeBuckets: ["medium", "large"],
    insulation: "n/a",
    certifications: ["iso"],
  },
  {
    slug: "grp-lining-on-rcc-tank",
    group: "lining",
    featured: true,
    name: { en: "GRP Lining on RCC Tanks", ar: "بطانة GRP لخزانات الخرسانة" },
    pitch: {
      en: "100% leak-proof, hygienic GRP lining that converts concrete tanks into DM-approved potable storage.",
      ar: "بطانة GRP مقاومة للتسرب وصحية 100% تحوّل الخزانات الخرسانية إلى تخزين شرب معتمد.",
    },
    description: [
      {
        en: "Concrete tanks absorb water, crack over time and host algae and bacteria. Our GRP lining creates a seamless, non-porous internal barrier that restores the tank to hygienic, leak-proof service — without demolishing the structure.",
        ar: "خزانات الخرسانة تمتص الماء وتشقق مع الوقت وتستضيف الطحالب والبكتيريا. بطانة GRP تخلق حاجزاً داخلياً متصلاً غير مسامي يعيد الخزان لخدمة صحية محكمة — دون هدم الإنشاء.",
      },
      {
        en: "Surface preparation, lay-up schedule and finish are executed to Dubai Municipality guidelines using potable-water-approved resins and reinforcement, with thickness typically 2–3 mm across walls and floor.",
        ar: "يُنفَّذ تجهيز السطح وجدول التقوية والتشطيب وفق إرشادات بلدية دبي براتنجات ومعتمدة لمياه الشرب، بسماكة عادة 2–3 مم للجدران والأرضية.",
      },
    ],
    keyFeatures: [
      { en: "Seamless — no joints, no leaks", ar: "متصلة — بلا وصلات ولا تسرّب" },
      { en: "Potable-water-approved materials", ar: "مواد معتمدة لمياه الشرب" },
      { en: "DM guideline application", ar: "تنفيذ وفق إرشادات بلدية دبي" },
      { en: "Resists algae, bacteria, chloride", ar: "مقاومة للطحالب والبكتيريا والكلوريد" },
      { en: "No demolition — applied in situ", ar: "بلا هدم — تطبيق في الموقع" },
      { en: "Wall & floor coverage 2–3 mm", ar: "تغطية الجدران والأرضية 2–3 مم" },
    ],
    specGroups: [
      {
        name: { en: "Application", ar: "التطبيق" },
        rows: [
          { key: { en: "Substrates", ar: "الأسطح" }, value: { en: "RCC tanks, sumps, manholes, drains", ar: "خزانات RCC، غرف سump، فتحات، مجاري" } },
          { key: { en: "Thickness", ar: "السماكة" }, value: { en: "2 – 3 mm typical", ar: "2 – 3 مم عادة" } },
          { key: { en: "Preparation", ar: "التحضير" }, value: { en: "Abrasive blast / grind to clean profile", ar: "تنظيف بالتفريغ أو الطحن لسطح نظيف" } },
        ],
      },
      {
        name: { en: "Compliance", ar: "الامتثال" },
        rows: [
          { key: { en: "Materials", ar: "المواد" }, value: { en: "Potable-water-approved resin & glass", ar: "راتنج وزجاج معتمد للاستخدام الغذائي" } },
          { key: { en: "Coverage", ar: "التغطية" }, value: { en: "Dubai, Sharjah, Abu Dhabi + GCC", ar: "دبي والشارقة وأبوظبي + دول الخليج" } },
        ],
      },
    ],
    applications: ["potable-water", "wastewater", "infrastructure", "industrial"],
    attributes: [
      { key: { en: "Technology", ar: "التقنية" }, value: { en: "Hand lay-up in situ", ar: "صبّ يدوي في الموقع" } },
      { key: { en: "Service", ar: "الخدمة" }, value: { en: "Potable / waste water", ar: "مياه شرب / صرف" } },
      { key: { en: "Warranty", ar: "الضمان" }, value: { en: "24 months workmanship", ar: "24 شهراً على التنفيذ" } },
    ],
    faqs: [
      {
        q: { en: "Can you line a leaking tank without emptying it permanently?", ar: "هل يمكن بطانة خزان مسرّب دون إفراغه نهائياً؟" },
        a: {
          en: "The tank must be drained, cleaned and prepared; we phase works so building water service is restored as early as possible with temporary bypass tanks available.",
          ar: "يجب إفراغ الخزان وتنظيفه وتجهيزه؛ وننفّذ الأعمال على مراحل مع استعادة الخدمة مبكراً عبر خزانات مؤقتة عند الحاجة.",
        },
      },
      {
        q: { en: "How long does lining take?", ar: "كم تستغرق البطانة؟" },
        a: {
          en: "A typical residential sump is 2–3 days; a 500 m³ municipal tank is 1–2 weeks including preparation and cure.",
          ar: "غرفة سump سكنية نموذجية 2–3 أيام؛ خزان بلدي 500 م³ أسبوع إلى أسبوعين مع التحضير والتجفيف.",
        },
      },
    ],
    gallery: [
      { kind: "installed", caption: { en: "RCC tank after lining", ar: "خزان RCC بعد البطانة" } },
      { kind: "product", caption: { en: "Laminate detail", ar: "تفصيل الجلد" } },
      { kind: "drawing", caption: { en: "Lining layout", ar: "تخطيط البطانة" } },
    ],
    keyFacts: [
      { label: { en: "Thickness", ar: "السماكة" }, value: { en: "2 – 3 mm", ar: "2 – 3 مم" } },
      { label: { en: "Approvals", ar: "الاعتمادات" }, value: { en: "DM compliant", ar: "مطابق لبلدية دبي" } },
      { label: { en: "Typical duration", ar: "المدة المعتادة" }, value: { en: "2 days – 2 weeks", ar: "يومان – أسبوعان" } },
    ],
    relatedProducts: ["hot-press-grp-panel-tank", "grp-septic-tank", "grp-cylindrical-tank"],
    boughtWith: ["grp-septic-tank", "hot-press-grp-panel-tank"],
    technology: "hand-layup",
    sizeBuckets: ["medium", "large"],
    insulation: "n/a",
    certifications: ["dm", "esma", "iso"],
  },
  {
    slug: "grp-septic-tank",
    group: "septic",
    name: { en: "GRP Septic & Sewerage Tanks", ar: "خزانات GRP للمخلفات والصرف الصحي" },
    pitch: {
      en: "Bury-ready septic and sewerage tanks with high chemical resistance — for villas, camps and remote facilities.",
      ar: "خزانات مخلفات وصرف قابلة للدفن بمقاومة كيميائية عالية — للفلل والمخيتمات والمنشآت البعيدة.",
    },
    description: [
      {
        en: "Molded GRP septic tanks provide a sealed, corrosion-free primary treatment vessel. Chambers, baffles and inspection ports are integrated into the shell, ready for drop-in installation.",
        ar: "خزانات GRP المصبوبة توفر حاوية معالجة أولية محكمة ومقاومة للتآكل. الحواجز وفتحات الفحص مدمجة في الجسم وجاهزة للدفن المباشر.",
      },
      {
        en: "Sewerage holding variants add pump sumps and vent stacks; grease trap manhole covers complete the below-ground package for hospitality and food-service projects.",
        ar: "بدائل الصرف تضيف غرف مصبات ومخارج تهوية؛ وأغطية مصائد الدهون تكمل حزمة الأعمدة للمشاريع الضيافية والمطاعم.",
      },
    ],
    keyFeatures: [
      { en: "Sealed, corrosion-proof vessel", ar: "حاوية محكمة مقاومة للتآكل" },
      { en: "Integrated chambers & baffles", ar: "غرف وحواجز مدمجة" },
      { en: "Drop-in burial — no special bedding", ar: "دفن مباشر بلا فرش خاص" },
      { en: "Vent & inspection ports included", ar: "مخارج تهوية وفحص مشمولة" },
      { en: "Pump-sump options for sewerage", ar: "بدائل مصبات للصرف الصحي" },
    ],
    specGroups: [
      {
        name: { en: "Sizes", ar: "المقاسات" },
        rows: [
          { key: { en: "Residential", ar: "سكني" }, value: { en: "1.0 – 4.5 m³", ar: "1.0 – 4.5 م³" } },
          { key: { en: "Commercial", ar: "تجاري" }, value: { en: "6 – 30 m³ (multi-chamber)", ar: "6 – 30 م³ (غرف متعددة)" } },
          { key: { en: "Cover load", ar: "حمل الغطاء" }, value: { en: "Light vehicular (A15/B125)", ar: "مرور خفيف (A15/B125)" } },
        ],
      },
      {
        name: { en: "Construction", ar: "البناء" },
        rows: [
          { key: { en: "Material", ar: "المادة" }, value: { en: "GRP, isophthalic resin", ar: "GRP، راتنج إزوفثالك" } },
          { key: { en: "Access", ar: "الوصول" }, value: { en: "Ø600 mm inspection covers", ar: "أغطية فحص قطر 600 مم" } },
        ],
      },
    ],
    applications: ["wastewater", "hospitality", "residential", "infrastructure"],
    attributes: [
      { key: { en: "Technology", ar: "التقنية" }, value: { en: "Molded hand lay-up", ar: "صبّ يدوي بالقوالب" } },
      { key: { en: "Installation", ar: "التركيب" }, value: { en: "Below ground", ar: "تحت الأرض" } },
      { key: { en: "Warranty", ar: "الضمان" }, value: { en: "18 months", ar: "18 شهراً" } },
    ],
    faqs: [
      {
        q: { en: "Are these tanks suitable for burial under parking?", ar: "هل تصلح هذه الخزانات للدفن تحت المواقف؟" },
        a: {
          en: "Yes with the B125 cover option and proper backfill — tell us the load case in your RFQ and we will specify it.",
          ar: "نعم مع خيار غطاء B125 وردم صحيح — أخبرنا بحالة الحمل في طلب السعر وسنحدّد المواصفة.",
        },
      },
    ],
    gallery: [
      { kind: "product", caption: { en: "Septic tank — chambers visible", ar: "خزان مخلفات — الغرف ظاهرة" } },
      { kind: "installed", caption: { en: "Backfill on site", ar: "ردم في الموقع" } },
      { kind: "drawing", caption: { en: "Chamber arrangement", ar: "ترتيب الغرف" } },
    ],
    keyFacts: [
      { label: { en: "Capacity", ar: "السعة" }, value: { en: "1 – 30 m³", ar: "1 – 30 م³" } },
      { label: { en: "Cover", ar: "الغطاء" }, value: { en: "A15 / B125", ar: "A15 / B125" } },
      { label: { en: "Lead time", ar: "مدة التوريد" }, value: { en: "1–2 weeks", ar: "1–2 أسبوع" } },
    ],
    relatedProducts: ["grp-lining-on-rcc-tank", "cold-press-grp-panel-tank"],
    boughtWith: ["grp-lining-on-rcc-tank"],
    technology: "hand-layup",
    sizeBuckets: ["compact", "medium"],
    insulation: "n/a",
    certifications: ["iso"],
  },
  {
    slug: "grp-planter-box",
    group: "architectural",
    name: { en: "GRP Planter Boxes", ar: "صناديق زراعة GRP" },
    pitch: {
      en: "Lightweight architectural planters in any shape and finish — concrete looks without the weight.",
      ar: "صناديق زراعة خفيفة بأي شكل وتشطيب — مظهر الخرسانة دون الوزن.",
    },
    description: [
      {
        en: "GRP planters replicate stone, concrete or metal finishes at a fraction of the weight — critical for rooftop and balcony landscapes where structural load is limited.",
        ar: "تكرّر صناديق GRP تشطيبات الحجر والخرسانة والمعدن بوزن أصغر بكثير — حاسم لأسطح وبلكونات حيث الحمولة الإنشائية محدودة.",
      },
      {
        en: "Internal drainage, waterproof membrane and frost-resistant gel coat are standard; custom branding, curves and integrated irrigation channels available.",
        ar: "التصريف الداخلي وطبقة العزل وطلاء الجل مقاوم للصقيع قياسي؛ والشعارات والمنحنيات وقنوات الري المخصصة متاحة.",
      },
    ],
    keyFeatures: [
      { en: "80% lighter than concrete equivalents", ar: "أخفّ بنسبة 80% من الخرسانة" },
      { en: "Stone / concrete / metal finishes", ar: "تشطيبات حجر وخرسانة ومعدن" },
      { en: "Integrated drainage & irrigation channels", ar: "تصريف وقنوات ري مدمجة" },
      { en: "Rooftop-optimized weight", ar: "وزن مناسب للأسطح" },
      { en: "UV & frost-resistant gel coat", ar: "طلاء جل مقاوم للأشعة والصقيع" },
    ],
    specGroups: [
      {
        name: { en: "Options", ar: "الخيارات" },
        rows: [
          { key: { en: "Shapes", ar: "الأشكال" }, value: { en: "Rectangular, trough, curved, custom", ar: "مستطيل، مزراب، منحني، مخصص" } },
          { key: { en: "Wall thickness", ar: "سماكة الجدار" }, value: { en: "4 – 8 mm", ar: "4 – 8 مم" } },
          { key: { en: "Drainage", ar: "التصريف" }, value: { en: "Overflow + plug outlet", ar: "فيضان + مخرج بأداة" } },
        ],
      },
    ],
    applications: ["landscaping", "hospitality", "residential"],
    attributes: [
      { key: { en: "Technology", ar: "التقنية" }, value: { en: "Molded GRP", ar: "GRP مصبوب" } },
      { key: { en: "Finish", ar: "التشطيب" }, value: { en: "Any RAL / stone texture", ar: "أي لون RAL / نسيج حجري" } },
    ],
    faqs: [
      {
        q: { en: "Are they suitable for rooftops?", ar: "هل تناسب الأسطح؟" },
        a: {
          en: "Yes — their light weight is the main reason designers specify them on roofs and balconies.",
          ar: "نعم — خفافها هو السبب الرئيس لاعتمادهم على الأسس والبلكونات.",
        },
      },
    ],
    gallery: [
      { kind: "product", caption: { en: "Trough planter — stone finish", ar: "مزراب زراعة — تشطيب حجري" } },
      { kind: "installed", caption: { en: "Hotel terrace landscaping", ar: "تشجير تراس فندق" } },
      { kind: "drawing", caption: { en: "Custom curve plan", ar: "مخطط منحنى مخصص" } },
    ],
    keyFacts: [
      { label: { en: "Weight", ar: "الوزن" }, value: { en: "~80% of concrete", ar: "~80% من الخرسانة" } },
      { label: { en: "Lead time", ar: "مدة التوريد" }, value: { en: "2–3 weeks", ar: "2–3 أسابيع" } },
    ],
    relatedProducts: ["prefabricated-grp-plunge-pools", "grp-sand-trap-bucket"],
    boughtWith: ["prefabricated-grp-plunge-pools"],
    technology: "hand-layup",
    sizeBuckets: ["compact"],
    insulation: "n/a",
    certifications: ["iso"],
  },
  {
    slug: "grp-sand-trap-bucket",
    group: "specialty",
    name: { en: "GRP Sand Trap Bucket", ar: "دلو فخّار الرمل GRP" },
    pitch: {
      en: "Durable GRP buckets for beach volleyball courts and playgrounds — UV-stable, stackable, custom sizes.",
      ar: "دلاء GRP متينة لملاعب كرة الشاطئ وأماكن اللعب — مقاومة للأشعة وقابلة للتكديس بمقاسات مخصصة.",
    },
    description: [
      {
        en: "Manufactured from high-grade GRP, our sand trap buckets withstand constant UV exposure and abrasion without rust — a long-service alternative to steel and concrete boxes.",
        ar: "مصنوعة من GRP عالي الجودة، تتحمّل دلاءنا التعرض المستمر للأشعة والاحتكاك دون صدأ — بديل طويل العمر للصناديق الحديدية والخرسانية.",
      },
      {
        en: "Supplied in standard playground sizes or to your dimensions, with lifting points and optional drain holes.",
        ar: "تُورَّد بمقاسات ملاعب قياسية أو حسب أبعادك، مع نقاط رفع وثقوب تصريف اختيارية.",
      },
    ],
    keyFeatures: [
      { en: "UV & corrosion resistant", ar: "مقاومة للأشعة والتآكل" },
      { en: "Stackable for transport", ar: "قابلة للتكديس للنقل" },
      { en: "Custom dimensions on request", ar: "أبعاد مخصصة عند الطلب" },
      { en: "Integrated lifting points", ar: "نقاط رفع مدمجة" },
    ],
    specGroups: [
      {
        name: { en: "Sizes", ar: "المقاسات" },
        rows: [
          { key: { en: "Standard", ar: "قياسي" }, value: { en: "1.5 × 1.5 × 0.6 m", ar: "1.5 × 1.5 × 0.6 م" } },
          { key: { en: "Custom", ar: "مخصص" }, value: { en: "To drawing", ar: "حسب الرسم" } },
        ],
      },
    ],
    applications: ["infrastructure", "residential"],
    attributes: [
      { key: { en: "Technology", ar: "التقنية" }, value: { en: "Molded GRP", ar: "GRP مصبوب" } },
      { key: { en: "Color", ar: "اللون" }, value: { en: "Sand / custom RAL", ar: "رملي / أي لون RAL" } },
    ],
    faqs: [
      {
        q: { en: "Can you produce to our drawing?", ar: "هل يمكن التصنيع حسب رسمنا؟" },
        a: { en: "Yes — send the drawing with your RFQ for a tailored price.", ar: "نعم — أرسل الرسم مع طلب السعر للحصول على تسعير مخصص." },
      },
    ],
    gallery: [
      { kind: "product", caption: { en: "Sand trap bucket", ar: "دلو فخّار الرمل" } },
      { kind: "installed", caption: { en: "Beach court installation", ar: "تركيب ملعب شاطئ" } },
      { kind: "drawing", caption: { en: "Dimensioned drawing", ar: "رسم بالأبعاد" } },
    ],
    keyFacts: [
      { label: { en: "Standard size", ar: "المقاس القياسي" }, value: { en: "1.5 × 1.5 × 0.6 m", ar: "1.5 × 1.5 × 0.6 م" } },
      { label: { en: "Lead time", ar: "مدة التوريد" }, value: { en: "1–2 weeks", ar: "1–2 أسبوع" } },
    ],
    relatedProducts: ["grp-planter-box", "grp-septic-tank"],
    boughtWith: ["grp-planter-box"],
    technology: "hand-layup",
    sizeBuckets: ["compact"],
    insulation: "n/a",
    certifications: ["iso"],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function relatedInGroup(product: Product, limit = 4): Product[] {
  return products.filter((p) => p.group === product.group && p.slug !== product.slug).slice(0, limit);
}
