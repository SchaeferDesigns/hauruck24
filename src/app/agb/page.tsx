import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PageHeader from "@/components/layout/PageHeader";
import LegalDocument from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen",
  description: "Die Bedingungen für unsere Leistungen.",
  alternates: { canonical: "/agb" },
  robots: { index: true, follow: true },
};

const breadcrumbs = [
  { name: "Start", href: "/" },
  { name: "AGB", href: "/agb" },
];

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Rechtliches"
        title="Allgemeine Geschäftsbedingungen"
        lead="Die Bedingungen, die für Aufträge und Leistungen gelten."
        breadcrumbs={breadcrumbs}
      />

      <section className="section-pad pt-10">
        <div className="container-page">
          <div className="max-w-3xl">
            <LegalDocument slug="agb" />
          </div>
        </div>
      </section>

      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  );
}
