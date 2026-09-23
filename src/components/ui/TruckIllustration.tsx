"use client";

import { motion, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Koffer-LKW in Seitenansicht, gezeichnet in den Markenfarben.
 * Die Raeder koennen ueber einen MotionValue gedreht werden,
 * damit sie zur gefahrenen Strecke passen.
 *
 * viewBox 0 0 320 150. Der Laderaum liegt bei x 10 bis 206, y 20 bis 108.
 */
export default function TruckIllustration({
  wheelRotate,
  className,
  lettering = true,
  cargoOpen = false,
}: {
  wheelRotate?: MotionValue<number>;
  className?: string;
  lettering?: boolean;
  /** Laderaum als offenes Fenster zeichnen, fuer die Ladeansicht */
  cargoOpen?: boolean;
}) {
  const wheel = (cx: number) => (
    <g>
      <circle cx={cx} cy="116" r="19" fill="#070b13" />
      <motion.g
        style={{
          rotate: wheelRotate,
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      >
        <circle cx={cx} cy="116" r="15.5" fill="#0d1526" stroke="#2a3a57" strokeWidth="2" />
        <circle cx={cx} cy="116" r="7.5" fill="#b3c0d4" />
        <circle cx={cx} cy="116" r="2.6" fill="#0d1526" />
        {/* Speichen, damit die Drehung sichtbar ist */}
        <path
          d={`M${cx} 101.5v7M${cx} 123.5v7M${cx - 14.5} 116h7M${cx + 7.5} 116h7`}
          stroke="#74849e"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </motion.g>
    </g>
  );

  return (
    <svg
      viewBox="0 0 320 150"
      className={cn("overflow-visible", className)}
      role="img"
      aria-label="Umzugswagen von Hauruck24"
    >
      <defs>
        <linearGradient id="truck-cab" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffc56e" />
          <stop offset="55%" stopColor="#ff9522" />
          <stop offset="100%" stopColor="#d96a00" />
        </linearGradient>
        <linearGradient id="truck-box" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#223350" />
          <stop offset="100%" stopColor="#111b2e" />
        </linearGradient>
        <linearGradient id="truck-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8df3e0" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#1b2942" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="truck-light" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff4d6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffb454" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Bodenschatten */}
      <ellipse cx="160" cy="136" rx="150" ry="6" fill="#000" opacity="0.45" />

      {/* Laderaum */}
      <rect
        x="10"
        y="20"
        width="196"
        height="88"
        rx="9"
        fill={cargoOpen ? "#0b1322" : "url(#truck-box)"}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
      />
      {cargoOpen ? (
        <rect
          x="10"
          y="20"
          width="196"
          height="88"
          rx="9"
          fill="none"
          stroke="rgba(255,180,84,0.35)"
          strokeWidth="1.5"
          strokeDasharray="5 6"
        />
      ) : (
        <>
          {/* Sicken im Aufbau */}
          <path
            d="M58 24v80M106 24v80M154 24v80"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="2"
          />
          {lettering ? (
            <text
              x="108"
              y="70"
              textAnchor="middle"
              fontFamily="var(--font-jakarta), system-ui, sans-serif"
              fontWeight="800"
              fontSize="25"
              letterSpacing="-0.5"
              fill="#eaf0f8"
            >
              Hauruck<tspan fill="#ffb454">24</tspan>
            </text>
          ) : null}
        </>
      )}

      {/* Zierstreifen */}
      <rect x="10" y="96" width="196" height="6" fill="#ff9522" opacity="0.9" />

      {/* Fahrerhaus */}
      <path
        d="M210 42h52c6 0 11 3 14 8l20 30c3 4 4 9 4 14v14c0 4-3 7-7 7h-83z"
        fill="url(#truck-cab)"
      />
      <path d="M222 50h35c4 0 7 2 9 5l14 21h-58z" fill="url(#truck-glass)" />
      <path d="M226 54h10l-6 18h-8z" fill="#ffffff" opacity="0.18" />
      {/* Tuergriff und Kante */}
      <path d="M244 84h12" stroke="#7a3c00" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M216 80v27" stroke="#b85900" strokeWidth="1.5" opacity="0.6" />
      {/* Scheinwerfer */}
      <rect x="293" y="92" width="7" height="8" rx="2" fill="#fff4d6" />
      <ellipse cx="318" cy="96" rx="22" ry="12" fill="url(#truck-light)" opacity="0.55" />
      {/* Stossfaenger */}
      <rect x="276" y="108" width="28" height="7" rx="3" fill="#1b2942" />
      {/* Fahrgestell */}
      <rect x="18" y="106" width="262" height="8" rx="3" fill="#0d1526" />

      {wheel(64)}
      {wheel(246)}
    </svg>
  );
}
