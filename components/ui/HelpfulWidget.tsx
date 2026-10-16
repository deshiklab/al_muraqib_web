"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { track } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export default function HelpfulWidget({
  labels,
}: {
  locale: Locale;
  labels: { q: string; thanks: string };
}) {
  const [voted, setVoted] = useState<null | boolean>(null);

  if (voted !== null) {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-brand-700">
        <Icon name="checkCircle" className="w-4.5 h-4.5" />
        {labels.thanks}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className="text-slate-500 font-semibold">{labels.q}</span>
      {[true, false].map((v) => (
        <button
          key={String(v)}
          onClick={() => {
            setVoted(v);
            track("kb_feedback", { helpful: v });
          }}
          className="inline-flex items-center gap-1.5 border border-slate-200 rounded-full px-4 py-1.5 font-bold text-navy-900 hover:border-brand-700 hover:text-brand-700 transition-colors cursor-pointer"
        >
          {v ? "👍" : "👎"}
          {v ? "Yes" : "No"}
        </button>
      ))}
    </div>
  );
}
