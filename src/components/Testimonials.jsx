import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    title: "Escrow API integration",
    quote:
      "Georgi integrated our escrow workflow with precision and exceptional reliability. Communication was proactive, implementation was clean, and delivery quality exceeded expectations.",
    source: "Upwork Client Review",
  },
  {
    title: "IMI system delivery",
    quote:
      "Complex compliance requirements were handled professionally end-to-end. Georgi built a stable, maintainable solution and significantly improved our operational speed.",
    source: "Upwork Client Review",
  },
];

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="w-full min-w-0 max-w-full overflow-x-hidden border-t border-slate-200/80 bg-slate-50/40 py-16 px-gutter text-slate-900 dark:border-slate-700/60 dark:bg-slate-900/20 sm:py-20 sm:px-gutter-sm lg:px-gutter-lg"
    >
      <div className="max-w-content mx-auto">
        <h2 className="mb-10 text-center font-display text-3xl font-bold text-slate-900 dark:text-slate-50 sm:mb-12 sm:text-4xl">
          Client proof
        </h2>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <motion.article
              key={item.title}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-ds-2xl border border-slate-200/90 bg-slate-50/50 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/50"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-ds-md border border-indigo-200/80 bg-indigo-50 text-indigo-600 dark:border-indigo-500/30 dark:bg-indigo-950/50 dark:text-indigo-300">
                  <Quote className="h-4 w-4" />
                </span>
                <span className="inline-flex items-center gap-1 text-amber-500 dark:text-amber-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </span>
              </div>
              <h3 className="mb-3 font-display text-lg font-bold text-slate-900 dark:text-slate-50">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                &ldquo;{item.quote}&rdquo;
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-800 dark:text-emerald-400/90">
                {item.source}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
