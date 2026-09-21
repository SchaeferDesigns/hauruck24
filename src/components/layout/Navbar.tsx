"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { nav, site } from "@/content/site";
import { cn, telHref } from "@/lib/utils";
import Logo from "@/components/ui/Logo";

function useIsActive() {
  const pathname = usePathname();
  return useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );
}

/** Erkennt einen echten Zeiger. Auf Touch bleiben Hover-Effekte aus. */
function useHasHover() {
  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHasHover(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return hasHover;
}

export default function Navbar() {
  const pathname = usePathname();
  const isActive = useIsActive();
  const hasHover = useHasHover();
  const reduce = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);

  const groupRef = useRef<HTMLLIElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.3 });

  /* Kompaktzustand beim Scrollen */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Menue beim Seitenwechsel schliessen */
  useEffect(() => {
    setMenuOpen(false);
    setOpenGroup(null);
    setMobileGroup(null);
  }, [pathname]);

  /* Scrollsperre, solange das mobile Menue offen ist.
     position fixed statt overflow hidden, weil iOS sonst weiterscrollt. */
  useEffect(() => {
    if (!menuOpen) return;

    const body = document.body;
    const scrollY = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };

    body.dataset.scrollLocked = "true";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      delete body.dataset.scrollLocked;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

  /* Escape schliesst Menue und Untermenue */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openGroup) {
        setOpenGroup(null);
        toggleRef.current?.focus();
        return;
      }
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, openGroup]);

  /* Klick ausserhalb schliesst das Untermenue */
  useEffect(() => {
    if (!openGroup) return;
    const onPointerDown = (event: PointerEvent) => {
      if (groupRef.current && !groupRef.current.contains(event.target as Node)) {
        setOpenGroup(null);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [openGroup]);

  /* Fokus ins mobile Panel setzen, damit die Tastatur dort weiterarbeitet */
  useEffect(() => {
    if (menuOpen) panelRef.current?.focus();
  }, [menuOpen]);

  return (
    <>
      <a
        href="#inhalt"
        className="sr-only-focusable fixed top-3 left-1/2 z-100 -translate-x-1/2 rounded-pill bg-brand-500 px-5 py-2.5 text-sm font-semibold text-night-950"
      >
        Zum Inhalt springen
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-90">
        {/* Lesbarkeit sichern, auch wenn heller Inhalt unter der Leiste liegt */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-night-950/80 to-transparent transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />

        <div className="container-page pointer-events-auto relative">
          <div
            className={cn(
              "glass-strong mt-3 flex items-center gap-3 rounded-pill transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:mt-4",
              scrolled ? "px-3 py-2 sm:px-4" : "px-3.5 py-2.5 sm:px-5 sm:py-3",
            )}
          >
            <Link
              href="/"
              aria-label={`${site.shortName}, zur Startseite`}
              className="flex shrink-0 items-center rounded-pill px-1 py-1"
            >
              <Logo compact={scrolled} />
            </Link>

            {/* Desktop-Navigation */}
            <nav aria-label="Hauptnavigation" className="ml-auto hidden lg:block">
              <ul className="flex items-center gap-1">
                {nav.map((item) => {
                  const active = isActive(item.href);

                  if (!item.children) {
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "relative flex h-10 items-center rounded-pill px-3.5 text-sm font-medium transition-colors duration-300",
                            active ? "text-night-950" : "text-mist-200 hover:text-mist-50",
                          )}
                        >
                          {active ? (
                            <motion.span
                              layoutId="nav-active"
                              aria-hidden="true"
                              className="absolute inset-0 -z-1 rounded-pill bg-brand-400"
                              transition={
                                reduce
                                  ? { duration: 0 }
                                  : { type: "spring", stiffness: 380, damping: 32 }
                              }
                            />
                          ) : null}
                          {item.label}
                        </Link>
                      </li>
                    );
                  }

                  const open = openGroup === item.label;

                  return (
                    <li
                      key={item.href}
                      ref={open ? groupRef : null}
                      className="relative"
                      onMouseEnter={hasHover ? () => setOpenGroup(item.label) : undefined}
                      onMouseLeave={hasHover ? () => setOpenGroup(null) : undefined}
                    >
                      <button
                        ref={open ? toggleRef : null}
                        type="button"
                        aria-expanded={open}
                        aria-haspopup="true"
                        aria-controls={`${menuId}-${item.label}`}
                        onClick={() => setOpenGroup(open ? null : item.label)}
                        className={cn(
                          "relative flex h-10 items-center gap-1.5 rounded-pill px-3.5 text-sm font-medium transition-colors duration-300",
                          active ? "text-night-950" : "text-mist-200 hover:text-mist-50",
                        )}
                      >
                        {active ? (
                          <motion.span
                            layoutId="nav-active"
                            aria-hidden="true"
                            className="absolute inset-0 -z-1 rounded-pill bg-brand-400"
                            transition={
                              reduce
                                ? { duration: 0 }
                                : { type: "spring", stiffness: 380, damping: 32 }
                            }
                          />
                        ) : null}
                        {item.label}
                        <ChevronDown
                          aria-hidden="true"
                          className={cn(
                            "size-4 transition-transform duration-300",
                            open && "rotate-180",
                          )}
                        />
                      </button>

                      <AnimatePresence>
                        {open ? (
                          <motion.div
                            id={`${menuId}-${item.label}`}
                            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                            className="glass-strong absolute top-[calc(100%+0.75rem)] left-1/2 w-80 -translate-x-1/2 rounded-3xl p-2"
                          >
                            <Link
                              href={item.href}
                              className="flex items-center justify-between rounded-2xl px-4 py-2.5 text-xs font-semibold tracking-[0.14em] text-brand-300 uppercase transition-colors duration-200 hover:bg-white/8"
                            >
                              Alle Leistungen
                            </Link>
                            <ul className="mt-1 flex flex-col">
                              {item.children.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    aria-current={isActive(child.href) ? "page" : undefined}
                                    className={cn(
                                      "block rounded-2xl px-4 py-3 transition-colors duration-200 hover:bg-white/8",
                                      isActive(child.href) && "bg-white/8",
                                    )}
                                  >
                                    <span className="block text-sm font-semibold text-mist-50">
                                      {child.label}
                                    </span>
                                    <span className="mt-0.5 block text-xs leading-snug text-mist-400">
                                      {child.description}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="ml-auto flex items-center gap-2 lg:ml-2">
              <a
                href={telHref(site.contact.phoneHref)}
                className="btn btn-ghost hidden h-11 min-h-11 px-4 py-0 text-sm md:inline-flex"
              >
                <Phone aria-hidden="true" className="size-4" />
                <span className="hidden xl:inline">{site.contact.phoneDisplay}</span>
                <span className="xl:hidden">Anrufen</span>
              </a>

              <Link href="/angebot" className="btn btn-primary hidden h-11 min-h-11 px-5 py-0 text-sm sm:inline-flex">
                Angebot anfragen
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                aria-expanded={menuOpen}
                aria-controls={menuId}
                aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
                className="tap-target grid size-11 place-items-center rounded-pill border border-white/14 bg-white/6 text-mist-50 lg:hidden"
              >
                <AnimatePresence initial={false} mode="wait">
                  {menuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <X aria-hidden="true" className="size-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="open"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Menu aria-hidden="true" className="size-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Lesefortschritt der aktuellen Seite */}
          <motion.div
            aria-hidden="true"
            style={{ scaleX: progress }}
            className="mx-auto mt-1.5 h-0.5 w-[92%] origin-left rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-signal-400 opacity-70"
          />
        </div>
      </header>

      {/* Mobiles Menue */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-95 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              aria-label="Menü schließen"
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-night-950/70 backdrop-blur-xl"
            />

            <motion.div
              id={menuId}
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              initial={reduce ? { opacity: 0 } : { y: "-8%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { y: "-6%", opacity: 0 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong absolute inset-x-3 top-3 max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain rounded-[2rem] p-4 pb-6"
            >
              <div className="flex items-center justify-between px-1 pb-3">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Menü schließen"
                  className="tap-target grid size-11 place-items-center rounded-pill border border-white/14 bg-white/6"
                >
                  <X aria-hidden="true" className="size-5" />
                </button>
              </div>

              <nav aria-label="Navigation mobil">
                <ul className="flex flex-col gap-1">
                  {nav.map((item, index) => {
                    const active = isActive(item.href);
                    const groupOpen = mobileGroup === item.label;

                    return (
                      <motion.li
                        key={item.href}
                        initial={reduce ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 + index * 0.035, duration: 0.3 }}
                      >
                        <div className="flex items-center gap-2">
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex min-h-13 flex-1 items-center rounded-2xl px-4 text-base font-semibold transition-colors duration-200",
                              active ? "bg-brand-400 text-night-950" : "text-mist-100",
                            )}
                          >
                            {item.label}
                          </Link>

                          {item.children ? (
                            <button
                              type="button"
                              aria-expanded={groupOpen}
                              aria-label={
                                groupOpen
                                  ? `Untermenü ${item.label} schließen`
                                  : `Untermenü ${item.label} öffnen`
                              }
                              onClick={() => setMobileGroup(groupOpen ? null : item.label)}
                              className="tap-target grid size-12 place-items-center rounded-2xl border border-white/12 bg-white/5"
                            >
                              <ChevronDown
                                aria-hidden="true"
                                className={cn(
                                  "size-5 text-mist-200 transition-transform duration-300",
                                  groupOpen && "rotate-180",
                                )}
                              />
                            </button>
                          ) : null}
                        </div>

                        <AnimatePresence initial={false}>
                          {item.children && groupOpen ? (
                            <motion.ul
                              initial={reduce ? { height: "auto" } : { height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden pl-3"
                            >
                              {item.children.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    aria-current={isActive(child.href) ? "page" : undefined}
                                    className={cn(
                                      "mt-1 flex min-h-12 items-center rounded-xl border-l-2 border-white/10 px-4 text-sm text-mist-200",
                                      isActive(child.href) &&
                                        "border-brand-400 bg-white/6 text-mist-50",
                                    )}
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          ) : null}
                        </AnimatePresence>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-5 flex flex-col gap-2">
                <Link href="/angebot" className="btn btn-primary w-full">
                  Angebot anfragen
                </Link>
                <a href={telHref(site.contact.phoneHref)} className="btn btn-ghost w-full">
                  <Phone aria-hidden="true" className="size-4" />
                  {site.contact.phoneDisplay}
                </a>
              </div>

              <p className="mt-4 px-1 text-xs leading-relaxed text-mist-400">
                {site.openingHours[0].days}: {site.openingHours[0].time}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
