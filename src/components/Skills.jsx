import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Bot,
  Brain,
  Cpu,
  Database,
  Globe,
  Smartphone,
  Sparkles,
} from "lucide-react";
import {
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPython,
  SiReact,
  SiTypescript,
} from "react-icons/si";

const easing = [0.22, 1, 0.36, 1];

const categories = [
  {
    title: "AI & Machine Learning",
    subtitle: "Models, agents, and intelligent automation at production quality.",
    headerIcons: [Brain, Cpu, Bot],
    technologies: [
      { name: "Python", icon: SiPython, kind: "si" },
      { name: "Artificial Intelligence", icon: Brain, kind: "lucide" },
      { name: "Machine Learning", icon: Cpu, kind: "lucide" },
      { name: "OpenAI API", icon: SiOpenai, kind: "si" },
    ],
  },
  {
    title: "Mobile Development",
    subtitle: "Cross-platform delivery with polished mobile UI.",
    headerIcons: [Smartphone, Smartphone],
    technologies: [
      { name: "React Native", icon: SiReact, kind: "si" },
      { name: "Mobile App Development", icon: Smartphone, kind: "lucide" },
    ],
  },
  {
    title: "Web & Full-Stack",
    subtitle: "End-to-end product engineering from API to interface.",
    headerIcons: [Globe, Database, Globe],
    technologies: [
      { name: "React", icon: SiReact, kind: "si" },
      { name: "Next.js", icon: SiNextdotjs, kind: "si" },
      { name: "TypeScript", icon: SiTypescript, kind: "si" },
      { name: "Node.js", icon: SiNodedotjs, kind: "si" },
      { name: "MongoDB", icon: SiMongodb, kind: "si" },
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easing },
  },
};

function SkillIcon({ tech, iconClassName = "h-[1.15em] w-[1.15em]" }) {
  const Cmp = tech.icon;
  if (tech.kind === "si") {
    return <Cmp className={`shrink-0 ${iconClassName}`} aria-hidden />;
  }
  return <Cmp className={`shrink-0 ${iconClassName}`} strokeWidth={2} aria-hidden />;
}

function TechStackCard({ category }) {
  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, ease: easing }}
      className="group relative min-w-0 max-w-full overflow-hidden rounded-ds-2xl border border-slate-200/90 bg-white p-6 shadow-sm backdrop-blur-sm sm:p-7 dark:border-slate-700/60 dark:bg-slate-900/40"
    >
      <div className="pointer-events-none absolute inset-0 rounded-ds-2xl bg-gradient-to-br from-indigo-500/6 via-transparent to-emerald-500/5 opacity-60 dark:from-indigo-500/10 dark:to-emerald-500/5" />
      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-center gap-1.5 sm:justify-start">
          {category.headerIcons.map((HeaderIcon, i) => (
            <span
              key={i}
              className="inline-flex h-8 w-8 items-center justify-center rounded-ds-md border border-slate-200/80 bg-slate-50 text-indigo-600 dark:border-slate-600/50 dark:bg-slate-950/50 dark:text-indigo-400"
            >
              <HeaderIcon className="h-4 w-4" strokeWidth={2} aria-hidden />
            </span>
          ))}
        </div>

        <h3 className="text-center font-display text-lg font-bold text-slate-900 sm:text-left sm:text-xl dark:text-slate-50">
          {category.title}
        </h3>
        <p className="mt-2 text-center text-sm text-slate-600 sm:text-left dark:text-slate-400">
          {category.subtitle}
        </p>

        <ul className="mt-6 flex w-full min-w-0 list-none flex-wrap content-start items-stretch gap-2.5 p-0 sm:gap-3">
          {category.technologies.map((tech) => (
            <li key={tech.name} className="w-auto min-w-0 max-w-full shrink-0">
              <div
                className="inline-flex w-auto max-w-full items-center gap-2.5 rounded-ds-md border border-slate-200/90 bg-white/90 px-3 py-2 text-sm font-medium text-slate-800 shadow-sm dark:border-slate-600/40 dark:bg-slate-950/40 dark:text-slate-200 sm:px-4 sm:py-2.5"
              >
                <span
                  className="inline-flex h-[2em] w-[2em] shrink-0 items-center justify-center rounded-ds-md bg-slate-50 text-slate-800 dark:bg-slate-800/60 dark:text-indigo-200"
                  aria-hidden
                >
                  <SkillIcon tech={tech} iconClassName="h-[1.125em] w-[1.125em]" />
                </span>
                <span className="whitespace-nowrap leading-normal">{tech.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px -60px 0px" });

  return (
    <section
      id="tech-stack"
      className="flex w-full min-w-0 max-w-full flex-col items-center overflow-x-hidden border-t border-slate-200/80 bg-slate-50/40 py-16 px-gutter text-slate-900 dark:border-slate-700/60 dark:bg-slate-900/20 sm:py-20 sm:px-gutter-sm lg:px-gutter-lg"
    >
      <div className="w-full max-w-content">
        <div className="mb-10 flex w-full flex-col items-center sm:mb-12">
          <div className="mb-4 flex w-full justify-center">
            <span className="inline-flex items-center gap-2 rounded-ds-full border border-emerald-200/80 bg-emerald-50/90 px-3.5 py-1.5 text-center text-xs font-semibold uppercase tracking-[0.08em] text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300/90">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>Verified Upwork Rising Talent &amp; 5-Star Rated</span>
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
            Tech Stack
          </h2>
          <p className="mt-3 max-w-2xl text-center text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Skills and technologies aligned with my Upwork profile—mapped clearly from AI
            and mobile to full-stack web delivery.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-7"
        >
          {categories.map((category) => (
            <TechStackCard key={category.title} category={category} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
