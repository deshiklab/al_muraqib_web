#!/usr/bin/env python3
"""Generate public/feed.xml (RSS 2.0 + per-locale atom:link alternates) by
parsing lib/data/content.ts — the same source the pages and sitemap use.
Run after adding articles:  npm run feed
"""
import re
from datetime import datetime, timezone
from email.utils import format_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FEED_BASE = "https://almuraqib.ae"


def unesc(s: str) -> str:
    return s.replace('\\"', '"').replace("\\'", "'")


def main() -> None:
    src = (ROOT / "lib/data/content.ts").read_text()
    m = re.search(r"export const articles: Article\[\] = \[(.*?)\n\];", src, re.S)
    assert m, "articles array not found in content.ts"
    items = []
    for chunk in re.split(r"\n  \{\n", m.group(1))[1:]:
        slug = re.search(r'slug:\s*"((?:[^"\\]|\\.)*)"', chunk)
        kb = re.search(r'kind:\s*"kb"', chunk)
        date = re.search(r'date:\s*"(\d{4}-\d{2}-\d{2})"', chunk)
        title = re.search(r'title:\s*\{\s*en:\s*"((?:[^"\\]|\\.)*)"', chunk)
        exc = re.search(r'excerpt:\s*\{\s*en:\s*"((?:[^"\\]|\\.)*)"', chunk)
        if not (slug and date and title):
            continue
        base = "knowledge-base" if kb else "blog"
        items.append({
            "title": unesc(title.group(1)),
            "desc": unesc(exc.group(1)) if exc else unesc(title.group(1)),
            "date": date.group(1),
            "link": f"{FEED_BASE}/en/{base}/{slug.group(1)}",
            "cat": "Knowledge Base" if kb else "Insights",
        })
    items.sort(key=lambda x: x["date"], reverse=True)

    xe = lambda s: (s.replace("&", "&amp;").replace("<", "&lt;")
                     .replace(">", "&gt;").replace('"', "&quot;"))
    rfc = lambda d: format_datetime(
        datetime.strptime(d, "%Y-%m-%d").replace(tzinfo=timezone.utc), usegmt=True)

    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
           '<channel>',
           '<title>AL Muraqib — GRP Insights &amp; Knowledge Base</title>',
           f'<link>{FEED_BASE}/en/blog</link>',
           '<description>Engineering notes on GRP/FRP tanks, pools, lining and '
           'fabrication from Al Muraqib Fiber Glass Industry L.L.C (Sharjah, UAE).</description>',
           '<language>en-us</language>',
           f'<lastBuildDate>{rfc(items[0]["date"])}</lastBuildDate>',
           f'<atom:link href="{FEED_BASE}/feed.xml" rel="self" type="application/rss+xml"/>']
    for it in items[:30]:
        out.append(" <item>")
        out.append(f'  <title>{xe(it["title"])}</title>')
        out.append(f'  <link>{it["link"]}</link>')
        out.append(f'  <guid isPermaLink="true">{it["link"]}</guid>')
        out.append(f'  <pubDate>{rfc(it["date"])}</pubDate>')
        out.append(f'  <category>{it["cat"]}</category>')
        out.append(f'  <description>{xe(it["desc"])}</description>')
        for loc in ("en", "ar", "bn"):
            out.append(f'  <atom:link href="{it["link"].replace("/en/", f"/{loc}/")}" '
                       f'rel="alternate" hreflang="{loc}"/>')
        out.append(" </item>")
    out += ['</channel>', '</rss>', '']
    (ROOT / "public/feed.xml").write_text("\n".join(out))
    print(f"feed.xml ✓ {min(30, len(items))} of {len(items)} items")


if __name__ == "__main__":
    main()
