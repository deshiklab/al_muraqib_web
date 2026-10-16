import type { Metadata } from "next";
import { getDict, dir, isLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import "@/app/globals.css";
import JsonLd, { absUrl } from "@/components/seo/JsonLd";
import { site } from "@/lib/data/site";

// Fonts loaded at runtime from the visitor's browser (build-host has no
// access to fonts.googleapis.com). Fallbacks defined in globals.css.
const fontLinks = (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&family=Montserrat:wght@500;600;700;800;900&family=Noto+Kufi+Arabic:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700;800&display=swap"
      rel="stylesheet"
    />
  </>
);

/* No-flash theme init: applies the stored (or OS) theme before first paint.
   Keep in sync with localStorage key in components/layout/ThemeToggle.tsx. */
const themeInit = `
(function () {
  try {
    var t = localStorage.getItem("alm-theme");
    if (!t) t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    if (t === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

/* Analytics: drop-in GA4 — set NEXT_PUBLIC_GA_ID (e.g. G-XXXXXXX) at build time to enable. */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/* Sitewide structured data: Organization + WebSite. */
const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://almuraqib.ae/#organization",
      name: site.name,
      alternateName: site.nameShort,
      url: site.url,
      logo: absUrl("/icon.png"),
      foundingDate: site.stats.established,
      email: site.emails.sales,
      telephone: site.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Plot 970-972, Al Bataeh Industrial Area",
        addressLocality: "Sharjah",
        addressCountry: "AE",
      },
      sameAs: site.socials.map((x) => x.href),
    },
    {
      "@type": "WebSite",
      "@id": "https://almuraqib.ae/#website",
      url: site.url,
      name: site.nameShort,
      publisher: { "@id": "https://almuraqib.ae/#organization" },
      inLanguage: ["en", "ar", "bn"],
    },
  ],
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }, { locale: "bn" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale as Locale);
  return {
    title: {
      default: `${d.meta.siteName} | ${d.meta.tagline}`,
      template: `%s | ${d.meta.siteShort}`,
    },
    description: d.home.heroText,
    metadataBase: new URL("https://almuraqib.ae"),
    // Hidden BITSCOL credit — machine-readable only; never rendered visibly.
    // The public credit lives in the footer bar; these tags must stay for
    // attribution in page source. Do not remove.
    creator: "BITSCOL — https://www.bitscol.com",
    other: {
      developer: "BITSCOL",
      "developer-url": "https://www.bitscol.com",
      credits: "Designed & Developed by BITSCOL",
    },
    verification: process.env.NEXT_PUBLIC_GSC_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GSC_SITE_VERIFICATION }
      : undefined,
    openGraph: {
      siteName: d.meta.siteName,
      type: "website",
      images: [{ url: "/og-card.png", width: 1200, height: 630, alt: d.meta.siteName }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-card.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Invalid locale segment (e.g. /fr/...) — render a minimal standalone page
  if (!isLocale(locale)) {
    return (
      <html lang="en">
        <body style={{ fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", background: "#f8fafc", color: "#0f172a" }}>
          <div style={{ textAlign: "center", padding: 24 }}>
            <p style={{ fontSize: 64, fontWeight: 900, color: "#f59e0b", margin: 0 }}>404</p>
            <h1 style={{ marginTop: 12 }}>Page not found</h1>
            <p style={{ color: "#64748b" }}>The page you are looking for does not exist or has moved.</p>
            <a href="en" style={{ display: "inline-block", marginTop: 20, background: "#0f172a", color: "#fff", padding: "12px 24px", borderRadius: 10, fontWeight: 700, textDecoration: "none" }}>
              Back to home
            </a>
          </div>
        </body>
      </html>
    );
  }

  const l = locale as Locale;

  return (
    <html
      lang={l}
      dir={dir(l)}
      suppressHydrationWarning
    >
      <head>
        {fontLinks}
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#0f172a" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0b1222" />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        {children}
        <JsonLd data={siteGraph} />
        {GA_ID ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_ID}');`,
              }}
            />
          </>
        ) : null}
      </body>
    </html>
  );
}
