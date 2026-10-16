"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { cn, tl, track } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export type HeroSlide = {
  img: string;
  object?: string;
  eyebrow: string;
  title1: string;
  title2: string;
  text: string;
};

/**
 * Homepage hero slider — full-bleed background images with overlaid text.
 * Crossfades every 6.5 s, pauses on hover / hidden tab, respects
 * reduced-motion (no auto-advance), with dots + arrow controls.
 */
export default function HeroSlider({
  slides,
  locale,
  d,
  children,
}: {
  slides: HeroSlide[];
  locale: Locale;
  children?: React.ReactNode;
  d: {
    home: { heroCta1: string; heroCta2: string; heroPrev?: string; heroNext?: string };
  };
}) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);
  const count = slides.length;

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const go = useCallback(
    (n: number) => setIdx(((n % count) + count) % count),
    [count]
  );

  useEffect(() => {
    if (paused || reduced.current || count < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % count), 6500);
    return () => clearInterval(id);
  }, [paused, count]);

  // Pause while the tab is hidden
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const slide = slides[idx];

  return (
    <section
      className="relative min-h-[86vh] lg:min-h-[92vh] flex items-center overflow-hidden bg-navy-950"
      aria-roledescription="carousel"
      aria-label={tl(locale, "Highlights", "أبرز الحلول")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ---------- Slide backgrounds ---------- */}
      {slides.map((s, i) => (
        <div
          key={s.img}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-out",
            i === idx ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={i !== idx}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_BASE ?? ""}${s.img}`}
            alt=""
            width={1600}
            height={900}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            decoding="async"
            className={cn("h-full w-full object-cover", s.object ?? "object-center")}
          />
        </div>
      ))}

      {/* ---------- Contrast scrims (navy-hero rule: keep white text legible) ---------- */}
      <div className="absolute inset-0 bg-navy-950/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-navy-950/30" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-navy-950/90 to-transparent" />
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-[size:48px_48px] text-white" />

      {/* ---------- Content ---------- */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-28 w-full">
        <div key={idx} className="animate-[megaIn_0.55s_ease-out]">
          <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold-500 bg-gold-500/10 ring-1 ring-gold-500/30 rounded-full px-4 py-2">
            <Icon name="shield" className="w-4 h-4" />
            {slide.eyebrow}
          </p>
          <h1 className="mt-6 font-heading font-black text-white text-[2.25rem] leading-[1.08] sm:text-5xl lg:text-6xl max-w-4xl text-balance">
            {slide.title1}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
              {slide.title2}
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-slate-200 leading-relaxed [text-shadow:0_1px_14px_rgba(2,6,23,0.65)]">
            {slide.text}
          </p>
        </div>

        <div className="mt-9 flex flex-col sm:flex-row gap-4">
          <Link
            href={`/${locale}/get-quotation`}
            className="inline-flex items-center justify-center gap-2.5 bg-gold-500 text-navy-950 font-bold text-base px-8 py-4 rounded-[10px] hover:bg-gold-600 hover:text-white transition-colors"
            onClick={() => track("cta_hero_quote")}
          >
            <Icon name="file" className="w-5 h-5" />
            {d.home.heroCta1}
          </Link>
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center justify-center gap-2.5 bg-white/10 backdrop-blur-sm text-white font-bold text-base px-8 py-4 rounded-[10px] ring-1 ring-white/25 hover:bg-white hover:text-navy-900 transition-colors"
          >
            {d.home.heroCta2}
            <Icon name="arrowRight" className="w-5 h-5 flip-x" />
          </Link>
        </div>

        {children}

        {/* Controls */}
        <div className="mt-10 flex items-center gap-5">
          {count > 1 && (
            <>
              <div className="flex items-center gap-2" role="tablist" aria-label={tl(locale, "Slides", "الشرائح")}>
                {slides.map((s, i) => (
                  <button
                    key={s.img}
                    type="button"
                    role="tab"
                    aria-selected={i === idx}
                    aria-label={`${tl(locale, "Slide", "شريحة")} ${i + 1}`}
                    onClick={() => {
                      go(i);
                      track("hero_slide_dot", { i });
                    }}
                    className={cn(
                      "h-1.5 rounded-full transition-all cursor-pointer",
                      i === idx ? "w-8 bg-gold-500" : "w-1.5 bg-white/40 hover:bg-white/70"
                    )}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    go(idx - 1);
                    track("hero_slide_prev");
                  }}
                  aria-label={d.home.heroPrev ?? (tl(locale, "Previous slide", "الشريحة السابقة"))}
                  className="grid place-items-center w-10 h-10 rounded-full bg-white/10 text-white ring-1 ring-white/25 hover:bg-gold-500 hover:text-navy-950 transition-colors cursor-pointer"
                >
                  <Icon name="arrowRight" className="w-4 h-4 rotate-180 flip-x" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    go(idx + 1);
                    track("hero_slide_next");
                  }}
                  aria-label={d.home.heroNext ?? (tl(locale, "Next slide", "الشريحة التالية"))}
                  className="grid place-items-center w-10 h-10 rounded-full bg-white/10 text-white ring-1 ring-white/25 hover:bg-gold-500 hover:text-navy-950 transition-colors cursor-pointer"
                >
                  <Icon name="arrowRight" className="w-4 h-4 flip-x" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#stats"
        aria-label={tl(locale, "Scroll to content", "مرّر للأسفل")}
        className="hidden md:flex absolute bottom-7 inset-x-0 flex-col items-center gap-1 text-white/45 hover:text-gold-400 transition-colors"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.3em]">{tl(locale, "Scroll", "مرّر")}</span>
        <Icon name="chevronDown" className="w-5 h-5 scroll-cue" />
      </a>
    </section>
  );
}
