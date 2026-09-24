/**
 * Pruefagent Design/UX: Viewport-Screenshots beim Durchscrollen + DOM-Diagnostik.
 * Nur lesend, aendert nichts an der Website.
 *
 * Aufruf: node tools/ux-audit.mjs [bp-filter d|t|m] [seiten-filter name,name]
 * Ausgabe: tools/screens/ux/<bp>-<name>-<nn>.png, tools/screens/ux/_report-<bp>.json
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const out = "tools/screens/ux";
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
  ["d", 1440, 900],
  ["t", 834, 1112],
  ["m", 390, 844],
];

const onlyBp = process.argv[2] && process.argv[2] !== "all" ? process.argv[2] : null;
const onlyPages = process.argv[3] ? process.argv[3].split(",") : null;

const browser = await chromium.launch();

for (const [bp, w, h] of bps) {
  if (onlyBp && onlyBp !== bp) continue;
  const report = [];
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    locale: "de-DE",
    hasTouch: w < 900,
    isMobile: w < 900,
  });
  const page = await ctx.newPage();

  for (const [path, name] of pages) {
    if (onlyPages && !onlyPages.includes(name)) continue;
    const errors = [];
    const onConsole = (m) => {
      if (m.type() === "error") errors.push(m.text().slice(0, 200));
    };
    const onPageError = (e) => errors.push("pageerror: " + e.message.slice(0, 200));
    page.on("console", onConsole);
    page.on("pageerror", onPageError);

    const resp = await page.goto("http://localhost:3000" + path, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(1500);

    // Ganz durchscrollen (instant, weil html smooth scrolling hat), Reveals ausloesen
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.5);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForTimeout(1200);

    const diag = await page.evaluate(({ isMobile }) => {
      const de = document.documentElement;
      const vw = de.clientWidth;
      const res = {
        scrollW: de.scrollWidth,
        clientW: vw,
        docH: de.scrollHeight,
        overflow: [],
        overlaps: [],
        clipped: [],
        tinyText: [],
        smallTargets: [],
        longLines: [],
        headings: [],
      };
      const desc = (el) => {
        const cls = String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || "")
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 4)
          .join(".");
        const txt = (el.innerText || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
        return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}${txt ? ` "${txt}"` : ""}`;
      };
      const visible = (el) =>
        el.checkVisibility ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : true;
      const isFixedTree = (el) => {
        let n = el;
        while (n && n !== document.body) {
          const p = getComputedStyle(n).position;
          if (p === "fixed") return true;
          n = n.parentElement;
        }
        return false;
      };
      const clippedByAncestor = (el) => {
        let n = el.parentElement;
        while (n && n !== document.body) {
          const cs = getComputedStyle(n);
          if (cs.overflowX !== "visible" || cs.overflow !== "visible") {
            const r = n.getBoundingClientRect();
            if (r.right <= vw + 1 && r.left >= -1) return true;
          }
          n = n.parentElement;
        }
        return false;
      };

      // 1. Horizontal ueberlaufende Elemente, die nicht von einem Vorfahren abgeschnitten werden
      for (const el of document.body.querySelectorAll("*")) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (r.right > vw + 1 || r.left < -1) {
          if (getComputedStyle(el).position === "fixed") continue;
          if (clippedByAncestor(el)) continue;
          res.overflow.push(`${desc(el)} l=${Math.round(r.left)} r=${Math.round(r.right)}`);
        }
      }
      res.overflow = res.overflow.slice(0, 15);

      // 2. Ueberlappende Textzeilen (verschiedene Textknoten)
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const boxes = [];
      let node;
      while ((node = walker.nextNode())) {
        if (!node.textContent.trim()) continue;
        const el = node.parentElement;
        if (!el || !visible(el)) continue;
        const cs = getComputedStyle(el);
        if (cs.clipPath && cs.clipPath.includes("inset(50%)")) continue;
        if (el.closest(".sr-only, [hidden], script, style, noscript")) continue;
        if (isFixedTree(el)) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const r of range.getClientRects()) {
          if (r.width < 2 || r.height < 2) continue;
          boxes.push({ el, t: node.textContent.trim().slice(0, 30), x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height });
        }
      }
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          if (a.el === b.el) continue;
          const ix = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
          const iy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
          if (ix > 3 && iy > 4) {
            const area = ix * iy;
            const minArea = Math.min(a.w * a.h, b.w * b.h);
            if (area > 0.15 * minArea) {
              res.overlaps.push(`"${a.t}" <> "${b.t}" @y=${Math.round(a.y)}`);
            }
          }
        }
      }
      res.overlaps = [...new Set(res.overlaps)].slice(0, 20);

      // 3. Abgeschnittener Text (Ellipsis oder overflow hidden mit Textinhalt)
      for (const el of document.body.querySelectorAll("*")) {
        const cs = getComputedStyle(el);
        const clips = cs.overflow !== "visible" || cs.overflowX !== "visible" || cs.overflowY !== "visible";
        if (!clips) continue;
        const hasOwnText = [...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim());
        const truncX = el.scrollWidth > el.clientWidth + 2;
        const truncY = el.scrollHeight > el.clientHeight + 2 && cs.overflowY !== "auto" && cs.overflowY !== "scroll";
        if ((truncX || truncY) && (hasOwnText || cs.textOverflow === "ellipsis" || cs.webkitLineClamp !== "none")) {
          if (!visible(el)) continue;
          res.clipped.push(`${desc(el)} sw=${el.scrollWidth}/${el.clientWidth} sh=${el.scrollHeight}/${el.clientHeight}`);
        }
      }
      res.clipped = res.clipped.slice(0, 15);

      // 4. Sehr kleine Schrift
      const seen = new Set();
      for (const b of boxes) {
        const fs = parseFloat(getComputedStyle(b.el).fontSize);
        if (fs < 12 && !seen.has(b.el)) {
          seen.add(b.el);
          res.tinyText.push(`${fs}px "${b.t}"`);
        }
      }
      res.tinyText = res.tinyText.slice(0, 20);

      // 5. Touch-Ziele (nur mobil sinnvoll)
      if (isMobile) {
        for (const el of document.querySelectorAll("a[href], button, [role=button], [role=combobox], summary, input:not([type=hidden]), select, textarea")) {
          if (!visible(el)) continue;
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) continue;
          if (el.closest("p, li p, dd") && el.tagName === "A") continue; // Inline-Links sind ausgenommen
          const cs = getComputedStyle(el);
          if (cs.opacity === "0") continue;
          if (r.width < 44 || r.height < 44) {
            res.smallTargets.push(`${Math.round(r.width)}x${Math.round(r.height)} ${desc(el)}`);
          }
        }
        res.smallTargets = [...new Set(res.smallTargets)].slice(0, 30);
      }

      // 6. Zeilenlaenge von Fliesstext
      for (const p of document.querySelectorAll("p, li, dd")) {
        const txt = p.textContent.trim();
        if (txt.length < 140) continue;
        const cs = getComputedStyle(p);
        const fs = parseFloat(cs.fontSize);
        const wpx = p.getBoundingClientRect().width;
        const approxChars = wpx / (fs * 0.52);
        if (approxChars > 88) res.longLines.push(`${Math.round(approxChars)}ch ${fs}px "${txt.slice(0, 40)}"`);
      }
      res.longLines = res.longLines.slice(0, 10);

      // 7. Ueberschriften-Hierarchie
      for (const hEl of document.querySelectorAll("h1, h2, h3")) {
        const cs = getComputedStyle(hEl);
        res.headings.push(`${hEl.tagName} ${cs.fontSize}/${cs.lineHeight} "${hEl.textContent.trim().replace(/\s+/g, " ").slice(0, 60)}"`);
      }
      return res;
    }, { isMobile: w < 900 });

    // Viewport-Screenshots beim Durchscrollen (echte Darstellung inkl. fixer/sticky Elemente)
    const docH = await page.evaluate(() => document.documentElement.scrollHeight);
    const stepPx = Math.round(h * 0.92);
    const shots = [];
    let idx = 0;
    for (let y = 0; y < docH - 40; y += stepPx) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(idx === 0 ? 400 : 750);
      const file = `${out}/${bp}-${name}-${String(idx).padStart(2, "0")}.png`;
      await page.screenshot({ path: file });
      shots.push(file);
      idx++;
      if (idx > 30) break;
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));

    report.push({
      bp,
      path,
      name,
      status: resp ? resp.status() : null,
      title: await page.title(),
      errors: [...new Set(errors)],
      shots: shots.length,
      ...diag,
    });
    console.log(
      `${bp} ${path} status=${resp ? resp.status() : "?"} scrollW=${diag.scrollW}/${diag.clientW} docH=${diag.docH} shots=${shots.length} overflow=${diag.overflow.length} overlaps=${diag.overlaps.length} clipped=${diag.clipped.length} small=${diag.smallTargets.length} err=${errors.length}`,
    );
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
  }
  await ctx.close();
  await writeFile(`${out}/_report-${bp}.json`, JSON.stringify(report, null, 2));
}

await browser.close();
console.log("OK");
