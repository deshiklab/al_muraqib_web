import type { L } from "@/lib/types";

/** Canonical service list — ids match app/[locale]/(site)/services/page.tsx blocks */
export const serviceList: { id: string; title: L }[] = [
  { id: "supply", title: { en: "Product supply", ar: "توريد المنتجات", bn: "পণ্য সরবরাহ" } },
  { id: "install", title: { en: "Installation & commissioning", ar: "التركيب والتشغيل", bn: "স্থাপন ও কমিশনিং" } },
  { id: "lining", title: { en: "GRP lining application", ar: "تنفيذ بطانات GRP", bn: "জিআরপি লাইনিং" } },
  { id: "repair", title: { en: "Repair & maintenance", ar: "الإصلاح والصيانة", bn: "মেরামত ও রক্ষণাবেক্ষণ" } },
  { id: "fabrication", title: { en: "Custom fabrication", ar: "التصنيع المخصص", bn: "কাস্টম ফ্যাব্রিকেশন" } },
];
