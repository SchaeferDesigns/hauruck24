import type { Metadata } from "next";
import { faq } from "@/content/faq";
import { services } from "@/content/services";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import PageHeader from "@/components/layout/PageHeader";
import CtaBanner from "@/components/sections/CtaBanner";
import Accordion from "@/components/ui/Accordion";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { pageAlternates } from "@/lib/deploy";

export const metadata: Metadata = {
  title: "Häufige Fragen",
  description:
    "Antworten zu Kosten, Terminen, Besichtigung, Entsorgung und Einsatzgebiet rund um Umzug und Entrümpelung in Schwäbisch Gmünd.",
  alternates: pageAlternates("/faq/"),
};

const breadcrumbs = [
  { name: "Start", href: "/" },
  { name: "Häufige Fragen", href: "/faq" },
];

const allItems = [...faq, ...services.flatMap((service) => service.faq)];

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Häufige Fragen"
        title="Antworten, bevor Sie fragen müssen"
        lead="Die Punkte, die im Erstgespräch am häufigsten vorkommen. Wenn etwas fehlt, rufen Sie an, dann klären wir es direkt."
        breadcrumbs={breadcrumbs}
      />

      <section className="section-pad pt-10">
        <div className="container-page">
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl">Allgemein</h2>
            <Accordion items={faq} defaultOpen={0} className="mt-6" />
          </div>

          <div className="mt-16 flex flex-col gap-12">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.04}>
                <div className="max-w-3xl">
                  <h2 className="flex items-center gap-3 font-display text-2xl">
                    <span className="grid size-10 place-items-center rounded-xl border border-white/12 bg-white/5 text-brand-300">
                      <ServiceIcon name={service.icon} className="size-5" />
                    </span>
                    {service.label}
                  </h2>
                  <Accordion items={service.faq} className="mt-6" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Frage nicht dabei?"
        text="Rufen Sie an oder schreiben Sie uns. Wir antworten auch dann ehrlich, wenn die Antwort gegen einen Auftrag spricht."
      />

      <BreadcrumbJsonLd items={breadcrumbs} />
      <FaqJsonLd items={allItems} />
    </>
  );
}
