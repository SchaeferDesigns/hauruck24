"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  ClipboardList,
  PackageCheck,
  PhoneCall,
  Truck,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { processSteps, type ProcessStep } from "@/content/process";
import { cn } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const icons: Record<ProcessStep["icon"], LucideIcon> = {
  call: PhoneCall,
  inspect: ClipboardList,
  calendar: CalendarCheck,
  done: PackageCheck,
};

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Ablauf als Scroll-Geschichte.
 * Links laeuft ein Panel mit Schrittnummer und Fortschritt mit,
 * rechts werden die Karten nacheinander aktiv. Ein kleiner Wagen
 * faehrt die Zeitleiste entlang.
 */
export default function ProcessSteps({
  detailed = false,
  title = "Vier Schritte, keine Überraschungen",
  lead = "Sie wissen vorher, wer kommt, wann es losgeht und was am Ende auf der Rechnung steht.",
}: {
  detailed?: boolean;
  title?: string;
  lead?: string;
}) {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 70%", "end 55%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const markerTop = useTransform(fill, [0, 1], ["0%", "100%"]);

  /* Aktiver Schritt: die Karte, die gerade durch die Bildmitte laeuft */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.step));
          }
        }
      },
      { rootMargin: "-42% 0px -52% 0px" },
    );

    list.querySelectorAll("[data-step]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const current = processSteps[active];

  return (
    <section id="ablauf" className="section-pad">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          {/* Mitlaufendes Panel */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading eyebrow="Ablauf" title={title} lead={lead} />

            <div className="mt-10 hidden lg:block" aria-hidden="true">
              <div className="flex items-end gap-3">
                <span className="relative block h-[5.5rem] w-[6.5rem] overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={active}
                      initial={reduce ? { opacity: 0 } : { y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="text-gradient absolute inset-0 font-display text-[5.5rem] leading-none font-extrabold"
                    >
                      {pad(active + 1)}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="pb-3 font-display text-lg text-mist-500">
                  / {pad(processSteps.length)}
                </span>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={current.title}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-3 font-display text-2xl text-mist-50"
                >
                  {current.title}
                </motion.p>
              </AnimatePresence>

              <div className="mt-6 grid grid-cols-4 gap-2">
                {processSteps.map((step, index) => (
                  <span key={step.title} className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.span
                      className="block h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-500"
                      initial={false}
                      animate={{ width: index <= active ? "100%" : "0%" }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                ))}
              </div>
            </div>

            <Link href="/angebot" className="btn btn-primary mt-9 hidden lg:inline-flex">
              Mit Schritt 1 starten
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          {/* Schritte mit Zeitleiste */}
          <ol ref={listRef} className="relative flex flex-col gap-5 pl-12 sm:pl-16">
            <div
              aria-hidden="true"
              className="absolute top-4 bottom-4 left-[1.1rem] w-px bg-white/10 sm:left-[1.6rem]"
            >
              <motion.div
                style={{ scaleY: reduce ? 1 : fill }}
                className="h-full w-full origin-top bg-gradient-to-b from-brand-400 via-brand-500 to-signal-400"
              />
              {!reduce ? (
                <motion.span
                  style={{ top: markerTop }}
                  className="absolute left-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brand-200/60 bg-gradient-to-br from-brand-300 to-brand-500 text-night-950 shadow-[0_8px_24px_-6px_rgb(255_149_34/0.8)]"
                >
                  <Truck className="size-4 rotate-90" strokeWidth={2.2} />
                </motion.span>
              ) : null}
            </div>

            {processSteps.map((step, index) => {
              const Icon = icons[step.icon];
              const isActive = index === active;
              const isDone = index < active;

              return (
                <li key={step.title} data-step={index} className="relative">
                  {/* Knoten auf der Zeitleiste */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-6 -left-12 grid size-9 place-items-center rounded-full border font-display text-xs font-bold transition-colors duration-400 sm:-left-16 sm:size-[3.25rem] sm:text-sm",
                      isActive || isDone
                        ? "border-brand-300/70 bg-night-900 text-brand-200"
                        : "border-white/15 bg-night-900 text-mist-400",
                    )}
                  >
                    {isDone ? <Check className="size-4" strokeWidth={2.6} /> : pad(index + 1)}
                  </span>

                  <Reveal>
                    <article
                      aria-current={isActive ? "step" : undefined}
                      className={cn(
                        "glass sheen relative rounded-card p-6 transition-[border-color,box-shadow,background-color] duration-500 sm:p-7",
                        isActive &&
                          "border-brand-400/45 bg-white/[0.075] shadow-[0_30px_80px_-34px_rgb(255_149_34/0.55)]",
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={cn(
                            "grid size-12 shrink-0 place-items-center rounded-2xl border transition-colors duration-500",
                            isActive
                              ? "border-brand-300/60 bg-gradient-to-br from-brand-300 to-brand-500 text-night-950"
                              : "border-white/12 bg-white/5 text-brand-300",
                          )}
                        >
                          <Icon aria-hidden="true" className="size-5" strokeWidth={1.9} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold tracking-[0.14em] text-brand-300 uppercase">
                            Schritt {index + 1}
                          </p>
                          <h3 className="mt-1 font-display text-xl">{step.title}</h3>
                        </div>
                        <span className="ml-auto hidden shrink-0 rounded-pill border border-white/12 bg-white/5 px-3 py-1 text-xs text-mist-300 sm:inline-block">
                          {step.detail}
                        </span>
                      </div>

                      <p className="mt-4 text-[0.975rem] leading-relaxed text-mist-300">{step.text}</p>

                      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                        <div className="surface rounded-2xl p-3.5">
                          <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-mist-400 uppercase">
                            <User aria-hidden="true" className="size-3.5 text-mist-300" />
                            Sie
                          </p>
                          <p className="mt-1.5 text-sm leading-relaxed text-mist-100">{step.you}</p>
                        </div>
                        <div className="rounded-2xl border border-brand-400/25 bg-brand-500/8 p-3.5">
                          <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-brand-300 uppercase">
                            <Users aria-hidden="true" className="size-3.5" />
                            Wir
                          </p>
                          <p className="mt-1.5 text-sm leading-relaxed text-mist-100">{step.we}</p>
                        </div>
                      </div>

                      {detailed ? (
                        <ul className="mt-5 flex flex-col gap-2.5 border-t border-white/10 pt-5">
                          {step.more.map((point) => (
                            <li key={point} className="flex gap-3 text-sm leading-relaxed text-mist-200">
                              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-signal-400" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      <p className="mt-4 text-xs text-mist-400 sm:hidden">{step.detail}</p>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-10 lg:hidden">
          <Link href="/angebot" className="btn btn-primary w-full sm:w-auto">
            Mit Schritt 1 starten
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
