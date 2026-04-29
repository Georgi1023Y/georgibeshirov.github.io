import React, { lazy, memo, Suspense, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { GraduationCap, Sparkles, Star, TrendingUp } from "lucide-react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { Hero3DFallback } from "./hero/Hero3DFallback";
import { LetsTalkUpworkLink } from "./LetsTalkUpworkLink";
import { VerifiedIdentityBadge } from "./VerifiedIdentityBadge";

const NeuralParticleMesh = lazy(() => import("./hero/NeuralParticleMesh"));

const ease = [0.22, 1, 0.36, 1];

/** Isolated from hero copy + motion so Framer / React updates do not re-render the WebGL subtree. */
const HeroParticleLayer = memo(function HeroParticleLayer({
  reducedMotion,
  enable3D,
  mounted,
  isDark,
  lowPower,
  pointerRef,
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 min-h-0 w-full touch-pan-y overflow-hidden"
      aria-hidden
    >
      {reducedMotion || !enable3D ? (
        <Hero3DFallback isDark={isDark} />
      ) : (
        <Suspense fallback={<Hero3DFallback isDark={isDark} />}>
          {mounted && (
            <NeuralParticleMesh pointerRef={pointerRef} lowPower={lowPower} isDark={isDark} />
          )}
        </Suspense>
      )}
    </div>
  );
});

const Hero = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const reducedMotion = usePrefersReducedMotion();
  const [lowPower, setLowPower] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 900px)").matches
      : false
  );
  const [enable3D, setEnable3D] = useState(false);
  const [allowHero3D, setAllowHero3D] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const fn = () => setLowPower(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setEnable3D(false);
      return;
    }
    let cancelled = false;
    let idleId = null;
    let retryTimer = null;
    /** After any wheel/touch/scroll, avoid inserting WebGL until quiet — prevents scroll-into-view on canvas / anchoring fights. */
    let userGestured = false;
    let lastGestureAt = 0;
    const quietMs = 450;

    const markGesture = () => {
      userGestured = true;
      lastGestureAt = Date.now();
    };
    window.addEventListener("wheel", markGesture, { passive: true });
    window.addEventListener("touchmove", markGesture, { passive: true });
    window.addEventListener("scroll", markGesture, { passive: true });

    const enableAfterPaint = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) setEnable3D(true);
        });
      });
    };

    const scheduleEnable = () => {
      if (cancelled) return;
      if (userGestured && Date.now() - lastGestureAt < quietMs) {
        const wait = quietMs - (Date.now() - lastGestureAt) + 20;
        retryTimer = window.setTimeout(scheduleEnable, wait);
        return;
      }
      retryTimer = null;
      enableAfterPaint();
    };

    const w = window;
    idleId = w.requestIdleCallback
      ? w.requestIdleCallback(scheduleEnable, { timeout: 2400 })
      : w.setTimeout(scheduleEnable, 900);

    return () => {
      cancelled = true;
      window.removeEventListener("wheel", markGesture);
      window.removeEventListener("touchmove", markGesture);
      window.removeEventListener("scroll", markGesture);
      if (retryTimer != null) clearTimeout(retryTimer);
      if (w.cancelIdleCallback && idleId != null && typeof idleId === "number") {
        w.cancelIdleCallback(idleId);
      } else if (idleId != null) {
        clearTimeout(idleId);
      }
    };
  }, [reducedMotion]);

  useEffect(() => {
    const onPointer = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      pointerRef.current = { x, y };
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => window.removeEventListener("pointermove", onPointer);
  }, []);

  useEffect(() => {
    if (reducedMotion || !enable3D) {
      setAllowHero3D(false);
      return;
    }

    let rafId = null;
    const updateVisibility = () => {
      const hero = document.getElementById("top");
      if (!hero) {
        setAllowHero3D(false);
        return;
      }
      const rect = hero.getBoundingClientRect();
      const heroTouchesViewport = rect.bottom > 0 && rect.top < window.innerHeight;
      const nearTop = window.scrollY < window.innerHeight * 0.65;
      setAllowHero3D(heroTouchesViewport && nearTop);
    };

    const onScrollOrResize = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateVisibility();
      });
    };

    updateVisibility();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      if (rafId != null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [enable3D, reducedMotion]);

  return (
    <section
      className="relative z-10 flex min-h-[100svh] min-w-0 max-w-full flex-col items-center justify-center overflow-hidden bg-transparent px-gutter pb-12 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] text-center text-slate-900 dark:text-slate-50 sm:px-gutter-sm lg:px-gutter-lg"
      id="top"
    >
      {/* Three.js lives only inside this section — it scrolls away; lower sections have no WebGL behind them */}
      <HeroParticleLayer
        reducedMotion={reducedMotion}
        enable3D={enable3D && allowHero3D}
        mounted={mounted}
        isDark={isDark}
        lowPower={lowPower}
        pointerRef={pointerRef}
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-b from-transparent to-white dark:to-[#020617] sm:h-36"
        aria-hidden
      />

      <div className="relative z-10 flex w-full min-w-0 max-w-4xl flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400"
          >
            Georgi Beshirov
          </motion.p>

          <div className="mb-5 flex w-full justify-center px-2">
            <VerifiedIdentityBadge />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
            className="mb-4 max-w-full px-1 font-display text-balance break-words text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl md:text-5xl lg:text-[2.75rem]"
          >
            AI Integrations | Full Stack Developer &amp; Web Apps
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease }}
            className="mx-auto mb-4 flex max-w-lg items-center justify-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <GraduationCap
              className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400"
              aria-hidden
            />
            <span>Currently pursuing a B.Sc. in Computer Science</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12, ease }}
            className="mb-8 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg"
          >
            Helping businesses automate complexity and scale through custom AI-driven web
            ecosystems — with a clear focus on{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">ROI</span>,
            reliability, and long-term maintainability.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease }}
            className="mb-10 mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-2 rounded-ds-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-center shadow-sm backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/50 sm:flex-row sm:items-stretch sm:gap-0 sm:divide-x sm:divide-slate-200/80 dark:sm:divide-slate-700/60 sm:px-2"
            role="group"
            aria-label="Upwork trust indicators"
          >
            {[
              { label: "5-Star Rated on Upwork", icon: Star },
              { label: "Rising Talent", icon: TrendingUp },
              { label: "100% Job Success", icon: Sparkles },
            ].map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-1.5 px-2 py-2 text-center sm:flex-row sm:gap-2 sm:px-4"
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400"
                  strokeWidth={2}
                />
                <span className="w-full min-w-0 text-center text-xs font-medium leading-snug text-slate-800 dark:text-slate-200 sm:text-[11px] md:text-xs">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.28, ease }}
            className="mb-10 flex w-full max-w-2xl flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <LetsTalkUpworkLink className="w-full min-h-[48px] px-8 py-3 text-sm sm:w-auto" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mb-6 text-sm text-slate-500 dark:text-slate-400"
          >
            High-end solution partner for AI integrations, full-stack delivery, and production
            systems.
          </motion.p>

          <div className="flex justify-center gap-8">
            <a
              href="https://github.com/Georgi1023Y"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-slate-400 transition-colors hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.instagram.com/georgiyuliqnov/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-slate-400 transition-colors hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
    </section>
  );
};

export default Hero;
