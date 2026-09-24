import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PageHeader from "@/components/layout/PageHeader";
import LegalDocument from "@/components/legal/LegalDocument";
import { pageAlternates } from "@/lib/deploy";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Informationen zur Verarbeitung personenbezogener Daten nach DSGVO.",
  alternates: pageAlternates("/datenschutz/"),
};

const breadcrumbs = [
  { name: "Start", href: "/" },
  { name: "Datenschutz", href: "/datenschutz" },
];

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Rechtliches"
        title="Datenschutzerklärung"
        lead="Wie wir mit Ihren Daten umgehen, welche erhoben werden und welche Rechte Sie haben."
        breadcrumbs={breadcrumbs}
      />

      <section className="section-pad pt-10">
        <div className="container-page">
          <div className="max-w-3xl">
            <LegalDocument slug="datenschutz" />
          </div>
        </div>
      </section>

      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  );
}
