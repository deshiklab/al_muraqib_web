"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { track } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export default function NewsletterForm({ locale, d }: { locale: Locale; d: Dict }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email.includes("@")) return;
        track("newsletter_signup", { locale });
        setDone(true);
      }}
      className="space-y-2"
      aria-label={d.newsletter.title}
    >
      <p className="text-sm font-semibold text-white mb-1">{d.newsletter.title}</p>
      {done ? (
        <p className="text-sm text-gold-400 flex items-center gap-2">
          <Icon name="checkCircle" className="w-4 h-4" /> {d.newsletter.done}
        </p>
      ) : (
        <div className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={d.newsletter.placeholder}
            className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-gold-500"
            aria-label={d.newsletter.placeholder}
          />
          <button
            type="submit"
            className="bg-brand-700 hover:bg-brand-600 text-white text-sm font-bold px-4 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            {d.newsletter.submit}
          </button>
        </div>
      )}
    </form>
  );
}
