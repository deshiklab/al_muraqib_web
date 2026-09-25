import type { NextConfig } from "next";

/**
 * STATIC EXPORT MODE (GitHub Pages):
 *   NEXT_PUBLIC_STATIC_EXPORT=1 npm run build
 * - output: export          → plain HTML in out/
 * - basePath /al_muraqib_web → GitHub project-pages subpath
 * - trailingSlash           → directory-style URLs Pages serves natively
 * API route handlers (RFQ/contact) are skipped in this mode — the forms fall
 * back to WhatsApp submission at runtime.
 */
const isStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    ...(isStatic ? { unoptimized: true } : {}),
  },
  ...(isStatic
    ? {
        output: "export" as const,
        basePath: "/al_muraqib_web",
        trailingSlash: true,
        // API route handlers cannot exist in an export build — ignore app/api
        // (the workflow also moves them aside; this is belt & braces).
      }
    : {}),
};

export default nextConfig;
