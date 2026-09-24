import Link from "next/link";
import { ArrowRight, Boxes, Building2, Info, Recycle, Route, Timer } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const factors = [
  {
    icon: Boxes,
    title: "Menge",
    text: "Kubikmeter statt Bauchgefühl. Wie viel muss bewegt oder entsorgt werden?",
  },
  {
    icon: Building2,
    title: "Zugang",
    text: "Stockwerk, Aufzug, Treppenhausbreite und Halteverbot machen den Unterschied.",
  },
  {
    icon: Route,
    title: "Entfernung",
    text: "Kurze Strecke innerhalb der Stadt oder Fahrt in den Nachbarkreis.",
  },
  {
    icon: Recycle,
    title: "Entsorgung",
    text: "Gemischter Abfall kostet mehr als sauber getrennte Fraktionen.",
  },
  {
    icon: Timer,
    title: "Termin",
    text: "Zum Monatswechsel sind Kalender voll. Flexible Tage sind oft günstiger.",
  },
  {
    icon: Info,
    title: "Zusatzarbeiten",
    text: "Möbelmontage, Küchendemontage oder Bodenbeläge werden gesondert eingeplant.",
  },
];

export default function PriceFactors() {
  return (
    <section className="section-pad">
      <div className="container-page">
        <SectionHeading
          eyebrow="Preisbildung"
          title="Woraus sich Ihr Preis ergibt"
          lead="Pauschalen im Internet klingen bequem und stimmen selten. Deshalb rechnen wir mit den Faktoren, die den Aufwand wirklich bestimmen."
          className="mb-14"
        />

        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <ul className="grid gap-4 sm:grid-cols-2">
            {factors.map((factor, index) => (
              <Reveal as="li" key={factor.title} delay={index * 0.05} className="h-full">
                <div className="glass card-hover sheen flex h-full gap-4 rounded-card p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/5 text-brand-300">
                    <factor.icon aria-hidden="true" className="size-5" strokeWidth={1.7} />
                  </span>
                  <div>
                    <h3 className="font-display text-base">{factor.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-mist-300">{factor.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.1}>
            <div className="glass-strong flex h-full flex-col justify-between rounded-card p-6">
              <div>
                <h3 className="font-display text-xl">Warum hier keine Preisliste steht</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist-300">
                  Ein Keller mit drei Kubikmetern und ein Keller mit dreißig sehen auf einem Foto
                  ähnlich aus. Eine Zahl, die vorher genannt und hinterher korrigiert wird, hilft
                  niemandem. Wir schauen hin und nennen Ihnen dann einen Preis, der hält.
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3">
                <Link href="/angebot" className="btn btn-primary w-full">
                  Angebot anfragen
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link href="/ablauf" className="btn btn-ghost w-full">
                  Ablauf im Detail
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
