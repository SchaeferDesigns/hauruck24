/**
 * Erzeugt public/og.png (1200 x 630) fuer Social-Media-Vorschauen.
 * Nutzt die laufende Dev-Seite, damit Schriften und Wagen-Zeichnung
 * exakt der Website entsprechen.
 * Aufruf (Dev-Server muss laufen): node tools/og-image.mjs
 */
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(3000);

await page.evaluate(() => {
  const truck = document.querySelector('svg[aria-label="Umzugswagen von Hauruck24"]')?.outerHTML ?? "";
  document.querySelectorAll("nextjs-portal, header, footer, main, [data-nextjs-toast]").forEach((node) => node.remove());
  window.scrollTo(0, 0);

  const card = document.createElement("div");
  card.setAttribute(
    "style",
    [
      "position:fixed",
      "inset:0",
      "z-index:9999",
      "overflow:hidden",
      "display:flex",
      "flex-direction:column",
      "justify-content:space-between",
      "padding:64px 72px",
      "background:#04070d",
      "background-image:radial-gradient(760px 460px at 8% 0%, rgba(255,149,34,0.34), transparent 64%), radial-gradient(640px 420px at 100% 100%, rgba(23,183,156,0.22), transparent 62%)",
      "color:#f7f9fc",
      "font-family:var(--font-inter), system-ui, sans-serif",
    ].join(";"),
  );

  card.innerHTML = `
    <div style="display:flex;align-items:center;gap:18px">
      <svg viewBox="0 0 40 40" width="64" height="64">
        <defs><linearGradient id="og-mark" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffd08a"/><stop offset="55%" stop-color="#ff9522"/><stop offset="100%" stop-color="#ee7a05"/></linearGradient></defs>
        <rect x="1" y="1" width="38" height="38" rx="12" fill="url(#og-mark)"/>
        <path d="M10.5 22.5h19v8.2a1.6 1.6 0 0 1-1.6 1.6H12.1a1.6 1.6 0 0 1-1.6-1.6z" fill="#20120a"/>
        <path d="M10.5 22.5h19" stroke="#20120a" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M20 7.6v11.3M20 7.6l-5 5M20 7.6l5 5" stroke="#20120a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
      <span style="font-family:var(--font-jakarta);font-weight:800;font-size:34px;letter-spacing:-0.5px">Hauruck<span style="color:#ffb454">24</span></span>
      <span style="margin-left:auto;padding:10px 18px;border-radius:999px;border:1px solid rgba(255,255,255,0.16);background:rgba(255,255,255,0.06);font-size:18px;color:#ffd08a;letter-spacing:2px;text-transform:uppercase;font-weight:600">Hussenhofen</span>
    </div>

    <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:32px">
      <div style="max-width:700px">
        <div style="font-family:var(--font-jakarta);font-weight:800;font-size:68px;line-height:1.04;letter-spacing:-2px">
          Umzug und Entrümpelung
          <span style="display:block;background:linear-gradient(100deg,#f7f9fc 0%,#ffd08a 55%,#ff9522 100%);-webkit-background-clip:text;background-clip:text;color:transparent">in Schwäbisch Gmünd</span>
        </div>
        <div style="margin-top:22px;font-size:26px;color:#b3c0d4">Wir tragen, fahren, räumen und entsorgen.</div>
      </div>
      <div style="width:330px;flex-shrink:0;margin-bottom:6px">${truck}</div>
    </div>

    <div style="display:flex;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.14);padding-top:24px;font-size:22px;color:#d3dcea">
      <span>0172 7312531</span>
      <span>Montag bis Samstag, 07:30 bis 18:30 Uhr</span>
    </div>`;

  document.body.appendChild(card);
  const svg = card.querySelector('svg[aria-label="Umzugswagen von Hauruck24"]');
  if (svg) svg.setAttribute("style", "width:100%;height:auto;overflow:visible");
});

await page.waitForTimeout(400);
await page.screenshot({ path: "public/og.png", type: "png" });
await browser.close();
console.log("public/og.png geschrieben");
