import React from "react";
import { motion } from "framer-motion";
import {
  BookOpenCheck,
  Bug,
  FileSearch,
  FlaskConical,
  GitBranch,
  GraduationCap,
  LayoutTemplate,
  Rocket,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

const processSteps = [
  {
    title: "Requirement Analysis",
    description: "Understanding project requirements and defining scope",
    icon: FileSearch,
  },
  {
    title: "Planning & Design",
    description: "Creating architecture diagrams and component structure",
    icon: LayoutTemplate,
  },
  {
    title: "Development",
    description: "Implementing features with clean, maintainable code",
    icon: Sparkles,
  },
  {
    title: "Testing",
    description: "Unit tests, integration tests, and manual testing",
    icon: FlaskConical,
  },
  {
    title: "Deployment",
    description: "Setting up CI/CD pipelines and deploying to production",
    icon: Rocket,
  },
  {
    title: "Maintenance",
    description: "Monitoring performance and fixing bugs",
    icon: Wrench,
  },
];

const problemSolving = [
  {
    title: "Break Down Problems",
    description: "Divide complex problems into smaller, manageable tasks",
    icon: SearchCheck,
  },
  {
    title: "Research & Documentation",
    description: "Study best practices and official documentation",
    icon: BookOpenCheck,
  },
  {
    title: "Version Control",
    description: "Use Git for tracking changes and collaborating",
    icon: GitBranch,
  },
  {
    title: "Code Review",
    description: "Regular code reviews and pair programming",
    icon: ShieldCheck,
  },
  {
    title: "Testing First",
    description: "Write tests before implementing features",
    icon: Bug,
  },
  {
    title: "Continuous Learning",
    description: "Stay updated with latest technologies and patterns",
    icon: GraduationCap,
  },
];

const cardLight =
  "rounded-ds-lg border border-slate-200/90 bg-slate-50/50 p-6 shadow-sm backdrop-blur-sm transition-all duration-300";

const cardDark =
  "dark:border dark:border-indigo-500/30 dark:bg-slate-950/50 dark:backdrop-blur-xl dark:shadow-[0_0_24px_rgba(99,102,241,0.12)] dark:drop-shadow-[0_0_15px_rgba(99,102,241,0.2)]";

const processCard = `${cardLight} ${cardDark}`;
const processIconWrap =
  "mr-3 inline-flex h-9 w-9 items-center justify-center rounded-ds-md border border-indigo-200/80 bg-indigo-50 text-indigo-600 dark:border-indigo-500/30 dark:bg-indigo-950/40 dark:text-indigo-300";
const methodIconWrap =
  "inline-flex h-9 w-9 items-center justify-center rounded-ds-md border border-emerald-200/80 bg-emerald-50 text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-950/30 dark:text-emerald-300";

/**
 * Glowing indigo → emerald connectors (dark mode only) showing AI → platform → interface.
 */
function DarkMethodologyFlow() {
  const chain = [
    { key: "ai", label: "AI & ML" },
    { key: "node", label: "Node.js" },
    { key: "react", label: "React" },
  ];

  return (
    <div
      className="mb-12 hidden w-full max-w-2xl flex-col items-center sm:mx-auto dark:flex"
      aria-hidden
    >
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-400/90">
        Stack flow
      </p>
      <div className="flex w-full flex-row flex-wrap items-center justify-center gap-y-2">
        {chain.map((item, i) => (
          <div key={item.key} className="flex items-center">
            {i > 0 && (
              <motion.div
                className="mx-1 h-0.5 w-8 min-w-[1.5rem] max-w-[3.5rem] flex-1 overflow-hidden rounded-full sm:mx-2 sm:w-16"
                initial={{ opacity: 0.4 }}
                animate={{ opacity: [0.35, 0.95, 0.35] }}
                transition={{
                  duration: 2.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (i - 1) * 0.2,
                }}
              >
                <div
                  className="h-full w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400"
                />
              </motion.div>
            )}
            <div className="whitespace-nowrap rounded-ds-full border border-indigo-500/35 bg-slate-950/50 px-3 py-1.5 text-xs font-semibold text-indigo-100 shadow-[0_0_12px_rgba(99,102,241,0.15)] backdrop-blur-md">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const DevelopmentProcess = () => {
  return (
    <section
      id="process"
      className="w-full min-w-0 max-w-full overflow-x-hidden border-t border-slate-200/80 bg-white py-16 px-gutter text-slate-900 dark:border-slate-700/60 dark:bg-[#020617] sm:py-20 sm:px-gutter-sm lg:px-gutter-lg"
    >
      <div className="max-w-content mx-auto min-w-0 w-full">
        <h2 className="mb-10 text-center font-display text-3xl font-bold text-slate-900 dark:text-slate-50 sm:mb-12 sm:text-4xl">
          Development workflow &amp; methodology
        </h2>

        <DarkMethodologyFlow />

        <div className="space-y-16">
          <div>
            <h3 className="mb-6 text-center font-display text-2xl font-bold text-indigo-600 sm:text-left dark:text-indigo-400">
              Delivery process
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {processSteps.map((step) => (
                <motion.div
                  key={step.title}
                  className={processCard}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-4 flex items-center">
                    <span className={processIconWrap} aria-hidden>
                      <step.icon className="h-4 w-4" />
                    </span>
                    <h4 className="font-display font-semibold text-slate-900 dark:text-slate-100">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-center font-display text-2xl font-bold text-emerald-800 md:text-left dark:text-emerald-400/90">
              Problem-solving methodology
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {problemSolving.map((method) => (
                <motion.div
                  key={method.title}
                  className={processCard}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className={methodIconWrap}>
                      <method.icon className="h-4 w-4" />
                    </span>
                    <h4 className="font-display font-semibold text-slate-900 dark:text-slate-100">
                      {method.title}
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {method.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevelopmentProcess;
