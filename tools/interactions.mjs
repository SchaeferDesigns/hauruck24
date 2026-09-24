/**
 * Klickt die neuen Interaktionen durch und macht Screenshots.
 * Prueft ausserdem, ob irgendwo ein nativer Browser-Dialog aufgeht.
 * Aufruf: node tools/interactions.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const out = "tools/screens";
await mkdir(out, { recursive: true });

const browser = await chromium.launch();
const dialogs = [];
const errors = [];

async function newPage(width, height, mobile = false) {
  const context = await browser.newContext({
    viewport: { width, height },
    hasTouch: mobile,
    isMobile: mobile,
    locale: "de-DE",
  });
  const page = await context.newPage();
  page.on("dialog", async (dialog) => {
    dialogs.push(`${dialog.type()}: ${dialog.message()}`);
    await dialog.dismiss();
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  return page;
}

const shot = (page, name, fullPage = false) =>
  page.screenshot({ path: `${out}/${name}.png`, fullPage });

const auditAncestors = (page, selector) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return "nicht gefunden";
    const reasons = [];
    let node = el.parentElement;
    while (node && node !== document.documentElement) {
      const cs = getComputedStyle(node);
      if (parseFloat(cs.opacity) < 1) reasons.push(`opacity ${cs.opacity}`);
      if (cs.filter !== "none") reasons.push("filter");
      if (cs.backdropFilter && cs.backdropFilter !== "none") reasons.push("backdrop-filter");
      if (/opacity|filter/.test(cs.willChange)) reasons.push(`will-change ${cs.willChange}`);
      node = node.parentElement;
    }
    return reasons.length ? reasons.join(", ") : "Blur intakt";
  }, selector);

/* 1. Startseite: Hero, Scroll-Zustand, Aufklappliste, Telefon-Panel */
{
  const page = await newPage(1440, 900);
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(3200);
  await shot(page, "v2-hero");

  await page.mouse.wheel(0, 260);
  await page.waitForTimeout(700);
  console.log("Hero-Karte beim Scrollen:", await auditAncestors(page, "section[aria-labelledby=hero-title] .glass-strong"));
  await shot(page, "v2-hero-scrolled");
  await page.mouse.wheel(0, -260);
  await page.waitForTimeout(500);

  await page.getByRole("button", { name: /Leistungen/ }).first().hover();
  await page.waitForTimeout(500);
  // Maus langsam von der Schaltflaeche in die Liste bewegen
  const box = await page.getByRole("button", { name: /Leistungen/ }).first().boundingBox();
  for (let step = 0; step <= 10; step += 1) {
    await page.mouse.move(box.x + box.width / 2 + step * 6, box.y + box.height + step * 9);
    await page.waitForTimeout(35);
  }
  await page.waitForTimeout(400);
  const stillOpen = await page.locator("text=Nicht sicher, was passt?").isVisible();
  console.log("Liste bleibt beim Weg zur Liste offen:", stillOpen);
  await shot(page, "v2-dropdown");

  await page.mouse.move(40, 600);
  await page.waitForTimeout(700);

  await page.locator("header").getByRole("link", { name: /0172|Anrufen/ }).first().click();
  await page.waitForTimeout(600);
  await shot(page, "v2-phone-popover");
  await page.keyboard.press("Escape");
  await page.close();
}

/* 2. Wagen beladen */
{
  const page = await newPage(1440, 1000);
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const heading = page.getByRole("heading", { name: "Packen Sie den Wagen" });
  await heading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  for (const name of ["Sofa hinzufügen", "Bett hinzufügen", "Schrank hinzufügen", "5 Kartons hinzufügen", "5 Kartons hinzufügen", "Waschmaschine hinzufügen", "Regal hinzufügen", "Regal hinzufügen"]) {
    await page.getByRole("button", { name, exact: true }).click();
    await page.waitForTimeout(220);
  }
  await page.waitForTimeout(700);
  await heading.evaluate((el) => el.scrollIntoView({ block: "start" }));
  await page.mouse.wheel(0, -90);
  await page.waitForTimeout(700);
  await shot(page, "v2-truckloader");
  const summary = await page.locator("text=Im Wagen:").locator("..").innerText();
  console.log("Ladeliste:", summary.replace(/\s+/g, " "));
  await page.close();
}

/* 3. Ablauf: Scroll-Geschichte und Checkliste */
{
  const page = await newPage(1440, 900);
  await page.goto("http://localhost:3000/ablauf", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.locator("[data-step='1']").scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 120);
  await page.waitForTimeout(1200);
  await shot(page, "v2-ablauf-steps");

  const checklist = page.getByRole("heading", { name: "Vorbereitung, die Zeit und Geld spart" });
  await checklist.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const boxes = page.getByRole("checkbox");
  const count = await boxes.count();
  for (let index = 0; index < Math.min(6, count); index += 1) {
    await boxes.nth(index).check({ force: true });
    await page.waitForTimeout(120);
  }
  await checklist.evaluate((el) => el.scrollIntoView({ block: "start" }));
  await page.mouse.wheel(0, -110);
  await page.waitForTimeout(800);
  await shot(page, "v2-ablauf-checklist");
  await page.close();
}

/* 4. Formular: eigene Auswahlliste, Kalender, Checkboxen, Validierung ohne Browser-Hinweis */
{
  const page = await newPage(1440, 1000);
  await page.goto("http://localhost:3000/angebot?leistung=umzug&liste=Sofa%2C%2010%20Kartons", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(900);
  await page.getByRole("combobox", { name: /Umfang/ }).click();
  await page.waitForTimeout(500);
  await shot(page, "v2-select-open");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  console.log("Auswahl per Tastatur:", await page.getByRole("combobox", { name: /Umfang/ }).innerText());

  await page.getByRole("button", { name: "Weiter" }).click();
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: /Wunschtermin/ }).click();
  await page.waitForTimeout(600);
  await shot(page, "v2-datepicker");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  console.log("Datum gewaehlt:", await page.getByRole("button", { name: /Wunschtermin/ }).innerText());
  await page.getByText("Termin ist flexibel").click();
  await page.waitForTimeout(300);
  await shot(page, "v2-form-step2");

  await page.getByRole("button", { name: "Weiter" }).click();
  await page.waitForTimeout(600);
  await page.getByRole("button", { name: "Anfrage senden" }).click();
  await page.waitForTimeout(600);
  await shot(page, "v2-form-errors");
  console.log("Fehlermeldung:", await page.getByRole("alert").innerText());
  console.log("Nachricht vorbefuellt:", (await page.locator("#message").inputValue()).slice(0, 60));
  await page.close();
}

/* 5. Handy: Menue mit Leistungs-Kacheln, Scrollsperre, Auswahlliste als Sheet */
{
  const page = await newPage(390, 844, true);
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: "Menü öffnen" }).tap();
  await page.waitForTimeout(700);
  await page.getByRole("button", { name: /Untermenü Leistungen öffnen/ }).tap();
  await page.waitForTimeout(800);
  await shot(page, "v2-mobile-menu");

  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(400);
  const after = await page.evaluate(() => window.scrollY);
  console.log("Scrollsperre Handy-Menue:", before === after ? "aktiv" : `NICHT aktiv (${before} -> ${after})`);
  await page.close();

  const form = await newPage(390, 844, true);
  await form.goto("http://localhost:3000/angebot", { waitUntil: "networkidle" });
  await form.waitForTimeout(900);
  await form.getByRole("combobox", { name: /Umfang/ }).tap();
  await form.waitForTimeout(700);
  await shot(form, "v2-mobile-select-sheet");
  await form.close();
}

console.log("Native Browser-Dialoge:", dialogs.length ? dialogs : "keine");
console.log("JS-Fehler:", errors.length ? errors.slice(0, 5) : "keine");
await browser.close();
