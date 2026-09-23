"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  House,
  LayoutGrid,
  ListChecks,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { nav, site } from "@/content/site";
import { services } from "@/content/services";
import { useHasHover, useScrollLock } from "@/lib/hooks";
import { cn, telHref } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { PhoneAction } from "@/components/ui/ContactAction";

const navIcons: Record<string, LucideIcon> = {
  "/": House,
  "/leistungen": LayoutGrid,
  "/ablauf": ListChecks,
  "/einsatzgebiet": MapPin,
  "/ueber-uns": Users,
  "/kontakt": MessageCircle,
};

const serviceFor = (href: string) =>
  services.find((service) => `/leistungen/${service.slug}` === href);

/* Verzoegerungen fuer das Aufklappmenue. Das Schliessen wartet kurz,
   damit der Weg von der Schaltflaeche zur Liste nicht abreisst. */
const OPEN_DELAY = 60;
const CLOSE_DELAY = 280;

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

const spring = { type: "spring", stiffness: 380, damping: 32 } as const;

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
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const menuId = useId();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.3 });

  useScrollLock(menuOpen);

  /* Kompaktzustand beim Scrollen */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Beim Seitenwechsel alles schliessen, Leistungen auf Leistungsseiten offen lassen */
  useEffect(() => {
    setMenuOpen(false);
    setOpenGroup(null);
    setMobileGroup(pathname.startsWith("/leistungen") ? "Leistungen" : null);
  }, [pathname]);

  useEffect(
    () => () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
    },
    [],
  );

  const openSoon = (label: string) => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setOpenGroup(label), OPEN_DELAY);
  };

  const closeSoon = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenGroup(null), CLOSE_DELAY);
  };

  /* Escape schliesst Untermenue oder mobiles Menue */
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

  /* Fokus ins mobile Panel setzen */
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
        {/* Lesbarkeit sichern, wenn Inhalt unter der Leiste liegt */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-night-950/75 to-transparent transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />

        <div className="container-page pointer-events-auto relative">
          {/* Die Pill selbst traegt keinen Blur. Das Glas liegt als eigene Ebene
              dahinter, so koennen Aufklappliste und Buttons eigenen Blur nutzen. */}
          <div
            className={cn(
              "relative z-10 mt-3 flex items-center gap-3 rounded-pill transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:mt-4",
              scrolled ? "px-3 py-2 sm:px-4" : "px-3.5 py-2.5 sm:px-5 sm:py-3",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "glass-strong pointer-events-none absolute inset-0 -z-1 rounded-pill transition-[background-color] duration-500",
                scrolled && "bg-white/[0.09]",
              )}
            />

            <Link
              href="/"
              aria-label={`${site.shortName}, zur Startseite`}
              className="flex shrink-0 items-center rounded-pill px-1 py-1"
            >
              <Logo compact={scrolled} />
            </Link>

            {/* Desktop-Navigation */}
            <nav aria-label="Hauptnavigation" className="ml-auto hidden lg:block">
              <ul className="flex items-center gap-0.5">
                {nav.map((item) => {
                  const active = isActive(item.href);

                  if (!item.children) {
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "relative z-0 flex h-10 items-center rounded-pill px-3.5 text-sm font-medium transition-colors duration-300",
                            active
                              ? "text-night-950"
                              : "text-mist-200 hover:bg-white/7 hover:text-mist-50",
                          )}
                        >
                          {active ? (
                            <motion.span
                              layoutId="nav-active"
                              aria-hidden="true"
                              className="absolute inset-0 -z-1 rounded-pill bg-brand-400"
                              transition={reduce ? { duration: 0 } : spring}
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
                      ref={groupRef}
                      className="relative"
                      onMouseEnter={hasHover ? () => openSoon(item.label) : undefined}
                      onMouseLeave={hasHover ? closeSoon : undefined}
                      onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                          setOpenGroup(null);
                        }
                      }}
                    >
                      <button
                        ref={toggleRef}
                        type="button"
                        aria-expanded={open}
                        aria-controls={`${menuId}-group`}
                        onClick={() => setOpenGroup(open ? null : item.label)}
                        onKeyDown={(event) => {
                          if (event.key === "ArrowDown") {
                            event.preventDefault();
                            setOpenGroup(item.label);
                            requestAnimationFrame(() => firstItemRef.current?.focus());
                          }
                        }}
                        className={cn(
                          "relative z-0 flex h-10 cursor-pointer items-center gap-1.5 rounded-pill px-3.5 text-sm font-medium transition-colors duration-300",
                          active
                            ? "text-night-950"
                            : open
                              ? "bg-white/9 text-mist-50"
                              : "text-mist-200 hover:bg-white/7 hover:text-mist-50",
                        )}
                      >
                        {active ? (
                          <motion.span
                            layoutId="nav-active"
                            aria-hidden="true"
                            className="absolute inset-0 -z-1 rounded-pill bg-brand-400"
                            transition={reduce ? { duration: 0 } : spring}
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
                          /* Aeusserer Rahmen mit Innenabstand oben: unsichtbare Bruecke
                             zwischen Schaltflaeche und Liste, der Hover reisst nicht ab. */
                          <div
                            id={`${menuId}-group`}
                            className="absolute top-full left-1/2 w-[36rem] -translate-x-1/2 pt-3.5"
                          >
                            <motion.div
                              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.985 }}
                              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                              style={{ transformOrigin: "top center" }}
                              className="glass-strong rounded-[1.75rem] p-2.5"
                            >
                              <div className="flex items-center justify-between px-3 pt-2 pb-3">
                                <span className="text-xs font-semibold tracking-[0.16em] text-brand-300 uppercase">
                                  Leistungen
                                </span>
                                <Link
                                  href={item.href}
                                  className="group/all inline-flex items-center gap-1.5 text-xs font-medium text-mist-300 transition-colors duration-200 hover:text-mist-50"
                                >
                                  Alle ansehen
                                  <ArrowRight
                                    aria-hidden="true"
                                    className="size-3.5 transition-transform duration-300 group-hover/all:translate-x-0.5"
                                  />
                                </Link>
                              </div>

                              <ul className="grid grid-cols-2 gap-1.5">
                                {item.children.map((child, index) => {
                                  const service = serviceFor(child.href);
                                  const childActive = isActive(child.href);
                                  return (
                                    <li key={child.href}>
                                      <Link
                                        ref={index === 0 ? firstItemRef : undefined}
                                        href={child.href}
                                        aria-current={childActive ? "page" : undefined}
                                        className={cn(
                                          "group/item flex h-full gap-3 rounded-2xl border p-3 transition-colors duration-200",
                                          childActive
                                            ? "border-brand-400/35 bg-brand-500/10"
                                            : "border-transparent hover:border-white/12 hover:bg-white/7",
                                        )}
                                      >
                                        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/6 text-brand-300 transition-colors duration-200 group-hover/item:border-brand-400/40 group-hover/item:bg-brand-500/15">
                                          {service ? (
                                            <ServiceIcon name={service.icon} className="size-[1.15rem]" />
                                          ) : null}
                                        </span>
                                        <span className="min-w-0">
                                          <span className="block text-sm font-semibold text-mist-50">
                                            {child.label}
                                          </span>
                                          <span className="mt-0.5 block text-xs leading-snug text-mist-400">
                                            {child.description}
                                          </span>
                                        </span>
                                      </Link>
                                    </li>
                                  );
                                })}

                                <li>
                                  <Link
                                    href="/angebot"
                                    className="group/cta flex h-full flex-col justify-between gap-2 rounded-2xl border border-brand-400/30 bg-gradient-to-br from-brand-500/20 to-brand-600/5 p-3.5 transition-colors duration-200 hover:border-brand-400/55"
                                  >
                                    <span className="text-sm font-semibold text-mist-50">
                                      Nicht sicher, was passt?
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-300">
                                      Situation schildern
                                      <ArrowRight
                                        aria-hidden="true"
                                        className="size-3.5 transition-transform duration-300 group-hover/cta:translate-x-1"
                                      />
                                    </span>
                                  </Link>
                                </li>
                              </ul>
                            </motion.div>
                          </div>
                        ) : null}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="ml-auto flex items-center gap-2 lg:ml-2">
              <PhoneAction className="btn btn-ghost hidden h-11 min-h-11 px-4 py-0 text-sm md:inline-flex">
                <Phone aria-hidden="true" className="size-4" />
                <span className="hidden xl:inline">{site.contact.phoneDisplay}</span>
                <span className="xl:hidden">Anrufen</span>
              </PhoneAction>

              <Link
                href="/angebot"
                className="btn btn-primary hidden h-11 min-h-11 px-5 py-0 text-sm sm:inline-flex"
              >
                Angebot anfragen
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                aria-expanded={menuOpen}
                aria-controls={menuId}
                aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
                className="tap-target grid size-11 cursor-pointer place-items-center rounded-pill border border-white/14 bg-white/6 text-mist-50 lg:hidden"
              >
                <Menu aria-hidden="true" className="size-5" />
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

      {/* Mobiles Menue. Der aeussere Rahmen blendet nicht, sonst braeche der Blur
          des Panels. Hintergrund und Panel animieren sich jeweils selbst. */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div key="mobile-menu" className="fixed inset-0 z-95 lg:hidden" initial={false}>
            <motion.button
              type="button"
              tabIndex={-1}
              aria-label="Menü schließen"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 cursor-default bg-night-950/55 backdrop-blur-lg"
            />

            <motion.div
              id={menuId}
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.985 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "top center" }}
              className="glass-strong absolute inset-x-3 top-3 max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain rounded-[2rem] p-3 pb-5 outline-none"
            >
              <div className="flex items-center justify-between px-2 pt-1 pb-3">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Menü schließen"
                  className="tap-target grid size-11 cursor-pointer place-items-center rounded-pill border border-white/14 bg-white/6"
                >
                  <X aria-hidden="true" className="size-5" />
                </button>
              </div>

              <nav aria-label="Navigation mobil">
                <ul className="flex flex-col gap-1">
                  {nav.map((item, index) => {
                    const active = isActive(item.href);
                    const groupOpen = mobileGroup === item.label;
                    const Icon = navIcons[item.href] ?? House;

                    return (
                      <motion.li
                        key={item.href}
                        initial={reduce ? false : { opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.06 + index * 0.035, duration: 0.3 }}
                      >
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex min-h-13 flex-1 items-center gap-3 rounded-2xl px-3 text-base font-semibold transition-colors duration-200",
                              active ? "bg-brand-400 text-night-950" : "text-mist-100",
                            )}
                          >
                            <span
                              className={cn(
                                "grid size-9 shrink-0 place-items-center rounded-xl border",
                                active
                                  ? "border-night-950/15 bg-night-950/10"
                                  : "border-white/10 bg-white/5 text-brand-300",
                              )}
                            >
                              <Icon aria-hidden="true" className="size-[1.05rem]" />
                            </span>
                            {item.label}
                          </Link>

                          {item.children ? (
                            <button
                              type="button"
                              aria-expanded={groupOpen}
                              aria-controls={`${menuId}-mobile-group`}
                              aria-label={
                                groupOpen
                                  ? `Untermenü ${item.label} schließen`
                                  : `Untermenü ${item.label} öffnen`
                              }
                              onClick={() => setMobileGroup(groupOpen ? null : item.label)}
                              className={cn(
                                "tap-target grid size-13 shrink-0 cursor-pointer place-items-center rounded-2xl border transition-colors duration-200",
                                groupOpen
                                  ? "border-brand-400/40 bg-brand-500/15"
                                  : "border-white/12 bg-white/5",
                              )}
                            >
                              <ChevronDown
                                aria-hidden="true"
                                className={cn(
                                  "size-5 text-mist-100 transition-transform duration-300",
                                  groupOpen && "rotate-180",
                                )}
                              />
                            </button>
                          ) : null}
                        </div>

                        <AnimatePresence initial={false}>
                          {item.children && groupOpen ? (
                            <motion.div
                              id={`${menuId}-mobile-group`}
                              initial={reduce ? { height: "auto" } : { height: 0 }}
                              animate={{ height: "auto" }}
                              exit={reduce ? { height: "auto" } : { height: 0 }}
                              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <ul className="grid grid-cols-2 gap-2 px-1 pt-2 pb-2">
                                {item.children.map((child, childIndex) => {
                                  const service = serviceFor(child.href);
                                  const childActive = isActive(child.href);
                                  return (
                                    <motion.li
                                      key={child.href}
                                      initial={reduce ? false : { opacity: 0, y: 8 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.05 + childIndex * 0.04, duration: 0.28 }}
                                    >
                                      <Link
                                        href={child.href}
                                        aria-current={childActive ? "page" : undefined}
                                        className={cn(
                                          "flex h-full min-h-[5.5rem] flex-col justify-between gap-2 rounded-2xl border p-3",
                                          childActive
                                            ? "border-brand-400/45 bg-brand-500/14"
                                            : "surface",
                                        )}
                                      >
                                        <span className="grid size-8 place-items-center rounded-lg border border-white/12 bg-white/6 text-brand-300">
                                          {service ? (
                                            <ServiceIcon name={service.icon} className="size-4" />
                                          ) : null}
                                        </span>
                                        <span>
                                          <span className="block text-sm leading-tight font-semibold text-mist-50">
                                            {child.label}
                                          </span>
                                          {service ? (
                                            <span className="mt-0.5 block text-[0.72rem] leading-snug text-mist-400">
                                              {service.hook}
                                            </span>
                                          ) : null}
                                        </span>
                                      </Link>
                                    </motion.li>
                                  );
                                })}

                                <motion.li
                                  initial={reduce ? false : { opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.05 + item.children.length * 0.04, duration: 0.28 }}
                                >
                                  <Link
                                    href={item.href}
                                    className="flex h-full min-h-[5.5rem] flex-col justify-between gap-2 rounded-2xl border border-brand-400/30 bg-gradient-to-br from-brand-500/20 to-brand-600/5 p-3"
                                  >
                                    <span className="grid size-8 place-items-center rounded-lg bg-brand-400 text-night-950">
                                      <ArrowRight aria-hidden="true" className="size-4" />
                                    </span>
                                    <span className="text-sm leading-tight font-semibold text-mist-50">
                                      Alle Leistungen
                                    </span>
                                  </Link>
                                </motion.li>
                              </ul>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-4 flex flex-col gap-2 border-t border-white/10 px-1 pt-4">
                <Link href="/angebot" className="btn btn-primary w-full">
                  Angebot anfragen
                </Link>
                <a href={telHref(site.contact.phoneHref)} className="btn btn-ghost w-full">
                  <Phone aria-hidden="true" className="size-4" />
                  {site.contact.phoneDisplay}
                </a>
              </div>

              <p className="mt-4 px-2 text-xs leading-relaxed text-mist-400">
                {site.openingHours[0].days}: {site.openingHours[0].time}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
