"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { cn, track, waLink, makeRfqRef } from "@/lib/utils";
import { site } from "@/lib/data/site";
import { products } from "@/lib/data/catalog";
import { t } from "@/lib/utils";
import type { Dict } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

interface Props {
  locale: Locale;
  d: Dict;
  initialProducts: string[]; // slugs from ?product=
  source?: string;
}

const MAX_TOTAL = 25 * 1024 * 1024;
const MAX_FILES = 5;
const EXT_OK = [".pdf", ".dwg", ".dxf", ".xls", ".xlsx", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".webp", ".zip", ".csv", ".txt"];
const DRAFT_KEY = "almuraqib-rfq-draft";
/** Static (GitHub Pages) build: no API routes — submissions go via WhatsApp. */
const isStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

type Step = 0 | 1 | 2 | 3 | 4;

export default function RfqWizard({ locale, d, initialProducts, source }: Props) {
  const isAr = locale === "ar";
  const [step, setStep] = useState<Step>(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refNo, setRefNo] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [productQuery, setProductQuery] = useState("");

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "United Arab Emirates",
    products: initialProducts,
    custom: "",
    sector: "",
    stage: "",
    location: "",
    deadline: "",
    notes: "",
    consent: false,
  });

  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  // Hydrate draft (once)
  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as Partial<typeof form>;
        setForm((f) => ({ ...f, ...draft, products: initialProducts.length ? initialProducts : draft.products ?? [] }));
      }
    } catch { /* ignore */ }
    if (source) track("rfq_source", { source });
  }, [initialProducts, source]);

  // Persist draft
  useEffect(() => {
    if (refNo) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch { /* ignore */ }
  }, [form, refNo]);

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => t(p.name, locale).toLowerCase().includes(q) || p.slug.includes(q));
  }, [productQuery, locale]);

  const toggleProduct = (slug: string) =>
    setForm((f) => ({
      ...f,
      products: f.products.includes(slug) ? f.products.filter((x) => x !== slug) : [...f.products, slug],
    }));

  const addFiles = (incoming: FileList | File[]) => {
    setFileError(null);
    const arr = Array.from(incoming);
    if (files.length + arr.length > MAX_FILES) {
      setFileError(d.rfq.upload.tooMany);
      return;
    }
    const okExt = arr.filter((f) => EXT_OK.includes("." + f.name.split(".").pop()?.toLowerCase()));
    if (okExt.length !== arr.length) {
      setFileError(d.rfq.upload.badType);
      return;
    }
    const newTotal = [...files, ...arr].reduce((s, f) => s + f.size, 0);
    if (newTotal > MAX_TOTAL) {
      setFileError(d.rfq.upload.tooBig);
      return;
    }
    setFiles((cur) => [...cur, ...arr]);
    track("rfq_file_added", { count: arr.length });
  };

  const validateStep = (): boolean => {
    if (step === 0) {
      if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
        setError(d.rfq.errors.required);
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setError(d.rfq.errors.email);
        return false;
      }
    }
    if (step === 4 && !form.consent) {
      setError(d.rfq.errors.required);
      return false;
    }
    setError(null);
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, 4) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setError(null);
    try {
      if (isStatic) {
        // Static build has no API — hand the request over to WhatsApp.
        const ref = makeRfqRef();
        const lines = [
          `${d.rfq.success.title} — ${ref}`,
          `${d.rfq.fields.name}: ${form.name}`,
          form.company ? `${d.rfq.fields.company}: ${form.company}` : "",
          `${d.rfq.fields.email}: ${form.email}`,
          `${d.rfq.fields.phone}: ${form.phone}`,
          form.country ? `${d.rfq.fields.country}: ${form.country}` : "",
          form.products.length ? `${d.rfq.fields.products}: ${form.products.join(", ")}` : "",
          form.notes ? `${d.rfq.fields.notes}: ${form.notes}` : "",
        ].filter(Boolean);
        window.open(waLink(site.whatsapp, lines.join("\n")), "_blank");
        setRefNo(ref);
        localStorage.removeItem(DRAFT_KEY);
        track("generate_lead", { ref, items: form.products.length, files: files.length, locale, via: "whatsapp" });
        return;
      }

      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "consent") return;
        fd.append(k, Array.isArray(v) ? v.join(",") : String(v));
      });
      fd.append("locale", locale);
      fd.append("sourceUrl", typeof window !== "undefined" ? window.location.href : "");
      if (source) fd.append("source", source);
      files.forEach((f) => fd.append("files", f));

      const res = await fetch("/api/rfq", { method: "POST", body: fd });
      const json = (await res.json()) as { ok: boolean; ref?: string; error?: string };
      if (!json.ok || !json.ref) throw new Error(json.error ?? "server");

      setRefNo(json.ref);
      localStorage.removeItem(DRAFT_KEY);
      track("generate_lead", { ref: json.ref, items: form.products.length, files: files.length, locale });
    } catch (e) {
      console.error(e);
      setError(d.rfq.errors.server);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- Success screen ---------- */
  if (refNo) {
    return (
      <div className="bg-white border border-slate-200 rounded-[16px] p-8 md:p-10 text-center shadow-soft max-w-2xl mx-auto">
        <span className="mx-auto grid place-items-center w-16 h-16 rounded-full bg-green-100 text-green-600">
          <Icon name="checkCircle" className="w-9 h-9" strokeWidth={1.6} />
        </span>
        <h2 className="mt-5 font-heading font-black text-2xl md:text-3xl">{d.rfq.success.title}</h2>
        <p className="mt-3 text-slate-500">{d.rfq.success.text}</p>
        <p className="mt-2 inline-block font-mono text-lg md:text-xl font-bold bg-navy-900 text-gold-400 rounded-lg px-5 py-2.5 select-all">
          {refNo}
        </p>
        <div className="mt-6 space-y-2 text-sm text-slate-500 text-start max-w-md mx-auto">
          {isStatic ? (
            <p className="flex items-start gap-2 bg-gold-50 border border-gold-200 text-navy-900 rounded-lg px-3 py-2.5">
              <Icon name="whatsapp" className="w-4 h-4 text-[#25D366] mt-0.5 shrink-0" />
              {d.rfq.success.staticNote}
            </p>
          ) : (
            <>
              <p className="flex items-start gap-2">
                <Icon name="check" className="w-4 h-4 text-brand-700 mt-0.5 shrink-0" />
                {d.rfq.success.next1}
              </p>
              <p className="flex items-start gap-2">
                <Icon name="check" className="w-4 h-4 text-brand-700 mt-0.5 shrink-0" />
                {d.rfq.success.next2}
              </p>
            </>
          )}
        </div>
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setRefNo(null);
              setStep(0);
              setForm((f) => ({ ...f, name: f.name, notes: "", consent: false }));
              setFiles([]);
            }}
            className="px-6 py-3 border-2 border-slate-200 rounded-[10px] font-bold text-sm hover:border-brand-700 hover:text-brand-700 transition-colors cursor-pointer"
          >
            {d.rfq.success.another}
          </button>
          <a
            href={waLink(site.whatsapp, `${d.rfq.success.title} ${refNo}`)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click", { where: "rfq_success" })}
            className="px-6 py-3 bg-[#25D366] text-white rounded-[10px] font-bold text-sm hover:bg-[#1ebe5b] transition-colors inline-flex items-center justify-center gap-2"
          >
            <Icon name="whatsapp" className="w-4.5 h-4.5" />
            {d.rfq.success.whatsapp}
          </a>
        </div>
      </div>
    );
  }

  /* ---------- Wizard ---------- */
  return (
    <div className="bg-white border border-slate-200 rounded-[16px] shadow-soft overflow-hidden">
      {/* Stepper */}
      <ol className="flex overflow-x-auto hide-scrollbar border-b border-slate-100 bg-slate-50" aria-label="Progress">
        {d.rfq.steps.map((label, i) => {
          const state = i === step ? "current" : i < step ? "done" : "todo";
          return (
            <li key={label} className="flex-1 min-w-[110px]">
              <button
                type="button"
                onClick={() => i < step && setStep(i as Step)}
                disabled={i > step}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-3 py-4 text-xs font-bold border-b-2 transition-colors",
                  state === "current" && "border-gold-500 text-navy-900 bg-white",
                  state === "done" && "border-brand-700 text-brand-700 cursor-pointer",
                  state === "todo" && "border-transparent text-slate-500"
                )}
                aria-current={state === "current" ? "step" : undefined}
              >
                <span
                  className={cn(
                    "grid place-items-center w-6 h-6 rounded-full text-[11px] shrink-0",
                    state === "current" && "bg-gold-500 text-navy-950",
                    state === "done" && "bg-brand-700 text-white",
                    state === "todo" && "bg-slate-200 text-slate-500"
                  )}
                >
                  {state === "done" ? <Icon name="check" className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="p-6 md:p-8">
        <div key={step} className="step-enter">
        {/* ===== Step 0: Contact ===== */}
        {step === 0 && (
          <div className="space-y-5">
            <Field label={d.rfq.fields.name}>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} autoComplete="name" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={d.rfq.fields.company}>
                <input value={form.company} onChange={(e) => set("company", e.target.value)} className={inputCls} autoComplete="organization" />
              </Field>
              <Field label={d.rfq.fields.country}>
                <input value={form.country} onChange={(e) => set("country", e.target.value)} className={inputCls} autoComplete="country-name" />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={d.rfq.fields.email}>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} autoComplete="email" dir="ltr" />
              </Field>
              <Field label={d.rfq.fields.phone}>
                <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} autoComplete="tel" dir="ltr" placeholder="+971…" />
              </Field>
            </div>
          </div>
        )}

        {/* ===== Step 1: Products ===== */}
        {step === 1 && (
          <div className="space-y-5">
            <Field label={d.rfq.fields.products}>
              <input
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                placeholder={d.nav.searchPlaceholder}
                className={inputCls}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pe-1">
              {filteredProducts.map((p) => {
                const on = form.products.includes(p.slug);
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => toggleProduct(p.slug)}
                    className={cn(
                      "flex items-center gap-2.5 text-start text-sm rounded-[10px] border-2 px-3.5 py-3 transition-all cursor-pointer",
                      on ? "border-brand-700 bg-brand-700/5 font-bold text-navy-900" : "border-slate-200 text-slate-600 hover:border-slate-300"
                    )}
                    aria-pressed={on}
                  >
                    <span className={cn("grid place-items-center w-4.5 h-4.5 rounded border shrink-0", on ? "bg-brand-700 border-brand-700 text-white" : "border-slate-300")}>
                      {on && <Icon name="check" className="w-3 h-3" strokeWidth={3} />}
                    </span>
                    <span className="line-clamp-2">{t(p.name, locale)}</span>
                  </button>
                );
              })}
            </div>
            <Field label={d.rfq.fields.custom}>
              <textarea
                rows={2}
                value={form.custom}
                onChange={(e) => set("custom", e.target.value)}
                placeholder={d.rfq.fields.customPlaceholder}
                className={cn(inputCls, "resize-none")}
              />
            </Field>
          </div>
        )}

        {/* ===== Step 2: Project ===== */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={d.rfq.fields.sector}>
                <select value={form.sector} onChange={(e) => set("sector", e.target.value)} className={inputCls}>
                  <option value="">—</option>
                  {d.rfq.sectors.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label={d.rfq.fields.stage}>
                <select value={form.stage} onChange={(e) => set("stage", e.target.value)} className={inputCls}>
                  <option value="">—</option>
                  {d.rfq.stages.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={d.rfq.fields.location}>
                <input value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls} placeholder={isAr ? "دبي، الإمارات" : "Dubai, UAE"} />
              </Field>
              <Field label={d.rfq.fields.deadline}>
                <input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} className={inputCls} dir="ltr" />
              </Field>
            </div>
            <Field label={d.rfq.fields.notes}>
              <textarea
                rows={5}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder={d.rfq.fields.notesPlaceholder}
                className={cn(inputCls, "resize-none")}
              />
            </Field>
          </div>
        )}

        {/* ===== Step 3: Files ===== */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm font-bold text-navy-900">{d.rfq.fields.files}</p>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                addFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInput.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-[12px] p-10 text-center cursor-pointer transition-colors",
                dragging ? "border-gold-500 bg-gold-500/5" : "border-slate-300 hover:border-brand-600 bg-slate-50"
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileInput.current?.click()}
            >
              <span className="mx-auto grid place-items-center w-14 h-14 rounded-full bg-white ring-1 ring-slate-200 text-brand-700">
                <Icon name="upload" className="w-7 h-7" />
              </span>
              <p className="mt-4 font-bold text-navy-900">{d.rfq.upload.drop}</p>
              <p className="mt-1.5 text-xs text-slate-500">{d.rfq.upload.hint}</p>
              <input
                ref={fileInput}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>

            {fileError && (
              <p className="text-sm font-semibold text-red-600 flex items-center gap-2" role="alert">
                <Icon name="close" className="w-4 h-4" />
                {fileError}
              </p>
            )}

            {files.length > 0 && (
              <ul className="space-y-2">
                {files.map((f, i) => (
                  <li key={`${f.name}-${i}`} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-[10px] px-4 py-3">
                    <Icon name="file" className="w-5 h-5 text-brand-700 shrink-0" />
                    <span className="flex-1 text-sm font-semibold text-navy-900 truncate" dir="ltr">{f.name}</span>
                    <span className="text-xs text-slate-500 shrink-0" dir="ltr">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((_, x) => x !== i))}
                      aria-label={d.rfq.upload.remove}
                      className="p-1.5 text-slate-500 hover:text-red-600 cursor-pointer"
                    >
                      <Icon name="close" className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* ===== Step 4: Review ===== */}
        {step === 4 && (
          <div className="space-y-5">
            <p className="font-heading font-black text-xl text-navy-900">{d.rfq.review.title}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <ReviewBlock
                title={d.rfq.steps[0]}
                onEdit={() => setStep(0)}
                changeLabel={d.rfq.review.change}
                lines={[form.name, form.company, form.email, form.phone, form.country]}
              />
              <ReviewBlock
                title={d.rfq.steps[1]}
                onEdit={() => setStep(1)}
                changeLabel={d.rfq.review.change}
                lines={[
                  ...form.products.map((slug) => t(products.find((p) => p.slug === slug)?.name ?? { en: slug, ar: slug }, locale)),
                  ...(form.custom ? [form.custom] : []),
                ]}
                empty={d.rfq.fields.products}
              />
              <ReviewBlock
                title={d.rfq.steps[2]}
                onEdit={() => setStep(2)}
                changeLabel={d.rfq.review.change}
                lines={[form.sector, form.stage, form.location, form.deadline, form.notes].filter(Boolean)}
                empty={d.rfq.fields.sector}
              />
              <ReviewBlock
                title={d.rfq.steps[3]}
                onEdit={() => setStep(3)}
                changeLabel={d.rfq.review.change}
                lines={files.map((f) => f.name)}
                empty={d.rfq.review.files + " — " + d.rfq.review.none}
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => set("consent", e.target.checked)}
                className="mt-0.5 w-4.5 h-4.5 accent-[#0369a1]"
              />
              {d.rfq.fields.consent}
            </label>
          </div>
        )}

        </div>

        {error && (
          <p className="mt-5 text-sm font-semibold text-red-600 flex items-center gap-2" role="alert">
            <Icon name="close" className="w-4 h-4" />
            {error}
          </p>
        )}

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between gap-4 pt-5 border-t border-slate-100">
          <button
            type="button"
            onClick={back}
            disabled={step === 0 || submitting}
            className={cn(
              "inline-flex items-center gap-2 font-bold text-sm text-slate-500 hover:text-navy-900 transition-colors cursor-pointer",
              (step === 0 || submitting) && "opacity-0 pointer-events-none"
            )}
          >
            <Icon name="chevronRight" className="w-4 h-4 flip-x" />
            {d.rfq.back}
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-2 bg-navy-900 text-white font-bold text-sm px-7 py-3 rounded-[10px] hover:bg-brand-700 transition-colors cursor-pointer"
            >
              {d.rfq.next}
              <Icon name="chevronRight" className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-gold-500 text-navy-950 font-bold text-sm px-7 py-3 rounded-[10px] hover:bg-gold-600 hover:text-white transition-colors cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {d.rfq.submitting}
                </>
              ) : (
                <>
                  <Icon name="checkCircle" className="w-4.5 h-4.5" />
                  {d.rfq.submit}
                </>
              )}
            </button>
          )}
        </div>

        {step === 0 && !refNo && (
          <p className="mt-4 text-xs text-slate-500 flex items-center gap-1.5">
            <Icon name="check" className="w-3.5 h-3.5" />
            {d.rfq.draftSaved}
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

const inputCls =
  "w-full bg-slate-50 border border-slate-200 rounded-[10px] px-4 py-3 text-[15px] text-navy-900 outline-none focus:border-brand-700 focus:bg-white transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[13px] font-bold text-navy-900 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function ReviewBlock({
  title,
  lines,
  onEdit,
  changeLabel,
  empty,
}: {
  title: string;
  lines: string[];
  onEdit: () => void;
  changeLabel: string;
  empty?: string;
}) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-[10px] p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">{title}</p>
        <button type="button" onClick={onEdit} className="text-xs font-bold text-brand-700 hover:text-gold-700 cursor-pointer">
          {changeLabel}
        </button>
      </div>
      {lines.filter(Boolean).length ? (
        <ul className="space-y-1 text-sm text-navy-900">
          {lines.filter(Boolean).map((line, i) => (
            <li key={i} className="truncate">{line}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">{empty}</p>
      )}
    </div>
  );
}
