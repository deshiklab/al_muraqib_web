"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { site } from "@/lib/data/site";
import { makeRfqRef, track, waLink } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const MAX_FILES = 5;
const MAX_TOTAL = 25 * 1024 * 1024;
const ALLOWED_EXT = [
  ".pdf", ".dwg", ".dxf", ".xls", ".xlsx", ".csv", ".txt",
  ".doc", ".docx", ".jpg", ".jpeg", ".png", ".webp", ".zip",
];

const inputCls =
  "w-full bg-slate-50 border border-slate-200 rounded-[10px] px-3.5 py-2.5 text-[15px] text-navy-900 outline-none focus:border-brand-700 focus:bg-white transition-colors placeholder:text-slate-400";

const MB = 1024 * 1024;

/**
 * Simple “Get a Quotation” modal — name, contacts, message and optional files.
 * Posts to the same /api/rfq endpoint as the full wizard (source: quick-quote);
 * in static-export builds it hands the request over to WhatsApp, mirroring the
 * wizard/contact form behaviour. Opened via useQuoteModal().
 */
export default function QuickQuoteModal({
  locale,
  d,
  source,
  onClose,
}: {
  locale: Locale;
  d: Dict;
  source?: string;
  onClose: () => void;
}) {
  const isStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
  const fileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileErr, setFileErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [refNo, setRefNo] = useState<string | null>(null);

  /* Esc closes + scroll lock */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const picked = Array.from(list).filter((f) => {
      const ext = f.name.slice(f.name.lastIndexOf(".")).toLowerCase();
      return ext === "" || ALLOWED_EXT.includes(ext) || f.type === "application/octet-stream";
    });
    if (picked.length !== list.length) setFileErr(d.rfq.upload.badType);
    const merged = [...files, ...picked];
    if (merged.length > MAX_FILES) {
      setFileErr(d.rfq.upload.tooMany);
      setFiles(merged.slice(0, MAX_FILES));
      return;
    }
    if (merged.reduce((s, f) => s + f.size, 0) > MAX_TOTAL) setFileErr(d.rfq.upload.tooBig);
    else setFileErr(null);
    setFiles(merged.slice(0, MAX_FILES));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !email || !phone) {
      setErr(d.rfq.errors.required);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr(d.rfq.errors.email);
      return;
    }
    setErr(null);
    setBusy(true);
    try {
      if (isStatic) {
        // Static export has no API — deliver the request via WhatsApp instead.
        const ref = makeRfqRef();
        const lines = [
          `${d.rfq.title} — ${ref}`,
          `${d.rfq.fields.name}: ${name}`,
          `${d.rfq.fields.email}: ${email}`,
          `${d.rfq.fields.phone}: ${phone}`,
          message ? `${d.rfq.modal.message}: ${message}` : "",
          files.length ? `${d.rfq.review.files}: ${files.map((f) => f.name).join(", ")}` : "",
        ].filter(Boolean);
        window.open(waLink(site.whatsapp, lines.join("\n")), "_blank");
        setRefNo(ref);
        track("generate_lead", { ref, type: "quick_quote", via: "whatsapp", locale });
        return;
      }
      const fd = new FormData();
      fd.append("name", name);
      fd.append("email", email);
      fd.append("phone", phone);
      fd.append("notes", message);
      fd.append("locale", locale);
      fd.append("source", `quick-${source ?? "button"}`);
      fd.append("sourceUrl", typeof window !== "undefined" ? window.location.href : "");
      files.forEach((f) => fd.append("files", f));
      const res = await fetch("/api/rfq", { method: "POST", body: fd });
      const json = (await res.json()) as { ok: boolean; ref?: string; error?: string };
      if (!json.ok || !json.ref) throw new Error(json.error ?? "server");
      setRefNo(json.ref);
      track("generate_lead", { ref: json.ref, type: "quick_quote", files: files.length, locale });
    } catch {
      setErr(d.rfq.errors.server);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-navy-950/70 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={d.rfq.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-[16px] shadow-dropdown w-full max-w-lg my-auto animate-[megaIn_0.18s_ease-out] overflow-hidden">
        {/* Header */}
        <div className="bg-navy-900 px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
              <Icon name="file" className="w-3.5 h-3.5" />
              {locale === "en" ? "Fast quote" : "عرض سعر سريع"}
            </p>
            <h2 className="mt-1.5 font-heading font-black text-white text-xl md:text-2xl">{d.rfq.title}</h2>
            <p className="mt-1 text-sm text-slate-300 leading-snug">{d.rfq.modal.text}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={d.nav.close}
            className="p-1.5 -m-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>

        {refNo ? (
          /* ---------- Success ---------- */
          <div className="px-6 py-9 text-center">
            <span className="mx-auto grid place-items-center w-14 h-14 rounded-full bg-green-100 text-green-600">
              <Icon name="checkCircle" className="w-8 h-8" strokeWidth={1.6} />
            </span>
            <h3 className="mt-4 font-heading font-black text-navy-900 text-xl">{d.rfq.success.title}</h3>
            <p className="mt-1.5 text-sm text-slate-600">
              {d.rfq.success.text}{" "}
              <span className="font-bold text-navy-900" dir="ltr">
                {refNo}
              </span>
            </p>
            <p className="mt-3 text-[13px] text-slate-500">{isStatic ? d.rfq.success.staticNote : d.rfq.modal.note}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-2.5 justify-center">
              <a
                href={waLink(site.whatsapp, `${d.rfq.title} ${refNo}`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click", { where: "quick_quote_success" })}
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-sm px-5 py-2.5 rounded-[10px] hover:bg-[#1ebe5b] transition-colors"
              >
                <Icon name="whatsapp" className="w-4 h-4" />
                {d.rfq.success.whatsapp}
              </a>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 bg-slate-100 text-navy-900 font-bold text-sm px-5 py-2.5 rounded-[10px] hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {d.rfq.modal.done}
              </button>
            </div>
          </div>
        ) : (
          /* ---------- Form ---------- */
          <form onSubmit={submit} className="px-6 py-5 space-y-3.5">
            <label className="block">
              <span className="block text-[13px] font-bold text-navy-900 mb-1">{d.rfq.fields.name}</span>
              <input name="name" required autoComplete="name" className={inputCls} />
            </label>

            <div className="grid sm:grid-cols-2 gap-3.5">
              <label className="block">
                <span className="block text-[13px] font-bold text-navy-900 mb-1">{d.rfq.fields.email}</span>
                <input name="email" type="email" required dir="ltr" autoComplete="email" className={inputCls} placeholder="you@company.com" />
              </label>
              <label className="block">
                <span className="block text-[13px] font-bold text-navy-900 mb-1">{d.rfq.fields.phone}</span>
                <input name="phone" type="tel" required dir="ltr" autoComplete="tel" className={inputCls} placeholder="+971 5x xxx xxxx" />
              </label>
            </div>

            <label className="block">
              <span className="block text-[13px] font-bold text-navy-900 mb-1">{d.rfq.modal.message}</span>
              <textarea name="message" rows={3} className={`${inputCls} resize-none`} placeholder={d.rfq.modal.messagePlaceholder} />
            </label>

            {/* Optional file upload */}
            <div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-[10px] px-4 py-3 text-sm font-semibold text-slate-600 hover:border-brand-700 hover:text-brand-700 transition-colors cursor-pointer bg-slate-50/60"
              >
                <Icon name="upload" className="w-4.5 h-4.5" />
                {d.rfq.modal.attach}
              </button>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept={ALLOWED_EXT.join(",")}
                className="sr-only"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              {files.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {files.map((f) => (
                    <li key={`${f.name}-${f.size}`} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[13px]">
                      <Icon name="file" className="w-4 h-4 text-brand-700 shrink-0" />
                      <span className="truncate flex-1 font-semibold text-navy-900">{f.name}</span>
                      <span className="text-slate-400 shrink-0" dir="ltr">
                        {(f.size / MB).toFixed(1)} MB
                      </span>
                      <button
                        type="button"
                        onClick={() => setFiles(files.filter((x) => x !== f))}
                        aria-label={d.rfq.upload.remove}
                        className="p-1 -m-0.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Icon name="close" className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-1.5 text-[11px] text-slate-400">{d.rfq.upload.hint}</p>
              {(fileErr || err) && (
                <p role="alert" className="mt-2 text-[13px] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {fileErr ?? err}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 bg-gold-500 text-navy-950 font-bold py-3.5 rounded-[10px] hover:bg-gold-600 hover:text-white transition-colors disabled:opacity-60 cursor-pointer"
            >
              {busy ? (
                <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Icon name="mail" className="w-4.5 h-4.5" />
              )}
              {busy ? d.rfq.submitting : d.rfq.modal.submit}
            </button>

            <p className="text-center text-[12px] text-slate-500">
              <Link
                href={`/${locale}/get-quotation`}
                onClick={() => track("quick_quote_more_details")}
                className="inline-flex items-center gap-1 font-bold text-brand-700 hover:text-gold-700 transition-colors"
              >
                {d.rfq.modal.more}
                <Icon name="arrowRight" className="w-3.5 h-3.5 flip-x" />
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
