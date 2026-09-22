import fs from "node:fs";
import path from "node:path";
import { FileText, Mail, Phone } from "lucide-react";
import { site } from "@/content/site";
import { telHref } from "@/lib/utils";

export type LegalSlug = "impressum" | "datenschutz" | "agb" | "widerruf";

/**
 * Laedt den vorformatierten Rechtstext aus src/content/legal/<slug>.html.
 * Die Dateien sind bewusst leer, bis die finalen Texte vorliegen.
 * Solange die Datei leer ist, erscheint ein klarer Hinweis statt Platzhaltertext.
 */
function readLegalHtml(slug: LegalSlug) {
  try {
    const file = path.join(process.cwd(), "src", "content", "legal", `${slug}.html`);
    return fs.readFileSync(file, "utf8").trim();
  } catch {
    return "";
  }
}

export default function LegalDocument({ slug }: { slug: LegalSlug }) {
  const html = readLegalHtml(slug);

  if (!html) {
    return (
      <div className="glass-strong rounded-card p-7 sm:p-10">
        <span className="grid size-12 place-items-center rounded-2xl border border-brand-400/25 bg-brand-500/12 text-brand-300">
          <FileText aria-hidden="true" className="size-5" />
        </span>

        <h2 className="mt-5 font-display text-2xl">Der Text folgt in Kürze</h2>
        <p className="mt-3 max-w-2xl text-[0.975rem] leading-relaxed text-mist-300">
          Dieser Rechtstext wird gerade erstellt und anschließend hier veröffentlicht. Bis dahin
          erreichen Sie uns für alle Fragen direkt.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a href={telHref(site.contact.phoneHref)} className="btn btn-primary">
            <Phone aria-hidden="true" className="size-4" />
            {site.contact.phoneDisplay}
          </a>
          <a href={`mailto:${site.contact.email}`} className="btn btn-ghost">
            <Mail aria-hidden="true" className="size-4" />
            {site.contact.email}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="legal-prose glass rounded-card p-7 sm:p-10"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
