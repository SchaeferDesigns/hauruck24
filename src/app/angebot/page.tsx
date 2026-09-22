import type { Metadata } from "next";
import { Camera, Clock, Phone, ShieldCheck } from "lucide-react";
import { site } from "@/content/site";
import { telHref } from "@/lib/utils";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PageHeader from "@/components/layout/PageHeader";
import QuoteForm from "@/components/forms/QuoteForm";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Angebot anfragen",
  description:
    "Angebot für Umzug, Entrümpelung, Haushaltsauflösung, Kleintransport oder Lagerraum in Schwäbisch Gmünd anfragen. Kostenlos und unverbindlich.",
  alternates: { canonical: "/angebot" },
};

const breadcrumbs = [
  { name: "Start", href: "/" },
  { name: "Angebot anfragen", href: "/angebot" },
];

const hints = [
  {
    icon: Clock,
    title: "Wir melden uns zeitnah",
    text: "Anfragen bearbeiten wir während der Öffnungszeiten von Montag bis Samstag.",
  },
  {
    icon: Camera,
    title: "Fotos helfen",
    text: "Bilder von Räumen, Möbeln oder Treppenhaus machen die Einschätzung deutlich genauer. Senden Sie sie gern per E-Mail nach.",
  },
  {
    icon: ShieldCheck,
    title: "Unverbindlich",
    text: "Eine Anfrage ist keine Buchung. Sie entscheiden erst, wenn Ihnen das Angebot vorliegt.",
  },
];

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ leistung?: string }>;
}) {
  const params = await searchParams;
  const initialService = typeof params.leistung === "string" ? params.leistung : "";

  return (
    <>
      <PageHeader
        eyebrow="Angebot"
        title="In drei Schritten zur Einschätzung"
        lead="Sagen Sie uns, worum es geht, wo es stattfindet und wie wir Sie erreichen. Alles andere klären wir persönlich."
        breadcrumbs={breadcrumbs}
      />

      <section id="anfrage" className="pt-8 pb-4 sm:pt-12">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr] lg:items-start">
            <QuoteForm initialService={initialService} />

            <div className="flex flex-col gap-4">
              <Reveal delay={0.08}>
                <div className="glass rounded-card p-6">
                  <h2 className="font-display text-lg">Lieber direkt sprechen?</h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-mist-300">
                    Bei kurzfristigen Terminen und knappen Fragen ist das Telefon der schnellste
                    Weg.
                  </p>
                  <a href={telHref(site.contact.phoneHref)} className="btn btn-primary mt-5 w-full">
                    <Phone aria-hidden="true" className="size-4" />
                    {site.contact.phoneDisplay}
                  </a>
                  <p className="mt-4 text-xs text-mist-400">
                    {site.openingHours[0].days}, {site.openingHours[0].time}
                  </p>
                </div>
              </Reveal>

              {hints.map((hint, index) => (
                <Reveal key={hint.title} delay={0.12 + index * 0.06}>
                  <div className="glass-soft flex gap-3.5 rounded-card p-5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/5 text-brand-300">
                      <hint.icon aria-hidden="true" className="size-4" strokeWidth={1.8} />
                    </span>
                    <div>
                      <h3 className="font-display text-sm">{hint.title}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-mist-400">{hint.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  );
}
