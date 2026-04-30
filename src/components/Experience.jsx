import React from "react";

const experiences = [
  {
    title: "Freelance AI & Full-Stack Engineer",
    org: "Upwork",
    date: "2024 – Present",
    points: [
      "Delivered 5-star rated solutions for international clients, focusing on AI-driven automations and robust web ecosystems.",
      "Awarded Rising Talent status for consistent project success and high-quality clean code.",
      "Specialized in transforming complex business requirements into scalable MVPs.",
    ],
  },
  {
    title: "Independent Project Developer",
    org: "Self-directed",
    date: "2023 – Present",
    points: [
      "Architected and deployed high-impact systems, including an automated posting engine for the EU Single Market (IMI) and secure B2B Escrow API integrations.",
      "Focused on end-to-end development, from Supabase database architecture to responsive React frontends.",
    ],
  },
];

const lineGradient = "bg-gradient-to-b from-indigo-500 to-slate-300";

const Experience = () => {
  return (
    <section
      id="experience"
      className="flex w-full min-w-0 max-w-full flex-col items-center overflow-x-hidden border-t border-slate-200/80 bg-white px-4 py-12 dark:border-slate-700/60 dark:bg-[#020617] sm:px-gutter-sm sm:py-16 lg:px-gutter-lg lg:py-20"
    >
      <h2 className="mb-8 text-center font-display text-2xl font-bold text-slate-900 dark:text-slate-50 sm:mb-10 md:mb-12 lg:mb-14 md:text-3xl lg:text-4xl">
        Experience
      </h2>
      <div className="relative w-full min-w-0 max-w-3xl">
        <div
          className={`absolute left-1/2 top-0 z-0 h-full w-px -translate-x-1/2 ${lineGradient} opacity-40`}
        />
        <ul className="space-y-16 sm:space-y-20">
          {experiences.map((exp, idx) => (
            <li
              key={exp.title}
              className={`relative flex flex-col items-center md:flex-row ${
                idx % 2 === 0
                  ? "md:flex-row-reverse md:justify-end"
                  : "md:justify-start"
              }`}
            >
              <span
                className="absolute left-1/2 top-6 z-10 hidden h-3.5 w-3.5 -translate-x-1/2 rounded-ds-full border-2 border-white bg-indigo-500 shadow-[0_0_0_3px_rgba(79,70,229,0.2)] dark:border-slate-950 md:block"
                aria-hidden
              />
              <div
                className={`z-10 w-full min-w-0 max-w-full rounded-ds-xl border border-slate-200/90 bg-slate-50/50 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/50 sm:p-8 md:w-1/2 ${
                  idx % 2 === 0 ? "md:mr-12" : "md:ml-12"
                }`}
              >
                <div className="mb-2 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-50 sm:text-lg md:text-xl">
                    {exp.title}
                  </h3>
                </div>
                <div className="mb-1 flex flex-wrap items-center gap-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">{exp.org}</span>
                  <span className="text-slate-300 dark:text-slate-600" aria-hidden>
                    |
                  </span>
                  <time className="font-medium text-slate-600 dark:text-slate-300">{exp.date}</time>
                </div>
                <ul className="mt-4 list-outside list-disc space-y-3 pl-5 text-left marker:text-indigo-600 dark:marker:text-indigo-400">
                  {exp.points.map((point) => (
                    <li
                      key={point}
                      className="pl-1 text-base leading-relaxed text-slate-600 dark:text-slate-300"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Experience;
