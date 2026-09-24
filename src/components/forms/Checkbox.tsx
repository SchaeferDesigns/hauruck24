"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Eigene Checkbox mit gezeichnetem Haken.
 * Darunter liegt ein echtes, unsichtbares input, damit Tastatur,
 * Screenreader und Formularlogik wie gewohnt funktionieren.
 */
export default function Checkbox({
  checked,
  onChange,
  children,
  description,
  id,
  name,
  required = false,
  invalid = false,
  variant = "card",
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  description?: ReactNode;
  id?: string;
  name?: string;
  required?: boolean;
  invalid?: boolean;
  /** card: eigene Flaeche mit Rahmen, plain: nur Box und Text */
  variant?: "card" | "plain";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const autoId = useId();
  const inputId = id ?? autoId;
  const descriptionId = description ? `${inputId}-description` : undefined;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "group flex cursor-pointer items-start gap-3 select-none",
        variant === "card" &&
          "rounded-2xl border p-4 transition-colors duration-250",
        variant === "card" &&
          (checked
            ? "border-brand-400/45 bg-brand-500/10"
            : invalid
              ? "border-red-400/45 bg-red-500/8"
              : "border-white/12 bg-white/4 hover:border-white/22 hover:bg-white/6"),
        className,
      )}
    >
      <input
        id={inputId}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={descriptionId}
        className="peer sr-only"
      />

      <span
        aria-hidden="true"
        className={cn(
          "relative mt-0.5 grid size-[1.375rem] shrink-0 place-items-center rounded-[0.45rem] border-[1.5px] transition-[background-color,border-color,box-shadow,scale] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "peer-focus-visible:shadow-[0_0_0_3px_#04070d,0_0_0_5.5px_var(--color-brand-400)]",
          "group-active:scale-90",
          checked
            ? "border-brand-400 bg-gradient-to-br from-brand-300 to-brand-500 shadow-[0_6px_18px_-6px_rgb(255_149_34/0.7)]"
            : invalid
              ? "border-red-300/80 bg-white/5"
              : "border-white/35 bg-white/5 group-hover:border-white/55",
        )}
      >
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
          <motion.path
            d="M3.2 8.6 6.4 11.6 12.8 4.6"
            stroke="#1f1206"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-sm leading-relaxed transition-colors duration-200",
            checked ? "text-mist-50" : "text-mist-200",
          )}
        >
          {children}
        </span>
        {description ? (
          <span id={descriptionId} className="mt-1 block text-xs leading-relaxed text-mist-400">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
