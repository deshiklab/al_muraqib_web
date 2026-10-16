#!/usr/bin/env node
/**
 * Re-optimizes the site's static imagery in place (public/).
 * Usage: npm run images:opt [-- <dir>]
 *
 * JPG  → mozjpeg, quality 72, progressive, metadata stripped, capped at 1600px wide.
 * PNG  → palette-quantized (256 colors) — used for the OG card.
 * Only rewrites a file if the result is actually smaller.
 */
import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(process.argv[2] ?? "public");
const exts = new Set([".jpg", ".jpeg", ".png"]);

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (exts.has(path.extname(p).toLowerCase())) yield p;
  }
}

let totalBefore = 0;
let totalAfter = 0;
for await (const file of walk(root)) {
  const { size } = await stat(file);
  const isPng = file.toLowerCase().endsWith(".png");
  const img = sharp(file, { failOn: "none" }).rotate(); // honor EXIF orientation
  const meta = await img.metadata();
  const maxW = isPng ? 1200 : 1600;
  const pipeline = meta.width > maxW ? img.resize({ width: maxW, withoutEnlargement: true }) : img;
  const buf = await (isPng
    ? pipeline.png({ palette: true, quality: 82, effort: 9 }).toBuffer()
    : pipeline.jpeg({ quality: 72, mozjpeg: true, progressive: true, mct: true }).toBuffer());

  if (buf.length < size) {
    await writeFile(file, buf);
    totalBefore += size;
    totalAfter += buf.length;
    console.log(`${((1 - buf.length / size) * 100).toFixed(0).padStart(3)}%  ${(size / 1024) >> 0}KB→${(buf.length / 1024) >> 0}KB  ${path.relative(root, file)}`);
  } else {
    totalBefore += size;
    totalAfter += size;
    console.log(` --  already optimal: ${path.relative(root, file)}`);
  }
}
console.log(
  `\nTOTAL ${(totalBefore / 1048576).toFixed(1)}MB → ${(totalAfter / 1048576).toFixed(1)}MB  (-${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`
);
