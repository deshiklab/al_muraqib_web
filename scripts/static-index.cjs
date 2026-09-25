/**
 * Generates out/index.html for the static export build.
 * The server build redirects "/" via middleware; static hosting (GitHub
 * Pages) has no middleware, so we emit a tiny locale-aware redirect page.
 * Run: node scripts/static-index.mjs   (after NEXT_PUBLIC_STATIC_EXPORT=1 next build)
 */
const fs = require("node:fs");
const path = require("node:path");

const outDir = path.join(__dirname, "..", "out");
if (!fs.existsSync(outDir)) {
  console.error("out/ not found — run the static build first.");
  process.exit(1);
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Al Muraqib Fiber Glass Industry LLC</title>
    <script>
      (function () {
        try {
          var m = document.cookie.match(/(?:^|;\\s*)locale=(en|ar)/);
          var loc = (m && m[1]) || (navigator.language || "en").toLowerCase().indexOf("ar") === 0 ? (m && m[1]) || "ar" : (m && m[1]) || "en";
          if (m && m[1]) loc = m[1];
          else if ((navigator.language || "").toLowerCase().indexOf("ar") === 0) loc = "ar";
          else loc = "en";
          document.location.replace("./" + loc + "/");
        } catch (e) {
          document.location.replace("./en/");
        }
      })();
    </script>
    <meta http-equiv="refresh" content="0; url=./en/" />
    <style>
      body { font-family: system-ui, sans-serif; display: grid; place-items: center; min-height: 100vh; margin: 0; color: #0f172a; }
      a { font-weight: 700; color: #0f172a; }
    </style>
  </head>
  <body>
    <p><a href="./en/">Al Muraqib Fiber Glass Industry LLC →</a></p>
  </body>
</html>
`;

fs.writeFileSync(path.join(outDir, "index.html"), html);
console.log("Wrote out/index.html (locale-aware redirect).");
