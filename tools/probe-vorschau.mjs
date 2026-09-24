/**
 * Auslieferungstest der Vorschau unter /demo/hauruck24/.
 * Kopiert out-vorschau nach probe/demo/hauruck24/, startet einen statischen
 * Server auf probe/ und laedt Seiten direkt sowie per Navigation.
 * Meldet jede Antwort mit Status >= 400. Raeumt am Ende auf.
 */
import { spawn } from "node:child_process";
import { cpSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const probe = path.join(root, "probe");
const port = 4173;
const origin = `http://localhost:${port}`;

rmSync(probe, { recursive: true, force: true });
cpSync(path.join(root, "out-vorschau"), path.join(probe, "demo", "hauruck24"), { recursive: true });

const server = spawn(process.execPath, [path.join(root, "scripts", "serve.mjs"), probe, String(port)], {
  stdio: "ignore",
});
await new Promise((resolve) => setTimeout(resolve, 800));

const browser = await chromium.launch();
const failures = [];
const results = [];

try {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on("response", (response) => {
    if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
  });
  page.on("pageerror", (error) => failures.push(`JS-Fehler: ${error.message}`));

  const visit = async (url) => {
    const response = await page.goto(`${origin}${url}`, { waitUntil: "networkidle" });
    const title = await page.title();
    results.push(`${response?.status()} ${url} -> "${title}"`);
  };

  await visit("/demo/hauruck24/");
  await visit("/demo/hauruck24/kontakt/");
  await visit("/demo/hauruck24/leistungen/umzug/");
  await visit("/demo/hauruck24/angebot/?leistung=umzug&liste=Sofa");

  /* Direkter Aufruf ohne Schraegstrich wird umgeleitet */
  await visit("/demo/hauruck24/faq");
  results.push(`   landet auf ${new URL(page.url()).pathname}`);

  /* Navigation im Browser, laedt die Seitendaten nach */
  await page.goto(`${origin}/demo/hauruck24/`, { waitUntil: "networkidle" });
  await page.locator('footer a[href="/demo/hauruck24/ablauf/"]').first().click();
  await page.waitForURL("**/demo/hauruck24/ablauf/");
  await page.waitForLoadState("networkidle");
  results.push(`Navigation Start -> Ablauf: ${new URL(page.url()).pathname} "${await page.title()}"`);

  /* Altpfad der frueheren Website */
  await page.goto(`${origin}/demo/hauruck24/index6.html`);
  await page.waitForURL("**/demo/hauruck24/");
  results.push(`Altpfad index6.html -> ${new URL(page.url()).pathname}`);

  /* Unbekannte Seite: 404 mit eigener Fehlerseite, keine Folgefehler */
  const before = failures.length;
  const missing = await page.goto(`${origin}/demo/hauruck24/gibt-es-nicht/`, { waitUntil: "networkidle" });
  const heading = await page.locator("h1").first().innerText();
  results.push(`${missing?.status()} /demo/hauruck24/gibt-es-nicht/ -> "${heading}"`);
  failures.splice(before, failures.length - before, ...failures.slice(before).filter((line) => !line.includes("gibt-es-nicht")));
} finally {
  await browser.close();
  server.kill();
  rmSync(probe, { recursive: true, force: true });
}

console.log(results.join("\n"));
console.log(failures.length ? `\nFEHLER (${failures.length}):\n${failures.join("\n")}` : "\nKeine Antwort mit Status >= 400.");
console.log("probe/ aufgeraeumt.");
process.exit(failures.length ? 1 : 0);
