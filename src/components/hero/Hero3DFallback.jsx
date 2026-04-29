/**
 * Shown while the WebGL chunk loads (Suspense) or for reduced-motion preference.
 * Fills the hero particle layer (absolute inset inside #top only — not full-document fixed).
 */
export function Hero3DFallback({ isDark = false }) {
  if (isDark) {
    return (
      <div
        className="h-full w-full bg-[radial-gradient(ellipse_80%_55%_at_50%_35%,rgba(99,102,241,0.22),transparent_58%)]"
        aria-hidden
      />
    );
  }
  return (
    <div
      className="h-full w-full bg-[radial-gradient(ellipse_90%_60%_at_50%_30%,rgba(99,102,241,0.06),rgba(71,85,105,0.05)_40%,transparent_65%)]"
      aria-hidden
    />
  );
}
