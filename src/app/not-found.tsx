import Link from "next/link";
import { ArrowRight, Compass, Phone } from "lucide-react";
import { services } from "@/content/services";
import { site } from "@/content/site";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { PhoneAction } from "@/components/ui/ContactAction";

export const metadata = {
  title: "Seite nicht gefunden",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="glass-strong mx-auto max-w-3xl rounded-card p-8 text-center sm:p-12">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-brand-400/25 bg-brand-500/12 text-brand-300">
            <Compass aria-hidden="true" className="size-6" />
          </span>

          <p className="mt-6 font-display text-sm font-semibold tracking-[0.18em] text-brand-300 uppercase">
            Fehler 404
          </p>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl">Diese Seite gibt es nicht</h1>
          <p className="mx-auto mt-4 max-w-lg text-[0.975rem] leading-relaxed text-mist-300">
            Vielleicht wurde die Adresse geändert oder es hat sich ein Tippfehler eingeschlichen.
            Über die folgenden Wege kommen Sie schnell wieder ans Ziel.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn btn-primary">
              Zur Startseite
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <PhoneAction className="btn btn-ghost">
              <Phone aria-hidden="true" className="size-4" />
              {site.contact.phoneDisplay}
            </PhoneAction>
          </div>

          <ul className="mt-10 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/leistungen/${service.slug}`}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 p-3.5 text-left transition-colors duration-250 hover:border-white/22"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/5 text-brand-300">
                    <ServiceIcon name={service.icon} className="size-4" />
                  </span>
                  <span className="text-sm font-medium text-mist-100">{service.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
