import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { areaGroups } from "@/content/areas";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AreaTeaser() {
  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading
            eyebrow="Einsatzgebiet"
            title="Zuhause im Ostalbkreis"
            lead={
              <>
                Schwerpunkt ist Schwäbisch Gmünd mit allen Stadtteilen. Dazu kommen der Ostalbkreis
                und der Rems-Murr-Kreis. Fahrten darüber hinaus klären wir im Einzelfall.
                <Link href="/einsatzgebiet" className="link-underline mt-5 flex items-center gap-1.5 text-base font-medium">
                  Alle Orte ansehen
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </>
            }
          />

          <div className="flex flex-col gap-4">
            {areaGroups.map((group, index) => (
              <Reveal key={group.title} delay={index * 0.08}>
                <div className="glass rounded-card p-5 sm:p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-base sm:text-lg">{group.title}</h3>
                    <span className="shrink-0 text-xs text-mist-400">{group.note}</span>
                  </div>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.places.slice(0, 8).map((place) => (
                      <li
                        key={place}
                        className="glass-soft inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs text-mist-200"
                      >
                        <MapPin aria-hidden="true" className="size-3 text-brand-400" />
                        {place}
                      </li>
                    ))}
                    {group.places.length > 8 ? (
                      <li className="inline-flex items-center rounded-pill px-3 py-1.5 text-xs text-mist-400">
                        und {group.places.length - 8} weitere
                      </li>
                    ) : null}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
