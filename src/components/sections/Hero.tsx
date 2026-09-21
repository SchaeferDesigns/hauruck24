"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, Clock, MapPin, Phone, ShieldCheck, Truck } from "lucide-react";
import { useCallback, useRef } from "react";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { telHref } from "@/lib/utils";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { SceneBoxes, SceneHills, SceneRoute, SceneTown } from "./HeroScene";

const trust = [
  { icon: Clock, label: "Mo bis Sa, 07:30 bis 18:30 Uhr" },
  { icon: MapPin, label: "Regional in Schwäbisch Gmünd" },
  { icon: Truck, label: "Eigenes Fahrzeug, eigene Leute" },
  { icon: ShieldCheck, label: "Angebot kostenlos und unverbindlich" },
];

/** Drei Einstiege, damit Besucher sich sofort selbst einordnen. */
const quickPicks = services.slice(0, 3);

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  /* Scroll-Parallax: jede Ebene bewegt sich anders schnell */
  const yTown = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const yHills = useTransform(scrollYProgress, [0, 1], ["0%", "48%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scaleGlow = useTransform(scrollYProgress, [0, 1], [1, 1.3]);

  /* Zeiger-Parallax fuer die Bildebene, nur bei feinem Zeiger sinnvoll */
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltX = useSpring(pointerX, { stiffness: 90, damping: 20 });
  const tiltY = useSpring(pointerY, { stiffness: 90, damping: 20 });
  const sceneX = useTransform(tiltX, [-0.5, 0.5], ["-16px", "16px"]);
  const sceneY = useTransform(tiltY, [-0.5, 0.5], ["-12px", "12px"]);
  const boxesX = useTransform(tiltX, [-0.5, 0.5], ["26px", "-26px"]);
  const boxesY = useTransform(tiltY, [-0.5, 0.5], ["18px", "-18px"]);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType !== "mouse" || reduce) return;
      const rect = event.currentTarget.getBoundingClientRect();
      pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
      pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [pointerX, pointerY, reduce],
  );

  const onPointerLeave = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  return (
    <section
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-labelledby="hero-title"
      className="relative -mt-24 flex min-h-[calc(100dvh-2rem)] items-center overflow-hidden pt-32 pb-20 sm:-mt-28 sm:pt-40 lg:min-h-[46rem]"
    >
      {/* Ebene 1, Lichtschein */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { scale: scaleGlow }}
        className="pointer-events-none absolute top-[-12%] left-1/2 -z-1 size-[46rem] -translate-x-1/2 rounded-full bg-brand-500/14 blur-[120px]"
      />

      {/* Ebene 2, ferne Huegel */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: yHills }}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-1"
      >
        <SceneHills className="h-40 w-full opacity-70 sm:h-56" />
      </motion.div>

      {/* Ebene 3, Stadtsilhouette */}
      <motion.div
        aria-hidden="true"
        style={reduce ? undefined : { y: yTown }}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-1"
      >
        <SceneTown className="h-32 w-full opacity-90 sm:h-44" />
      </motion.div>

      <motion.div
        style={reduce ? undefined : { y: yContent, opacity: opacityContent }}
        className="container-page relative w-full"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Textspalte */}
          <div>
            <motion.span
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="glass inline-flex items-center gap-2 rounded-pill px-4 py-2 text-xs font-semibold tracking-[0.14em] text-brand-300 uppercase"
            >
              <MapPin aria-hidden="true" className="size-3.5" />
              {site.address.district}, {site.address.city}
            </motion.span>

            <motion.h1
              id="hero-title"
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-display text-4xl leading-[1.04] sm:text-5xl lg:text-[3.9rem]"
            >
              Umzug und Entrümpelung
              <span className="block text-gradient">in Schwäbisch Gmünd</span>
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-xl text-base leading-relaxed text-mist-200 sm:text-lg"
            >
              Wir tragen, fahren, räumen und entsorgen. Sie sagen uns, was weg soll und wann.
              Alles andere übernehmen wir, von der ersten Kiste bis zur besenreinen Übergabe.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link href="/angebot" className="btn btn-primary">
                Angebot anfragen
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>

              <a href={telHref(site.contact.phoneHref)} className="btn btn-ghost">
                <Phone aria-hidden="true" className="size-4" />
                {site.contact.phoneDisplay}
              </a>
            </motion.div>

            <motion.ul
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.36 }}
              className="mt-10 grid gap-x-6 gap-y-3 sm:grid-cols-2"
            >
              {trust.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm text-mist-300">
                  <item.icon aria-hidden="true" className="size-4 shrink-0 text-brand-400" />
                  {item.label}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Bildspalte mit schnellen Einstiegen */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 26 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div
              aria-hidden="true"
              style={reduce ? undefined : { x: sceneX, y: sceneY }}
              className="pointer-events-none absolute -top-16 -right-6 hidden w-[24rem] opacity-80 sm:block"
            >
              <SceneRoute className="w-full" />
            </motion.div>

            <motion.div
              aria-hidden="true"
              style={reduce ? undefined : { x: boxesX, y: boxesY }}
              className="pointer-events-none absolute -bottom-16 -left-10 hidden w-56 opacity-70 lg:block"
            >
              <SceneBoxes className="w-full animate-float" />
            </motion.div>

            <div className="glass-strong relative rounded-[2rem] p-5 sm:p-7">
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
                      className="card-hover group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/4 p-4"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-brand-400/25 bg-brand-500/12 text-brand-300">
                        <ServiceIcon name={service.icon} className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-base font-semibold text-mist-50">
                          {service.label}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-mist-400">
                          {service.lead}
                        </span>
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 shrink-0 text-mist-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-300"
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href="/leistungen"
                className="link-underline mt-5 inline-flex items-center gap-1.5 text-sm font-medium"
              >
                Alle Leistungen ansehen
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scrollhinweis */}
      <motion.div
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <span className="flex h-11 w-7 items-start justify-center rounded-pill border border-white/15 p-1.5">
          <motion.span
            animate={reduce ? undefined : { y: [0, 12, 0], opacity: [1, 0.35, 1] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
            className="size-1.5 rounded-full bg-brand-400"
          />
        </span>
      </motion.div>
    </section>
  );
}
