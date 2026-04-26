import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, BookOpen, Code2, Gamepad2, GraduationCap, Rocket } from "lucide-react";

const items = [
  {
    name: "Machine Learning A – Z",
    icon: BookOpen,
    focus: "Model pipelines, deployment mindset, and production-quality ML thinking.",
    skills: ["State management", "AI deployment", "Data workflows"],
  },
  {
    name: "The Complete Python Bootcamp",
    icon: Code2,
    focus: "Automation, APIs, and scripting at a senior level for integrations.",
    skills: ["Automation", "Scalability", "System glue code"],
  },
  {
    name: "Telerik Academy – Game Development",
    icon: Gamepad2,
    focus: "Performance, real-time systems, and disciplined architecture under constraints.",
    skills: ["Performance", "State management", "Architecture"],
  },
  {
    name: "freeCodeCamp",
    icon: GraduationCap,
    focus: "Full-stack patterns, algorithmic practice, and shipping complete products.",
    skills: ["Full-stack", "Algorithm thinking", "Delivery"],
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Certifications = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <section
      id="certifications"
      className="w-full min-w-0 max-w-full overflow-x-hidden border-y border-slate-200/80 bg-white py-16 px-gutter dark:border-slate-700/60 dark:bg-[#020617] sm:py-20 sm:px-gutter-sm lg:px-gutter-lg"
    >
      <div className="mx-auto max-w-content">
        <div className="mb-12 flex flex-col items-center text-center sm:mb-14">
          <span className="mb-3 inline-flex items-center gap-2 rounded-ds-full border border-indigo-200/80 bg-indigo-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-950/40 dark:text-indigo-300">
            <Award className="h-3.5 w-3.5" />
            Trust & depth
          </span>
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
            Certifications
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Continuous learning that maps directly to client outcomes: AI deployment, scalable
            systems, and expert-level delivery.
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5"
        >
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.name}
                custom={i}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-ds-2xl border border-slate-200/90 bg-slate-50/50 p-5 shadow-sm backdrop-blur-sm transition duration-300 hover:border-indigo-200 hover:bg-white/80 dark:border-slate-700/60 dark:bg-slate-900/50 dark:hover:border-indigo-500/40 dark:hover:bg-slate-900/80 sm:p-6"
              >
                <div className="mb-3 flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-ds-lg border border-indigo-200/80 bg-white text-indigo-600 dark:border-indigo-500/30 dark:bg-slate-950/50 dark:text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {item.focus}
                    </p>
                  </div>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {item.skills.map((s) => (
                    <li
                      key={s}
                      className="inline-flex items-center gap-1 rounded-ds-full border border-slate-200/90 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-600/50 dark:bg-slate-950/50 dark:text-slate-200"
                    >
                      <Rocket className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
