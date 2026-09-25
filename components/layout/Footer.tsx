import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { site, clients } from "@/lib/data/site";
import { productGroups } from "@/lib/data/nav";
import { t } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import type { Dict } from "@/lib/i18n";
import NewsletterForm from "./NewsletterForm";

export default function Footer({ locale, d }: { locale: Locale; d: Dict }) {
  const p = `/${locale}`;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand + newsletter */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="grid place-items-center w-11 h-11 rounded-xl bg-white/10 ring-1 ring-white/15">
              <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7 text-gold-500" aria-hidden="true">
                <path d="M16 3 5 7.5v8.2C5 23 10 28.2 16 29.5c6-1.3 11-6.5 11-13.8V7.5L16 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M10.5 17c1.8-3.4 3.6-5 5.5-5s3.7 1.6 5.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="14.5" r="1.6" fill="currentColor" />
              </svg>
            </span>
            <div className="leading-none">
              <p className="font-heading font-black text-white text-lg">AL MURAQIB</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-gold-500 mt-1">Fiber Glass Ind. L.L.C</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-5">{d.meta.tagline}</p>
          <div className="flex gap-3 mb-6">
            {site.socials.map((s) => (
              <a
                key={s.icon}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.icon}
                className="grid place-items-center w-9 h-9 rounded-lg bg-white/5 hover:bg-gold-500 hover:text-navy-950 transition-colors"
              >
                <Icon name={s.icon} className="w-4 h-4" />
              </a>
            ))}
          </div>
          <NewsletterForm locale={locale} d={d} />
        </div>

        {/* Quick nav */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-6 h-px bg-gold-500" />
            {d.footer.quickNav}
          </h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { href: `${p}/company/about`, label: d.nav.about },
              { href: `${p}/company/certifications`, label: d.nav.certifications },
              { href: `${p}/services`, label: d.nav.services },
              { href: `${p}/projects`, label: d.nav.projects },
              { href: `${p}/blog`, label: d.nav.blog },
              { href: `${p}/knowledge-base`, label: d.nav.knowledgeBase },
              { href: `${p}/faq`, label: d.nav.faq },
              { href: `${p}/contact`, label: d.nav.contact },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-slate-400 hover:text-gold-400 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Product groups */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-6 h-px bg-gold-500" />
            {d.footer.productGroups}
          </h4>
          <ul className="space-y-2.5 text-sm">
            {productGroups.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`${p}/products?group=${g.slug}`}
                  className="text-slate-400 hover:text-gold-400 transition-colors"
                >
                  {t(g.name, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + capabilities */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-6 h-px bg-gold-500" />
            {d.footer.capabilities}
          </h4>
          <ul className="space-y-2.5 text-sm mb-6">
            {d.footer.capabilitiesList.map((c) => (
              <li key={c} className="text-slate-400 flex items-start gap-2">
                <Icon name="check" className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                {c}
              </li>
            ))}
          </ul>
          <div className="space-y-2.5 text-sm">
            <a href={`tel:${site.phoneIntl}`} className="flex items-center gap-2 text-slate-400 hover:text-gold-400">
              <Icon name="phone" className="w-4 h-4 text-gold-500" /> {site.phone}
            </a>
            <a href={`mailto:${site.emails.sales}`} className="flex items-center gap-2 text-slate-400 hover:text-gold-400">
              <Icon name="mail" className="w-4 h-4 text-gold-500" /> {site.emails.sales}
            </a>
            <p className="flex items-start gap-2 text-slate-400">
              <Icon name="pin" className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
              <span className="leading-relaxed">{t(site.address, locale)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Accreditation strip */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              {d.footer.accreditation}
            </span>
            {["ISO 9001:2015", "DM Approved", "ESMA / ECAS"].map((b) => (
              <span key={b} className="px-3 py-1 rounded-full bg-white/5 ring-1 ring-white/10 text-slate-300 font-semibold">
                {b}
              </span>
            ))}
            <span className="hidden md:flex gap-3 opacity-60">
              {clients.slice(0, 4).map((c) => (
                <span key={c.name} className="text-slate-400 font-heading font-bold tracking-wider text-[11px]">
                  {c.logoText}
                </span>
              ))}
            </span>
          </div>
          <p className="text-center">
            © {year} {site.nameShort}. {d.footer.rights}{" "}
            <Link href={`${p}/privacy-policy`} className="hover:text-gold-400 mx-1">
              {d.footer.privacy}
            </Link>
            ·
            <Link href={`${p}/terms`} className="hover:text-gold-400 mx-1">
              {d.footer.terms}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
