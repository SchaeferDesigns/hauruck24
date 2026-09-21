"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Parallax-Ebene. speed > 0 laeuft langsamer als der Scroll (tiefe Ebene),
 * speed < 0 laeuft schneller (nahe Ebene).
 * Ohne Bewegungswunsch des Nutzers wird nichts verschoben.
 */
export default function Parallax({
  children,
  speed = 0.2,
  className,
  scaleTo,
  fade = false,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  scaleTo?: number;
  fade?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.35 });
  const y = useTransform(smooth, [0, 1], [`${speed * -100}px`, `${speed * 100}px`]);
  const scale = useTransform(smooth, [0, 0.5, 1], [1, scaleTo ?? 1, 1]);
  const opacity = useTransform(smooth, [0, 0.25, 0.75, 1], [0.35, 1, 1, 0.35]);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{
          y,
          ...(scaleTo ? { scale } : {}),
          ...(fade ? { opacity } : {}),
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
