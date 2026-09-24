import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PageHeader from "@/components/layout/PageHeader";
import LegalDocument from "@/components/legal/LegalDocument";
import { pageAlternates } from "@/lib/deploy";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Anbieterkennzeichnung nach Paragraf 5 DDG.",
  alternates: pageAlternates("/impressum/"),
};

const breadcrumbs = [
  { name: "Start", href: "/" },
  { name: "Impressum", href: "/impressum" },
];

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Rechtliches"
        title="Impressum"
        lead="Angaben zum Anbieter dieser Website."
        breadcrumbs={breadcrumbs}
      />

      <section className="section-pad pt-10">
        <div className="container-page">
          <div className="max-w-3xl">
            <LegalDocument slug="impressum" />
          </div>
        </div>
      </section>

      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  );
}
