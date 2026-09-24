import { site } from "@/content/site";

/**
 * Build-Modus der Website.
 *
 * Live: Domainwurzel der Kundenseite, indexierbar, mit Sitemap und Canonical.
 * Vorschau: gesetzter NEXT_PUBLIC_BASE_PATH, zum Beispiel /demo/hauruck24.
 *   Alle Seiten noindex, kein Canonical, alle Pfade mit dem Basispfad.
 *
 * Der Wert wird beim Build eingesetzt, siehe scripts/build.mjs.
 */

export function normalizeBasePath(value: string | undefined) {
  const trimmed = (value ?? "").trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
}

export const BASE_PATH = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
export const IS_PREVIEW = BASE_PATH !== "";

/** Herkunft der Vorschau, dort liegt der Ordner unter public/demo/... */
export const PREVIEW_ORIGIN = "https://schaeferdesigns.de";

/** Absolute Adresse der Website ohne abschliessenden Schraegstrich */
export const SITE_URL = IS_PREVIEW ? `${PREVIEW_ORIGIN}${BASE_PATH}` : site.url;

/** Pfad fuer Stellen, an denen Next.js den Basispfad nicht selbst ergaenzt */
export const withBase = (path: string) => `${BASE_PATH}${path}`;

/** Absolute URL einer Seite, path immer mit abschliessendem Schraegstrich */
export const pageUrl = (path: string) => `${SITE_URL}${path}`;

/** Canonical nur live. In der Vorschau gibt es bewusst keinen. */
export const pageAlternates = (path: string) => (IS_PREVIEW ? undefined : { canonical: path });

/** Optionaler Empfaenger fuer das Anfrageformular, zum Beispiel ein Formular-Dienst */
export const FORM_ENDPOINT = (process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "").trim();
