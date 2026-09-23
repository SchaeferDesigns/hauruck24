"use client";

import { useEffect, useState } from "react";

/** Reagiert auf eine Media Query, serverseitig immer false. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** Echter Zeiger mit Hover, also Maus oder Trackpad. */
export function useHasHover() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/* Mehrere Ebenen koennen gleichzeitig sperren, entsperrt wird erst,
   wenn die letzte Ebene schliesst. */
let lockCount = 0;
let savedScrollY = 0;

/**
 * Sperrt das Scrollen der Seite.
 * position fixed statt overflow hidden, weil iOS sonst trotzdem scrollt.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const body = document.body;

    if (lockCount === 0) {
      savedScrollY = window.scrollY;
      body.dataset.scrollLocked = "true";
      body.style.position = "fixed";
      body.style.top = `-${savedScrollY}px`;
      body.style.width = "100%";
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount > 0) return;

      delete body.dataset.scrollLocked;
      body.style.position = "";
      body.style.top = "";
      body.style.width = "";

      // Sanftes Scrollen kurz aussetzen, sonst springt die Seite sichtbar zurueck
      const html = document.documentElement;
      const previous = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, savedScrollY);
      html.style.scrollBehavior = previous;
    };
  }, [active]);
}
