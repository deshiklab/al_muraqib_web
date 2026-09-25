import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "ar"];

function detectLocale(req: NextRequest): string {
  const cookie = req.cookies.get("locale")?.value;
  if (cookie && locales.includes(cookie)) return cookie;
  const accept = req.headers.get("accept-language") || "";
  const first = accept.split(",")[0]?.split(";")[0]?.toLowerCase() ?? "";
  return first.startsWith("ar") ? "ar" : "en";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Root → locale-prefixed home
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = `/${detectLocale(req)}`;
    return NextResponse.redirect(url);
  }

  // Strip invalid locale segments like /fr/... → treat as not-found upstream
  const seg = pathname.split("/")[1];
  if (seg && !locales.includes(seg) && !seg.startsWith("api") && !seg.includes(".")) {
    // leave to Next (will 404) — no rewrite needed
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
