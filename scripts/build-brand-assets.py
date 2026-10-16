#!/usr/bin/env python3
"""Generate all brand logo assets from the original Al Muraqib logo.

Source of truth: public/images/brand/logo.png (the client-supplied master,
light-blue line art on transparency, mark + wordmark stacked).

Derived assets (regenerate any time with:  python3 scripts/build-brand-assets.py):
  public/images/brand/logo-mark.png         geometric mark, native colors
  public/images/brand/logo-mark-white.png   solid-white silhouette (dark surfaces)
  public/images/brand/logo-mark-navy.png    solid-navy silhouette (light surfaces)
  public/images/brand/logo-full-white.png   full lockup, white (dark surfaces / PDF)
  public/images/brand/logo-full-navy.png    full lockup, navy
  app/icon.png                              favicon (white mark on navy rounded square)
  app/apple-icon.png                        180px navy tile for iOS
  public/og-card.png                        1200x630 social share card
"""
import os
import shutil
import sys

from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND_DIR = os.path.join(ROOT, "public", "images", "brand")
SRC = os.path.join(BRAND_DIR, "logo.png")

NAVY950 = (7, 16, 31)
NAVY800 = (10, 37, 64)
GOLD500 = (245, 158, 11)
BRAND600 = (2, 132, 199)

MARK_BOTTOM = 445  # empty alpha band between the mark and the wordmark (445..496)


def load():
    if not os.path.exists(SRC):
        sys.exit(f"missing source logo: {SRC}")
    return Image.open(SRC).convert("RGBA")


def tint(im, rgb):
    """Keep the original alpha (soft glow & line detail), replace color."""
    a = im.split()[3]
    out = Image.new("RGBA", im.size, rgb + (0,))
    out.putalpha(a)
    return out


def main():
    os.makedirs(BRAND_DIR, exist_ok=True)
    logo = load()

    # --- crops -------------------------------------------------------------
    bbox = logo.split()[3].getbbox()
    x0, y0, x1, y1 = bbox
    mark = logo.crop((x0, y0, x1, MARK_BOTTOM))
    full = logo.crop(bbox)

    mark.save(os.path.join(BRAND_DIR, "logo-mark.png"))
    tint(mark, (255, 255, 255)).save(os.path.join(BRAND_DIR, "logo-mark-white.png"))
    tint(mark, NAVY950).save(os.path.join(BRAND_DIR, "logo-mark-navy.png"))
    tint(full, (255, 255, 255)).save(os.path.join(BRAND_DIR, "logo-full-white.png"))
    tint(full, NAVY800).save(os.path.join(BRAND_DIR, "logo-full-navy.png"))

    # --- favicon + apple tile -----------------------------------------------
    def tile(size, pad_frac, radius_frac):
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        d = ImageDraw.Draw(canvas)
        d.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * radius_frac),
                            fill=NAVY950 + (255,))
        inner = int(size * (1 - 2 * pad_frac))
        m = mark.resize((inner, int(inner * mark.height / mark.width)), Image.LANCZOS)
        # keep it square-ish vertically centered
        mw, mh = m.size
        if mh > inner:
            m = m.resize((int(inner * mw / mh), inner), Image.LANCZOS)
            mw, mh = m.size
        canvas.paste(m, ((size - mw) // 2, (size - mh) // 2), m)
        return canvas

    tile(128, 0.16, 0.20).save(os.path.join(ROOT, "app", "icon.png"))
    tile(180, 0.14, 0.22).save(os.path.join(ROOT, "app", "apple-icon.png"))

    # --- og card 1200x630 ---------------------------------------------------
    W, H = 1200, 630
    og = Image.new("RGBA", (W, H), NAVY950 + (255,))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([W * 0.62, -260, W + 320, 320], fill=BRAND600 + (70,))
    gd.ellipse([-260, H * 0.45, 420, H + 240], fill=GOLD500 + (46,))
    og = Image.alpha_composite(og, glow.filter(ImageFilter.GaussianBlur(90)))
    gd2 = ImageDraw.Draw(og)
    # thin diagonal hairlines top-right, echoing the logo lattice
    for k in range(9):
        x = W - 46 - k * 24
        gd2.line([(x, 30), (x - 110, 150)], fill=(255, 255, 255, 12), width=2)
    # frame + gold accent bar
    gd2.rectangle([26, 26, W - 27, H - 27], outline=(255, 255, 255, 26), width=2)
    gd2.rectangle([26, 26, int(W * 0.40), 29], fill=GOLD500 + (255,))

    # lockup (mark + wordmark), white, left of centre
    lh = 420
    lw = int(lh * full.width / full.height)
    lock = tint(full.resize((lw, lh), Image.LANCZOS), (255, 255, 255))
    lx, ly = 118, (H - lh) // 2 - 14
    og.paste(lock, (lx, ly), lock)

    # right text block
    from PIL import ImageFont
    font_big = font_mid = None
    for cand in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                 "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"):
        if os.path.exists(cand):
            font_big = ImageFont.truetype(cand, 34)
            font_mid = ImageFont.truetype(cand, 22)
            break
    if font_big:
        tx = lx + lw + 110
        mid_y = H // 2
        gd2.rectangle([tx - 46, mid_y - 96, tx - 43, mid_y + 84], fill=GOLD500 + (220,))
        gd2.text((tx, mid_y - 88), "Glass Reinforced Plastic,", font=font_big, fill=(255, 255, 255, 240))
        gd2.text((tx, mid_y - 40), "engineered in-house.", font=font_big, fill=(255, 255, 255, 240))
        gd2.text((tx, mid_y + 26), "ISO 9001  \u00b7  Dubai Municipality approved", font=font_mid,
                 fill=(203, 213, 225, 235))
        gd2.text((tx, mid_y + 62), "almuraqib.ae  \u00b7  Sharjah, UAE  \u00b7  Est. 2016", font=font_mid,
                 fill=GOLD500 + (235,))
    og.convert("RGB").save(os.path.join(ROOT, "public", "og-card.png"), optimize=True)

    print("brand assets done:")
    for f in sorted(os.listdir(BRAND_DIR)):
        p = os.path.join(BRAND_DIR, f)
        print(f"  {f:26s} {Image.open(p).size} {os.path.getsize(p)//1024} KB")


if __name__ == "__main__":
    main()
