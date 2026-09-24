"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarClock, CalendarRange, PartyPopper, RotateCcw, Sun, Timer } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import Checkbox from "@/components/forms/Checkbox";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const phases = [
  {
    id: "vier-wochen",
    title: "Vier Wochen vorher",
    icon: CalendarRange,
    items: [
      "Termin grob festlegen und anfragen",
      "Kündigung und Übergabetermin abstimmen",
      "Aussortieren beginnen, das senkt den Aufwand spürbar",
      "Sondergut notieren: Klavier, Tresor, Aquarium",
    ],
  },
  {
    id: "zwei-wochen",
    title: "Zwei Wochen vorher",
    icon: CalendarClock,
    items: [
      "Kartons besorgen und beschriften",
      "Halteverbot prüfen, wenn die Straße eng ist",
      "Nachbarn und Hausverwaltung informieren",
      "Nachsendeauftrag und Ummeldungen vorbereiten",
    ],
  },
  {
    id: "tag-davor",
    title: "Am Tag davor",
    icon: Timer,
    items: [
      "Wertsachen und Dokumente separat packen",
      "Kühlschrank abtauen und leeren",
      "Wege und Treppenhaus frei räumen",
      "Zugang, Schlüssel und Parkfläche klären",
    ],
  },
  {
    id: "am-termin",
    title: "Am Termin",
    icon: Sun,
    items: [
      "Kurze Abstimmung vor dem Start",
      "Was bleibt und was mitgeht, klar markieren",
      "Erreichbar sein für Rückfragen",
      "Gemeinsame Abnahme am Ende",
    ],
  },
];

const total = phases.reduce((sum, phase) => sum + phase.items.length, 0);

/**
 * Checkliste zum Abhaken. Der Stand bleibt nur in diesem Browserfenster
 * und wird nirgends gespeichert oder uebertragen.
 */
export default function MoveChecklist() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState<Set<string>>(new Set());

  const toggle = (key: string, checked: boolean) =>
    setDone((current) => {
      const next = new Set(current);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });

  const count = done.size;
  const ratio = count / total;
  const allDone = count === total;

  const perPhase = useMemo(
    () =>
      phases.map(
        (phase) => phase.items.filter((item) => done.has(`${phase.id}:${item}`)).length,
      ),
    [done],
  );

  return (
    <section className="section-pad pt-0">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Checkliste"
            title="Vorbereitung, die Zeit und Geld spart"
            lead="Je besser vorbereitet, desto kürzer der Termin. Haken Sie ab, was erledigt ist. Der Stand bleibt nur in diesem Fenster und wird nirgends gespeichert."
          />

          {/* Gesamtfortschritt */}
          <Reveal className="w-full shrink-0 lg:w-80">
            <div className="glass rounded-card p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium text-mist-200">Erledigt</p>
                <p className="font-display text-2xl font-bold text-mist-50">
                  {count}
                  <span className="text-base font-medium text-mist-500"> / {total}</span>
                </p>
              </div>
              <div
                role="progressbar"
                aria-label="Fortschritt der Checkliste"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={count}
                className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/8"
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-signal-400"
                  initial={false}
                  animate={{ width: `${ratio * 100}%` }}
                  transition={{ type: "spring", stiffness: 140, damping: 24 }}
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={allDone ? "done" : "open"}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "flex items-center gap-2 text-xs",
                      allDone ? "text-signal-300" : "text-mist-400",
                    )}
                  >
                    {allDone ? (
                      <>
                        <PartyPopper aria-hidden="true" className="size-4" />
                        Alles vorbereitet
                      </>
                    ) : (
                      `${total - count} Punkte offen`
                    )}
                  </motion.p>
                </AnimatePresence>
                <button
                  type="button"
                  onClick={() => setDone(new Set())}
                  disabled={!count}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-pill px-2.5 py-1.5 text-xs font-medium text-mist-300 transition-colors duration-200 hover:bg-white/8 hover:text-mist-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RotateCcw aria-hidden="true" className="size-3.5" />
                  Zurücksetzen
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            const phaseDone = perPhase[index] === phase.items.length;
            return (
              <Reveal key={phase.id} delay={index * 0.06} className="h-full">
                <fieldset
                  className={cn(
                    "glass h-full rounded-card p-5 transition-[border-color] duration-500 sm:p-6",
                    phaseDone && "border-signal-400/40",
                  )}
                >
                  <legend className="sr-only">{phase.title}</legend>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-xl border transition-colors duration-500",
                        phaseDone
                          ? "border-signal-400/50 bg-signal-500/15 text-signal-300"
                          : "border-white/12 bg-white/5 text-brand-300",
                      )}
                    >
                      <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
                    </span>
                    <h3 aria-hidden="true" className="font-display text-lg">
                      {phase.title}
                    </h3>
                    <span
                      className={cn(
                        "ml-auto rounded-pill px-2.5 py-1 text-xs font-semibold transition-colors duration-500",
                        phaseDone ? "bg-signal-500/18 text-signal-300" : "bg-white/6 text-mist-400",
                      )}
                    >
                      {perPhase[index]} / {phase.items.length}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-col gap-2">
                    {phase.items.map((item) => {
                      const key = `${phase.id}:${item}`;
                      return (
                        <Checkbox
                          key={key}
                          checked={done.has(key)}
                          onChange={(checked) => toggle(key, checked)}
                          className="px-3.5 py-3"
                        >
                          <span className={cn(done.has(key) && "text-mist-400 line-through decoration-mist-500/60")}>
                            {item}
                          </span>
                        </Checkbox>
                      );
                    })}
                  </div>
                </fieldset>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
