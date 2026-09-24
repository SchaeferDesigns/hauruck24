// Prueft alle Dateien unter src/ auf Gedankenstriche, Emojis und auffaellige Zeichen.
// Aufruf: node tools/qa-scan-src.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const srcDir = path.join(root, "src");

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else files.push(full);
  }
})(srcDir);

const checks = [
  { name: "EN DASH U+2013", re: /–/g },
  { name: "EM DASH U+2014", re: /—/g },
  { name: "FIGURE DASH U+2012", re: /‒/g },
  { name: "HORIZONTAL BAR U+2015", re: /―/g },
  { name: "MINUS SIGN U+2212", re: /−/g },
  { name: "DOUBLE/TRIPLE EM DASH", re: /[⸺⸻]/g },
  { name: "SMALL/FULLWIDTH DASH", re: /[﹘﹣－]/g },
  { name: "EMOJI (Extended_Pictographic)", re: /\p{Extended_Pictographic}/gu },
  { name: "VARIATION SELECTOR-16", re: /️/g },
  { name: "REGIONAL INDICATOR", re: /[\u{1F1E6}-\u{1F1FF}]/gu },
  { name: "PFEIL/SYMBOL", re: /[←-⇿✀-➿☀-⛿⬀-⯿]/gu },
  { name: "ELLIPSIS U+2026", re: /…/g },
  { name: "NBSP U+00A0", re: / /g },
  { name: "ZERO WIDTH", re: /[​-‍⁠]/g },
];

// Bindestrich mit Leerzeichen auf beiden Seiten in Strings (Ersatz-Gedankenstrich)
const spacedHyphen = /(["'`>][^"'`<]*?)\s-\s/g;

let total = 0;
for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  if (/\.(png|jpg|jpeg|webp|avif|ico|woff2?)$/i.test(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const check of checks) {
      check.re.lastIndex = 0;
      const m = line.match(check.re);
      if (m) {
        total += m.length;
        console.log(`${check.name} | ${rel}:${i + 1} | ${JSON.stringify(m.join(""))} | ${line.trim().slice(0, 160)}`);
      }
    }
    // Ersatz-Gedankenstrich " - " ausserhalb von Code-Ausdruecken grob finden
    if (/\s-\s/.test(line) && !/^\s*(\/\/|\*|\/\*)/.test(line) && !/[=(]\s*[\w.\]\)]+\s-\s[\w.(]/.test(line) && !/\b(lng|lat)\b/.test(line)) {
      console.log(`SPACED HYPHEN (pruefen) | ${rel}:${i + 1} | ${line.trim().slice(0, 160)}`);
    }
  });
}
console.log(`\nDateien: ${files.length}, Treffer strikt: ${total}`);
