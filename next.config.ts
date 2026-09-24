import type { NextConfig } from "next";

/*
 * Statischer Export fuer zwei Ziele, gesteuert von scripts/build.mjs:
 *
 * Live      NEXT_PUBLIC_BASE_PATH leer          Domainwurzel, Export nach out/
 * Vorschau  NEXT_PUBLIC_BASE_PATH=/demo/...     Unterordner, Export nach out/
 *           oder ueber npm run build:vorschau   Export nach out-vorschau/
 *
 * npm run dev nutzt dieselbe Konfiguration ohne Basispfad.
 */

const basePath = (() => {
  const trimmed = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
})();

/* Nur das Build-Skript setzt diesen Wert. Bei output "export" wird ein eigenes
   distDir von Next.js direkt als Export-Ordner verwendet, gebaut wird in .next. */
const exportDir = process.env.HAURUCK_EXPORT_DIR?.trim();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath } : {}),
  ...(exportDir ? { distDir: exportDir } : {}),
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
