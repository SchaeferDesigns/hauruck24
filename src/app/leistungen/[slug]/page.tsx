import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Phone } from "lucide-react";
import { serviceBySlug, services } from "@/content/services";
import { site } from "@/content/site";
import { BreadcrumbJsonLd, FaqJsonLd, ServiceJsonLd } from "@/components/seo/JsonLd";
import PageHeader from "@/components/layout/PageHeader";
import CtaBanner from "@/components/sections/CtaBanner";
import FaqSection from "@/components/sections/FaqSection";
import TruckLoader from "@/components/sections/TruckLoader";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { PhoneAction } from "@/components/ui/ContactAction";
import { pageAlternates, pageUrl } from "@/lib/deploy";

/* Statischer Export: nur die bekannten Leistungen, alles andere ist 404 */
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug(slug);

  if (!service) return { title: "Leistung nicht gefunden" };

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: pageAlternates(`/leistungen/${service.slug}/`),
    openGraph: {
      title: service.seoTitle,
      description: service.seoDescription,
      url: pageUrl(`/leistungen/${service.slug}/`),
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = serviceBySlug(slug);

  if (!service) notFound();

  const others = services.filter((entry) => entry.slug !== service.slug);
  const breadcrumbs = [
    { name: "Start", href: "/" },
    { name: "Leistungen", href: "/leistungen" },
    { name: service.label, href: `/leistungen/${service.slug}` },
  ];

  return (
    <>
      <PageHeader
        eyebrow={service.label}
        title={service.title}
        lead={service.lead}
        breadcrumbs={breadcrumbs}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={`/angebot/?leistung=${service.slug}`} className="btn btn-primary">
            Angebot für {service.label}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <PhoneAction className="btn btn-ghost">
            <Phone aria-hidden="true" className="size-4" />
            {site.contact.phoneDisplay}
          </PhoneAction>
        </div>
      </PageHeader>

      {/* Leistungsumfang und Anlaesse */}
      <section className="section-pad">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="glass h-full rounded-card p-7">
                <span className="grid size-12 place-items-center rounded-2xl border border-brand-400/25 bg-brand-500/12 text-brand-300">
                  <ServiceIcon name={service.icon} />
                </span>
                <h2 className="mt-5 font-display text-2xl">Das ist enthalten</h2>
                <ul className="mt-6 flex flex-col gap-3.5">
                  {service.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.975rem] leading-relaxed text-mist-200">
                      <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-signal-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="glass-strong h-full rounded-card p-7">
                <h2 className="font-display text-2xl">Typische Situationen</h2>
                <p className="mt-3 text-sm leading-relaxed text-mist-300">
                  Wenn Sie sich in einem dieser Punkte wiederfinden, sind Sie hier richtig.
                </p>

                <ul className="mt-6 flex flex-col gap-3">
                  {service.cases.map((item, index) => (
                    <li
                      key={item}
                      className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/4 p-4"
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-400 font-display text-xs font-bold text-night-950">
                        {index + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-mist-200">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/angebot/?leistung=${service.slug}`}
                  className="btn btn-primary mt-7 w-full"
                >
                  Situation schildern
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {service.slug === "umzug" ? <TruckLoader service="umzug" /> : null}

      <FaqSection
        items={service.faq}
        eyebrow={`${service.label}, häufige Fragen`}
        title="Was vorab oft gefragt wird"
        lead="Wenn Ihre Frage hier nicht dabei ist, rufen Sie an. Wir antworten auch dann ehrlich, wenn die Antwort gegen einen Auftrag spricht."
      />

      {/* Weitere Leistungen */}
      <section className="section-pad pt-0">
        <div className="container-page">
          <h2 className="font-display text-2xl">Passt vielleicht auch</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((entry, index) => (
              <Reveal as="li" key={entry.slug} delay={index * 0.05} className="h-full">
                <Link
                  href={`/leistungen/${entry.slug}`}
                  className="glass card-hover sheen group flex h-full flex-col rounded-card p-5"
                >
                  <span className="grid size-10 place-items-center rounded-xl border border-white/12 bg-white/5 text-brand-300">
                    <ServiceIcon name={entry.icon} className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base">{entry.label}</h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-mist-400">
                    {entry.teaser}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-300">
                    Ansehen
                    <ArrowRight
                      aria-hidden="true"
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner
        title={`${service.label} anfragen`}
        text="Ein kurzes Gespräch reicht für die erste Einschätzung. Danach wissen Sie, ob und wann es passt."
        primaryHref={`/angebot/?leistung=${service.slug}`}
      />

      <BreadcrumbJsonLd items={breadcrumbs} />
      <ServiceJsonLd
        name={service.title}
        description={service.seoDescription}
        slug={service.slug}
      />
      <FaqJsonLd items={service.faq} />
    </>
  );
}
