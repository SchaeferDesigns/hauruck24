import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PageHeader from "@/components/layout/PageHeader";
import CtaBanner from "@/components/sections/CtaBanner";
import MoveChecklist from "@/components/sections/MoveChecklist";
import PriceFactors from "@/components/sections/PriceFactors";
import ProcessSteps from "@/components/sections/ProcessSteps";

export const metadata: Metadata = {
  title: "Ablauf",
  description:
    "So läuft ein Auftrag bei Hauruck24 ab: Anfrage, Besichtigung, Angebot, Termin und Durchführung. Mit Checkliste zum Abhaken für die Vorbereitung.",
  alternates: { canonical: "/ablauf" },
};

const breadcrumbs = [
  { name: "Start", href: "/" },
  { name: "Ablauf", href: "/ablauf" },
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

      <ProcessSteps
        detailed
        title="Vier Schritte im Detail"
        lead="Jeder Schritt mit dem, was Sie tun, was wir tun und worauf es ankommt. Scrollen Sie durch, die Übersicht links läuft mit."
      />

      <MoveChecklist />
      <PriceFactors />
      <CtaBanner
        title="Termin ins Auge gefasst?"
        text="Sagen Sie uns Datum und Umfang. Wir prüfen, ob es passt, und melden uns mit einer klaren Rückmeldung."
      />

      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  );
}
