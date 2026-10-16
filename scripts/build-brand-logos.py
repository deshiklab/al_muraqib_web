#!/usr/bin/env python3
"""Build normalized partner/client brand logos for AL Muraqib site + PDF.

Source of truth: public/images/brands/source/<slug>.<ext>  (client-supplied originals)
Output:         public/images/brands/<slug>.png            (uniform white-plate canvases)

Every output sits on the SAME 700x200 white canvas with equal margins, so the logos
can be tiled identically on dark and light surfaces (white plate = brand-safe for
multi-colour artwork) and drop straight into the reportlab brand grid in the PDF.

Regenerate:  python3 scripts/build-brand-logos.py
"""
import os

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public", "images", "brands", "source")
OUT = os.path.join(ROOT, "public", "images", "brands")

MIN_ASPECT = 2.4         # plates never go narrower than this ratio → banner-friendly rows
BOX_W, BOX_H = 620, 150  # max artwork box inside the plate
MX, MY = 40, 22          # plate padding around the artwork
WHITE_AT = 245           # pixels brighter than this (all channels) count as background
NEAR_WHITE = 228         # pushed to pure white (kills JPEG off-white halos)

EXTS = (".png", ".jpg", ".jpeg", ".webp")


def on_white(im: Image.Image) -> Image.Image:
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
        im = Image.alpha_composite(bg, im).convert("RGB")
    else:
        im = im.convert("RGB")
    a = np.asarray(im).astype(np.int16)
    mask = a.min(axis=2) >= NEAR_WHITE          # bright & neutral-ish → true white
    a[mask] = 255
    return Image.fromarray(a.astype("uint8"), "RGB")


def trim(im: Image.Image) -> Image.Image:
    g = im.convert("L").point(lambda v: 0 if v >= WHITE_AT else 255)
    bbox = g.getbbox()
    return im.crop(bbox) if bbox else im


def build(slug: str) -> None:
    src = next((os.path.join(SRC, slug + e) for e in EXTS if os.path.exists(os.path.join(SRC, slug + e))), None)
    if not src:
        print(f"  skip {slug}: no source")
        return
    art = trim(on_white(Image.open(src)))
    scale = min(BOX_W / art.width, BOX_H / art.height, 1.0)
    if scale < 1:  # also allow modest upscaling for tiny sources so all plates share artwork height
        scale = max(scale, BOX_H / art.height) if art.height > art.width else min(BOX_H / art.height, BOX_W / art.width)
    art = art.resize((max(1, int(art.width * scale)), max(1, int(art.height * scale))), Image.LANCZOS)
    cw, ch = art.width + 2 * MX, art.height + 2 * MY
    if cw / ch < MIN_ASPECT:
        cw = int(ch * MIN_ASPECT)
    canvas = Image.new("RGB", (cw, ch), (255, 255, 255))
    canvas.paste(art, ((cw - art.width) // 2, (ch - art.height) // 2))
    canvas.save(os.path.join(OUT, f"{slug}.png"), optimize=True)
    print(f"  {slug}: {art.width}×{art.height} art → plate {cw}×{ch}")


def main():
    os.makedirs(OUT, exist_ok=True)
    for slug in sorted(f.rsplit(".", 1)[0] for f in os.listdir(SRC) if os.path.splitext(f)[1].lower() in EXTS):
        build(slug)

    # on-theme contact sheet for visual QA (white band + navy band per logo)
    slugs = sorted(f[:-4] for f in os.listdir(OUT) if f.endswith(".png"))
    cols = 2
    tile_w, tile_h = 380, 130
    rows = (len(slugs) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * (tile_w + 16) + 16, rows * 2 * (tile_h + 12) + 24), (7, 16, 31))
    for i, sl in enumerate(slugs):
        im = Image.open(os.path.join(OUT, f"{sl}.png"))
        im.thumbnail((tile_w, tile_h), Image.LANCZOS)
        r, c = divmod(i, cols)
        x = 8 + c * (tile_w + 16)
        base_y = 8 + r * 2 * (tile_h + 12)
        sheet.paste(im, (x + (tile_w - im.width) // 2, base_y + (tile_h - im.height) // 2))
        y2 = base_y + tile_h + 12
        sheet.paste(im, (x + (tile_w - im.width) // 2, y2 + (tile_h - im.height) // 2))
    sheet.save("/tmp/brand-logos-sheet.png")
    print("contact sheet → /tmp/brand-logos-sheet.png")


if __name__ == "__main__":
    main()
