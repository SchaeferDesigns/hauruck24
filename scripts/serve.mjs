/**
 * Minimaler statischer Server ohne Abhaengigkeiten, verhaelt sich wie
 * ein ueblicher Static-Host: Ordner liefern index.html, Ordner ohne
 * Schraegstrich werden umgeleitet, fehlende Dateien bekommen die naechste 404.html.
 *
 *   node scripts/serve.mjs out            http://localhost:3000/
 *   node scripts/serve.mjs probe 4173     beliebiger Ordner und Port
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "out");
const port = Number(process.argv[3] ?? process.env.PORT ?? 3000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".php": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
};

const isFile = (file) => existsSync(file) && statSync(file).isFile();
const isDir = (file) => existsSync(file) && statSync(file).isDirectory();

function send(res, file, status = 200) {
  res.writeHead(status, { "Content-Type": types[path.extname(file).toLowerCase()] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}

function nearest404(dir) {
  let current = dir;
  while (current.startsWith(root)) {
    const candidate = path.join(current, "404.html");
    if (isFile(candidate)) return candidate;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }

  const target = path.join(root, pathname);
  if (!target.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }

  if (isDir(target)) {
    if (!pathname.endsWith("/")) {
      res.writeHead(301, { Location: `${url.pathname}/${url.search}` }).end();
      return;
    }
    const index = path.join(target, "index.html");
    if (isFile(index)) return send(res, index);
  } else if (isFile(target)) {
    return send(res, target);
  } else if (isFile(`${target}.html`)) {
    return send(res, `${target}.html`);
  }

  const notFound = nearest404(isDir(target) ? target : path.dirname(target));
  if (notFound) return send(res, notFound, 404);
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("404");
});

server.listen(port, () => {
  console.log(`Statischer Server: ${root} auf http://localhost:${port}/`);
});
