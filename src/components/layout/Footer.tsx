import Link from "next/link";
import { ArrowUp, Clock, Mail, MapPin, Phone, Printer } from "lucide-react";
import { fullAddress, legalNav, nav, site } from "@/content/site";
import { services } from "@/content/services";
import { telHref } from "@/lib/utils";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-brand-500/8 blur-3xl"
      />

      <div className="container-page relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist-300">
              Umzüge, Entrümpelungen, Haushaltsauflösungen, Kleintransporte und Lagerraum. Aus
              Hussenhofen für Schwäbisch Gmünd und die Region.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={telHref(site.contact.phoneHref)}
                className="group flex items-center gap-3 text-sm text-mist-200"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5">
                  <Phone aria-hidden="true" className="size-4 text-brand-400" />
                </span>
                <span className="link-underline text-mist-100">{site.contact.phoneDisplay}</span>
              </a>

              <a
                href={`mailto:${site.contact.email}`}
                className="group flex items-center gap-3 text-sm text-mist-200"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5">
                  <Mail aria-hidden="true" className="size-4 text-brand-400" />
                </span>
                <span className="link-underline text-mist-100">{site.contact.email}</span>
              </a>

              <p className="flex items-center gap-3 text-sm text-mist-300">
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5">
                  <Printer aria-hidden="true" className="size-4 text-mist-400" />
                </span>
                Fax {site.contact.faxDisplay}
              </p>
            </div>
          </div>

          <nav aria-label="Seiten">
            <h2 className="font-display text-sm font-semibold tracking-[0.16em] text-mist-400 uppercase">
              Seiten
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-mist-200 transition-colors duration-200 hover:text-brand-300">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/faq" className="text-sm text-mist-200 transition-colors duration-200 hover:text-brand-300">
                  Häufige Fragen
                </Link>
              </li>
              <li>
                <Link href="/angebot" className="text-sm text-mist-200 transition-colors duration-200 hover:text-brand-300">
                  Angebot anfragen
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Leistungen">
            <h2 className="font-display text-sm font-semibold tracking-[0.16em] text-mist-400 uppercase">
              Leistungen
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/leistungen/${service.slug}`}
                    className="text-sm text-mist-200 transition-colors duration-200 hover:text-brand-300"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/einsatzgebiet" className="text-sm text-mist-200 transition-colors duration-200 hover:text-brand-300">
                  Einsatzgebiet
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-sm font-semibold tracking-[0.16em] text-mist-400 uppercase">
              Standort
            </h2>

            <address className="mt-4 flex gap-3 text-sm leading-relaxed text-mist-300 not-italic">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-400" />
              <span>
                {site.name}
                <br />
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
                <br />
                {site.address.district}
              </span>
            </address>

            <div className="mt-5 flex gap-3 text-sm text-mist-300">
              <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-400" />
              <div className="flex flex-col gap-1">
                {site.openingHours.map((entry) => (
                  <span key={entry.days}>
                    {entry.days}
                    <br />
                    <span className="text-mist-400">{entry.time}</span>
                  </span>
                ))}
              </div>
            </div>

            <a
              href={`https://www.openstreetmap.org/?mlat=${site.address.lat}&mlon=${site.address.lng}#map=17/${site.address.lat}/${site.address.lng}`}
              target="_blank"
              rel="noreferrer noopener"
              className="link-underline mt-5 inline-block text-sm"
            >
              Auf der Karte ansehen
            </a>
            <span className="sr-only">{fullAddress}</span>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/8 pt-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <nav aria-label="Rechtliches" className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {legalNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs text-mist-400 transition-colors duration-200 hover:text-mist-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <a
              href="#top"
              className="ml-auto inline-flex items-center gap-2 rounded-pill border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-mist-200 transition-colors duration-200 hover:border-white/20 hover:text-mist-50"
            >
              <ArrowUp aria-hidden="true" className="size-3.5" />
              Nach oben
            </a>
          </div>

          <div className="flex flex-col gap-2 text-xs text-mist-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {year} {site.name}. Alle Rechte vorbehalten.
            </p>
            <p>
              Erstellt von{" "}
              <a
                href={site.creator.href}
                target="_blank"
                rel="noreferrer noopener"
                className="link-underline font-medium"
              >
                {site.creator.label}
              </a>
            </p>
          </div>

          <p className="text-xs leading-relaxed text-mist-500">
            Diese Website verzichtet auf Tracking, Werbenetzwerke und externe Schriftarten. Karten
            werden erst nach Ihrer Zustimmung geladen.
          </p>
        </div>
      </div>
    </footer>
  );
}
