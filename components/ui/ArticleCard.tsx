import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { t } from "@/lib/utils";
import type { Article, Locale } from "@/lib/types";

export default function ArticleCard({
  article,
  locale,
  href,
}: {
  article: Article;
  locale: Locale;
  href: string;
}) {
  const date = new Date(article.date).toLocaleDateString(locale === "ar" ? "ar-AE" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="group bg-white rounded-[12px] border border-slate-200/80 overflow-hidden hover:shadow-soft transition-all flex flex-col">
      <Link href={href} className="p-5 border-b border-slate-100 bg-gradient-to-br from-navy-900 to-navy-800 relative overflow-hidden">
        <span className="absolute -end-6 -bottom-6 w-28 h-28 rounded-full bg-gold-500/10" />
        <span className="relative text-gold-400 text-[10px] font-black uppercase tracking-[0.18em]">
          {t(article.category, locale)}
        </span>
        <span className="relative block text-white/50 text-xs mt-1 flex items-center gap-1.5">
          <Icon name="clock" className="w-3.5 h-3.5" />
          {article.readingMinutes} {locale === "en" ? "min read" : "دقائق قراءة"}
        </span>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-navy-900 text-base leading-snug group-hover:text-brand-700 transition-colors line-clamp-2">
          {t(article.title, locale)}
        </h3>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">
          {t(article.excerpt, locale)}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs">
          <time className="text-slate-500">{date}</time>
          <span className="inline-flex items-center gap-1 font-bold text-brand-700 group-hover:gap-2 transition-all">
            {locale === "en" ? "Read" : "اقرأ"}
            <Icon name="arrowRight" className="w-3.5 h-3.5 flip-x" />
          </span>
        </div>
      </div>
    </article>
  );
}
