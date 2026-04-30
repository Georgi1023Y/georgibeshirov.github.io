import React from "react";
import { motion } from "framer-motion";
import { Code2, Crosshair, Video } from "lucide-react";

const ease = [0.22, 1, 0.36, 1];

const pillars = [
  {
    title: "Deep focus",
    description: "Execution-first cadence — fewer interruptions, more shipped.",
    icon: Crosshair,
  },
  {
    title: "Daily updates",
    description: "Loom-style video briefs plus living docs so you always see progress.",
    icon: Video,
  },
  {
    title: "Code delivery",
    description: "Direct repo access and transparent commits — audit reality, not slides.",
    icon: Code2,
  },
];

const cardLight =
  "rounded-ds-xl border border-slate-200/90 bg-slate-50/40 p-4 shadow-sm backdrop-blur-sm sm:p-6";

const cardDark =
  "dark:border-slate-600/60 dark:bg-slate-950/40 dark:shadow-[0_0_20px_rgba(99,102,241,0.08)]";

const iconWrap =
  "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-ds-lg border border-indigo-200/90 bg-indigo-50 text-indigo-600 dark:border-indigo-500/35 dark:bg-indigo-950/50 dark:text-indigo-300";

const AsynchronousWorkflow = () => {
  return (
    <section
      id="async-workflow"
      className="w-full min-w-0 max-w-full overflow-x-hidden border-t border-slate-200/80 bg-white px-4 py-12 text-slate-900 dark:border-slate-700/60 dark:bg-[#020617] sm:px-gutter-sm sm:py-16 lg:px-gutter-lg lg:py-20"
    >
      <div className="mx-auto w-full max-w-content min-w-0">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.5, ease }}
          className="mb-3 text-center font-display text-2xl font-bold text-slate-900 dark:text-slate-50 md:text-3xl lg:text-4xl"
        >
          Engineered for Speed: Asynchronous Workflow
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.5, delay: 0.06, ease }}
          className="mx-auto mb-8 max-w-3xl text-center text-pretty text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:mb-10 md:mb-12 md:text-base lg:text-lg"
        >
          I prioritize deep work and technical execution over long meetings. To ensure 24/7 progress and
          zero errors, I work 100% asynchronously. You get daily video updates (Loom), real-time
          documentation, and direct code access. No time-wasting status calls—just results.
        </motion.p>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-3 lg:gap-8">
          {pillars.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6%" }}
              transition={{ duration: 0.45, delay: i * 0.07, ease }}
              whileHover={{ y: -3 }}
              className={`${cardLight} ${cardDark}`}
            >
              <span className={iconWrap} aria-hidden>
                <item.icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <h3 className="mb-2 font-display text-base font-semibold text-slate-900 dark:text-slate-50 md:text-lg">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AsynchronousWorkflow;
