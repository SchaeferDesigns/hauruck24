"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  Archive,
  ArrowRight,
  Armchair,
  BedDouble,
  Bike,
  DoorClosed,
  LibraryBig,
  Minus,
  Monitor,
  Package,
  Plus,
  Refrigerator,
  RotateCcw,
  Sofa,
  Utensils,
  WashingMachine,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  loadItems,
  loadLabel,
  TRUCK_CAPACITY,
  type LoadItem,
  type LoadItemIcon,
} from "@/content/loadItems";
import { cn } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import TruckIllustration from "@/components/ui/TruckIllustration";

const icons: Record<LoadItemIcon, LucideIcon> = {
  sofa: Sofa,
  armchair: Armchair,
  bed: BedDouble,
  wardrobe: DoorClosed,
  dresser: Archive,
  table: Utensils,
  desk: Monitor,
  shelf: LibraryBig,
  washer: WashingMachine,
  fridge: Refrigerator,
  bike: Bike,
  boxes: Package,
};

const chipWidth: Record<LoadItem["size"], string> = {
  1: "w-8 sm:w-10",
  2: "w-11 sm:w-14",
  3: "w-14 sm:w-[4.6rem]",
};

const WHEEL_CIRCUMFERENCE = 2 * Math.PI * 19;

/** Text fuer Liste und Anfrage, zum Beispiel "2 Betten" oder "15 Kartons" */
function describe(item: LoadItem, count: number) {
  if (count === 1) return item.label;
  return `${count} ${item.plural}`;
}

/**
 * Interaktiver Laderaum: Gegenstaende antippen, sie landen im Wagen.
 * Die Liste wird auf Wunsch direkt ins Anfrageformular uebernommen.
 */
export default function TruckLoader({
  withHeading = true,
  service = "umzug",
}: {
  withHeading?: boolean;
  service?: string;
}) {
  const router = useRouter();
  const reduce = useReducedMotion();

  const [counts, setCounts] = useState<Record<string, number>>({});
  /* Reihenfolge des Einladens, damit der Stapel logisch waechst */
  const [order, setOrder] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const [leaving, setLeaving] = useState(false);

  const truckY = useMotionValue(0);
  const truckX = useMotionValue(0);
  const wheelRotate = useTransform(truckX, (x) => (x / WHEEL_CIRCUMFERENCE) * 360);

  const loaded = useMemo(
    () =>
      order
        .map((id) => loadItems.find((item) => item.id === id))
        .filter((item): item is LoadItem => Boolean(item && counts[item.id])),
    [order, counts],
  );

  const units = loaded.reduce((sum, item) => sum + item.units * (counts[item.id] ?? 0), 0);
  const ratio = units / TRUCK_CAPACITY;
  const pieces = loaded.reduce((sum, item) => sum + (counts[item.id] ?? 0), 0);
  const summary = loaded.map((item) => describe(item, counts[item.id] ?? 0)).join(", ");
  const href = `/angebot?leistung=${service}${summary ? `&liste=${encodeURIComponent(summary)}` : ""}`;

  const bump = () => {
    if (reduce) return;
    animate(truckY, [0, 3.5, -1, 0], { duration: 0.45, ease: "easeOut" });
  };

  const add = (item: LoadItem) => {
    const current = counts[item.id] ?? 0;
    if (current >= item.max) {
      setAnnouncement(`${item.plural}: Höchstmenge erreicht.`);
      return;
    }
    const next = Math.min(current + item.step, item.max);
    setCounts((value) => ({ ...value, [item.id]: next }));
    setOrder((value) => (value.includes(item.id) ? value : [...value, item.id]));
    setAnnouncement(`${describe(item, next)} im Wagen.`);
    bump();
  };

  const remove = (item: LoadItem) => {
    const current = counts[item.id] ?? 0;
    const next = Math.max(current - item.step, 0);
    setCounts((value) => ({ ...value, [item.id]: next }));
    if (next === 0) setOrder((value) => value.filter((id) => id !== item.id));
    setAnnouncement(next ? `${describe(item, next)} im Wagen.` : `${item.label} ausgeladen.`);
  };

  const reset = () => {
    setCounts({});
    setOrder([]);
    setAnnouncement("Wagen ausgeladen.");
  };

  /* Der Wagen faehrt los, danach geht es mit der Liste zum Formular */
  const depart = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduce || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    setLeaving(true);
    await animate(truckX, 900, { duration: 0.75, ease: [0.55, 0, 0.8, 0.4] });
    router.push(href);
  };

  const meterColor =
    ratio > 1 ? "from-brand-500 to-red-400" : "from-brand-400 via-brand-500 to-signal-400";

  return (
    <section className="section-pad">
      <div className="container-page">
        {withHeading ? (
          <SectionHeading
            eyebrow="Zum Ausprobieren"
            title="Packen Sie den Wagen"
            lead="Tippen Sie an, was mitkommen soll. Der Wagen zeigt grob, wie voll es wird, und die Liste nehmen Sie direkt mit in Ihre Anfrage."
            className="mb-12"
          />
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          {/* Buehne mit Wagen */}
          <Reveal className="h-full">
            <div className="glass-strong relative flex h-full flex-col overflow-hidden rounded-card p-5 sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-20 size-72 rounded-full bg-brand-500/14 blur-[90px]"
              />

              <div className="relative flex items-center justify-between gap-3">
                <p className="text-xs font-semibold tracking-[0.16em] text-brand-300 uppercase">
                  Ladefläche
                </p>
                <p className="text-xs text-mist-400">
                  {pieces === 0 ? "leer" : pieces === 1 ? "1 Teil" : `${pieces} Teile`}
                </p>
              </div>

              {/* Strasse und Wagen */}
              <div className="relative mt-6 flex-1">
                <div className="relative mx-auto w-full max-w-[36rem] pt-4 pb-3">
                  <motion.div style={{ x: truckX, y: truckY }} className="relative">
                    <TruckIllustration
                      cargoOpen
                      lettering={false}
                      wheelRotate={wheelRotate}
                      className="w-full"
                    />

                    {/* Laderaum, deckungsgleich mit der Zeichnung */}
                    <div
                      aria-hidden="true"
                      className="absolute overflow-hidden"
                      style={{ left: "5%", top: "17.3%", width: "57.5%", height: "46.7%" }}
                    >
                      <div className="flex h-full flex-wrap-reverse content-start gap-1 sm:gap-1.5">
                        <AnimatePresence>
                          {loaded.map((item) => {
                            const Icon = icons[item.icon];
                            const count = counts[item.id] ?? 0;
                            return (
                              <motion.span
                                key={item.id}
                                layout={!reduce}
                                initial={
                                  reduce
                                    ? { opacity: 0 }
                                    : { y: -54, opacity: 0, rotate: -10, scale: 0.8 }
                                }
                                animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
                                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: -10 }}
                                transition={{ type: "spring", stiffness: 520, damping: 24 }}
                                className={cn(
                                  "relative grid h-8 place-items-center rounded-lg border border-brand-400/45 bg-gradient-to-b from-brand-400/35 to-brand-600/25 text-brand-100 sm:h-10",
                                  chipWidth[item.size],
                                )}
                              >
                                <Icon className="size-4 text-brand-100 sm:size-5" strokeWidth={1.9} />
                                {count > 1 ? (
                                  <motion.span
                                    key={count}
                                    initial={reduce ? false : { scale: 1.5 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1.5 -right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-mist-50 px-1 text-[0.6rem] leading-none font-bold text-night-950"
                                  >
                                    {count}
                                  </motion.span>
                                ) : null}
                              </motion.span>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Fahrbahn */}
                <div aria-hidden="true" className="h-px w-full bg-white/12" />
                <div
                  aria-hidden="true"
                  className="mt-2 h-px w-full bg-[repeating-linear-gradient(90deg,rgba(255,180,84,0.45)_0_22px,transparent_22px_44px)]"
                />
              </div>

              {/* Fuellanzeige */}
              <div className="relative mt-7">
                <div
                  role="meter"
                  aria-label="Füllung des Wagens, grobe Orientierung"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.min(100, Math.round(ratio * 100))}
                  aria-valuetext={loadLabel(ratio)}
                  className="h-3 overflow-hidden rounded-full border border-white/12 bg-white/6"
                >
                  <motion.div
                    className={cn("h-full rounded-full bg-gradient-to-r", meterColor)}
                    initial={false}
                    animate={{ width: `${Math.min(100, ratio * 100)}%` }}
                    transition={{ type: "spring", stiffness: 140, damping: 22 }}
                  />
                </div>
                <p className="mt-3 min-h-[2.75rem] text-sm leading-relaxed text-mist-200">
                  {loadLabel(ratio)}
                </p>
                <p className="text-xs text-mist-500">
                  Grobe Orientierung. Den tatsächlichen Umfang klären wir gemeinsam.
                </p>
              </div>

              {/* Liste als Text, fuer alle lesbar */}
              <div className="relative mt-5 min-h-[3.25rem] rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-mist-300">
                {summary ? (
                  <>
                    <span className="font-semibold text-mist-100">Im Wagen: </span>
                    {summary}
                  </>
                ) : (
                  "Die Ladeliste erscheint hier, sobald Sie etwas auswählen."
                )}
              </div>

              <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={href}
                  onClick={depart}
                  aria-disabled={leaving}
                  className="btn btn-primary sm:flex-1"
                >
                  {pieces ? "Mit dieser Liste anfragen" : "Ohne Liste anfragen"}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <button
                  type="button"
                  onClick={reset}
                  disabled={!pieces}
                  className="btn btn-ghost disabled:opacity-45"
                >
                  <RotateCcw aria-hidden="true" className="size-4" />
                  Ausladen
                </button>
              </div>
            </div>
          </Reveal>

          {/* Auswahl */}
          <Reveal delay={0.08} className="h-full">
            <div className="glass flex h-full flex-col rounded-card p-5 sm:p-6">
              <h3 className="font-display text-lg">Was soll mit?</h3>
              <p className="mt-1.5 text-sm text-mist-400">
                Antippen fügt hinzu, das Minus nimmt wieder heraus.
              </p>

              <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {loadItems.map((item) => {
                  const Icon = icons[item.icon];
                  const count = counts[item.id] ?? 0;
                  const full = count >= item.max;
                  return (
                    <li key={item.id} className="relative">
                      <button
                        type="button"
                        onClick={() => add(item)}
                        aria-label={
                          item.step > 1
                            ? `${item.step} ${item.plural} hinzufügen`
                            : `${item.label} hinzufügen`
                        }
                        aria-disabled={full}
                        className={cn(
                          "flex min-h-[5.25rem] w-full cursor-pointer flex-col items-start justify-between gap-2 rounded-2xl border p-3 text-left transition-[background-color,border-color,translate] duration-250 hover:-translate-y-0.5",
                          count
                            ? "border-brand-400/50 bg-brand-500/14"
                            : "surface hover:border-white/22 hover:bg-white/8",
                          full && "opacity-70",
                        )}
                      >
                        <span className="flex w-full items-center justify-between">
                          <Icon
                            aria-hidden="true"
                            className={cn("size-5", count ? "text-brand-300" : "text-mist-300")}
                            strokeWidth={1.8}
                          />
                          {!count ? (
                            <Plus aria-hidden="true" className="size-4 text-mist-500" />
                          ) : null}
                        </span>
                        <span className="text-sm leading-tight font-medium text-mist-100">
                          {item.step > 1 ? `${item.step} ${item.plural}` : item.label}
                        </span>
                      </button>

                      {count ? (
                        <span className="absolute top-2 right-2 flex items-center gap-1">
                          <span className="grid h-7 min-w-7 place-items-center rounded-full bg-brand-400 px-1.5 text-xs font-bold text-night-950">
                            {count}
                          </span>
                          <button
                            type="button"
                            onClick={() => remove(item)}
                            aria-label={
                              item.step > 1
                                ? `${item.step} ${item.plural} entfernen`
                                : `${item.label} entfernen`
                            }
                            className="grid size-7 cursor-pointer place-items-center rounded-full border border-white/20 bg-night-800/80 text-mist-100 transition-colors duration-200 hover:bg-night-700"
                          >
                            <Minus aria-hidden="true" className="size-3.5" />
                          </button>
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>

              <p aria-live="polite" className="sr-only">
                {announcement}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
