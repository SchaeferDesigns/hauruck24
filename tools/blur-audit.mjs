/**
 * Findet Glasflaechen, deren Blur durch einen Vorfahren gebrochen wird.
 * Ein Vorfahre mit backdrop-filter, filter, opacity < 1, mask, clip-path,
 * mix-blend-mode oder will-change auf diese Eigenschaften wird zur
 * "Backdrop Root". Der Blur sieht dann nur noch dessen Inhalt statt der Seite.
 *
 * Aufruf: node tools/blur-audit.mjs <pfad> [breite] [hoehe] [aktion]
 * aktion: none | dropdown | menu
 */
import { chromium } from "playwright";

const [, , path = "/", width = "1440", height = "1000", action = "none"] = process.argv;
const isMobile = Number(width) < 900;

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: Number(width), height: Number(height) },
  hasTouch: isMobile,
  isMobile,
});
const page = await context.newPage();
await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// Alle Reveals ausloesen
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1200);

if (action === "dropdown") {
  await page.getByRole("button", { name: /Leistungen/ }).first().click();
  await page.waitForTimeout(600);
}
if (action === "menu") {
  await page.getByRole("button", { name: "Menü öffnen" }).click();
  await page.waitForTimeout(900);
}

const report = await page.evaluate(() => {
  const isRoot = (cs) => {
    const reasons = [];
    if (cs.backdropFilter && cs.backdropFilter !== "none") reasons.push(`backdrop-filter:${cs.backdropFilter}`);
    if (cs.filter && cs.filter !== "none") reasons.push(`filter:${cs.filter}`);
    if (parseFloat(cs.opacity) < 1) reasons.push(`opacity:${cs.opacity}`);
    if (cs.maskImage && cs.maskImage !== "none") reasons.push("mask");
    if (cs.clipPath && cs.clipPath !== "none") reasons.push(`clip-path:${cs.clipPath}`);
    if (cs.mixBlendMode && cs.mixBlendMode !== "normal") reasons.push(`blend:${cs.mixBlendMode}`);
    const wc = cs.willChange || "auto";
    if (/opacity|filter|backdrop|mask|clip/.test(wc)) reasons.push(`will-change:${wc}`);
    return reasons;
  };

  const results = [];
  const glass = [...document.querySelectorAll("*")].filter((el) => {
    const bf = getComputedStyle(el).backdropFilter;
    return bf && bf !== "none" && el.getBoundingClientRect().width > 0;
  });

  for (const el of glass) {
    const chain = [];
    let node = el.parentElement;
    while (node && node !== document.documentElement) {
      const reasons = isRoot(getComputedStyle(node));
      if (reasons.length) {
        chain.push(`${node.tagName.toLowerCase()}.${String(node.className).split(" ").slice(0, 3).join(".")} [${reasons.join(", ")}]`);
      }
      node = node.parentElement;
    }
    if (chain.length) {
      const label = (el.innerText || el.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 50);
      results.push({ glass: `${el.tagName.toLowerCase()} "${label}"`, brokenBy: chain });
    }
  }
  return { total: glass.length, broken: results };
});

console.log(JSON.stringify(report, null, 2));
await browser.close();
