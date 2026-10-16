#!/usr/bin/env python3
"""
AL Muraqib — bilingual (EN/AR) company profile PDF.

Regenerate at any time:
    python3 scripts/build-company-profile.py

Reads the live site data files (lib/data/*.ts) so the profile never drifts
from the website. Colors and fonts mirror app/globals.css:
  navy-950 #07101f · navy-900 #0f172a · navy-800 #0a2540 · navy-700 #12314f
  brand-700 #0369a1 · gold-500 #f59e0b · gold-400 #fbbf24
Fonts (Montserrat + Noto Kufi Arabic) are downloaded to ~/.profile-assets/fonts
on first run (codeload.github.com).

Requires: pip install reportlab arabic-reshaper python-bidi
"""
import json
import os
import re
import subprocess
import sys
import tarfile
import urllib.request
from io import BytesIO

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND_LOGO = os.path.join(REPO_ROOT, "public", "images", "brand", "logo-mark-white.png")
FONTS_DIR = os.path.expanduser("~/.profile-assets/fonts")
OUT = os.path.join(REPO, "public", "company-profile.pdf")

NAVY950, NAVY900, NAVY800, NAVY700 = "#07101f", "#0f172a", "#0a2540", "#12314f"
BRAND700, BRAND600 = "#0369a1", "#0284c7"
GOLD500, GOLD400, SLATE, PAPER = "#f59e0b", "#fbbf24", "#64748b", "#f8fafc"

# ---------------------------------------------------------------- fonts
FONT_ZIPS = {
    "Montserrat": (
        "https://codeload.github.com/JulietaUla/Montserrat/tar.gz/refs/heads/master",
        {"Montserrat-Regular": "Montserrat-master/fonts/ttf/Montserrat-Regular.ttf",
         "Montserrat-Bold": "Montserrat-master/fonts/ttf/Montserrat-Bold.ttf",
         "Montserrat-ExtraBold": "Montserrat-master/fonts/ttf/Montserrat-ExtraBold.ttf",
         "Montserrat-Black": "Montserrat-master/fonts/ttf/Montserrat-Black.ttf"},
    ),
    "Amiri": (
        "https://codeload.github.com/aliftype/amiri/tar.gz/refs/heads/main",
        {"Amiri-Regular": "amiri-main/fonts/Amiri-Regular.ttf",
         "Amiri-Bold": "amiri-main/fonts/Amiri-Bold.ttf"},
    ),
}

def ensure_fonts():
    os.makedirs(FONTS_DIR, exist_ok=True)
    need = any(not os.path.exists(os.path.join(FONTS_DIR, f"{k}.ttf")) for z in FONT_ZIPS.values() for k in z[1])
    if need:
        print("downloading brand fonts…")
    for name, (url, members) in FONT_ZIPS.items():
        if all(os.path.exists(os.path.join(FONTS_DIR, f"{k}.ttf")) for k in members):
            continue
        blob = urllib.request.urlopen(url, timeout=120).read()
        with tarfile.open(fileobj=BytesIO(blob)) as tf:
            want = set(members.values())
            for m in tf.getmembers():
                if m.name in want:
                    tgt = os.path.join(FONTS_DIR, os.path.basename(m.name))
                    if not os.path.exists(tgt):
                        open(tgt, "wb").write(tf.extractfile(m).read())

# ---------------------------------------------------------------- site data extraction
def read(p):
    return open(os.path.join(REPO, p), encoding="utf-8").read()

def unesc(s):
    return s.replace('\\"', '"').replace("\\'", "'").replace("\\n", " ").strip()

BI = re.compile(r'en:\s*"((?:[^"\\]|\\.)*)"\s*,\s*ar:\s*"((?:[^"\\]|\\.)*)"', re.S)

def L(pat, s):  # first {en,ar} pair after pattern
    m = re.search(pat, s, re.S)
    if not m:
        return None
    b = BI.search(s, m.end())
    return (unesc(b.group(1)), unesc(b.group(2))) if b else None

def products():
    s = read("lib/data/catalog.ts")
    out = []
    for m in re.finditer(r'slug:\s*"([^"]+)"', s):
        seg = s[m.end(): m.end() + 3200]
        n = re.search(r'name:\s*\{\s*en:\s*"((?:[^"\\]|\\.)*)"\s*,\s*ar:\s*"((?:[^"\\]|\\.)*)"', seg, re.S)
        p = re.search(r'pitch:\s*\{\s*en:\s*"((?:[^"\\]|\\.)*)"\s*,\s*ar:\s*"((?:[^"\\]|\\.)*)"', seg, re.S)
        if n:
            out.append({"slug": m.group(1),
                        "en": unesc(n.group(1)), "ar": unesc(n.group(2)),
                        "pitch_en": unesc(p.group(1)) if p else "", "pitch_ar": unesc(p.group(2)) if p else ""})
    return out

def projects():
    s = read("lib/data/content.ts")
    s = s[: s.index("articles")]
    out = []
    for m in re.finditer(r'slug:\s*"([^"]+)"(.*?)(?=slug:|\Z)', s, re.S):
        seg = m.group(2)
        t = re.search(r'title:\s*\{\s*en:\s*"((?:[^"\\]|\\.)*)"\s*,\s*ar:\s*"((?:[^"\\]|\\.)*)"', seg, re.S)
        loc = re.search(r'location:\s*\{\s*en:\s*"((?:[^"\\]|\\.)*)"\s*,\s*ar:\s*"((?:[^"\\]|\\.)*)"', seg, re.S)
        yr = re.search(r'year:\s*"([^"]+)"', seg)
        if t:
            out.append({"en": unesc(t.group(1)), "ar": unesc(t.group(2)),
                        "loc": unesc(loc.group(1)) if loc else "", "year": yr.group(1) if yr else ""})
    return out

def cert_items():
    s = read("lib/data/site.ts")
    out = []
    for m in re.finditer(r'code:\s*"([^"]+)"', s):
        seg = s[m.end(): m.end() + 700]
        t = re.search(r'title:\s*\{\s*en:\s*"((?:[^"\\]|\\.)*)"\s*,\s*ar:\s*"((?:[^"\\]|\\.)*)"', seg, re.S)
        i = re.search(r'issuer:\s*\{\s*en:\s*"((?:[^"\\]|\\.)*)"\s*,\s*ar:\s*"((?:[^"\\]|\\.)*)"', seg, re.S)
        v = re.search(r'validity:\s*"([^"]+)"', seg)
        if t:
            out.append({"code": m.group(1), "en": unesc(t.group(1)), "ar": unesc(t.group(2)),
                        "issuer": unesc(i.group(1)) if i else "", "val": v.group(1) if v else ""})
    return out

def brands():
    s = read("lib/data/brands.ts")
    out = []
    for m in re.finditer(r'logoText:\s*"([^"]+)"', s):
        n = re.search(r'name:\s*\{\s*en:\s*"((?:[^"\\]|\\.)*)"', s[m.end(): m.end() + 400])
        lg = re.search(r'logo:\s*"([^"]+)"', s[m.end() - 160: m.end() + 200])
        out.append({"mark": m.group(1), "en": unesc(n.group(1)) if n else m.group(1),
                    "logo": lg.group(1) if lg else None})
    return out

def services():
    s = read("lib/data/services.ts")
    out = []
    for m in re.finditer(r'id:\s*"([^"]+)",\s*title:\s*\{\s*en:\s*"((?:[^"\\]|\\.)*)"\s*,\s*ar:\s*"((?:[^"\\]|\\.)*)"', s):
        out.append({"en": unesc(m.group(2)), "ar": unesc(m.group(3))})
    return out

def site_meta():
    s = read("lib/data/site.ts")
    g = lambda p, d="": (re.search(p, s).group(1) if re.search(p, s) else d)
    return {
        "name": g(r'name:\s*"([^"]+)"'),
        "short": g(r'nameShort:\s*"([^"]+)"'),
        "url": g(r'url:\s*"([^"]+)"', "https://almuraqib.ae"),
        "phone": g(r'phone:\s*"([^"]+)"'),
        "whatsapp": g(r'phoneIntl:\s*"[^"]*?(\d{6,})"'),
        "sales": g(r'sales:\s*"([^"]+)"'),
        "addr_en": g(r'address:\s*\{\s*en:\s*"([^"]+)"'),
        "addr_ar": g(r'address:\s*\{\s*en:\s*"[^"]+",\s*ar:\s*"([^"]+)"'),
        "est": g(r'established:\s*"([^"]+)"'),
        "clients": g(r'clients:\s*(\d+)'),
        "projects_n": g(r'projects:\s*(\d+)'),
        "tagline": L(r'tagline', read("lib/i18n/en.ts")) or ("", ""),
    }

# ---------------------------------------------------------------- arabic
import arabic_reshaper
from bidi.algorithm import get_display

def ar(t):
    return get_display(arabic_reshaper.reshape(t)) if t else ""

# ---------------------------------------------------------------- build
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
                                Table, TableStyle, Image as RLImage, PageBreak, KeepTogether, Flowable)

C = lambda k: HexColor(k)

class ShieldMark(Flowable):
    """Site shield-droplet monogram, vector-drawn."""
    def __init__(self, size=22 * mm, fg=GOLD500, bg=None):
        super().__init__()
        self.w = self.h = size
        self.fg, self.bg = C(fg), C(bg) if bg else None

    def draw(self):
        c, s = self.canv, self.w
        if self.bg:
            c.setFillColor(self.bg)
            c.roundRect(-s * .12, -s * .06, s * 1.24, s * 1.12, s * .18, stroke=0, fill=1)
        c.setStrokeColor(self.fg); c.setFillColor(self.fg); c.setLineWidth(s * .055)
        p = c.beginPath()
        p.moveTo(s * .5, s * .97); p.lineTo(s * .93, s * .82)
        p.lineTo(s * .93, s * .45)
        p.curveTo(s * .93, s * .18, s * .72, s * .06, s * .5, s * .0)
        p.curveTo(s * .28, s * .06, s * .07, s * .18, s * .07, s * .45)
        p.lineTo(s * .07, s * .82); p.close()
        c.drawPath(p, stroke=0, fill=1)
        c.setFillColor(C(NAVY900))
        q = c.beginPath()
        q.moveTo(s * .5, s * .86); q.lineTo(s * .84, s * .745)
        q.lineTo(s * .84, s * .455)
        q.curveTo(s * .84, s * .235, s * .67, s * .135, s * .5, s * .085)
        q.curveTo(s * .33, s * .135, s * .16, s * .235, s * .16, s * .455)
        q.lineTo(s * .16, s * .745); q.close()
        c.drawPath(q, stroke=0, fill=1)
        c.setFillColor(self.fg)
        d = c.beginPath()  # droplet
        d.moveTo(s * .5, s * .78)
        d.curveTo(s * .66, s * .60, s * .64, s * .50, s * .57, s * .435)
        d.curveTo(s * .50, s * .37, s * .40, s * .40, s * .375, s * .475)
        d.curveTo(s * .35, s * .56, s * .40, s * .66, s * .5, s * .78)
        d.close()
        c.drawPath(d, stroke=0, fill=1)
        c.setStrokeColor(self.fg); c.setLineWidth(s * .03)
        for yy, xx in ((.315, .28), (.25, .33)):
            w = c.beginPath(); w.moveTo(s * xx, s * yy)
            w.curveTo(s * (xx + .12), s * (yy + .05), s * (xx + .24), s * (yy - .05), s * (xx + .4), s * yy)
            c.drawPath(w, stroke=1, fill=0)

def main():
    ensure_fonts()
    for name, fn in [("Mo", "Montserrat-Regular"), ("MoB", "Montserrat-Bold"), ("MoX", "Montserrat-ExtraBold"),
                     ("MoK", "Montserrat-Black"), ("Ku", "Amiri-Regular"), ("KuB", "Amiri-Bold")]:
        pdfmetrics.registerFont(TTFont(name, os.path.join(FONTS_DIR, f"{fn}.ttf")))
    from reportlab.pdfbase.pdfmetrics import registerFontFamily
    registerFontFamily("Mo", normal="Mo", bold="MoB", italic="Mo", boldItalic="MoB")
    registerFontFamily("Ku", normal="Ku", bold="KuB", italic="Ku", boldItalic="KuB")

    P = dict(products=products(), projects=projects(), certs=cert_items(), brands=brands(),
             services=services(), site=site_meta())
    st = P["site"]

    S = {
        "h1": ParagraphStyle("h1", fontName="MoX", fontSize=21, leading=26, textColor=C(NAVY900)),
        "en": ParagraphStyle("en", fontName="Mo", fontSize=9.2, leading=13.4, textColor=HexColor("#334155")),
        "enb": ParagraphStyle("enb", fontName="MoB", fontSize=9.6, leading=13.4, textColor=C(NAVY900)),
        "ar": ParagraphStyle("ar", fontName="Ku", fontSize=10.4, leading=16.4, textColor=HexColor("#334155"),
                             alignment=2),
        "arb": ParagraphStyle("arb", fontName="KuB", fontSize=10.8, leading=15, textColor=C(NAVY900), alignment=2),
        "small": ParagraphStyle("sm", fontName="Mo", fontSize=7.6, leading=10.6, textColor=C(SLATE)),
        "smallar": ParagraphStyle("sma", fontName="Ku", fontSize=8.4, leading=12.6, textColor=C(SLATE), alignment=2),
        "gold": ParagraphStyle("g", fontName="MoX", fontSize=9, leading=12, textColor=C(GOLD500)),
        "whiteX": ParagraphStyle("wx", fontName="MoX", fontSize=23, leading=28, textColor=white),
        "whiteK": ParagraphStyle("wk", fontName="KuB", fontSize=17, leading=27, textColor=white, alignment=1),
        "tagline": ParagraphStyle("t", fontName="MoB", fontSize=10.5, leading=15, textColor=HexColor("#cbd5e1")),
        "taglineAr": ParagraphStyle("ta", fontName="Ku", fontSize=11, leading=20, textColor=HexColor("#cbd5e1"), alignment=1),
    }

    doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=15 * mm, rightMargin=15 * mm,
                          topMargin=17 * mm, bottomMargin=16 * mm,
                          title="AL MURAQIB — Company Profile · ملف الشركة",
                          author=st["name"])

    def deco(cv, doc_p):
        pg = cv.getPageNumber()
        if pg == 1:
            cv.setFillColor(C(NAVY950)); cv.rect(0, 0, A4[0], A4[1], stroke=0, fill=1)
            cv.setFillColor(C(NAVY700)); cv.rect(0, A4[1] - 66 * mm, A4[0], 66 * mm, stroke=0, fill=1)
            cv.setFillColor(C(NAVY800))
            cv.rect(0, 44 * mm, A4[0], 4.2 * mm, stroke=0, fill=1)
            cv.setFillColor(C(GOLD500)); cv.rect(0, 45.4 * mm, A4[0] * .58, 1.4 * mm, stroke=0, fill=1)
            cv.setFillColor(C(BRAND600)); cv.rect(A4[0] * .58, 45.4 * mm, A4[0] * .42, 1.4 * mm, stroke=0, fill=1)
        else:
            cv.setFillColor(C(NAVY950)); cv.rect(0, 0, A4[0], 9.2 * mm, stroke=0, fill=1)
            cv.setFont("MoB", 6.8); cv.setFillColor(C(GOLD400))
            cv.drawString(15 * mm, 3.2 * mm, "ALMURAQIB.AE")
            cv.setFont("MoB", 5.8); cv.setFillColor(HexColor("#64748b"))
            cv.drawString(38 * mm, 3.2 * mm, "·  DESIGNED & DEVELOPED BY BITSCOL")
            cv.setFillColor(HexColor("#94a3b8"))
            label = f"{st['name']}  ·  {ar('ملف الشركة ٢٠٢٦')}  ·  {pg - 1}"
            cv.setFont("Ku", 7)
            cv.drawRightString(A4[0] - 15 * mm, 3.2 * mm, label)
            cv.setStrokeColor(C(GOLD500)); cv.setLineWidth(0.8); cv.line(15 * mm, 9.2 * mm, A4[0] - 15 * mm, 9.2 * mm)

    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="n")
    doc.addPageTemplates([PageTemplate(id="all", frames=[frame], onPage=deco)])

    def sect(en, ar_t, blurb_en="", blurb_ar=""):
        head = Table([[Paragraph(en, S["h1"]), Paragraph(f"<font color='{GOLD500}'>—</font>  {ar(ar_t)}", S["arb"])],
                      ], colWidths=[doc.width * .6, doc.width * .4])
        head.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "bottom"),
                                  ("ALIGN", (0, 0), (0, 0), "LEFT"), ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                                  ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                                  ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]))
        bar = Table([[""]], colWidths=[11 * mm], rowHeights=[2.1 * mm])
        bar.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), C(GOLD500))]))
        out = [bar, Spacer(1, 2.6 * mm), head]
        if blurb_en or blurb_ar:
            out.append(Spacer(1, 1.6 * mm))
            cells = [[Paragraph(blurb_en, S["en"]), Paragraph(ar(blurb_ar), S["ar"])]]
            bl = Table(cells, colWidths=[doc.width * .58, doc.width * .42])
            bl.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (0, 0), 0),
                                    ("RIGHTPADDING", (1, 0), (1, 0), 0)]))
            out.append(bl)
        out.append(Spacer(1, 3 * mm))
        return out

    E = [Spacer(1, 34 * mm),
         Table([[RLImage(BRAND_LOGO, 25 * mm, 25 * mm * 438 / 430)]], colWidths=[doc.width], style=TableStyle([("ALIGN", (0, 0), (-1, -1), "CENTER")])),
         Spacer(1, 10 * mm),
         Paragraph("AL MURAQIB", ParagraphStyle("cov", parent=S["whiteX"], fontSize=33, leading=42, alignment=1)),
         Paragraph("FIBER GLASS INDUSTRY L.L.C", S["gold"].clone("gc", fontSize=10.5, alignment=1)),
         Spacer(1, 6 * mm),
         Paragraph(ar("المراقب لصناعة الألياف الزجاجية"), S["whiteK"]),
         Spacer(1, 12 * mm),
         Paragraph("Company Profile — 2026", ParagraphStyle("cv3", parent=S["tagline"], fontSize=9.5, alignment=1)),
         Paragraph(ar("ملف الشركة التعريفي · ٢٠٢٦"), ParagraphStyle("cv3b", parent=S["taglineAr"], fontSize=10, alignment=1, leading=17)),
         Paragraph("ISO 9001 Certified · Sharjah, UAE · Est. 2016",
                   ParagraphStyle("cv4", parent=S["tagline"], fontName="MoB", fontSize=9,
                                  textColor=HexColor("#7dd3fc"), alignment=1, leading=18)),
         Spacer(1, 52 * mm),
         Paragraph("almuraqib.ae", ParagraphStyle("cv5", fontName="MoB", fontSize=10, textColor=C(GOLD400), alignment=1)),
         Spacer(1, 2.2 * mm),
         Paragraph('Website designed &amp; developed by <font color="#fbbf24">BITSCOL</font> · bitscol.com',
                   ParagraphStyle("cvc", fontName="MoB", fontSize=7.4, leading=11,
                                  textColor=HexColor("#94a3b8"), alignment=1)),
         PageBreak()]

    # -- 1. About
    tag_en = "One of the UAE's most advanced manufacturers of Glass Reinforced Plastic (GRP / FRP) products — every stage executed in-house under ISO 9001-certified procedures: design, moulding, finishing, assembly, installation and lifetime support."
    tag_ar = "من أحدث مصانع الألياف الزجاجية (GRP/FRP) في الإمارات — كل المراحل تنفيذ داخلي وفق نظام الأيزو 9001: التصميم، القوالب، التشطيب، التجميع، التركيب والدعم بعد التسليم."
    E += sect("ABOUT US", "من نحن", tag_en, tag_ar)
    stats = [("EST.", st["est"], "السنة"), ("CLIENTS", f"{st['clients']}+", "عميلاً"),
             ("PROJECTS", f"{st['projects_n']}+", "مشروعاً"), ("DISCIPLINES", "4", "تخصصات داخلية")]
    cells, widths = [], []
    row_e, row_v, row_a = [], [], []
    for lab, val, a in stats:
        row_e.append(Paragraph(lab, ParagraphStyle("s1", fontName="MoB", fontSize=7, textColor=HexColor("#9fb4d8"), alignment=1)))
        row_v.append(Paragraph(val, ParagraphStyle("s2", fontName="MoK", fontSize=17.5, textColor=C(GOLD400), alignment=1, leading=20)))
        row_a.append(Paragraph(ar(a), ParagraphStyle("s3", fontName="Ku", fontSize=8, textColor=HexColor("#cbd5e1"), alignment=1)))
    tbl = Table([row_e, row_v, row_a], colWidths=[doc.width / 4] * 4)
    tbl.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), C(NAVY900)),
                             ("TOPPADDING", (0, 0), (-1, 0), 7), ("BOTTOMPADDING", (0, 2), (-1, 2), 7),
                             ("TOPPADDING", (0, 2), (-1, 2), 3.2), ("BOTTOMPADDING", (0, 0), (-1, 1), 1), ("BOTTOMPADDING", (0, 0), (-1, 0), 0),
                             ("LINEBEFORE", (1, 0), (-1, -1), 0.6, C(NAVY700))]))
    E += [tbl, Spacer(1, 7 * mm)]

    # -- 2. Services
    E += sect("WHAT WE DO", "خدماتنا")
    rows = []
    for i, sv in enumerate(P["services"], 1):
        rows.append([Paragraph(f"<font color='{GOLD500}'>{'0'+str(i)}</font>", S["enb"]),
                     Paragraph(sv["en"], S["enb"]), Paragraph(ar(sv["ar"]), S["ar"])])
    t = Table(rows, colWidths=[10 * mm, doc.width * .52, doc.width * .48 - 10 * mm])
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                           ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                           ("ROWBACKGROUNDS", (0, 0), (-1, -1), [white, C(PAPER)]),
                           ("LINEBELOW", (0, 0), (-1, -2), 0.4, HexColor("#e2e8f0")),
                           ("LEFTPADDING", (0, 0), (0, -1), 3)]))
    E += [t, Spacer(1, 7 * mm)]

    # -- 3. Products (with site photos)
    E += sect("PRODUCT PORTFOLIO", "منتجاتنا",
              "Nine engineered families, moulded in our own Al Bataeh facility — each configurable to site loads and volumes.",
              "عائلة منتجات مصنّعة هندسيًا في منشأتنا البطائح — قابلة للتجهيز حسب أحمال وسعات كل موقع.")
    img_dir = os.path.join(REPO, "public", "images", "products")
    rows = []
    for i, pr in enumerate(P["products"]):
        img = None
        fp = os.path.join(img_dir, f"{pr['slug']}.jpg")
        if os.path.exists(fp):
            im = RLImage(fp, width=37 * mm, height=23.5 * mm)
            img = im
        pe = pr["pitch_en"][:150] + ("…" if len(pr["pitch_en"]) > 150 else "")
        pa = pr["pitch_ar"][:110] + ("…" if len(pr["pitch_ar"]) > 110 else "")
        text = [Paragraph(f"<b>{i+1:02d}</b>  {pr['en']}", S["enb"]),
                Paragraph(f"<font color='{BRAND700}'>{ar(pr['ar'])}</font>", ParagraphStyle("pa2", parent=S["ar"], fontSize=8.8, leading=12.6)),
                Paragraph(pe, S["small"]),
                Paragraph(ar(pa), ParagraphStyle("pb2", parent=S["smallar"], fontSize=7.8, leading=11.4))]
        rows.append([img, text])
    grid_rows = []
    half = (doc.width) / 2
    def cell(it):
        img2, content = it
        return Table([[img2] if img2 else [Paragraph("", S["small"])], [content]], colWidths=[half - 5 * mm],
                     style=TableStyle([("ALIGN", (0, 0), (-1, -1), "LEFT"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                                       ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, 0), 2.2 * mm),
                                       ("TOPPADDING", (0, 1), (-1, 1), 0)]))
    for i in range(0, len(rows), 2):
        l = rows[i]
        r = rows[i + 1] if i + 1 < len(rows) else [None, ""]
        grid_rows.append([cell(l), cell(r)])
    t = Table(grid_rows, colWidths=[half, half])
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (0, -1), 0),
                           ("RIGHTPADDING", (0, 0), (0, -1), 6 * mm), ("LEFTPADDING", (1, 0), (1, -1), 6 * mm),
                           ("RIGHTPADDING", (1, 0), (1, -1), 0),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 6 * mm), ("TOPPADDING", (0, 0), (-1, -1), 0)]))
    E += [t, Spacer(1, 4 * mm)]

    # -- 4. Projects strip
    E += sect("DELIVERED — SELECTED PROJECTS", "أبرز أعمالنا",
              "From JBR balcony pools to Fujairah port chambers: hospitality, residential, municipal, industrial and infrastructure.",
              "من مسابح أبراج جميرا بيتش إلى حجرات ميناء الفجيرة: ضيافة، سكني، بلدي، صناعي وبنية تحتية.")
    prows = [[Paragraph("<b>Client project</b>", S["enb"]), Paragraph("<b>الموقع</b>", S["arb"]), Paragraph("<b>Year</b>", ParagraphStyle("y", parent=S["enb"], alignment=1))]]
    for pj in P["projects"]:
        prows.append([Paragraph(pj["en"], S["en"]), Paragraph(ar(f"{pj['loc']} — {pj['ar']}"), S["ar"]),
                      Paragraph(pj["year"], ParagraphStyle("y2", parent=S["small"], alignment=1))])
    t = Table(prows, colWidths=[doc.width * .40, doc.width * .45, doc.width * .15])
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("TOPPADDING", (0, 0), (-1, -1), 3.4),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 3.4), ("LINEBELOW", (0, 0), (-1, -2), 0.4, HexColor("#e2e8f0")),
                           ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, C(PAPER)]), ("LEFTPADDING", (0, 0), (-1, -1), 3)]))
    E += [t, Spacer(1, 7 * mm)]

    # -- 5. Quality
    E += sect("QUALITY & COMPLIANCE", "الجودة والامتثال")
    qrows = [[Paragraph(f"<b>{cc['code'].replace('-', ' ').upper()[:14]}</b>", ParagraphStyle("qc", parent=S["enb"], textColor=C(GOLD500), fontSize=8.4, leading=11)),
              [Paragraph(cc["en"], S["enb"]), Paragraph(cc["issuer"], S["small"])],
              Paragraph(ar(cc["ar"]), S["ar"]),
              Paragraph(ar(f"الصلاحية: {cc['val']}") if cc["val"] else "", ParagraphStyle("qv", parent=S["smallar"], fontSize=7.2)) ]
             for cc in P["certs"]]
    t = Table(qrows, colWidths=[27 * mm, doc.width * .35, doc.width * .32, doc.width - 27 * mm - doc.width * .67])
    t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("TOPPADDING", (0, 0), (-1, -1), 3.6),
                           ("BOTTOMPADDING", (0, 0), (-1, -1), 3.6), ("ROWBACKGROUNDS", (0, 0), (-1, -1), [white, C(PAPER)]),
                           ("LEFTPADDING", (0, 0), (-1, -1), 3)]))
    E += [t, Spacer(1, 7 * mm)]

    # -- 6. Brands
    E += sect("OUR BRANDS & PARTNERS", "علاماتنا وشركاؤنا",
              "Two in-house brands plus long-standing supply partners on landmark developments.",
              "علامتان داخليتان مع شركاء توريد موثوقين في مشاريع مميزة.")
    marks = P["brands"]
    per = 4
    brow = []
    bstyle = []
    for ri, r in enumerate(range(0, len(marks), per)):
        chunk = marks[r:r + per]
        cells = []
        for ci, b in enumerate(chunk):
            lg = b.get("logo")
            lp = os.path.join(REPO, "public", "images", "brands", f"{lg}.png") if lg else None
            if lg and os.path.exists(lp):
                from PIL import Image as _PIL
                _w, _h = _PIL.open(lp).size
                ih = min(9.7 * mm, 34 * mm * _h / _w)
                iw = min(34 * mm, ih * _w / _h)
                cells.append(RLImage(lp, width=iw, height=ih))
                bstyle.append(("BACKGROUND", (ci, ri), (ci, ri), white))
            else:
                cells.append(Paragraph(f"<font color='white'><b>{b['mark']}</b></font>",
                                       ParagraphStyle("bm2", fontName="MoX", fontSize=9.4, alignment=1)))
                bstyle.append(("BACKGROUND", (ci, ri), (ci, ri), C(NAVY900)))
        while len(cells) < per:
            cells.append(Paragraph("", ParagraphStyle("bmx", fontSize=1)))
        brow.append(cells)
    bt = Table(brow, colWidths=[doc.width / per] * per, rowHeights=[10.5 * mm] * len(brow))
    bt.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 1.6, white), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                            ("INNERGRID", (0, 0), (-1, -1), 0, white)] + bstyle))
    E += [bt, Spacer(1, 7 * mm)]

    # -- 7. Contact
    contact = Table([[
        [Paragraph("CONTACT", ParagraphStyle("ct1", parent=S["h1"], fontSize=14, textColor=white)),
         Spacer(1, 2 * mm),
         Paragraph("AL MURAQIB FIBER GLASS INDUSTRY L.L.C", ParagraphStyle("ct2", fontName="MoB", fontSize=8.4, textColor=C(GOLD400), leading=11)),
         Spacer(1, 2.4 * mm),
         Paragraph(st["addr_en"], S["small"].clone("ce", textColor=HexColor("#cbd5e1"), fontSize=8.2, leading=12)),
         Spacer(1, 2.4 * mm),
         Paragraph(f"Tel {st['phone']}  ·  WhatsApp +{st['whatsapp']}<br/>sales: {st['sales']}<br/>web: almuraqib.ae",
                   ParagraphStyle("ct3", parent=S["small"], textColor=HexColor("#e2e8f0"), fontSize=8.4, leading=13)),
        ],
        [Paragraph(ar("تواصل معنا"), ParagraphStyle("cta", fontName="KuB", fontSize=15, textColor=white, alignment=2)),
         Spacer(1, 2 * mm),
         Paragraph(ar(st["addr_ar"]), ParagraphStyle("car", parent=S["ar"], fontSize=9.2, leading=16, textColor=HexColor("#cbd5e1"))),
         Spacer(1, 2.4 * mm),
         Paragraph(ar(f"هاتف: {st['phone']}<br/> واتساب: ‎+{st['whatsapp']}<br/>البريد: {st['sales']}<br/>الموقع: almuraqib.ae"),
                   ParagraphStyle("car2", parent=S["smallar"], fontSize=9, leading=15, textColor=HexColor("#e2e8f0"))),
         Spacer(1, 3 * mm),
         Paragraph(ar("طلب عرض سعر — <font color='%s'>almuraqib.ae/get-quotation</font>") % GOLD400,
                   ParagraphStyle("car3", parent=S["smallar"], fontName="KuB", fontSize=9, textColor=white)),
        ],
    ]], colWidths=[doc.width * .56, doc.width * .44])
    contact.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), C(NAVY950)),
                                 ("VALIGN", (0, 0), (-1, -1), "TOP"),
                                 ("LEFTPADDING", (0, 0), (0, 0), 7 * mm), ("RIGHTPADDING", (1, 0), (1, 0), 7 * mm),
                                 ("TOPPADDING", (0, 0), (-1, -1), 6 * mm), ("BOTTOMPADDING", (0, 0), (-1, -1), 6 * mm),
                                 ("LINEBEFORE", (1, 0), (1, 0), 0.8, C(NAVY700)),
                                 ("BACKGROUND", (0, 0), (0, 0), C(NAVY900))]))
    E += [contact, Spacer(1, 4 * mm),
          Paragraph("Generated from the live website data · designed & developed by BITSCOL — bitscol.com · أُنشئ من بيانات الموقع الحي — scripts/build-company-profile.py",
                    S["small"].clone("fin", alignment=1, fontSize=6.8))]

    doc.build(E)
    sz = os.path.getsize(OUT) / 1024
    print(f"✓ wrote {OUT} ({sz:.0f} KB)")

if __name__ == "__main__":
    main()
