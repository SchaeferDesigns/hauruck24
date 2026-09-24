import Link from "next/link";
import { ArrowRight, Clock, Mail, Phone } from "lucide-react";
import { site } from "@/content/site";
import Reveal from "@/components/ui/Reveal";
import { MailAction, PhoneAction } from "@/components/ui/ContactAction";

export default function CtaBanner({
  title = "Sagen Sie uns, was weg soll",
  text = "Ein Anruf genügt für die erste Einschätzung. Wenn es größer ist, schauen wir vorbei und Sie erhalten ein Angebot, mit dem Sie rechnen können.",
  primaryLabel = "Angebot anfragen",
  primaryHref = "/angebot",
}: {
  title?: string;
  text?: string;
  primaryLabel?: string;
  primaryHref?: string;
}) {
  return (
    <section className="section-pad">
      <div className="container-page">
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-[2rem] p-7 sm:p-10 lg:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full bg-brand-500/18 blur-[90px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 -left-20 size-80 rounded-full bg-signal-500/12 blur-[100px]"
            />

            <div className="relative grid gap-9 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
              <div>
                <h2 className="font-display text-3xl leading-tight sm:text-4xl">{title}</h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-mist-200">{text}</p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href={primaryHref} className="btn btn-primary">
                    {primaryLabel}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                  <PhoneAction className="btn btn-ghost">
                    <Phone aria-hidden="true" className="size-4" />
                    {site.contact.phoneDisplay}
                  </PhoneAction>
                </div>
              </div>

              <dl className="flex flex-col gap-4 border-t border-white/10 pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-9">
                <div className="flex gap-3">
                  <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-400" />
                  <div>
                    <dt className="text-xs tracking-wide text-mist-400 uppercase">Erreichbar</dt>
                    <dd className="mt-1 text-sm text-mist-100">
                      {site.openingHours[0].days}
                      <br />
                      {site.openingHours[0].time}
                    </dd>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-400" />
                  <div>
                    <dt className="text-xs tracking-wide text-mist-400 uppercase">E-Mail</dt>
                    <dd className="mt-1 text-sm">
                      <MailAction className="link-underline">
                        {site.contact.email}
                      </MailAction>
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
