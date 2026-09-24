"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Popover from "@/components/ui/Popover";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const WEEKDAYS_LONG = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const MONTHS = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

/* Datum immer lokal behandeln, nie ueber UTC, sonst verrutscht der Tag */
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const toIso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const fromIso = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
};
const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const sameDay = (a: Date, b: Date) => toIso(a) === toIso(b);
/** Montag = 0 */
const weekdayIndex = (date: Date) => (date.getDay() + 6) % 7;

export function formatDateLong(value: string) {
  const date = fromIso(value);
  if (!date) return "";
  return `${WEEKDAYS_LONG[weekdayIndex(date)]}, ${date.getDate()}. ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Eigener Kalender statt des Browser-Datumsfelds.
 * Vergangene Tage und Sonntage (Ruhetag) sind nicht waehlbar.
 * Tastatur: Pfeiltasten, Bild auf und ab fuer Monate, Pos1 und Ende fuer die Woche.
 */
export default function DatePicker({
  id,
  label,
  value,
  onChange,
  disableSundays = true,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disableSundays?: boolean;
}) {
  const reduce = useReducedMotion();
  const autoId = useId();
  const baseId = id ?? autoId;
  const labelId = `${baseId}-label`;
  const gridLabelId = `${baseId}-month`;

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const today = useMemo(() => startOfDay(new Date()), []);
  const selected = fromIso(value);

  const [open, setOpen] = useState(false);
  const [focusDate, setFocusDate] = useState<Date>(selected ?? today);
  const [direction, setDirection] = useState(0);

  const viewYear = focusDate.getFullYear();
  const viewMonth = focusDate.getMonth();

  const isDisabled = (date: Date) =>
    date < today || (disableSundays && date.getDay() === 0);

  /* Sechs Wochen, beginnend mit dem Montag vor dem Monatsersten */
  const days = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const start = addDays(first, -weekdayIndex(first));
    return Array.from({ length: 42 }, (_, index) => addDays(start, index));
  }, [viewYear, viewMonth]);

  const canGoBack = new Date(viewYear, viewMonth, 1) > new Date(today.getFullYear(), today.getMonth(), 1);

  const moveFocus = (next: Date) => {
    if (next < today) next = today;
    if (next.getMonth() !== focusDate.getMonth() || next.getFullYear() !== focusDate.getFullYear()) {
      setDirection(next > focusDate ? 1 : -1);
    }
    setFocusDate(next);
  };

  const changeMonth = (delta: number) => {
    const target = new Date(viewYear, viewMonth + delta, 1);
    const day = Math.min(focusDate.getDate(), new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate());
    moveFocus(new Date(target.getFullYear(), target.getMonth(), day));
  };

  /* Fokus auf den aktiven Tag legen, sobald das Raster sichtbar ist */
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      gridRef.current
        ?.querySelector<HTMLButtonElement>(`[data-iso="${toIso(focusDate)}"]`)
        ?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [open, focusDate]);

  const openCalendar = () => {
    setFocusDate(selected && selected >= today ? selected : today);
    setDirection(0);
    setOpen(true);
  };

  const choose = (date: Date) => {
    if (isDisabled(date)) return;
    onChange(toIso(date));
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onGridKeyDown = (event: React.KeyboardEvent) => {
    const map: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focusDate, -1),
      ArrowRight: () => addDays(focusDate, 1),
      ArrowUp: () => addDays(focusDate, -7),
      ArrowDown: () => addDays(focusDate, 7),
      Home: () => addDays(focusDate, -weekdayIndex(focusDate)),
      End: () => addDays(focusDate, 6 - weekdayIndex(focusDate)),
      PageUp: () => new Date(viewYear, viewMonth - 1, Math.min(focusDate.getDate(), 28)),
      PageDown: () => new Date(viewYear, viewMonth + 1, Math.min(focusDate.getDate(), 28)),
    };

    if (map[event.key]) {
      event.preventDefault();
      moveFocus(map[event.key]());
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(focusDate);
    }
  };

  return (
    <div>
      <span id={labelId} className="mb-2 block text-sm font-medium text-mist-200">
        {label}
      </span>

      <div className="relative">
        <button
          ref={buttonRef}
          id={baseId}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-labelledby={`${labelId} ${baseId}`}
          onClick={() => (open ? setOpen(false) : openCalendar())}
          className={cn(
            "flex w-full cursor-pointer items-center gap-3 rounded-2xl border bg-white/5 py-3.5 pr-12 pl-4 text-left text-[0.975rem] transition-colors duration-200",
            open ? "border-brand-400/60 bg-white/8" : "border-white/12 hover:border-white/24",
          )}
        >
          <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-brand-300" />
          <span className={cn("truncate", value ? "text-mist-50" : "text-mist-500")}>
            {value ? formatDateLong(value) : "Datum wählen"}
          </span>
        </button>

        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Datum entfernen"
            className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-xl text-mist-400 transition-colors duration-200 hover:bg-white/8 hover:text-mist-100"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        ) : null}
      </div>

      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={buttonRef}
        role="dialog"
        ariaLabel="Wunschtermin wählen"
        focusOnOpen={false}
        sheetOnMobile
        sheetTitle="Wunschtermin"
        className="w-[21rem] p-4"
      >
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            disabled={!canGoBack}
            aria-label="Vorheriger Monat"
            className="grid size-10 cursor-pointer place-items-center rounded-xl border border-white/12 bg-white/5 text-mist-100 transition-colors duration-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </button>

          <p id={gridLabelId} aria-live="polite" className="font-display text-base font-semibold text-mist-50">
            {MONTHS[viewMonth]} {viewYear}
          </p>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Nächster Monat"
            className="grid size-10 cursor-pointer place-items-center rounded-xl border border-white/12 bg-white/5 text-mist-100 transition-colors duration-200 hover:bg-white/10"
          >
            <ChevronRight aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div
          ref={gridRef}
          role="grid"
          aria-labelledby={gridLabelId}
          onKeyDown={onGridKeyDown}
          className="mt-4 overflow-hidden"
        >
          <div role="row" className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((day, index) => (
              <span
                key={day}
                role="columnheader"
                aria-label={WEEKDAYS_LONG[index]}
                className={cn(
                  "grid h-8 place-items-center text-xs font-semibold",
                  index === 6 ? "text-mist-500" : "text-mist-400",
                )}
              >
                {day}
              </span>
            ))}
          </div>

          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={`${viewYear}-${viewMonth}`}
              custom={direction}
              initial={reduce ? { opacity: 0 } : { x: direction * 36, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { x: direction * -36, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-1 grid grid-cols-7 gap-1"
            >
              {days.map((date) => {
                const iso = toIso(date);
                const outside = date.getMonth() !== viewMonth;
                const disabled = isDisabled(date);
                const isSelected = selected ? sameDay(date, selected) : false;
                const isToday = sameDay(date, today);
                const isFocus = sameDay(date, focusDate);

                return (
                  <button
                    key={iso}
                    type="button"
                    role="gridcell"
                    data-iso={iso}
                    tabIndex={isFocus ? 0 : -1}
                    aria-selected={isSelected}
                    aria-disabled={disabled || undefined}
                    aria-label={`${formatDateLong(iso)}${disabled ? ", nicht wählbar" : ""}`}
                    onClick={() => choose(date)}
                    onFocus={() => !isFocus && setFocusDate(date)}
                    className={cn(
                      "relative grid aspect-square place-items-center rounded-xl text-sm transition-colors duration-150",
                      disabled
                        ? "cursor-not-allowed text-mist-500/60"
                        : "cursor-pointer text-mist-100 hover:bg-white/10",
                      outside && !disabled && "text-mist-400",
                      isSelected &&
                        "bg-gradient-to-br from-brand-300 to-brand-500 font-semibold text-night-950 hover:bg-brand-400",
                      isToday && !isSelected && "ring-1 ring-brand-400/60 ring-inset",
                    )}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3.5">
          <p className="text-xs text-mist-400">Sonntags geschlossen</p>
          <button
            type="button"
            onClick={() => (isDisabled(today) ? moveFocus(addDays(today, 1)) : choose(today))}
            className="cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold text-brand-300 transition-colors duration-200 hover:bg-white/8"
          >
            {isDisabled(today) ? "Ab morgen" : "Heute"}
          </button>
        </div>
      </Popover>
    </div>
  );
}
