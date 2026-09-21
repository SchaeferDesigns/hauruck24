"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export type AccordionItem = { q: string; a: string };

/**
 * Barrierefreies Akkordeon mit echter Aufklapp-Animation (Hoehe + Deckkraft).
 * Bedienbar mit Tastatur, Zustand ueber aria-expanded und aria-controls verknuepft.
 */
export default function Accordion({
  items,
  className,
  defaultOpen = null,
}: {
  items: AccordionItem[];
  className?: string;
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();
  const reduce = useReducedMotion();

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;

        return (
          <div
            key={item.q}
            className={cn(
              "glass overflow-hidden rounded-2xl transition-colors duration-300",
              isOpen && "border-brand-400/35 bg-white/[0.085]",
            )}
          >
            <h3 className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
              >
                <span className="font-display text-base font-semibold text-mist-50 sm:text-lg">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen && "rotate-135 border-brand-400/50 bg-brand-500/20",
                  )}
                >
                  <Plus className="size-4 text-brand-300" strokeWidth={2.4} />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  key="content"
                  initial={reduce ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? { height: "auto", opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.26, ease: "easeOut" },
                  }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-6 text-[0.975rem] leading-relaxed text-mist-300 sm:px-6 sm:text-base">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
