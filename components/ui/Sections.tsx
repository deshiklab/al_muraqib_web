import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Motion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn(center && "text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "text-[11px] font-black uppercase tracking-[0.22em] mb-3 flex items-center gap-2",
            center && "justify-center",
            light ? "text-gold-500" : "text-gold-600"
          )}
        >
          <span className={cn("w-6 h-px bg-current", !center && "hidden sm:block")} />
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-heading font-black text-3xl md:text-4xl leading-tight text-balance",
          light ? "text-white" : "text-navy-900"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-3 text-base md:text-lg leading-relaxed max-w-2xl", center && "mx-auto", light ? "text-slate-300" : "text-slate-500")}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

export function CtaBand({
  title,
  text,
  button,
  href,
  locale,
}: {
  title: string;
  text: string;
  button: string;
  href: string;
  locale: string;
}) {
  void locale;
  return (
    <section className="relative overflow-hidden bg-navy-900">
      <div className="absolute inset-0 opacity-[0.16] bg-[radial-gradient(circle_at_15%_20%,#0284c7_0,transparent_45%),radial-gradient(circle_at_85%_80%,#f59e0b_0,transparent_40%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-start">
        <Reveal className="max-w-2xl">
          <h2 className="font-heading font-black text-3xl md:text-4xl text-white leading-tight">{title}</h2>
          <p className="mt-3 text-slate-300 text-lg">{text}</p>
        </Reveal>
        <Reveal delay={120}>
          <Link
            href={href}
            className="inline-flex items-center gap-2.5 bg-gold-500 text-navy-950 font-bold text-base px-8 py-4 rounded-[10px] hover:bg-gold-600 hover:text-white transition-colors shadow-[0_10px_30px_-10px_rgba(245,158,11,0.6)]"
          >
            <Icon name="file" className="w-5 h-5" />
            {button}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
