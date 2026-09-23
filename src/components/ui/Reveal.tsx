"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

/**
 * Einblenden beim Scrollen.
 *
 * Animiert wird bewusst das direkte Kind, nicht dieser Wrapper.
 * Traegt das Kind den Glaseffekt, blendet es sich selbst ein und behaelt
 * dabei seinen Blur. Ein ausblendender Vorfahre wuerde den Blur brechen.
 * Die Regeln stehen in globals.css unter "Einblenden".
 */
export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  as?: "div" | "li" | "section" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-reveal={direction}
      data-shown={shown ? "" : undefined}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  );
}
