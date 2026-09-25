"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { cn, track } from "@/lib/utils";
import { locales, type Dict } from "@/lib/i18n";
import { megaColumns } from "@/lib/data/nav";
import { site } from "@/lib/data/site";
import { products } from "@/lib/data/catalog";
import { articlesByKind } from "@/lib/data/content";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";

interface HeaderProps {
  locale: Locale;
  d: Dict;
}

export default function Header({ locale, d }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<"products" | "company" | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [selIdx, setSelIdx] = useState(0);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawer(false);
    setSearch(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setDrawer(false);
        setSearch(false);
      }
      if (e.key === "/" && !search && !drawer) {
        const tag = (document.activeElement as HTMLElement)?.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          e.preventDefault();
          setSearch(true);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [search, drawer]);

  useEffect(() => {
    document.body.style.overflow = drawer || search ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer, search]);

  const transparent = isHome && !scrolled && !drawer && !search;
  const prefix = `/${locale}`;

  const hoverOpen = (menu: "products" | "company") => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  };
  const hoverClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 220);
  };

  const switchLocale = (next: Locale) => {
    document.cookie = `locale=${next};path=/;max-age=31536000;samesite=lax`;
    const rest = pathname.replace(new RegExp(`^/${locale}`), "") || "";
    track("language_switch", { to: next });
    router.push(`/${next}${rest}`);
  };

  // Search results (live, grouped)
  const q = query.trim().toLowerCase();
  const results = q
    ? {
        products: products
          .filter((p) => t(p.name, locale).toLowerCase().includes(q) || p.slug.includes(q))
          .slice(0, 4),
        articles: articlesByKind("blog")
          .concat(articlesByKind("kb"))
          .filter((a) => t(a.title, locale).toLowerCase().includes(q))
          .slice(0, 3),
      }
    : null;

  // Flat list for keyboard navigation ( ↑ ↓ Enter )
  const flatResults = results
    ? [
        ...results.products.map((p) => `${prefix}/products/${p.slug}`),
        ...results.articles.map(
          (a) => `${prefix}/${a.kind === "blog" ? "blog" : "knowledge-base"}/${a.slug}`
        ),
      ]
    : [];

  useEffect(() => setSelIdx(0), [query]);

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (flatResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelIdx((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = flatResults[selIdx] ?? flatResults[0];
      if (target) {
        router.push(target);
        setSearch(false);
        setQuery("");
      }
    }
  };

  const navLinkBase =
    "text-[13px] font-bold uppercase tracking-wide transition-colors px-3 py-2 flex items-center gap-1";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          transparent ? "bg-transparent" : "bg-white shadow-[0_1px_0_rgba(15,23,42,0.08)]"
        )}
        onMouseLeave={hoverClose}
      >
        {/* Utility bar */}
        <div
          className={cn(
            "hidden lg:block transition-colors",
            transparent ? "bg-navy-950/70 backdrop-blur-sm" : "bg-navy-900"
          )}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-[12px] text-slate-300">
            <div className="flex items-center gap-5">
              <a
                href={`mailto:${site.emails.sales}`}
                className="hover:text-gold-400 transition-colors flex items-center gap-1.5"
              >
                <Icon name="mail" className="w-3.5 h-3.5 text-gold-500" />
                {site.emails.sales}
              </a>
              <a
                href={`tel:${site.phoneIntl}`}
                className="hover:text-gold-400 transition-colors flex items-center gap-1.5"
                onClick={() => track("phone_click", { where: "topbar" })}
              >
                <Icon name="phone" className="w-3.5 h-3.5 text-gold-500" />
                {site.phone}
              </a>
              <span className="hidden xl:flex items-center gap-1.5 text-slate-400">
                <Icon name="clock" className="w-3.5 h-3.5" />
                {locale === "ar" ? "الاثنين – السبت، 8:00 – 18:00" : "Mon–Sat · 8:00–18:00 GST"}
              </span>
            </div>
            <div className="flex items-center gap-5">
              <span className="hidden xl:inline text-slate-400">{d.topbar.quoteFast}</span>
              <div className="flex items-center gap-1 rounded-full bg-white/10 p-0.5" aria-label={d.common.language}>
                {locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => switchLocale(loc)}
                    aria-current={loc === locale}
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer",
                      loc === locale ? "bg-gold-500 text-navy-950" : "hover:text-white text-slate-300"
                    )}
                  >
                    {loc === "en" ? "EN" : "AR"}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {site.socials.map((s) => (
                  <a
                    key={s.icon}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold-400 transition-colors"
                    aria-label={s.icon}
                  >
                    <Icon name={s.icon} className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div
          className={cn(
            "transition-colors relative",
            transparent ? "bg-navy-950/30 backdrop-blur-md border-b border-white/10" : "bg-white"
          )}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-[68px] lg:h-[76px] flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href={prefix} className="flex items-center gap-3 shrink-0 group" aria-label={site.name}>
              <span
                className={cn(
                  "grid place-items-center w-11 h-11 rounded-xl transition-colors",
                  transparent ? "bg-white/10 ring-1 ring-white/20" : "bg-navy-900"
                )}
              >
                <LogoMark className="w-7 h-7 text-gold-500" />
              </span>
              <span className="flex flex-col leading-none">
                <span
                  className={cn(
                    "font-heading font-black text-lg tracking-tight transition-colors",
                    transparent ? "text-white" : "text-navy-900"
                  )}
                >
                  AL MURAQIB
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-600 mt-1">
                  Fiber Glass Ind. L.L.C
                </span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden xl:flex items-center gap-0.5" aria-label="Main">
              <NavLink href={prefix} transparent={transparent} className={navLinkBase}>
                {d.nav.home}
              </NavLink>

              {/* Company */}
              <div
                className="relative"
                onMouseEnter={() => hoverOpen("company")}
                onMouseLeave={hoverClose}
              >
                <button
                  onClick={() => setOpenMenu(openMenu === "company" ? null : "company")}
                  aria-expanded={openMenu === "company"}
                  className={cn(
                    navLinkBase,
                    "cursor-pointer",
                    transparent ? "text-white hover:text-gold-400" : "text-navy-900 hover:text-brand-700",
                    openMenu === "company" && (transparent ? "text-gold-400" : "text-brand-700")
                  )}
                >
                  {d.nav.company}
                  <Icon name="chevronDown" className={cn("w-3.5 h-3.5 transition-transform", openMenu === "company" && "rotate-180")} />
                </button>
                {openMenu === "company" && (
                  <Dropdown>
                    <DropdownLink href={`${prefix}/company/about`} label={d.nav.about} desc={locale === "en" ? "Story, mission, facility" : "القصة والرسالة والمنشأة"} />
                    <DropdownLink href={`${prefix}/company/certifications`} label={d.nav.certifications} desc={locale === "en" ? "ISO, DM, ESMA & test reports" : "ISO وبلدية دبي وESMA وتقارير الاختبار"} />
                    <DropdownLink href={`${prefix}/contact`} label={d.nav.contact} desc={locale === "en" ? "Factory address & map" : "عنوان المصنع والخريطة"} />
                  </Dropdown>
                )}
              </div>

              {/* Products trigger (panel lives at bar level, see below) */}
              <div
                className="relative"
                onMouseEnter={() => hoverOpen("products")}
                onMouseLeave={hoverClose}
              >
                <button
                  onClick={() => setOpenMenu(openMenu === "products" ? null : "products")}
                  aria-expanded={openMenu === "products"}
                  className={cn(
                    navLinkBase,
                    "cursor-pointer",
                    transparent ? "text-white hover:text-gold-400" : "text-navy-900 hover:text-brand-700",
                    openMenu === "products" && (transparent ? "text-gold-400" : "text-brand-700")
                  )}
                >
                  {d.nav.products}
                  <Icon name="chevronDown" className={cn("w-3.5 h-3.5 transition-transform", openMenu === "products" && "rotate-180")} />
                </button>
              </div>

              {[
                { href: `${prefix}/services`, label: d.nav.services },
                { href: `${prefix}/projects`, label: d.nav.projects },
                { href: `${prefix}/blog`, label: d.nav.blog },
                { href: `${prefix}/knowledge-base`, label: d.nav.knowledgeBase },
                { href: `${prefix}/faq`, label: d.nav.faq },
                { href: `${prefix}/contact`, label: d.nav.contact },
              ].map((item) => (
                <NavLink key={item.href} href={item.href} transparent={transparent} className={navLinkBase}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setSearch(true)}
                aria-label={d.nav.search}
                className={cn(
                  "p-2.5 rounded-lg transition-colors cursor-pointer",
                  transparent
                    ? "text-white hover:bg-white/10"
                    : "text-navy-900 hover:bg-slate-100"
                )}
              >
                <Icon name="search" className="w-5 h-5" />
              </button>
              <Link
                href={`${prefix}/get-quotation`}
                onClick={() => track("cta_header_quote")}
                className="hidden sm:inline-flex items-center gap-2 bg-gold-500 text-navy-950 font-bold text-sm px-5 py-3 rounded-[10px] hover:bg-gold-600 hover:text-white transition-colors"
              >
                <Icon name="file" className="w-4 h-4" />
                {d.nav.getQuote}
              </Link>
              <button
                onClick={() => setDrawer(true)}
                aria-label={d.nav.menu}
                className={cn(
                  "xl:hidden p-2.5 rounded-lg transition-colors cursor-pointer",
                  transparent ? "text-white hover:bg-white/10" : "text-navy-900 hover:bg-slate-100"
                )}
              >
                <Icon name="menu" className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* ============ Products mega panel — full viewport width, container-aligned ============ */}
          {openMenu === "products" && (
            <div
              className="hidden xl:block absolute top-full inset-x-0 z-50 bg-white border-b border-slate-200 shadow-dropdown mega-panel"
              onMouseEnter={() => {
                if (closeTimer.current) clearTimeout(closeTimer.current);
              }}
              onMouseLeave={hoverClose}
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-7 flex gap-7">
                {/* Promo panel */}
                <div className="w-[264px] shrink-0 bg-navy-800 text-white rounded-xl p-6 flex flex-col justify-between">
                  <div>
                    <p className="text-gold-500 text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
                      {d.mega.promoEyebrow}
                    </p>
                    <h3 className="font-heading font-black text-xl leading-tight mb-3 text-white">
                      {d.mega.promoTitle}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{d.mega.promoText}</p>
                  </div>
                  <Link
                    href={`${prefix}/products`}
                    className="mt-5 inline-flex justify-center bg-gold-500 text-navy-950 font-bold text-sm py-2.5 px-4 rounded-lg hover:bg-gold-600 hover:text-white transition-colors"
                    onClick={() => track("mega_promo_click")}
                  >
                    {d.mega.promoCta}
                  </Link>
                </div>

                {/* Link columns */}
                <div className="flex-1 grid grid-cols-3 gap-x-7 gap-y-6 min-w-0">
                  {megaColumns.map((col) => (
                    <div key={col.title.en} className="min-w-0">
                      <p className="text-brand-700 text-[10px] font-bold uppercase tracking-[0.18em] mb-1.5">
                        {t(col.eyebrow, locale)}
                      </p>
                      <h4 className="font-heading font-bold text-base text-navy-900 mb-1">
                        {t(col.title, locale)}
                      </h4>
                      <p className="text-xs text-slate-500 mb-3 leading-relaxed line-clamp-2">{t(col.desc, locale)}</p>
                      <ul className="space-y-2">
                        {col.links.map((l) => (
                          <li key={l.href}>
                            <Link
                              href={`${prefix}${l.href}`}
                              className="text-[13px] font-semibold text-slate-700 hover:text-brand-700 transition-colors flex items-center gap-1.5"
                            >
                              <Icon name="chevronRight" className="w-3 h-3 text-gold-500 flip-x shrink-0" />
                              <span className="truncate">{t(l.label, locale)}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {col.viewAll && (
                        <Link
                          href={`${prefix}${col.viewAll.href}`}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-gold-600"
                        >
                          {d.nav.allProducts}
                          <Icon name="arrowRight" className="w-3.5 h-3.5 flip-x" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {/* Featured / brochure block */}
                <div className="w-[220px] shrink-0">
                  <Link
                    href={`${prefix}/get-quotation?source=brochure`}
                    onClick={() => track("mega_featured_click")}
                    className="group block h-full rounded-xl p-5 bg-gradient-to-br from-navy-900 to-brand-700 text-white relative overflow-hidden"
                  >
                    <span className="absolute -end-8 -bottom-8 w-32 h-32 rounded-full bg-gold-500/20 group-hover:scale-125 transition-transform" />
                    <span className="grid place-items-center w-11 h-11 rounded-lg bg-gold-500 text-navy-950">
                      <Icon name="download" className="w-5 h-5" />
                    </span>
                    <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-gold-400">
                      {d.mega.featuredTitle}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold leading-snug">{d.mega.featuredText}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-gold-400 group-hover:gap-2.5 transition-all">
                      {d.mega.featuredCta}
                      <Icon name="arrowRight" className="w-3.5 h-3.5 flip-x" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ============ Mobile drawer ============ */}
      {drawer && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col xl:hidden" role="dialog" aria-modal="true" aria-label={d.nav.menu}>
          <div className="bg-navy-900 text-white">
            <div className="px-4 h-16 flex items-center justify-between">
              <span className="font-heading font-black text-lg">AL MURAQIB</span>
              <button onClick={() => setDrawer(false)} aria-label={d.nav.close} className="p-2 rounded-lg hover:bg-white/10 cursor-pointer">
                <Icon name="close" className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <MobileLink href={prefix} onClick={() => setDrawer(false)}>{d.nav.home}</MobileLink>

            <MobileAccordion title={d.nav.company} open={openGroup === "company"} onToggle={() => setOpenGroup(openGroup === "company" ? null : "company")}>
              <MobileLink href={`${prefix}/company/about`} onClick={() => setDrawer(false)}>{d.nav.about}</MobileLink>
              <MobileLink href={`${prefix}/company/certifications`} onClick={() => setDrawer(false)}>{d.nav.certifications}</MobileLink>
              <MobileLink href={`${prefix}/contact`} onClick={() => setDrawer(false)}>{d.nav.contact}</MobileLink>
            </MobileAccordion>

            <MobileAccordion title={d.nav.products} open={openGroup === "products"} onToggle={() => setOpenGroup(openGroup === "products" ? null : "products")}>
              <MobileLink href={`${prefix}/products`} onClick={() => setDrawer(false)} bold>{d.nav.allProducts}</MobileLink>
              {megaColumns.flatMap((c) => c.links).map((l) => (
                <MobileLink key={l.href} href={`${prefix}${l.href}`} onClick={() => setDrawer(false)} sub>
                  {t(l.label, locale)}
                </MobileLink>
              ))}
            </MobileAccordion>

            <MobileLink href={`${prefix}/services`} onClick={() => setDrawer(false)}>{d.nav.services}</MobileLink>
            <MobileLink href={`${prefix}/projects`} onClick={() => setDrawer(false)}>{d.nav.projects}</MobileLink>
            <MobileLink href={`${prefix}/blog`} onClick={() => setDrawer(false)}>{d.nav.blog}</MobileLink>
            <MobileLink href={`${prefix}/knowledge-base`} onClick={() => setDrawer(false)}>{d.nav.knowledgeBase}</MobileLink>
            <MobileLink href={`${prefix}/faq`} onClick={() => setDrawer(false)}>{d.nav.faq}</MobileLink>
            <MobileLink href={`${prefix}/contact`} onClick={() => setDrawer(false)}>{d.nav.contact}</MobileLink>
          </div>
          <div className="border-t border-slate-200 p-4 space-y-3 bg-slate-50">
            <Link
              href={`${prefix}/get-quotation`}
              onClick={() => track("cta_mobile_quote")}
              className="flex items-center justify-center gap-2 w-full bg-gold-500 text-navy-950 font-bold py-3.5 rounded-[10px]"
            >
              <Icon name="file" className="w-5 h-5" />
              {d.nav.getQuote}
            </Link>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 rounded-full bg-slate-200 p-1">
                {locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => switchLocale(loc)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer",
                      loc === locale ? "bg-navy-900 text-white" : "text-slate-600"
                    )}
                  >
                    {loc === "en" ? "EN" : "AR"}
                  </button>
                ))}
              </div>
              <a
                href={`tel:${site.phoneIntl}`}
                className="flex items-center gap-2 font-semibold text-brand-700"
                onClick={() => track("phone_click", { where: "drawer" })}
              >
                <Icon name="phone" className="w-4 h-4" />
                {site.phone}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ============ Search overlay ============ */}
      {search && (
        <div className="fixed inset-0 z-[70] bg-navy-950/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={d.nav.search}>
          <div className="mx-auto max-w-2xl mt-[12vh] px-4">
            <div className="bg-white rounded-xl shadow-dropdown overflow-hidden">
              <div className="flex items-center gap-3 px-5 border-b border-slate-100">
                <Icon name="search" className="w-5 h-5 text-slate-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onSearchKeyDown}
                  placeholder={d.nav.searchPlaceholder}
                  className="flex-1 py-4 text-base outline-none bg-transparent"
                  aria-label={d.nav.search}
                  role="combobox"
                  aria-expanded={flatResults.length > 0}
                  aria-activedescendant={flatResults[selIdx] ? `sr-${selIdx}` : undefined}
                />
                <button onClick={() => setSearch(false)} aria-label={d.nav.close} className="p-2 text-slate-400 hover:text-navy-900 cursor-pointer">
                  <Icon name="close" className="w-5 h-5" />
                </button>
              </div>
              <div className="max-h-[55vh] overflow-y-auto p-3">
                {!q && (
                  <p className="text-sm text-slate-400 px-2 py-6 text-center">
                    {locale === "en"
                      ? "Start typing — press / anytime to search"
                      : "ابدأ الكتابة — اضغط / في أي وقت للبحث"}
                  </p>
                )}
                {q && results && (
                  <>
                    {results.products.length > 0 && (
                      <Group label={locale === "en" ? "Products" : "المنتجات"}>
                        {results.products.map((p, i) => (
                          <ResultLink
                            key={p.slug}
                            id={`sr-${i}`}
                            href={`${prefix}/products/${p.slug}`}
                            selected={selIdx === i}
                            onHover={() => setSelIdx(i)}
                            onClick={() => setSearch(false)}
                          >
                            <span className="grid place-items-center w-9 h-9 rounded-lg bg-navy-900 text-gold-500">
                              <Icon name="tank" className="w-4.5 h-4.5" />
                            </span>
                            <span>
                              <span className="block font-semibold text-navy-900 text-sm">{t(p.name, locale)}</span>
                              <span className="block text-xs text-slate-500 truncate max-w-[380px]">{t(p.pitch, locale)}</span>
                            </span>
                          </ResultLink>
                        ))}
                      </Group>
                    )}
                    {results.articles.length > 0 && (
                      <Group label={locale === "en" ? "Articles & Guides" : "مقالات وأدلة"}>
                        {results.articles.map((a, i) => (
                          <ResultLink
                            key={a.slug}
                            id={`sr-${results.products.length + i}`}
                            href={`${prefix}/${a.kind === "blog" ? "blog" : "knowledge-base"}/${a.slug}`}
                            selected={selIdx === results.products.length + i}
                            onHover={() => setSelIdx(results.products.length + i)}
                            onClick={() => setSearch(false)}
                          >
                            <span className="grid place-items-center w-9 h-9 rounded-lg bg-gold-500 text-navy-950">
                              <Icon name="file" className="w-4.5 h-4.5" />
                            </span>
                            <span className="font-semibold text-navy-900 text-sm">{t(a.title, locale)}</span>
                          </ResultLink>
                        ))}
                      </Group>
                    )}
                    {results.products.length === 0 && results.articles.length === 0 && (
                      <p className="text-sm text-slate-500 px-2 py-6 text-center">{d.common.emptyText}</p>
                    )}
                  </>
                )}
              </div>
              {flatResults.length > 0 && (
                <div className="flex items-center justify-center gap-4 px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono">↑↓</kbd>
                    {locale === "en" ? "navigate" : "تنقل"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono">↵</kbd>
                    {locale === "en" ? "open" : "فتح"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono">Esc</kbd>
                    {locale === "en" ? "close" : "إغلاق"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- sub-components ---------- */

function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path d="M16 3 5 7.5v8.2C5 23 10 28.2 16 29.5c6-1.3 11-6.5 11-13.8V7.5L16 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10.5 17c1.8-3.4 3.6-5 5.5-5s3.7 1.6 5.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="14.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

function NavLink({
  href,
  transparent,
  className,
  children,
}: {
  href: string;
  transparent: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRoot = /^\/(en|ar)$/.test(href);
  const active = isRoot ? pathname === href || pathname === `${href}/` : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        className,
        "relative",
        active
          ? transparent
            ? "text-gold-400"
            : "text-brand-700"
          : transparent
            ? "text-white hover:text-gold-400"
            : "text-navy-900 hover:text-brand-700",
        active &&
          "after:absolute after:-bottom-1 after:inset-x-3 after:h-[2.5px] after:rounded-full after:bg-gold-500"
      )}
    >
      {children}
    </Link>
  );
}

function Dropdown({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-full start-0 mt-1 w-64 bg-white rounded-xl shadow-dropdown border border-slate-100 p-2 z-50">
      {children}
    </div>
  );
}

function DropdownLink({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <Link
      href={href}
      className="block rounded-lg px-4 py-3 hover:bg-slate-50 transition-colors"
    >
      <span className="block text-sm font-bold text-navy-900">{label}</span>
      <span className="block text-xs text-slate-500 mt-0.5">{desc}</span>
    </Link>
  );
}

function MobileLink({
  href,
  onClick,
  children,
  sub,
  bold,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
  sub?: boolean;
  bold?: boolean;
}) {
  const pathname = usePathname();
  const isRoot = /^\/(en|ar)$/.test(href);
  const active = isRoot ? pathname === href || pathname === `${href}/` : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "block py-3 border-b border-slate-100 text-navy-900",
        sub ? "ps-6 text-sm text-slate-600" : "font-bold",
        bold && "text-brand-700",
        active && !sub && !bold && "text-brand-700"
      )}
    >
      {children}
    </Link>
  );
}

function MobileAccordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-slate-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 font-bold text-navy-900 cursor-pointer"
        aria-expanded={open}
      >
        {title}
        <Icon name="chevronDown" className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <p className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      {children}
    </div>
  );
}

function ResultLink({
  href,
  onClick,
  children,
  selected,
  onHover,
  id,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
  selected?: boolean;
  onHover?: () => void;
  id?: string;
}) {
  return (
    <Link
      id={id}
      href={href}
      onClick={onClick}
      onMouseEnter={onHover}
      className={cn(
        "flex items-center gap-3 rounded-lg p-2 transition-colors",
        selected ? "bg-slate-100 ring-1 ring-slate-200" : "hover:bg-slate-50"
      )}
    >
      {children}
    </Link>
  );
}
