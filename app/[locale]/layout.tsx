import type { Metadata } from "next";
import { getDict, dir, isLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import "@/app/globals.css";

// Fonts loaded at runtime from the visitor's browser (build-host has no
// access to fonts.googleapis.com). Fallbacks defined in globals.css.
const fontLinks = (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&family=Montserrat:wght@500;600;700;800;900&family=Noto+Kufi+Arabic:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </>
);

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
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
    >
      <head>{fontLinks}</head>
      <body>
        {children}
      </body>
    </html>
  );
}
