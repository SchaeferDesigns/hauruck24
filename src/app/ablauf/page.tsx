import type { Metadata } from "next";
import { Check } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PageHeader from "@/components/layout/PageHeader";
import ProcessSteps from "@/components/sections/ProcessSteps";
import PriceFactors from "@/components/sections/PriceFactors";
import CtaBanner from "@/components/sections/CtaBanner";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Ablauf",
  description:
    "So läuft ein Auftrag bei Hauruck24 ab: Anfrage, Besichtigung, Angebot, Termin und Durchführung. Dazu eine Checkliste für die Vorbereitung.",
  alternates: { canonical: "/ablauf" },
};

const breadcrumbs = [
  { name: "Start", href: "/" },
  { name: "Ablauf", href: "/ablauf" },
];

const checklist = [
  {
    title: "Vier Wochen vorher",
    items: [
      "Termin grob festlegen und anfragen",
      "Kündigung und Übergabetermin abstimmen",
      "Aussortieren beginnen, das senkt den Aufwand spürbar",
      "Sondergut notieren: Klavier, Tresor, Aquarium",
    ],
  },
  {
    title: "Zwei Wochen vorher",
    items: [
      "Kartons besorgen und beschriften",
      "Halteverbot prüfen, wenn die Straße eng ist",
      "Nachbarn und Hausverwaltung informieren",
      "Nachsendeauftrag und Ummeldungen vorbereiten",
    ],
  },
  {
    title: "Am Tag davor",
    items: [
      "Wertsachen und Dokumente separat packen",
      "Kühlschrank abtauen und leeren",
      "Wege und Treppenhaus frei räumen",
      "Zugang, Schlüssel und Parkfläche klären",
    ],
  },
  {
    title: "Am Termin",
    items: [
      "Kurze Abstimmung vor dem Start",
      "Was bleibt und was mitgeht, klar markieren",
      "Erreichbar sein für Rückfragen",
      "Gemeinsame Abnahme am Ende",
    ],
  },
];

export default function ProcessPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ablauf"
        title="Wie ein Auftrag bei uns läuft"
        lead="Kein Papierkram, keine Überraschungen. Sie wissen vorher, was passiert, wer kommt und woran sich der Preis bemisst."
        breadcrumbs={breadcrumbs}
      />

      <ProcessSteps />

      <section className="section-pad pt-0">
        <div className="container-page">
          <SectionHeading
            eyebrow="Checkliste"
            title="Vorbereitung, die Zeit und Geld spart"
            lead="Je besser vorbereitet, desto kürzer der Termin. Und ein kürzerer Termin bedeutet in der Regel einen niedrigeren Preis."
            className="mb-14"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            {checklist.map((block, index) => (
              <Reveal key={block.title} delay={index * 0.06} className="h-full">
                <div className="glass card-hover h-full rounded-card p-6">
                  <h3 className="font-display text-lg text-brand-300">{block.title}</h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-mist-200">
                        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-signal-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PriceFactors />
      <CtaBanner
        title="Termin ins Auge gefasst?"
        text="Sagen Sie uns Datum und Umfang. Wir prüfen, ob es passt, und melden uns mit einer klaren Rückmeldung."
      />

      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  );
}
