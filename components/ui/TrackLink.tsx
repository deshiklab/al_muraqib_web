"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track } from "@/lib/utils";

/**
 * Anchor that fires a dataLayer event on click. Server-safe to drop into any
 * page (client island); navigation and all anchor attributes are untouched.
 */
export default function TrackLink({
  event,
  params,
  children,
  ...rest
}: { event: string; params?: Record<string, unknown> } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track(event, params ?? {});
        rest.onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
