"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { site } from "@/lib/data/site";
import { makeRfqRef, tl, track, waLink } from "@/lib/utils";
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

/** Entrance stagger helper — children rise in as the drawer opens. */
const staged = (i: number, extra = "") => ({
  className: `${extra} motion-safe:animate-[drawerItem_0.55s_ease-out_both]`.trim(),
  style: { animationDelay: `${140 + i * 70}ms` },
});

/**
 * “Get a Quotation” app drawer — slides in from the right edge (anchored to
 * the redesigned right-side quote tab) with a staged entrance. Name, contacts,
 * message and optional files; posts to /api/rfq like the full wizard, and in
 * static-export builds hands the request over to WhatsApp.
 */
export default function QuickQuoteDrawer({
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
  const nameRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [shown, setShown] = useState(false);
  const [closing, setClosing] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileErr, setFileErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [refNo, setRefNo] = useState<string | null>(null);

  /* Slide in one frame after mount; slide out before unmount */
  useEffect(() => {
    const r = requestAnimationFrame(() => setShown(true));
    return () => {
      cancelAnimationFrame(r);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const requestClose = useCallback(() => {
    setClosing((c) => {
      if (c) return c;
      closeTimer.current = setTimeout(onClose, 340);
      return true;
    });
  }, [onClose]);

  /* Esc + scroll lock */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const focus = setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 480);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      clearTimeout(focus);
    };
  }, [requestClose]);

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

  const visible = shown && !closing;

  return (
    <div className="fixed inset-0 z-[80] print:hidden" role="dialog" aria-modal="true" aria-label={d.rfq.title}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-navy-950/60 backdrop-blur-[2px] transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={requestClose}
        aria-hidden="true"
      />

      {/* Panel — anchored to the physical right edge in both LTR and RTL */}
      <div
        className={`absolute inset-y-0 right-0 flex h-full w-full flex-col bg-white shadow-[0_0_60px_rgba(2,6,23,0.45)] transition-transform duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)] sm:w-[420px] ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ---------- Drawer head ---------- */}
        <div className="relative shrink-0 overflow-hidden bg-navy-950 px-6 pb-6 pt-2 text-white">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_85%_-10%,#f59e0b_0,transparent_45%)]" aria-hidden="true" />
          <span className="mx-auto mb-4 block h-1.5 w-10 rounded-full bg-white/30" aria-hidden="true" />
          <div className="relative flex items-start justify-between gap-4">
            <div {...staged(0)}>
              <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">
                <Icon name="file" className="w-3.5 h-3.5" />
                {tl(locale, "Quick Quote", "عرض سعر سريع")}
              </p>
              <h2 className="mt-1.5 font-heading font-black text-2xl leading-tight">{d.rfq.title}</h2>
              <p className="mt-1 text-[13px] leading-snug text-slate-300">{d.rfq.modal.text}</p>
            </div>
            <button
              type="button"
              onClick={requestClose}
              aria-label={d.nav.close}
              className="relative -me-1.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-slate-300 transition-colors hover:bg-white/20 hover:text-white cursor-pointer"
            >
              <Icon name="close" className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {refNo ? (
          /* ---------- Success ---------- */
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600 motion-safe:animate-[popCheck_0.55s_cubic-bezier(0.34,1.56,0.64,1)_both]">
              <Icon name="checkCircle" className="w-9 h-9" strokeWidth={1.6} />
            </span>
            <h3 {...staged(1, "mt-4 font-heading font-black text-navy-900 text-xl")}>
              {d.rfq.success.title}
            </h3>
            <p {...staged(2, "mt-1.5 text-sm text-slate-600")}>
              {d.rfq.success.text}{" "}
              <span className="font-bold text-navy-900" dir="ltr">
                {refNo}
              </span>
            </p>
            <p {...staged(3, "mt-3 max-w-[30ch] text-[13px] text-slate-500")}>
              {isStatic ? d.rfq.success.staticNote : d.rfq.modal.note}
            </p>
            <div {...staged(4, "mt-6 flex w-full flex-col gap-2.5")}>
              <a
                href={waLink(site.whatsapp, `${d.rfq.title} ${refNo}`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("whatsapp_click", { where: "quick_quote_success" })}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1ebe5b]"
              >
                <Icon name="whatsapp" className="w-4 h-4" />
                {d.rfq.success.whatsapp}
              </a>
              <button
                type="button"
                onClick={requestClose}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-slate-100 px-5 py-3 text-sm font-bold text-navy-900 transition-colors hover:bg-slate-200 cursor-pointer"
              >
                {d.rfq.modal.done}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ---------- Scrollable body ---------- */}
            <form id="quick-quote-form" onSubmit={submit} className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <label {...staged(1, "block")}>
                <span className="mb-1 block text-[13px] font-bold text-navy-900">{d.rfq.fields.name}</span>
                <input ref={nameRef} name="name" required autoComplete="name" className={inputCls} />
              </label>

              <div {...staged(2, "grid grid-cols-2 gap-3")}>
                <label className="block">
                  <span className="mb-1 block text-[13px] font-bold text-navy-900">{d.rfq.fields.email}</span>
                  <input name="email" type="email" required dir="ltr" autoComplete="email" className={inputCls} placeholder="you@company.com" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[13px] font-bold text-navy-900">{d.rfq.fields.phone}</span>
                  <input name="phone" type="tel" required dir="ltr" autoComplete="tel" className={inputCls} placeholder="+971 5x xxx xxxx" />
                </label>
              </div>

              <label {...staged(3, "block")}>
                <span className="mb-1 block text-[13px] font-bold text-navy-900">{d.rfq.modal.message}</span>
                <textarea name="message" rows={3} className={`${inputCls} resize-none`} placeholder={d.rfq.modal.messagePlaceholder} />
              </label>

              {/* Optional files */}
              <div {...staged(4)}>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-slate-300 bg-slate-50/60 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:border-brand-700 hover:text-brand-700"
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
                      <li key={`${f.name}-${f.size}`} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[13px]">
                        <Icon name="file" className="w-4 h-4 shrink-0 text-brand-700" />
                        <span className="flex-1 truncate font-semibold text-navy-900">{f.name}</span>
                        <span className="shrink-0 text-slate-400" dir="ltr">
                          {(f.size / MB).toFixed(1)} MB
                        </span>
                        <button
                          type="button"
                          onClick={() => setFiles(files.filter((x) => x !== f))}
                          aria-label={d.rfq.upload.remove}
                          className="-m-0.5 cursor-pointer p-1 text-slate-400 transition-colors hover:text-red-600"
                        >
                          <Icon name="close" className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-1.5 text-[11px] text-slate-400">{d.rfq.upload.hint}</p>
                {(fileErr || err) && (
                  <p role="alert" className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-600">
                    {fileErr ?? err}
                  </p>
                )}
              </div>
            </form>

            {/* ---------- Pinned footer ---------- */}
            <div {...staged(5, "shrink-0 space-y-2.5 border-t border-slate-200 bg-slate-50/80 px-6 py-4")}>
              <button
                type="submit"
                form="quick-quote-form"
                disabled={busy}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-gold-500 py-3.5 font-bold text-navy-950 transition-colors hover:bg-gold-600 hover:text-white disabled:opacity-60"
              >
                {busy ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy-950 border-t-transparent" />
                ) : (
                  <Icon name="mail" className="w-4.5 h-4.5" />
                )}
                {busy ? d.rfq.submitting : d.rfq.modal.submit}
              </button>
              <p className="text-center text-[12px] text-slate-500">
                <Link
                  href={`/${locale}/get-quotation`}
                  onClick={requestClose}
                  className="inline-flex items-center gap-1 font-bold text-brand-700 transition-colors hover:text-gold-700"
                >
                  {d.rfq.modal.more}
                  <Icon name="arrowRight" className="w-3.5 h-3.5 flip-x" />
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
