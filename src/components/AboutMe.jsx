import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import me from "../assets/georgi.webp";
import {
  SiCss3,
  SiExpress,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNodedotjs,
  SiReact,
  SiTailwindcss,
} from "react-icons/si";

const technologies = [
  { name: "React", icon: SiReact, color: "text-sky-400" },
  { name: "Node.js", icon: SiNodedotjs, color: "text-emerald-400" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "text-cyan-400" },
  { name: "Express.js", icon: SiExpress, color: "text-slate-200" },
  { name: "MongoDB", icon: SiMongodb, color: "text-green-500" },
  { name: "JavaScript", icon: SiJavascript, color: "text-amber-400" },
  { name: "HTML", icon: SiHtml5, color: "text-orange-400" },
  { name: "CSS", icon: SiCss3, color: "text-blue-400" },
];

const AboutMe = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      id="about"
      className="w-full min-w-0 max-w-full overflow-x-hidden border-t border-slate-200/80 bg-white px-4 py-12 dark:border-slate-700/60 dark:bg-[#020617] sm:px-gutter-sm sm:py-16 lg:px-gutter-lg lg:py-20"
    >
      <div
        ref={ref}
        className="mx-auto flex min-w-0 w-full max-w-4xl flex-col items-center gap-6 md:flex-row md:items-start md:gap-16 lg:gap-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex shrink-0 justify-center md:justify-start"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-ds-full bg-gradient-to-tr from-indigo-500/30 to-slate-200/40 opacity-60 blur-md dark:from-indigo-500/20 dark:to-slate-700/30" />
            <img
              src={me}
              alt="Georgi Beshirov"
              loading="lazy"
              decoding="async"
              className="relative h-40 w-40 rounded-ds-full border border-slate-200 object-cover shadow-lg dark:border-slate-600 sm:h-48 sm:w-48 md:h-52 md:w-52"
            />
          </div>
        </motion.div>

        <div className="min-w-0 flex-1 text-center md:text-left">
          <h2 className="font-display text-2xl font-bold leading-tight text-slate-900 dark:text-slate-50 md:text-3xl lg:text-4xl">
            Solution partner, not a ticket queue
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:mt-4 md:text-base lg:text-lg">
            I work as a <span className="font-semibold text-slate-900 dark:text-slate-50">high-end solution partner</span>{" "}
            for teams that need production-grade web apps,{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-50">AI integrations</span>, and architecture
            that still reads cleanly six months later — with measurable ROI at the center.
          </p>
          <div className="mt-8">
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Core stack
            </span>
            <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {technologies.map((tech) => (
                <li
                  key={tech.name}
                  className="rounded-ds-lg border border-slate-200/90 bg-slate-50/50 px-2.5 py-2.5 text-left text-xs font-medium text-slate-800 backdrop-blur-sm transition hover:border-indigo-200 dark:border-slate-600/50 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:border-indigo-500/40"
                >
                  <div className="flex items-center gap-2">
                    <tech.icon className={`h-4 w-4 ${tech.color} dark:opacity-90`} />
                    <span>{tech.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
