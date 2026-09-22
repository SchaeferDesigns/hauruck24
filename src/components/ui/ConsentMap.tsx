"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { useState } from "react";
import { fullAddress, mapsLink, site } from "@/content/site";

/**
 * Karte laedt erst nach ausdruecklicher Zustimmung.
 * Vorher geht keine Anfrage an einen externen Dienst, die IP bleibt hier.
 */
export default function ConsentMap() {
  const [loaded, setLoaded] = useState(false);

  const bbox = [
    site.address.lng - 0.006,
    site.address.lat - 0.003,
    site.address.lng + 0.006,
    site.address.lat + 0.003,
  ].join("%2C");

  return (
    <div className="glass overflow-hidden rounded-card">
      {loaded ? (
        <iframe
          title={`Karte mit dem Standort ${fullAddress}`}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${site.address.lat}%2C${site.address.lng}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-[22rem] w-full border-0"
        />
      ) : (
        <div className="relative flex h-[22rem] flex-col items-center justify-center gap-4 p-6 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-grid opacity-40"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 size-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/12 blur-3xl"
          />

          <span className="relative grid size-12 place-items-center rounded-full border border-brand-400/30 bg-brand-500/12">
            <MapPin aria-hidden="true" className="size-5 text-brand-300" />
          </span>

          <div className="relative max-w-sm">
            <h3 className="font-display text-lg">Karte erst nach Ihrer Zustimmung</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist-300">
              Beim Laden der Karte wird eine Verbindung zu OpenStreetMap aufgebaut. Dabei wird Ihre
              IP-Adresse an den Kartendienst übertragen.
            </p>
          </div>

          <div className="relative flex flex-col gap-2.5 sm:flex-row">
            <button type="button" onClick={() => setLoaded(true)} className="btn btn-primary">
              Karte laden
            </button>
            <a href={mapsLink} target="_blank" rel="noreferrer noopener" className="btn btn-ghost">
              In neuem Tab öffnen
              <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
