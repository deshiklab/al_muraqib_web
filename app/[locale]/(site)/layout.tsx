import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatDock from "@/components/layout/ChatDock";
import { SideTab, BackToTop, ScrollProgress } from "@/components/layout/Chrome";
import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const d = getDict(l);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[100] focus:bg-navy-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        {d.nav.skipToContent}
      </a>
      <Header locale={l} d={d} />
      <ScrollProgress />
      <main id="main">{children}</main>
      <Footer locale={l} d={d} />
      <SideTab locale={l} d={d} />
      <BackToTop d={d} />
      <ChatDock locale={l} d={d} />
    </>
  );
}
