"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import QuickQuoteModal from "./QuickQuoteModal";
import { track } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

type Ctx = { open: (source?: string) => void; close: () => void };

const QuoteModalCtx = createContext<Ctx | null>(null);

/** Opens the simple “Get a Quotation” modal from any client component. */
export function useQuoteModal(): Ctx {
  return useContext(QuoteModalCtx) ?? { open: () => {}, close: () => {} };
}

/**
 * App-level host for the quick-quote modal so every “Get Quote” trigger
 * (header, mobile drawer, side tab, sticky bar) opens the same simple form.
 */
export default function QuoteModalProvider({
  locale,
  d,
  children,
}: {
  locale: Locale;
  d: Dict;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<{ open: boolean; source?: string }>({ open: false });

  const open = useCallback((source?: string) => {
    setState({ open: true, source });
    track("cta_quote_click", { where: source ?? "unknown" });
  }, []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);
  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <QuoteModalCtx.Provider value={value}>
      {children}
      {state.open && (
        <QuickQuoteModal locale={locale} d={d} source={state.source} onClose={close} />
      )}
    </QuoteModalCtx.Provider>
  );
}
