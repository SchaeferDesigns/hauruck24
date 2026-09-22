/** Prüfagent Design/UX: Batch-Screenshots + Layout-Diagnostik. Nur lesend. */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const out = "tools/screens";
await mkdir(out, { recursive: true });

const pages = [
  ["/", "home"],
  ["/leistungen", "leistungen"],
  ["/leistungen/umzug", "umzug"],
  ["/leistungen/entruempelung", "entruempelung"],
  ["/ablauf", "ablauf"],
  ["/angebot", "angebot"],
  ["/kontakt", "kontakt"],
  ["/einsatzgebiet", "einsatzgebiet"],
  ["/ueber-uns", "ueberuns"],
  ["/faq", "faq"],
  ["/impressum", "impressum"],
  ["/gibtesnicht", "404"],
];

const bps = [
  ["d", 1440, 1000],
  ["t", 834, 1112],
  ["m", 390, 844],
];

const only = process.argv[2]; // optional breakpoint filter
const report = [];
const browser = await chromium.launch();

for (const [bp, w, h] of bps) {
  if (only && only !== bp) continue;
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    locale: "de-DE",
    hasTouch: w < 900,
    isMobile: w < 900,
  });
  const page = await ctx.newPage();

  for (const [path, name] of pages) {
    const errors = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message));

    await page.goto("http://localhost:3000" + path, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(900);

    // Reveals auslösen
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 130));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(700);

    // Diagnostik
    const diag = await page.evaluate(() => {
      const de = document.documentElement;
      const res = {
        scrollW: de.scrollWidth,
        clientW: de.clientWidth,
        docH: document.body.scrollHeight,
        overflowing: [],
        tinyText: [],
        h1: [],
        longLines: [],
        ctas: [],
      };
      const vw = de.clientWidth;
      document.querySelectorAll("body *").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        const abs = r.left + window.scrollX;
        if (abs + r.width > vw + 2 || abs < -2) {
          const cs = getComputedStyle(el);
          if (cs.position !== "fixed" && cs.overflow !== "hidden" && !el.closest("[aria-hidden='true']")) {
            res.overflowing.push({
              sel: el.tagName.toLowerCase() + "." + String(el.className || "").split(" ").filter(Boolean).slice(0, 3).join("."),
              left: Math.round(abs), w: Math.round(r.width),
            });
          }
        }
      });
      document.querySelectorAll("h1").forEach((el) => {
        const cs = getComputedStyle(el);
        res.h1.push({ text: el.textContent.trim().slice(0, 70), size: cs.fontSize, lh: cs.lineHeight, w: Math.round(el.getBoundingClientRect().width) });
      });
      // Zeilenlänge grob: p-Elemente mit Breite/Schriftgröße
      document.querySelectorAll("p").forEach((el) => {
        const cs = getComputedStyle(el);
        const fs = parseFloat(cs.fontSize);
        const w = el.getBoundingClientRect().width;
        const ch = w / (fs * 0.5); // grobe Zeichenschätzung
        if (ch > 95 && el.textContent.trim().length > 120) {
          res.longLines.push({ ch: Math.round(ch), w: Math.round(w), fs: cs.fontSize, t: el.textContent.trim().slice(0, 50) });
        }
        if (fs < 12.5 && el.textContent.trim().length > 25) {
          res.tinyText.push({ fs: cs.fontSize, t: el.textContent.trim().slice(0, 45) });
        }
      });
      // CTAs
      document.querySelectorAll("a.btn, button.btn").forEach((el) => {
        const t = el.textContent.trim();
        if (t) res.ctas.push(t.slice(0, 40));
      });
      return res;
    });

    await page.screenshot({ path: `${out}/${name}-${bp}.png`, fullPage: true, animations: "disabled" });
    report.push({ bp, path, name, title: await page.title(), errors: [...new Set(errors)], ...diag });
    console.log(`${bp} ${path} -> scrollW=${diag.scrollW}/${diag.clientW} docH=${diag.docH} overflow=${diag.overflowing.length} err=${errors.length}`);
    page.removeAllListeners("console");
    page.removeAllListeners("pageerror");
  }
  await ctx.close();
}

await browser.close();
await writeFile("tools/screens/_report.json", JSON.stringify(report, null, 2));
console.log("OK");
