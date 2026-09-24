import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PageHeader from "@/components/layout/PageHeader";
import ServicesGrid from "@/components/sections/ServicesGrid";
import ProcessSteps from "@/components/sections/ProcessSteps";
import CtaBanner from "@/components/sections/CtaBanner";
import { pageAlternates } from "@/lib/deploy";

export const metadata: Metadata = {
  title: "Leistungen",
  description:
    "Umzug, Entrümpelung, Haushaltsauflösung, Kleintransporte und Lagerraum in Schwäbisch Gmünd und Umgebung. Alle Leistungen im Überblick.",
  alternates: pageAlternates("/leistungen/"),
};

const breadcrumbs = [
  { name: "Start", href: "/" },
  { name: "Leistungen", href: "/leistungen" },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Leistungen"
        title="Was wir für Sie erledigen"
        lead="Fünf Bereiche, die sich im Alltag oft überschneiden. Ein Umzug bringt fast immer Sperrmüll mit sich, eine Haushaltsauflösung fast immer eine Einlagerung. Deshalb bekommen Sie alles aus einer Hand."
        breadcrumbs={breadcrumbs}
      />

      <ServicesGrid withHeading={false} />
      <ProcessSteps />
      <CtaBanner
        title="Noch unsicher, was passt?"
        text="Beschreiben Sie Ihre Situation. Wir sagen Ihnen offen, welche Leistung sinnvoll ist und wo Sie sich Aufwand sparen können."
      />

      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  );
}
