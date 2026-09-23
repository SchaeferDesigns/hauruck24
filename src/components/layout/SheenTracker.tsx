"use client";

import { useEffect } from "react";

/**
 * Ein einziger Listener fuer alle Glaskarten mit der Klasse "sheen".
 * Er setzt die Zeigerposition als CSS-Variablen, das Licht selbst
 * zeichnet das Stylesheet. Nur bei echtem Zeiger aktiv.
 */
export default function SheenTracker() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let lastEvent: PointerEvent | null = null;

    const update = () => {
      frame = 0;
      const event = lastEvent;
      if (!event) return;
      const target = (event.target as Element | null)?.closest?.(".sheen") as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      target.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      lastEvent = event;
      if (!frame) frame = requestAnimationFrame(update);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
