import React from "react";
import { BookOpen, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

const Education = () => {
  return (
    <section
      id="education"
      className="w-full min-w-0 max-w-full overflow-x-hidden border-t border-slate-200/80 bg-white py-16 px-gutter dark:border-slate-700/60 dark:bg-[#020617] sm:py-20 sm:px-gutter-sm lg:px-gutter-lg"
    >
      <div className="mx-auto max-w-content">
        <h2 className="mb-10 text-center font-display text-3xl font-bold text-slate-900 dark:text-slate-50 sm:mb-12 sm:text-4xl">
          Education
        </h2>

        <article className="mx-auto max-w-3xl overflow-hidden rounded-ds-2xl border border-slate-200/90 bg-slate-50/50 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/50 sm:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-ds-full border border-indigo-200/80 bg-indigo-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-950/40 dark:text-indigo-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Engineering foundation
          </div>

          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-ds-lg border border-indigo-200/80 bg-white text-indigo-600 dark:border-indigo-500/30 dark:bg-slate-950/50 dark:text-indigo-400">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50 sm:text-xl">
                Currently pursuing a B.Sc. in Computer Science
              </h3>
              <p className="mt-3 flex items-start gap-2 text-slate-600 dark:text-slate-300">
                <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
                <span>
                  Academic foundation in CS focusing on{" "}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">algorithm optimization</span> and{" "}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">scalable architectures</span> — applied
                  directly to product-grade delivery.
                </span>
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-ds-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-indigo-700 dark:border-indigo-500/25 dark:bg-slate-950/50 dark:text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
                Lead focus: AI &amp; systems architecture
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Education;
