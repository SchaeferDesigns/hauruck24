"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { CalendarCheck, ClipboardList, PackageCheck, PhoneCall } from "lucide-react";
import { useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    icon: PhoneCall,
    title: "Anfragen",
    text: "Kurz anrufen oder das Formular ausfüllen. Je genauer die Angaben, desto belastbarer die erste Einschätzung.",
    detail: "Dauer: wenige Minuten",
  },
  {
    icon: ClipboardList,
    title: "Ansehen und Angebot",
    text: "Bei größeren Aufträgen kommen wir vorbei und schauen uns alles an. Danach wissen Sie, was die Sache kostet.",
    detail: "Vor Ort oder nach Fotos",
  },
  {
    icon: CalendarCheck,
    title: "Termin fixieren",
    text: "Wunschtermin bestätigen, offene Punkte klären, Zugang und Parkmöglichkeit besprechen.",
    detail: "Montag bis Samstag möglich",
  },
  {
    icon: PackageCheck,
    title: "Wir packen an",
    text: "Wir tragen, fahren, räumen und entsorgen. Am Ende gehen wir gemeinsam durch und Sie geben Ihr Okay.",
    detail: "Abnahme gemeinsam",
  },
];

export default function ProcessSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 28 });
  const lineScale = useTransform(smooth, [0, 1], [0, 1]);

  return (
    <section id="ablauf" className="section-pad">
      <div className="container-page">
        <SectionHeading
          eyebrow="Ablauf"
          title="Vier Schritte, keine Überraschungen"
          lead="Sie wissen vorher, wer kommt, wann es losgeht und was am Ende auf der Rechnung steht."
          className="mb-16"
        />

        <div ref={ref} className="relative">
          {/* Fortschrittslinie, waechst beim Scrollen mit */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[1.65rem] w-px bg-white/10 lg:top-[3.25rem] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-full"
          >
            <motion.div
              style={reduce ? { scaleY: 1, scaleX: 1 } : { scaleY: lineScale }}
              className="h-full w-full origin-top bg-gradient-to-b from-brand-400 to-signal-400 lg:hidden"
            />
            <motion.div
              style={reduce ? { scaleX: 1 } : { scaleX: lineScale }}
              className="hidden h-full w-full origin-left bg-gradient-to-r from-brand-400 to-signal-400 lg:block"
            />
          </div>

          <ol className="relative flex flex-col gap-8 lg:grid lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => (
              <motion.li
                key={step.title}
                initial={reduce ? false : { opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex gap-5 lg:flex-col lg:gap-0"
              >
                <div className="relative z-1 shrink-0">
                  <span className="glass-strong grid size-14 place-items-center rounded-2xl text-brand-300">
                    <step.icon aria-hidden="true" className="size-6" strokeWidth={1.7} />
                  </span>
                  <span className="absolute -top-1.5 -right-1.5 grid size-6 place-items-center rounded-full bg-brand-400 font-display text-xs font-bold text-night-950">
                    {index + 1}
                  </span>
                </div>

                <div className="lg:mt-6">
                  <h3 className="font-display text-lg">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist-300">{step.text}</p>
                  <p className="mt-3 text-xs font-medium tracking-wide text-brand-300 uppercase">
                    {step.detail}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
