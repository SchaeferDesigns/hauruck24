"use client";

import Link from "next/link";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowRight, Clock, MapPin, Phone, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import { services } from "@/content/services";
import { site } from "@/content/site";
import ServiceIcon from "@/components/ui/ServiceIcon";
import TruckIllustration from "@/components/ui/TruckIllustration";
import { PhoneAction } from "@/components/ui/ContactAction";
import { SceneHills, SceneTown } from "./HeroScene";

const trust = [
  { icon: Clock, label: "Mo bis Sa, 07:30 bis 18:30 Uhr" },
  { icon: MapPin, label: "Regional in Schwäbisch Gmünd" },
  { icon: Truck, label: "Eigenes Fahrzeug, eigene Leute" },
  { icon: ShieldCheck, label: "Angebot kostenlos und unverbindlich" },
];

/** Drei Einstiege, damit Besucher sich sofort selbst einordnen. */
const quickPicks = services.slice(0, 3);

/** Radumfang in Pixeln der Zeichnung, fuer die passende Raddrehung */
const WHEEL_CIRCUMFERENCE = 2 * Math.PI * 19;

const delay = (seconds: number) => ({ "--enter-delay": `${seconds}s` }) as CSSProperties;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  /* Scroll-Parallax: jede Ebene laeuft mit eigener Geschwindigkeit.
     Glasflaechen bekommen nur Bewegung, nie Deckkraft auf einem Vorfahren. */
  const yGlow = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scaleGlow = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const yHills = useTransform(scrollYProgress, [0, 1], ["0%", "46%"]);
  const yTown = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const fadeText = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const yCard = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  /* Der Wagen faehrt beim Laden ein und beim Scrollen weiter */
  const driveIn = useMotionValue(reduce ? 0 : -520);
  const driveScroll = useTransform(scrollYProgress, [0, 0.9], [0, 760]);
  const truckX = useTransform(() => driveIn.get() + driveScroll.get());
  const wheelRotate = useTransform(truckX, (x) => (x / WHEEL_CIRCUMFERENCE) * 360);
  const bob = useMotionValue(0);

  useEffect(() => {
    if (reduce) {
      driveIn.set(0);
      return;
    }
    const drive = animate(driveIn, 0, { duration: 2.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] });
    /* Leichtes Federn des Aufbaus im Stand */
    const idle = animate(bob, [0, -1.6, 0], {
      duration: 1.8,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2.9,
    });
    return () => {
      drive.stop();
      idle.stop();
    };
  }, [driveIn, bob, reduce]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative -mt-24 flex min-h-[calc(100dvh-2rem)] items-center overflow-hidden pt-32 pb-36 sm:-mt-28 sm:pt-40 sm:pb-44 lg:min-h-[48rem]"
    >
      {/* Ebene 1, Lichtschein */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: yGlow, scale: scaleGlow }}
        className="pointer-events-none absolute top-[-14%] left-1/2 -z-1 size-[46rem] -translate-x-1/2 rounded-full bg-brand-500/14 blur-[120px]"
      />

      {/* Ebene 2, ferne Huegel */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: yHills }}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-1"
      >
        <SceneHills className="h-44 w-full opacity-70 sm:h-60" />
      </motion.div>

      {/* Ebene 3, Stadt, Strasse und Wagen */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: yTown }}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-1"
      >
        <SceneTown className="h-36 w-full opacity-95 sm:h-48" />

        {/* Strasse */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-night-900/0 via-night-950/85 to-night-950 sm:h-16" />
        <div className="absolute inset-x-0 bottom-7 h-px bg-[repeating-linear-gradient(90deg,rgba(255,180,84,0.4)_0_26px,transparent_26px_52px)] sm:bottom-8" />

        {/* Umzugswagen */}
        <motion.div
          style={{ x: truckX, y: bob }}
          className="absolute bottom-6 left-[6%] w-44 sm:bottom-7 sm:left-[8%] sm:w-64"
        >
          <TruckIllustration wheelRotate={wheelRotate} className="w-full" />
        </motion.div>
      </motion.div>

      <div className="container-page relative w-full">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Textspalte: darf ausblenden, sie enthaelt kein Glas */}
          <motion.div style={reduce ? undefined : { y: yText, opacity: fadeText }}>
            <span
              style={delay(0)}
              className="enter surface inline-flex items-center gap-2 rounded-pill px-4 py-2 text-xs font-semibold tracking-[0.14em] text-brand-300 uppercase"
            >
              <MapPin aria-hidden="true" className="size-3.5" />
              {site.address.district}, {site.address.city}
            </span>

            <h1
              id="hero-title"
              style={delay(0.08)}
              className="enter mt-6 font-display text-[2.6rem] leading-[1.05] sm:text-5xl lg:text-[3.4rem] xl:text-[3.75rem]"
            >
              Umzug und Entrümpelung
              <span className="block text-gradient">in Schwäbisch Gmünd</span>
            </h1>

            <p
              style={delay(0.16)}
              className="enter mt-6 max-w-xl text-base leading-relaxed text-mist-200 sm:text-lg"
            >
              Wir tragen, fahren, räumen und entsorgen. Sie sagen uns, was weg soll und wann.
              Alles andere übernehmen wir, von der ersten Kiste bis zur besenreinen Übergabe.
            </p>

            <div
              style={delay(0.24)}
              className="enter mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link href="/angebot" className="btn btn-primary">
                Angebot anfragen
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>

              <PhoneAction className="btn btn-ghost">
                <Phone aria-hidden="true" className="size-4" />
                {site.contact.phoneDisplay}
              </PhoneAction>
            </div>

            <ul style={delay(0.34)} className="enter mt-10 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {trust.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm text-mist-300">
                  <item.icon aria-hidden="true" className="size-4 shrink-0 text-brand-400" />
                  {item.label}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Kartenspalte: nur Bewegung, das Glas blendet sich selbst ein */}
          <motion.div style={reduce ? undefined : { y: yCard }}>
            <div
              style={delay(0.2)}
              className="enter glass-strong sheen relative rounded-[2rem] p-5 sm:p-7"
            >
              <p className="font-display text-sm font-semibold tracking-[0.14em] text-brand-300 uppercase">
                Worum geht es?
              </p>
              <p className="mt-2 text-sm text-mist-300">
                Wählen Sie Ihr Anliegen, wir zeigen Ihnen direkt den passenden Ablauf.
              </p>

              <ul className="mt-5 flex flex-col gap-2.5">
                {quickPicks.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/leistungen/${service.slug}`}
                      className="surface group relative z-1 flex items-center gap-4 rounded-2xl p-4 transition-[background-color,border-color,translate] duration-300 hover:-translate-y-0.5 hover:border-brand-400/35 hover:bg-white/9"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-brand-400/25 bg-brand-500/12 text-brand-300 transition-colors duration-300 group-hover:bg-brand-500/22">
                        <ServiceIcon name={service.icon} className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-base font-semibold text-mist-50">
                          {service.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-mist-400">{service.hook}</span>
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 shrink-0 text-mist-400 transition-[translate,color] duration-300 group-hover:translate-x-1 group-hover:text-brand-300"
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href="/leistungen"
                className="link-underline relative z-1 mt-5 inline-flex items-center gap-1.5 text-sm font-medium"
              >
                Alle Leistungen ansehen
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
