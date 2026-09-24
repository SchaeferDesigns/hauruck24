import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import { site } from "@/content/site";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PageHeader from "@/components/layout/PageHeader";
import WhyUs from "@/components/sections/WhyUs";
import CtaBanner from "@/components/sections/CtaBanner";
import Reveal from "@/components/ui/Reveal";
import { SceneBoxes } from "@/components/sections/HeroScene";
import { PhoneAction } from "@/components/ui/ContactAction";

export const metadata: Metadata = {
  title: "Über uns",
  description: `${site.name} aus ${site.address.city} ${site.address.district}: Umzüge, Entrümpelungen und Transporte aus der Region, mit eigenem Fahrzeug und festen Ansprechpartnern.`,
  alternates: { canonical: "/ueber-uns" },
};

const breadcrumbs = [
  { name: "Start", href: "/" },
  { name: "Über uns", href: "/ueber-uns" },
];

const facts = [
  { icon: MapPin, label: "Standort", value: `${site.address.district}, ${site.address.city}` },
  { icon: Clock, label: "Erreichbar", value: "Montag bis Samstag, 07:30 bis 18:30 Uhr" },
  { icon: Phone, label: "Direkt", value: site.contact.phoneDisplay },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Über uns"
        title="Aus Hussenhofen, für die Region"
        lead="Hauruck24 ist ein Betrieb aus Schwäbisch Gmünd. Kleine Strukturen, kurze Wege und Leute, die selbst mit anpacken."
        breadcrumbs={breadcrumbs}
      />

      <section className="section-pad pt-10">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <Reveal>
              <div className="flex flex-col gap-5 text-[0.975rem] leading-relaxed text-mist-200">
                <p>
                  Umzug und Entrümpelung sind selten schöne Anlässe. Meistens steht ein Wechsel an,
                  manchmal ein Abschied. In beiden Fällen ist es hilfreich, wenn jemand die Arbeit
                  übernimmt, ohne dass man sie ständig kontrollieren muss.
                </p>
                <p>
                  Genau das ist unsere Aufgabe. Wir kommen vorbei, schauen uns an, was zu tun ist,
                  und sagen offen, was machbar ist und was nicht. Wenn ein Auftrag für Sie günstiger
                  wird, weil Sie einen Teil selbst erledigen, sagen wir das auch.
                </p>
                <p>
                  Unsere Kunden sind Familien, Vermieter, Hausverwaltungen, Erbengemeinschaften und
                  Betriebe aus Schwäbisch Gmünd und dem Umland. Was sie verbindet, ist der Wunsch
                  nach einem Termin, der hält, und einem Preis, der stimmt.
                </p>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/angebot" className="btn btn-primary">
                  Angebot anfragen
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <PhoneAction className="btn btn-ghost">
                  <Phone aria-hidden="true" className="size-4" />
                  {site.contact.phoneDisplay}
                </PhoneAction>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="glass-strong relative overflow-hidden rounded-card p-7">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -right-12 size-56 rounded-full bg-brand-500/14 blur-3xl"
                />
                <SceneBoxes className="relative mx-auto w-48 animate-float opacity-80" />

                <dl className="relative mt-6 flex flex-col gap-4 border-t border-white/10 pt-6">
                  {facts.map((fact) => (
                    <div key={fact.label} className="flex gap-3.5">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/5 text-brand-300">
                        <fact.icon aria-hidden="true" className="size-4" strokeWidth={1.8} />
                      </span>
                      <div>
                        <dt className="text-xs tracking-wide text-mist-400 uppercase">
                          {fact.label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-medium text-mist-100">{fact.value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <WhyUs />
      <CtaBanner />

      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  );
}
