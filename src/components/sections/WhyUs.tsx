import { CalendarDays, HandHeart, Handshake, Recycle, Users, Wallet } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const reasons = [
  {
    icon: Users,
    title: "Ein Ansprechpartner",
    text: "Sie sprechen mit den Leuten, die auch anpacken. Keine Hotline, keine Weiterleitung, keine Warteschleife.",
  },
  {
    icon: CalendarDays,
    title: "Auch am Samstag",
    text: "Von Montag bis Samstag zwischen 07:30 und 18:30 Uhr erreichbar und im Einsatz. Das passt zu Arbeitszeiten und Übergabeterminen.",
  },
  {
    icon: Wallet,
    title: "Angebot vor dem Auftrag",
    text: "Sie erhalten vor der Entscheidung ein Angebot auf Basis des echten Umfangs. Keine Zahl ins Blaue, keine Nachforderung aus dem Nichts.",
  },
  {
    icon: Handshake,
    title: "Kurze Wege",
    text: "Wir sitzen in Hussenhofen. Anfahrt bleibt kurz, Rückfragen sind schnell geklärt, Termine lassen sich enger planen.",
  },
  {
    icon: Recycle,
    title: "Sauber entsorgt",
    text: "Getrennt nach Materialart und abgegeben bei zugelassenen Annahmestellen. Brauchbares wird weiterverwendet, nicht verbrannt.",
  },
  {
    icon: HandHeart,
    title: "Auch in schweren Momenten",
    text: "Bei Haushaltsauflösungen nach einem Todesfall arbeiten wir ruhig, diskret und mit Respekt für persönliche Dinge.",
  },
];

export default function WhyUs() {
  return (
    <section className="section-pad">
      <div className="container-page">
        <SectionHeading
          eyebrow="Warum Hauruck24"
          title="Kein Callcenter, sondern Leute aus der Region"
          lead="Was bei einem Umzug oder einer Entrümpelung zählt, ist nicht die Hochglanzbroschüre, sondern ob der Termin hält und der Preis stimmt."
          className="mb-14"
        />

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <Reveal as="li" key={reason.title} delay={index * 0.05} className="h-full">
              <div className="glass card-hover sheen h-full rounded-card p-6">
                <span className="grid size-11 place-items-center rounded-xl border border-white/12 bg-white/5 text-brand-300">
                  <reason.icon aria-hidden="true" className="size-5" strokeWidth={1.7} />
                </span>
                <h3 className="mt-5 font-display text-lg">{reason.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist-300">{reason.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
