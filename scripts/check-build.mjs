/**
 * Prueft einen statischen Export der Website.
 *
 *   node scripts/check-build.mjs out --live
 *   node scripts/check-build.mjs out-vorschau --vorschau --base /demo/hauruck24
 *
 * Beendet sich mit Fehlercode 1, sobald eine Regel verletzt ist.
 * Wird von scripts/build.mjs nach jedem Build automatisch aufgerufen.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const MAX_BYTES = 24 * 1000 * 1000;

const TEXT_EXTENSIONS = new Set([
  ".html",
  ".htm",
  ".css",
  ".js",
  ".mjs",
  ".json",
  ".txt",
  ".xml",
  ".webmanifest",
  ".svg",
  ".map",
  ".php",
]);

const FORBIDDEN_IN_PREVIEW = new Set(["sitemap.xml", "robots.txt", ".htaccess"]);

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Basispfad vereinheitlichen: "/demo/hauruck24", ohne Schraegstrich am Ende.
 *
 * Git Bash wandelt "/demo/hauruck24" in Argumenten und Umgebungsvariablen
 * in "C:/Program Files/Git/demo/hauruck24" um. Solche Werte werden auf den
 * urspruenglichen Pfad zurueckgefuehrt. Ist das nicht eindeutig moeglich,
 * bricht der Build lieber ab, statt mit falschem Pfad zu bauen.
 */
export function normalizeBase(value) {
  let text = String(value ?? "").trim().replace(/\\/g, "/");

  if (/^[A-Za-z]:\//.test(text)) {
    const marker = text.match(/\/(?:Git|msys64|msys32|msys2|cygwin64|cygwin)(?=\/)/i);
    if (!marker || marker.index === undefined) {
      throw new Error(
        `Basispfad sieht nach einem Windows-Pfad aus: "${value}". In Git Bash MSYS_NO_PATHCONV=1 setzen.`,
      );
    }
    text = text.slice(marker.index + marker[0].length);
  }

  const trimmed = text.replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
}

/** Alle Dateien und Ordner rekursiv, Pfade relativ und mit / getrennt */
function walk(dir, base = dir, list = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    const rel = path.relative(base, abs).split(path.sep).join("/");
    if (entry.isDirectory()) {
      list.push({ abs, rel, name: entry.name, dir: true, size: 0 });
      walk(abs, base, list);
    } else {
      list.push({ abs, rel, name: entry.name, dir: false, size: statSync(abs).size });
    }
  }
  return list;
}

const isText = (file) => file.name === ".htaccess" || TEXT_EXTENSIONS.has(path.extname(file.name).toLowerCase());

/** Live-Adresse aus src/content/site.ts */
export function readSiteUrl(root = projectRoot) {
  const source = readFileSync(path.join(root, "src", "content", "site.ts"), "utf8");
  const match = source.match(/url:\s*"(https?:\/\/[^"]+)"/);
  if (!match) throw new Error("Live-Adresse in src/content/site.ts nicht gefunden");
  return match[1].replace(/\/+$/, "");
}

export function readLegacy(root = projectRoot) {
  const file = path.join(root, "scripts", "altpfade.json");
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : [];
}

/**
 * Alle Routen aus src/app. Dynamische Segmente werden aus den Inhalten
 * aufgeloest. Unbekannte dynamische Segmente brechen ab, damit keine
 * neue Seite ungeprueft bleibt.
 */
export function expectedRoutes(root = projectRoot) {
  const appDir = path.join(root, "src", "app");
  const routes = new Set();
  const serviceSlugs = [
    ...readFileSync(path.join(root, "src", "content", "services.ts"), "utf8").matchAll(/slug:\s*"([^"]+)"/g),
  ].map((match) => match[1]);

  const visit = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(abs);
        continue;
      }
      if (!/^page\.(tsx|ts|jsx|js|mdx)$/.test(entry.name)) continue;

      const segments = path
        .relative(appDir, dir)
        .split(path.sep)
        .filter(Boolean)
        .filter((segment) => !/^\(.+\)$/.test(segment));
      if (segments.some((segment) => segment.startsWith("_"))) continue;

      const dynamicIndex = segments.findIndex((segment) => /^\[.+\]$/.test(segment));
      if (dynamicIndex === -1) {
        routes.add(segments.join("/"));
        continue;
      }

      const parent = segments.slice(0, dynamicIndex).join("/");
      if (parent === "leistungen" && segments[dynamicIndex] === "[slug]" && segments.length === dynamicIndex + 1) {
        for (const slug of serviceSlugs) routes.add(`leistungen/${slug}`);
        continue;
      }
      throw new Error(`Dynamische Route ohne Pruefregel: ${segments.join("/")}`);
    }
  };

  visit(appDir);
  return [...routes].sort();
}

const routeFile = (route) => (route ? `${route}/index.html` : "index.html");

/** Werte aller Attribute, die auf Adressen zeigen koennen */
function attributeUrls(html) {
  const urls = [];
  const markup = html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
  const attr = /\s(href|src|action|poster|data|srcset|imagesrcset|content)\s*=\s*("([^"]*)"|'([^']*)')/gi;
  for (const match of markup.matchAll(attr)) {
    const name = match[1].toLowerCase();
    const value = match[3] ?? match[4] ?? "";
    if (name === "srcset" || name === "imagesrcset") {
      for (const part of value.split(",")) urls.push({ name, value: part.trim().split(/\s+/)[0] });
    } else if (name === "content") {
      const refresh = value.match(/url\s*=\s*(\S+)/i);
      if (refresh) urls.push({ name: "meta-refresh", value: refresh[1] });
      else if (value.startsWith("/")) urls.push({ name, value });
    } else {
      urls.push({ name, value });
    }
  }
  for (const match of markup.matchAll(/style\s*=\s*"([^"]*)"/gi)) {
    for (const url of cssUrls(match[1])) urls.push({ name: "style", value: url });
  }
  return urls;
}

function cssUrls(css) {
  return [...css.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi)].map((match) => match[2].trim());
}

const isRootPath = (value) => value.startsWith("/") && !value.startsWith("//");

/**
 * @returns {{ problems: string[], pages: number, files: number }}
 */
export function checkBuild({ outDir, mode, base = "", root = projectRoot }) {
  const problems = [];
  const fail = (message) => problems.push(message);
  base = normalizeBase(base);

  if (mode !== "live" && mode !== "vorschau") throw new Error(`Unbekannter Modus: ${mode}`);
  if (mode === "vorschau" && !base) fail("Vorschau ohne Basispfad gebaut");
  if (mode === "live" && base) fail(`Live-Build mit Basispfad ${base}`);

  if (!existsSync(outDir)) {
    fail(`Export-Ordner fehlt: ${outDir}`);
    return { problems, pages: 0, files: 0 };
  }

  const entries = walk(outDir);
  const files = entries.filter((entry) => !entry.dir);
  const byRel = new Map(files.map((file) => [file.rel, file]));
  const siteUrl = readSiteUrl(root);
  const routes = expectedRoutes(root);
  const legacy = readLegacy(root);

  /* Grundstruktur (Regel 4) */
  if (!byRel.has("index.html")) fail("index.html fehlt im Hauptordner");
  if (!byRel.has("404.html")) fail("404.html fehlt im Hauptordner");
  for (const entry of entries) {
    if (!entry.dir && entry.name === "BUILD_ID") fail(`BUILD_ID vorhanden: ${entry.rel}`);
    if (entry.dir && entry.name === "cache") fail(`cache-Ordner vorhanden: ${entry.rel}`);
  }
  for (const route of routes) {
    if (!byRel.has(routeFile(route))) fail(`Route ohne Datei: /${route} (erwartet ${routeFile(route)})`);
  }
  for (const item of legacy) {
    if (!byRel.has(item.pfad)) fail(`Altpfad ohne Datei: ${item.pfad}`);
  }

  /* Dateigroesse (Regel 7) */
  for (const file of files) {
    if (file.size > MAX_BYTES) {
      fail(`Datei zu gross (${(file.size / 1e6).toFixed(1)} MB): ${file.rel}`);
    }
  }

  const legacyFiles = new Set(legacy.map((item) => item.pfad));

  for (const file of files) {
    if (!isText(file)) continue;
    const text = readFileSync(file.abs, "utf8");
    const isHtml = /\.(html?|php)$/i.test(file.name);

    if (isHtml && /<base\b/i.test(text)) fail(`<base>-Tag in ${file.rel}`);

    if (mode === "live") {
      /* Regel 6: kein Pfad mit /demo/ */
      if (text.includes("/demo/")) fail(`"/demo/" in ${file.rel}`);
      continue;
    }

    /* Regel 5: jeder absolute Pfad mit Basispfad */
    const okPath = (value) => value === base || value.startsWith(`${base}/`) || value.startsWith(`${base}?`) || value.startsWith(`${base}#`);

    if (isHtml) {
      for (const { name, value } of attributeUrls(text)) {
        if (isRootPath(value) && !okPath(value)) fail(`Pfad ohne ${base} in ${file.rel} (${name}): ${value}`);
      }
      for (const match of text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
        for (const url of cssUrls(match[1])) {
          if (isRootPath(url) && !okPath(url)) fail(`CSS-Pfad ohne ${base} in ${file.rel}: ${url}`);
        }
      }
      if (!/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(text)) fail(`noindex fehlt: ${file.rel}`);
      if (/rel="canonical"/i.test(text)) fail(`Canonical in der Vorschau: ${file.rel}`);
    }

    if (/\.css$/i.test(file.name)) {
      for (const url of cssUrls(text)) {
        if (isRootPath(url) && !okPath(url)) fail(`CSS-Pfad ohne ${base} in ${file.rel}: ${url}`);
      }
    }

    if (/\.(webmanifest|json)$/i.test(file.name) && /manifest/i.test(file.name)) {
      for (const match of text.matchAll(/"(start_url|scope|src)"\s*:\s*"([^"]*)"/g)) {
        if (isRootPath(match[2]) && !okPath(match[2])) fail(`Manifest-Pfad ohne ${base}: ${match[2]}`);
      }
    }

    /* Framework-Ressourcen: jede Referenz auf /_next/static, /_next/data oder
       /_next/image braucht den Basispfad davor. Reine Laufzeitlogik wie
       indexOf("/_next/") ist keine Adresse und bleibt unberuehrt. */
    for (const match of text.matchAll(/\/_next\/(?:static|data|image)/g)) {
      const index = match.index ?? 0;
      if (text.slice(Math.max(0, index - base.length), index) !== base) {
        const snippet = text.slice(Math.max(0, index - 30), index + 50).replace(/\s+/g, " ");
        fail(`/_next/ ohne ${base} in ${file.rel}: ...${snippet}...`);
        break;
      }
    }
  }

  if (mode === "vorschau") {
    for (const file of files) {
      if (FORBIDDEN_IN_PREVIEW.has(file.name)) fail(`In der Vorschau nicht erlaubt: ${file.rel}`);
    }
  }

  if (mode === "live") {
    for (const entry of entries) {
      if (`/${entry.rel}/`.includes("/demo/")) fail(`Pfad mit /demo/ im Export: ${entry.rel}`);
    }

    /* Sitemap, robots, Canonical und Indexierung fuer die Livedomain */
    const sitemap = byRel.get("sitemap.xml");
    const robots = byRel.get("robots.txt");
    if (!sitemap) fail("sitemap.xml fehlt");
    if (!robots) fail("robots.txt fehlt");

    if (robots) {
      const text = readFileSync(robots.abs, "utf8");
      if (!text.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) fail("robots.txt verweist nicht auf die Live-Sitemap");
      if (/^Disallow:\s*\/\s*$/im.test(text)) fail("robots.txt sperrt die gesamte Website");
    }

    if (sitemap) {
      const text = readFileSync(sitemap.abs, "utf8");
      const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
      const listed = new Set();
      for (const loc of locs) {
        if (!loc.startsWith(`${siteUrl}/`)) {
          fail(`Sitemap-Eintrag nicht auf der Livedomain: ${loc}`);
          continue;
        }
        const route = loc.slice(siteUrl.length + 1).replace(/\/+$/, "");
        listed.add(route);
        if (!byRel.has(routeFile(route))) fail(`Sitemap-Eintrag ohne Datei: ${loc}`);
      }
      for (const route of routes) {
        if (!listed.has(route)) fail(`Route fehlt in der Sitemap: /${route}`);
      }
    }

    for (const route of routes) {
      const file = byRel.get(routeFile(route));
      if (!file) continue;
      const html = readFileSync(file.abs, "utf8");
      const expected = `${siteUrl}/${route ? `${route}/` : ""}`;
      const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
      if (canonical !== expected) fail(`Canonical falsch auf /${route}: ${canonical ?? "fehlt"} statt ${expected}`);
      if (/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html)) fail(`noindex auf Live-Seite /${route}`);
    }

    for (const item of legacy) {
      const file = byRel.get(item.pfad);
      if (!file) continue;
      const html = readFileSync(file.abs, "utf8");
      if (!html.includes(`url=${item.ziel}`)) fail(`Altpfad ${item.pfad} leitet nicht auf ${item.ziel}`);
    }
  }

  if (mode === "vorschau") {
    for (const item of legacy) {
      const file = byRel.get(item.pfad);
      if (!file) continue;
      const html = readFileSync(file.abs, "utf8");
      if (!html.includes(`url=${base}${item.ziel}`)) fail(`Altpfad ${item.pfad} leitet nicht auf ${base}${item.ziel}`);
    }
  }

  return { problems, pages: routes.length, files: files.length, legacyFiles };
}

/* Aufruf von der Kommandozeile */
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const dir = args.find((arg) => !arg.startsWith("--") && args[args.indexOf(arg) - 1] !== "--base");
  const mode = args.includes("--vorschau") ? "vorschau" : "live";
  const baseIndex = args.indexOf("--base");
  const base = baseIndex !== -1 ? args[baseIndex + 1] : "";

  if (!dir) {
    console.error("Aufruf: node scripts/check-build.mjs <ordner> --live | --vorschau --base /pfad");
    process.exit(2);
  }

  const { problems, pages } = checkBuild({ outDir: path.resolve(dir), mode, base });
  if (problems.length) {
    console.error(`\nPruefung FEHLGESCHLAGEN (${problems.length}):`);
    for (const problem of problems.slice(0, 60)) console.error(`  x ${problem}`);
    if (problems.length > 60) console.error(`  ... und ${problems.length - 60} weitere`);
    process.exit(1);
  }
  console.log(`Pruefung OK: ${dir}, ${mode}${base ? ` ${normalizeBase(base)}` : ""}, ${pages} Seiten`);
}
