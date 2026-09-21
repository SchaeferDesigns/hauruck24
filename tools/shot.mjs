/**
 * Screenshot-Helfer fuer die visuelle Kontrolle.
 * Aufruf: node tools/shot.mjs <pfad> <name> [breite] [hoehe] [full|fold]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const [, , path = "/", name = "shot", width = "1440", height = "900", mode = "full"] = process.argv;

const out = "tools/screens";
await mkdir(out, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: Number(width), height: Number(height) },
  deviceScaleFactor: 1,
  locale: "de-DE",
  hasTouch: Number(width) < 900,
  isMobile: Number(width) < 900,
});
const page = await context.newPage();

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));

await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1200);

if (mode === "full") {
  // Lazy-Reveals ausloesen, danach zurueck nach oben
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 160));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
}

await page.screenshot({
  path: `${out}/${name}.png`,
  fullPage: mode === "full",
  animations: "disabled",
});

const title = await page.title();
console.log(JSON.stringify({ name, path, title, errors }, null, 2));

await browser.close();
