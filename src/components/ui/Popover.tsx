"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { useMediaQuery, useScrollLock } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Placement = "bottom-start" | "bottom-end" | "bottom-center";

type Position = {
  top: number;
  left: number;
  width?: number;
  maxHeight: number;
  above: boolean;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Schwebendes Panel am Ausloeser.
 *
 * Wird per Portal direkt in body gerendert. Damit liegt es ausserhalb jeder
 * Glaskarte und sein eigener Blur sieht die echte Seite dahinter.
 * Auf kleinen Displays wird es auf Wunsch zum Bottom Sheet.
 */
export default function Popover({
  open,
  onClose,
  anchorRef,
  children,
  placement = "bottom-start",
  offset = 10,
  matchWidth = false,
  minWidth = 0,
  className,
  role = "dialog",
  id,
  ariaLabel,
  ariaLabelledBy,
  sheetOnMobile = false,
  sheetTitle,
  focusOnOpen = true,
  initialFocusRef,
}: {
  open: boolean;
  onClose: (reason: "escape" | "outside" | "close") => void;
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  placement?: Placement;
  offset?: number;
  matchWidth?: boolean;
  minWidth?: number;
  className?: string;
  role?: "dialog" | "listbox" | "menu" | "none";
  id?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  sheetOnMobile?: boolean;
  sheetTitle?: string;
  focusOnOpen?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
}) {
  const reduce = useReducedMotion();
  const isSmall = useMediaQuery("(max-width: 639px)");
  const asSheet = sheetOnMobile && isSmall;

  const panelRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => setMounted(true), []);
  useScrollLock(open && asSheet);

  /* Position am Ausloeser berechnen, bei Platzmangel nach oben klappen */
  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return;

    const rect = anchor.getBoundingClientRect();
    const margin = 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const width = matchWidth ? Math.max(rect.width, minWidth) : panel.offsetWidth;
    const height = panel.scrollHeight;

    let left =
      placement === "bottom-end"
        ? rect.right - width
        : placement === "bottom-center"
          ? rect.left + rect.width / 2 - width / 2
          : rect.left;
    left = Math.min(Math.max(margin, left), viewportWidth - width - margin);

    const spaceBelow = viewportHeight - rect.bottom - offset - margin;
    const spaceAbove = rect.top - offset - margin;
    const above = height > spaceBelow && spaceAbove > spaceBelow;
    const maxHeight = Math.max(180, above ? spaceAbove : spaceBelow);
    const top = above ? rect.top - offset - Math.min(height, maxHeight) : rect.bottom + offset;

    setPosition({ top, left, width: matchWidth ? width : undefined, maxHeight, above });
  }, [anchorRef, matchWidth, minWidth, offset, placement]);

  useLayoutEffect(() => {
    if (!open || asSheet) return;
    updatePosition();

    const onChange = () => updatePosition();
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, true);

    const observer = new ResizeObserver(onChange);
    if (panelRef.current) observer.observe(panelRef.current);

    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("scroll", onChange, true);
      observer.disconnect();
    };
  }, [open, asSheet, updatePosition]);

  useEffect(() => {
    if (!open) setPosition(null);
  }, [open]);

  /* Escape und Klick ausserhalb */
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose("escape");
        anchorRef.current?.focus();
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onClose("outside");
    };

    window.addEventListener("keydown", onKey, true);
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [open, onClose, anchorRef]);

  /* Fokus ins Panel setzen */
  useEffect(() => {
    if (!open || !focusOnOpen) return;
    const frame = requestAnimationFrame(() => {
      const target =
        initialFocusRef?.current ||
        panelRef.current?.querySelector<HTMLElement>(FOCUSABLE) ||
        panelRef.current;
      target?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [open, focusOnOpen, initialFocusRef]);

  if (!mounted) return null;

  const panelRole = role === "none" ? undefined : role;

  return createPortal(
    <AnimatePresence>
      {open ? (
        asSheet ? (
          <motion.div key="sheet" className="fixed inset-0 z-[130]" initial={false}>
            <motion.button
              type="button"
              aria-label="Schließen"
              tabIndex={-1}
              onClick={() => onClose("outside")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-0 cursor-default bg-night-950/55 backdrop-blur-md"
            />
            <motion.div
              ref={panelRef}
              id={id}
              role={panelRole}
              aria-modal={panelRole === "dialog" ? true : undefined}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy}
              tabIndex={-1}
              initial={reduce ? { opacity: 0 } : { y: "100%" }}
              animate={reduce ? { opacity: 1 } : { y: 0 }}
              exit={reduce ? { opacity: 0 } : { y: "100%" }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong absolute inset-x-0 bottom-0 max-h-[82dvh] overflow-y-auto overscroll-contain rounded-t-[1.75rem] px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] outline-none"
            >
              <div aria-hidden="true" className="mx-auto mb-3 h-1.5 w-11 rounded-full bg-white/25" />
              {sheetTitle ? (
                <div className="mb-3 flex items-center justify-between gap-3 px-1">
                  <p className="font-display text-base font-semibold text-mist-50">{sheetTitle}</p>
                  <button
                    type="button"
                    onClick={() => onClose("close")}
                    aria-label="Schließen"
                    className="tap-target grid size-10 cursor-pointer place-items-center rounded-full border border-white/14 bg-white/6"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                </div>
              ) : null}
              {children}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="popover"
            ref={panelRef}
            id={id}
            role={panelRole}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            tabIndex={-1}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: position ? 1 : 0, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              top: position?.top ?? -9999,
              left: position?.left ?? -9999,
              width: position?.width,
              maxHeight: position?.maxHeight,
              transformOrigin: position?.above ? "bottom center" : "top center",
            }}
            className={cn(
              "glass-strong fixed z-[130] overflow-y-auto overscroll-contain rounded-3xl outline-none",
              className,
            )}
          >
            {children}
          </motion.div>
        )
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
