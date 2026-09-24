/**
 * Handgezeichnete Szene fuer den Header. Bewusst als Vektor statt Foto:
 * scharf auf jedem Display, wenige Kilobyte, keine externen Anfragen.
 * Die Ebenen werden im Hero einzeln mit Parallax bewegt.
 */

export function SceneHills({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="hill-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b2942" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0a1120" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path
        d="M0 214c118-52 196 18 318-16 122-34 178-86 292-64 114 22 168 76 268 62 100-14 168-70 268-52 60 11 196 63 294 42V320H0z"
        fill="url(#hill-far)"
      />
    </svg>
  );
}

export function SceneTown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 300" preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="town" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#131e33" />
          <stop offset="100%" stopColor="#04070d" />
        </linearGradient>
      </defs>
      <g fill="url(#town)">
        {/* Haeuserzeile mit zwei Kirchtuermen, angelehnt an die Silhouette der Region */}
        <path d="M0 300V196h74v-28h56v28h62v-46h48v46h70v-34h58v34h74V150h34l24-40 24 40h34v150z" />
        <path d="M596 300V162h68v-30h52v30h60v-52h46v52h58V126h30l22-34 22 34h30v174z" />
        <path d="M984 300V178h66v-26h54v26h64v-40h44v40h62v-46h58v46h62v-22h56v66z" />
      </g>
      <g stroke="#ffb454" strokeOpacity="0.5" strokeWidth="2">
        {/* Einzelne beleuchtete Fenster */}
        <path d="M100 214h10M170 216h10M262 196h10M340 210h10M430 200h10M640 190h10M726 180h10M816 172h10M1010 202h10M1090 196h10M1188 186h10M1290 190h10" />
      </g>
    </svg>
  );
}

export function SceneBoxes({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 260" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="box-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <g stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" fill="url(#box-face)">
        <rect x="42" y="126" width="126" height="98" rx="8" />
        <rect x="150" y="150" width="112" height="74" rx="8" />
        <rect x="74" y="52" width="94" height="72" rx="8" />
      </g>
      <g stroke="rgba(255,180,84,0.65)" strokeWidth="2.5" strokeLinecap="round">
        <path d="M105 126v98M121 52v72M206 150v74" />
      </g>
    </svg>
  );
}
