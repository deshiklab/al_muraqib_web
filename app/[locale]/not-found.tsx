import Link from "next/link";
import { getDict, isLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export default async function NotFound({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}) {
  const raw = (await params)?.locale;
  const locale: Locale = raw && isLocale(raw) ? raw : "en";
  const d = getDict(locale);

  return (
    <main className="min-h-[70vh] grid place-items-center px-4">
      <div className="text-center max-w-md">
        <p className="font-heading font-black text-7xl text-gold-500">404</p>
        <h1 className="mt-4 text-2xl">{d.notFound.title}</h1>
        <p className="mt-2 text-slate-500">{d.notFound.text}</p>
        <Link
          href={`/${locale}`}
          className="inline-block mt-6 bg-navy-900 text-white font-bold px-6 py-3 rounded-[10px] hover:bg-brand-700 transition-colors"
        >
          {d.notFound.cta}
        </Link>
      </div>
    </main>
  );
}
