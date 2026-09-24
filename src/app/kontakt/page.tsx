import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Navigation, Phone, Printer } from "lucide-react";
import { fullAddress, routeLink, site } from "@/content/site";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PageHeader from "@/components/layout/PageHeader";
import ConsentMap from "@/components/ui/ConsentMap";
import Reveal from "@/components/ui/Reveal";
import { MailAction, PhoneAction } from "@/components/ui/ContactAction";
import { pageAlternates } from "@/lib/deploy";

export const metadata: Metadata = {
  title: "Kontakt",
  description: `${site.name} in ${site.address.city} ${site.address.district}: Telefon ${site.contact.phoneDisplay}, E-Mail ${site.contact.email}. Erreichbar von Montag bis Samstag.`,
  alternates: pageAlternates("/kontakt/"),
};

const breadcrumbs = [
  { name: "Start", href: "/" },
  { name: "Kontakt", href: "/kontakt" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kontakt"
        title="Direkt zu uns, ohne Umweg"
        lead="Sie sprechen mit den Leuten, die auch anpacken. Am schnellsten geht es telefonisch, schriftlich antworten wir ebenso zuverlässig."
        breadcrumbs={breadcrumbs}
      />

      <section className="pt-8 pb-4 sm:pt-12">
        <div className="container-page">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal>
              <PhoneAction className="glass card-hover sheen flex h-full flex-col rounded-card p-6">
                <span className="grid size-11 place-items-center rounded-xl border border-brand-400/25 bg-brand-500/12 text-brand-300">
                  <Phone aria-hidden="true" className="size-5" />
                </span>
                <h2 className="mt-5 font-display text-lg">Telefon</h2>
                <p className="mt-2 text-xl font-semibold text-mist-50">
                  {site.contact.phoneDisplay}
                </p>
                <p className="mt-2 text-sm text-mist-400">
                  Der schnellste Weg für Termine und kurze Rückfragen.
                </p>
              </PhoneAction>
            </Reveal>

            <Reveal delay={0.06}>
              <MailAction className="glass card-hover sheen flex h-full flex-col rounded-card p-6">
                <span className="grid size-11 place-items-center rounded-xl border border-brand-400/25 bg-brand-500/12 text-brand-300">
                  <Mail aria-hidden="true" className="size-5" />
                </span>
                <h2 className="mt-5 font-display text-lg">E-Mail</h2>
                <p className="mt-2 text-lg font-semibold break-all text-mist-50">
                  {site.contact.email}
                </p>
                <p className="mt-2 text-sm text-mist-400">
                  Gut für Fotos, Grundrisse und ausführliche Beschreibungen.
                </p>
              </MailAction>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="glass-strong flex h-full flex-col rounded-card p-6">
                <span className="grid size-11 place-items-center rounded-xl border border-brand-400/25 bg-brand-500/12 text-brand-300">
                  <Clock aria-hidden="true" className="size-5" />
                </span>
                <h2 className="mt-5 font-display text-lg">Erreichbarkeit</h2>
                <dl className="mt-3 flex flex-col gap-2 text-sm">
                  {site.openingHours.map((entry) => (
                    <div key={entry.days} className="flex justify-between gap-4">
                      <dt className="text-mist-300">{entry.days}</dt>
                      <dd className="text-right font-medium text-mist-100">{entry.time}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs text-mist-400">
                  Außerhalb der Zeiten nutzen Sie gern das Anfrageformular.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad pt-10">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="flex flex-col gap-5">
              <Reveal>
                <div className="glass rounded-card p-6">
                  <h2 className="font-display text-xl">Anschrift</h2>
                  <address className="mt-4 flex gap-3 text-[0.975rem] leading-relaxed text-mist-200 not-italic">
                    <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-brand-400" />
                    <span>
                      {site.name}
                      <br />
                      {site.address.street}
                      <br />
                      {site.address.postalCode} {site.address.city}
                      <br />
                      Ortsteil {site.address.district}
                    </span>
                  </address>

                  <p className="mt-5 flex items-center gap-3 text-sm text-mist-300">
                    <Printer aria-hidden="true" className="size-4 shrink-0 text-mist-400" />
                    Fax {site.contact.faxDisplay}
                  </p>

                  <a
                    href={routeLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-ghost mt-6 w-full"
                  >
                    <Navigation aria-hidden="true" className="size-4" />
                    Route planen
                  </a>
                  <span className="sr-only">{fullAddress}</span>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="glass-strong rounded-card p-6">
                  <h2 className="font-display text-xl">Lieber schriftlich anfragen?</h2>
                  <p className="mt-3 text-sm leading-relaxed text-mist-300">
                    Im Formular fragen wir genau das ab, was wir für eine erste Einschätzung
                    brauchen. Das spart beiden Seiten Rückfragen.
                  </p>
                  <Link href="/angebot" className="btn btn-primary mt-5 w-full">
                    Zum Anfrageformular
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.12}>
              <ConsentMap />
            </Reveal>
          </div>
        </div>
      </section>

      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  );
}
