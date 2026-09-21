/**
 * Ambiente hinter dem Glas. Bewegte Farbflaechen sorgen dafuer,
 * dass der Blur etwas zu tun hat. Rein dekorativ, daher aria-hidden.
 */
export default function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-night-950" />

      <div className="absolute -top-[18vh] -left-[12vw] size-[58vw] min-w-[26rem] rounded-full bg-brand-600/18 blur-[120px] animate-drift" />
      <div
        className="absolute top-[42vh] -right-[14vw] size-[52vw] min-w-[24rem] rounded-full bg-signal-500/12 blur-[130px] animate-drift"
        style={{ animationDelay: "-8s", animationDuration: "26s" }}
      />
      <div
        className="absolute bottom-[-20vh] left-[28vw] size-[46vw] min-w-[22rem] rounded-full bg-night-600/50 blur-[120px] animate-drift"
        style={{ animationDelay: "-14s", animationDuration: "30s" }}
      />

      <div className="absolute inset-0 bg-grid mask-fade-b opacity-60" />
      <div className="absolute inset-0 bg-noise opacity-[0.035] mix-blend-soft-light" />

      {/* Vignette, damit Text am Rand ruhig bleibt */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_35%,rgba(4,7,13,0.82)_100%)]" />
    </div>
  );
}
