import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { services } from "@/content/services";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/ui/ServiceIcon";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ServicesGrid({
  withHeading = true,
  limit,
}: {
  withHeading?: boolean;
  limit?: number;
}) {
  const list = limit ? services.slice(0, limit) : services;

  return (
    <section id="leistungen" className="section-pad">
      <div className="container-page">
        {withHeading ? (
          <SectionHeading
            eyebrow="Leistungen"
            title="Fünf Aufgaben, ein Ansprechpartner"
            lead="Egal ob nur ein Schrank, ein kompletter Haushalt oder ein Keller voller Jahrzehnte: Sie rufen an, wir schauen es uns an und sagen klar, was möglich ist."
            className="mb-14"
          />
        ) : null}

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((service, index) => (
            <Reveal as="li" key={service.slug} delay={index * 0.06} className="h-full">
              <Link
                href={`/leistungen/${service.slug}`}
                className="glass card-hover sheen group flex h-full flex-col rounded-card p-6"
              >
                <span className="grid size-12 place-items-center rounded-2xl border border-brand-400/25 bg-brand-500/12 text-brand-300">
                  <ServiceIcon name={service.icon} />
                </span>

                <h3 className="mt-5 font-display text-xl">{service.label}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist-300">{service.teaser}</p>

                <ul className="mt-5 flex flex-1 flex-col gap-2">
                  {service.includes.slice(0, 3).map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-mist-300">
                      <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-signal-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300">
                  Details ansehen
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          ))}

          {/* Abschlusskarte mit direkter Handlungsaufforderung */}
          <Reveal as="li" delay={list.length * 0.06} className="h-full">
            <div className="glass-strong flex h-full flex-col justify-between rounded-card p-6">
              <div>
                <h3 className="font-display text-xl">Nicht sicher, was Sie brauchen?</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist-300">
                  Beschreiben Sie Ihre Situation in wenigen Sätzen. Wir sagen Ihnen, welche
                  Leistung passt und was sinnvoll ist.
                </p>
              </div>
              <Link href="/angebot" className="btn btn-primary mt-6 w-full">
                Situation schildern
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
