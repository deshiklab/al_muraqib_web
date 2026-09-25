import { NextRequest, NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const reason = String(fd.get("reason") ?? "").trim();

    if (!name || !message || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    }

    const dataDir = path.join(process.cwd(), ".data");
    await mkdir(dataDir, { recursive: true });
    const record = {
      type: "contact",
      createdAt: new Date().toISOString(),
      name,
      email,
      phone,
      company: String(fd.get("company") ?? ""),
      reason,
      message,
      locale: String(fd.get("locale") ?? "en"),
    };
    await appendFile(path.join(dataDir, "contact.jsonl"), JSON.stringify(record) + "\n", "utf8");
    console.log(`[contact] ${name} <${email}> — ${reason}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] error", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
