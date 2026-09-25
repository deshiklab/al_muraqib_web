"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { track, waLink } from "@/lib/utils";
import { site } from "@/lib/data/site";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const inputCls =
  "w-full bg-slate-50 border border-slate-200 rounded-[10px] px-4 py-3 text-[15px] text-navy-900 outline-none focus:border-brand-700 focus:bg-white transition-colors";

export default function ContactForm({ locale, d }: { locale: Locale; d: Dict }) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState("");

  if (sent) {
    return (
      <p className="flex items-center gap-2.5 text-green-700 font-bold bg-green-50 ring-1 ring-green-200 rounded-[10px] px-4 py-4">
        <Icon name="checkCircle" className="w-5 h-5" />
        {d.contact.sent}
      </p>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          const fd = new FormData(e.currentTarget);
          fd.append("locale", locale);
          if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "1") {
            const lines = [...fd.entries()].map(([k, v]) => `${k}: ${String(v)}`).filter((l) => !l.endsWith(": "));
            window.open(waLink(site.whatsapp, `Al Muraqib — ${d.nav.contact}\n${lines.join("\n")}`), "_blank");
            track("generate_lead", { type: "contact", reason, locale, via: "whatsapp" });
            setSent(true);
            return;
          }
          const res = await fetch("/api/contact", { method: "POST", body: fd });
          if (!res.ok) throw new Error("failed");
          track("generate_lead", { type: "contact", reason, locale });
          setSent(true);
        } catch {
          alert(d.rfq.errors.server);
        } finally {
          setBusy(false);
        }
      }}
      className="space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-[13px] font-bold text-navy-900 mb-1.5">{d.rfq.fields.name} *</span>
          <input name="name" required className={inputCls} autoComplete="name" />
        </label>
        <label className="block">
          <span className="block text-[13px] font-bold text-navy-900 mb-1.5">{d.rfq.fields.company}</span>
          <input name="company" className={inputCls} autoComplete="organization" />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-[13px] font-bold text-navy-900 mb-1.5">{d.rfq.fields.email} *</span>
          <input name="email" type="email" required className={inputCls} autoComplete="email" dir="ltr" />
        </label>
        <label className="block">
          <span className="block text-[13px] font-bold text-navy-900 mb-1.5">{d.rfq.fields.phone} *</span>
          <input name="phone" type="tel" required className={inputCls} autoComplete="tel" dir="ltr" />
        </label>
      </div>
      <label className="block">
        <span className="block text-[13px] font-bold text-navy-900 mb-1.5">{d.contact.reason} *</span>
        <select name="reason" required value={reason} onChange={(e) => setReason(e.target.value)} className={inputCls}>
          <option value="">—</option>
          {d.contact.reasons.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="block text-[13px] font-bold text-navy-900 mb-1.5">{d.contact.message} *</span>
        <textarea name="message" rows={4} required className={`${inputCls} resize-none`} />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="w-full bg-navy-900 text-white font-bold py-3.5 rounded-[10px] hover:bg-brand-700 transition-colors disabled:opacity-60 cursor-pointer inline-flex items-center justify-center gap-2"
      >
        {busy ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Icon name="mail" className="w-4.5 h-4.5" />
        )}
        {d.contact.send}
      </button>
    </form>
  );
}
