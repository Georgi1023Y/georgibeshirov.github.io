import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { GraduationCap, Sparkles, Star, TrendingUp } from "lucide-react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { Hero3DFallback } from "./hero/Hero3DFallback";

const NeuralParticleMesh = lazy(() => import("./hero/NeuralParticleMesh"));

const ease = [0.22, 1, 0.36, 1];

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
    const w = window;
    const idle = w.requestIdleCallback
      ? w.requestIdleCallback(() => setEnable3D(true), { timeout: 1500 })
      : w.setTimeout(() => setEnable3D(true), 700);
    return () => {
      if (w.cancelIdleCallback && typeof idle === "number") {
        w.cancelIdleCallback(idle);
      } else {
        clearTimeout(idle);
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

  const scrollToContact = (e) => {
    e.preventDefault();
    const el = document.getElementById("contact");
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      <div
        className="pointer-events-none fixed left-0 top-0 z-[-1] h-[100svh] w-screen overflow-hidden"
        aria-hidden
      >
        {reducedMotion || !enable3D ? (
          <Hero3DFallback isDark={isDark} />
        ) : (
          <Suspense fallback={<Hero3DFallback isDark={isDark} />}>
            {mounted && (
              <NeuralParticleMesh
                pointerRef={pointerRef}
                lowPower={lowPower}
                isDark={isDark}
              />
            )}
          </Suspense>
        )}
      </div>

      <section
        className="relative z-10 flex min-h-[100svh] min-w-0 max-w-full flex-col items-center justify-center overflow-x-hidden bg-transparent px-gutter pb-12 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] text-center text-slate-900 dark:text-slate-50 sm:px-gutter-sm lg:px-gutter-lg"
        id="home"
      >
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
            <a
              href="#contact"
              onClick={scrollToContact}
              className="animate-soft-cta-pulse inline-flex min-h-[48px] w-full items-center justify-center rounded-ds-full bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-md shadow-indigo-600/25 ring-2 ring-indigo-500/20 transition hover:bg-indigo-500 dark:shadow-indigo-900/40 sm:w-auto sm:px-8"
            >
              Ready to build the next big thing? Let&apos;s discuss your project ROI.
            </a>
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
    </>
  );
};

export default Hero;
