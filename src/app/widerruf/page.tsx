import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PageHeader from "@/components/layout/PageHeader";
import LegalDocument from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Widerrufsbelehrung",
  description: "Informationen zum Widerrufsrecht bei Verträgen im Fernabsatz.",
  alternates: { canonical: "/widerruf" },
  robots: { index: true, follow: true },
};

const breadcrumbs = [
  { name: "Start", href: "/" },
  { name: "Widerruf", href: "/widerruf" },
];

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Rechtliches"
        title="Widerrufsbelehrung"
        lead="Wann und wie Sie einen Vertrag widerrufen können."
        breadcrumbs={breadcrumbs}
      />

      <section className="section-pad pt-10">
        <div className="container-page">
          <div className="max-w-3xl">
            <LegalDocument slug="widerruf" />
          </div>
        </div>
      </section>

      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  );
}
