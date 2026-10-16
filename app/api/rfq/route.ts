import { NextRequest, NextResponse } from "next/server";
import { mkdir, appendFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { makeRfqRef } from "@/lib/utils";

const MAX_TOTAL = 25 * 1024 * 1024; // 25 MB
const MAX_FILES = 5;
const ALLOWED = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/zip",
  "application/x-zip-compressed",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-autocad",
  "application/dxf",
  "text/plain",
  "application/octet-stream", // .dwg/.dxf often sent as octet-stream — extension check below
];
const ALLOWED_EXT = [".pdf", ".dwg", ".dxf", ".xls", ".xlsx", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".webp", ".zip", ".csv", ".txt"];

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const ref = makeRfqRef();

    const fields: Record<string, string> = {};
    for (const [key, value] of form.entries()) {
      if (typeof value === "string") fields[key] = value;
    }

    // Required fields
    for (const reqField of ["name", "email", "phone"]) {
      if (!fields[reqField]?.trim()) {
        return NextResponse.json({ ok: false, error: `missing:${reqField}` }, { status: 400 });
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      return NextResponse.json({ ok: false, error: "invalid:email" }, { status: 400 });
    }

    const files = form.getAll("files").filter((f): f is File => f instanceof File);
    if (files.length > MAX_FILES) {
      return NextResponse.json({ ok: false, error: "too_many_files" }, { status: 400 });
    }
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > MAX_TOTAL) {
      return NextResponse.json({ ok: false, error: "files_too_large" }, { status: 400 });
    }
    for (const f of files) {
      const ext = path.extname(f.name).toLowerCase();
      if (!ALLOWED_EXT.includes(ext) && !ALLOWED.includes(f.type)) {
        return NextResponse.json({ ok: false, error: `bad_type:${ext}` }, { status: 400 });
      }
    }

    // Persist files (local volumes / later object storage)
    const dataDir = path.join(process.cwd(), ".data");
    const uploadDir = path.join(dataDir, "uploads", ref);
    const savedFiles: string[] = [];
    if (files.length) {
      await mkdir(uploadDir, { recursive: true });
      for (const f of files) {
        const safeName = f.name.replace(/[^\w.\-() ]/g, "_");
        const buf = Buffer.from(await f.arrayBuffer());
        await writeFile(path.join(uploadDir, safeName), buf);
        savedFiles.push(safeName);
      }
    }

    // Persist submission record (RFQ inbox data — later synced to CMS/CRM)
    const record = {
      ref,
      createdAt: new Date().toISOString(),
      contact: {
        name: fields.name,
        company: fields.company ?? "",
        email: fields.email,
        phone: fields.phone,
        country: fields.country ?? "",
      },
      items: (fields.products ?? "").split(",").map((s) => s.trim()).filter(Boolean),
      requirements: {
        sector: fields.sector ?? "",
        stage: fields.stage ?? "",
        location: fields.location ?? "",
        deadline: fields.deadline ?? "",
        notes: fields.notes ?? "",
      },
      files: savedFiles,
      sourceUrl: fields.sourceUrl ?? "",
      locale: fields.locale ?? "en",
      // P1: push to HubSpot/Zoho → CRM deal, email via Resend
    };
    await mkdir(dataDir, { recursive: true });
    await appendFile(path.join(dataDir, "rfq.jsonl"), JSON.stringify(record) + "\n", "utf8");

    console.log(`[rfq] ${ref} — ${record.contact.name} <${record.contact.email}> — items: ${record.items.join("; ") || "-"} — files: ${savedFiles.length}`);

    return NextResponse.json({ ok: true, ref });
  } catch (err) {
    console.error("[rfq] error", err);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
