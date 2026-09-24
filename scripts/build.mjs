/**
 * Statischer Build der Website fuer zwei Ziele.
 *
 *   npm run build                               Live nach out/
 *   NEXT_PUBLIC_BASE_PATH=/pfad npm run build   Vorschau fuer /pfad nach out/
 *   npm run build:vorschau                      Vorschau fuer /demo/hauruck24 nach out-vorschau/
 *
 * Nach dem Export folgen Nacharbeiten (Altpfade, .htaccess, Vorschau-Bereinigung)
 * und die Pruefung aus scripts/check-build.mjs. Jede Regelverletzung beendet
 * den Build mit Fehler.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkBuild, normalizeBase, readLegacy, readSiteUrl } from "./check-build.mjs";

const VORSCHAU_BASE = "/demo/hauruck24";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vorschauScript = process.argv.includes("--vorschau");
const base = vorschauScript ? VORSCHAU_BASE : normalizeBase(process.env.NEXT_PUBLIC_BASE_PATH);
const mode = base ? "vorschau" : "live";
const outName = vorschauScript ? "out-vorschau" : "out";
const outDir = path.join(root, outName);

const label = mode === "live" ? "Live" : `Vorschau ${base}`;
console.log(`\n> Build ${label} nach ${outName}/\n`);

/* 1. Export */
rmSync(outDir, { recursive: true, force: true });

const env = {
  ...process.env,
  NODE_ENV: "production",
  NEXT_TELEMETRY_DISABLED: "1",
  NEXT_PUBLIC_BASE_PATH: base,
};
if (vorschauScript) env.HAURUCK_EXPORT_DIR = outName;
else delete env.HAURUCK_EXPORT_DIR;

const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const result = spawnSync(process.execPath, [nextBin, "build"], { cwd: root, env, stdio: "inherit" });
if (result.status !== 0) {
  console.error(`\nnext build ist fehlgeschlagen (${label}).`);
  process.exit(result.status || 1);
}
if (!existsSync(path.join(outDir, "index.html"))) {
  console.error(`\nExport nicht gefunden: ${outName}/index.html`);
  process.exit(1);
}

/* 2. Nacharbeiten */
const siteUrl = readSiteUrl(root);
const legacy = readLegacy(root);

const walkRemove = (dir, test) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (test(entry)) {
      rmSync(abs, { recursive: true, force: true });
      continue;
    }
    if (entry.isDirectory()) walkRemove(abs, test);
  }
};

/* Build-Reste gehoeren nie in den Upload-Ordner */
walkRemove(outDir, (entry) => entry.name === "BUILD_ID" || (entry.isDirectory() && entry.name === "cache"));

/*
 * Seitendaten fuer die Navigation flach ablegen.
 * Next.js 16.2 bildet die Dateinamen beim Export mit path.relative(). Unter
 * Windows entstehen so Unterordner wie kontakt/__next.kontakt/__PAGE__.txt,
 * der Browser fragt aber kontakt/__next.kontakt.__PAGE__.txt an. Unter Linux
 * waere der Name bereits flach. Hier wird er auf allen Systemen angeglichen.
 */
const filesIn = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? filesIn(path.join(dir, entry.name)) : [path.join(dir, entry.name)],
  );

const flattenSegments = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const abs = path.join(dir, entry.name);
    if (!entry.name.startsWith("__next.")) {
      flattenSegments(abs);
      continue;
    }
    for (const file of filesIn(abs)) {
      const flat = path.relative(abs, file).split(path.sep).join(".");
      renameSync(file, path.join(dir, `${entry.name}.${flat}`));
    }
    rmSync(abs, { recursive: true, force: true });
  }
};
flattenSegments(outDir);

/* Vorschau: nicht indexierbar, keine Suchmaschinen- und Serverdateien */
if (mode === "vorschau") {
  walkRemove(outDir, (entry) => ["sitemap.xml", "robots.txt", ".htaccess"].includes(entry.name));
}

/* Altpfade der frueheren Website als echte Dateien mit Weiterleitung */
const escapeHtml = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

for (const item of legacy) {
  const target = `${base}${item.ziel}`;
  const head = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<title>Weiterleitung | Hauruck24</title>",
    mode === "vorschau"
      ? '<meta name="robots" content="noindex, nofollow">'
      : `<link rel="canonical" href="${escapeHtml(`${siteUrl}${item.ziel}`)}">`,
    `<meta http-equiv="refresh" content="0; url=${escapeHtml(target)}">`,
    `<script>location.replace(${JSON.stringify(target)} + location.hash)</script>`,
    "<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#04070d;color:#eaf0f8;font:16px/1.6 system-ui,sans-serif}a{color:#ffd08a}</style>",
  ].join("\n");
  const html = `<!doctype html>\n<html lang="de">\n<head>\n${head}\n</head>\n<body>\n<p>Diese Seite ist umgezogen. <a href="${escapeHtml(target)}">Weiter zur neuen Seite</a></p>\n</body>\n</html>\n`;
  const file = path.join(outDir, item.pfad);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, html, "utf8");
}

/* Live: Apache-Hosts bekommen 404-Seite, Weiterleitungen und Sicherheits-Header.
   Andere Hosts ignorieren die Datei. */
if (mode === "live") {
  const redirects = legacy.map((item) => `  Redirect 301 /${item.pfad} ${item.ziel}`).join("\n");
  const htaccess = [
    "# Statischer Export der Website Hauruck24, erzeugt von scripts/build.mjs",
    "ErrorDocument 404 /404.html",
    "",
    "<IfModule mod_alias.c>",
    redirects,
    "</IfModule>",
    "",
    "<IfModule mod_headers.c>",
    '  Header always set X-Content-Type-Options "nosniff"',
    '  Header always set Referrer-Policy "strict-origin-when-cross-origin"',
    '  Header always set X-Frame-Options "SAMEORIGIN"',
    '  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"',
    "</IfModule>",
    "",
  ].join("\n");
  writeFileSync(path.join(outDir, ".htaccess"), htaccess, "utf8");
}

/* 3. Pruefung */
const { problems, pages, files } = checkBuild({ outDir, mode, base, root });
if (problems.length) {
  console.error(`\nPruefung FEHLGESCHLAGEN fuer ${outName}/ (${problems.length}):`);
  for (const problem of problems.slice(0, 60)) console.error(`  x ${problem}`);
  if (problems.length > 60) console.error(`  ... und ${problems.length - 60} weitere`);
  process.exit(1);
}

console.log(`\nOK ${label} in ${outName}/: ${pages} Seiten, ${files} Dateien, Pruefung bestanden.\n`);
