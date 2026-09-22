import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { areaGroups } from "@/content/areas";
import { site } from "@/content/site";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PageHeader from "@/components/layout/PageHeader";
import CtaBanner from "@/components/sections/CtaBanner";
import ConsentMap from "@/components/ui/ConsentMap";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Einsatzgebiet",
  description:
    "Umzug, Entrümpelung und Transport in Schwäbisch Gmünd, im Ostalbkreis und im Rems-Murr-Kreis. Alle Orte im Überblick.",
  alternates: { canonical: "/einsatzgebiet" },
};

const breadcrumbs = [
  { name: "Start", href: "/" },
  { name: "Einsatzgebiet", href: "/einsatzgebiet" },
];

export default function AreaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Einsatzgebiet"
        title="Wo wir unterwegs sind"
        lead="Unser Standort liegt in Hussenhofen. Von dort sind die meisten Orte in der Region in wenigen Minuten erreicht. Das hält Anfahrtswege kurz und Termine planbar."
        breadcrumbs={breadcrumbs}
      />

      <section className="section-pad pt-10">
        <div className="container-page">
          <div className="flex flex-col gap-5">
            {areaGroups.map((group, index) => (
              <Reveal key={group.title} delay={index * 0.07}>
                <div className="glass rounded-card p-6 sm:p-7">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="font-display text-xl sm:text-2xl">{group.title}</h2>
                    <span className="text-sm text-mist-400">{group.note}</span>
                  </div>

                  <ul className="mt-6 flex flex-wrap gap-2.5">
                    {group.places.map((place) => (
                      <li
                        key={place}
                        className="glass-soft inline-flex items-center gap-2 rounded-pill px-3.5 py-2 text-sm text-mist-200"
                      >
                        <MapPin aria-hidden="true" className="size-3.5 text-brand-400" />
                        {place}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <div className="glass-strong rounded-card p-6 sm:p-7">
                <h2 className="font-display text-xl">Ihr Ort ist nicht dabei?</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist-300">
                  Die Liste ist kein Zaun. Fahrten über die Region hinaus sind möglich, sie hängen
                  vom Termin und vom Umfang ab. Fragen Sie einfach an, wir sagen Ihnen ehrlich, ob
                  es sich lohnt.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl">Unser Standort</h2>
              <p className="mt-4 text-[0.975rem] leading-relaxed text-mist-300">
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}, {site.address.district}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-mist-400">
                Die Karte wird erst geladen, wenn Sie zustimmen. So bleibt Ihre IP-Adresse beim
                Besuch dieser Seite bei uns.
              </p>
            </div>

            <ConsentMap />
          </div>
        </div>
      </section>

      <CtaBanner
        title="Anfahrt klären, Termin sichern"
        text="Nennen Sie uns Ort und Wunschtermin. Wir sagen Ihnen, ob wir es einrichten können."
      />

      <BreadcrumbJsonLd items={breadcrumbs} />
    </>
  );
}
