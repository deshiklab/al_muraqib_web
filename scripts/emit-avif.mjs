#!/usr/bin/env node
/**
 * Emits <name>.avif + <name>.webp next to each JPG passed through the hero
 * pipeline (public/hero/*.jpg) so <picture> can negotiate formats without a
 * server (static export has images.unoptimized). Idempotent; overwrites only
 * when the source is newer or the output is missing/larger than 60% of the
 * source (i.e. no point shipping a "smaller" AVIF that isn't).
 *
 *   node scripts/emit-avif.mjs            → processes public/hero/*.jpg
 *   node scripts/emit-avif.mjs a.jpg …    → explicit files
 */
import { stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const files = args.length ? args : (await import("node:fs")).readdirSync("public/hero").filter(f => /\.jpe?g$/i.test(f)).map(f => path.join("public/hero", f));

let before = 0, after = 0;
for (const rel of files) {
  const abs = path.resolve(ROOT, rel);
  if (!existsSync(abs)) { console.log("skip (missing):", rel); continue; }
  const src = await stat(abs);
  const base = abs.replace(/\.jpe?g$/i, "");
  const jobs = [
    [base + ".avif", s => s.avif({ quality: 52, effort: 5 })],
    [base + ".webp", s => s.webp({ quality: 66, effort: 5 })],
  ];
  for (const [out, conv] of jobs) {
    if (existsSync(out) && (await stat(out)).size < src.size * 0.6 && (await stat(out)).mtimeMs > src.mtimeMs) {
      console.log(`keep   ${path.relative(ROOT, out)}`);
      continue;
    }
    const info = await conv(sharp(abs).rotate()).toFile(out);
    before += src.size; after += info.size;
    console.log(`${path.relative(ROOT, out)}  ${(src.size / 1024).toFixed(0)}KB → ${(info.size / 1024).toFixed(0)}KB`);
  }
}
console.log(`TOTAL ${ (before/1024).toFixed(0) }KB → ${(after/1024).toFixed(0)}KB  (-${before ? Math.round(100 - (after / before) * 100) : 0}%)`);
