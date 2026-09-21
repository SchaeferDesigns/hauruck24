import { cn } from "@/lib/utils";

/**
 * Wortmarke mit Bildzeichen. Das Bildzeichen zeigt eine angehobene Kiste,
 * die Anspielung auf den Namen bleibt damit ohne Bild erkennbar.
 */
export default function Logo({
  className,
  withWordmark = true,
  compact = false,
}: {
  className?: string;
  withWordmark?: boolean;
  compact?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 40 40"
        role="img"
        aria-label="Hauruck24 Bildzeichen"
        className={cn("shrink-0 transition-all duration-500", compact ? "size-8" : "size-9")}
      >
        <defs>
          <linearGradient id="hr-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffd08a" />
            <stop offset="55%" stopColor="#ff9522" />
            <stop offset="100%" stopColor="#ee7a05" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="38" height="38" rx="12" fill="url(#hr-mark)" />
        <rect x="1" y="1" width="38" height="38" rx="12" fill="none" stroke="rgba(255,255,255,0.35)" />
        {/* Kiste */}
        <path
          d="M10.5 22.5h19v8.2a1.6 1.6 0 0 1-1.6 1.6H12.1a1.6 1.6 0 0 1-1.6-1.6z"
          fill="#20120a"
          opacity="0.92"
        />
        <path d="M10.5 22.5h19" stroke="#20120a" strokeWidth="2.6" strokeLinecap="round" />
        {/* Pfeil nach oben, das Anheben */}
        <path
          d="M20 7.6v11.3M20 7.6l-5 5M20 7.6l5 5"
          stroke="#20120a"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {withWordmark ? (
        <span className="font-display text-[1.05rem] leading-none font-extrabold tracking-tight text-mist-50">
          Hauruck
          <span className="text-brand-400">24</span>
        </span>
      ) : null}
    </span>
  );
}
