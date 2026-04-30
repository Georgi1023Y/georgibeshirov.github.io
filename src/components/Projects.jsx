import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  Check,
  Database,
  Globe,
  KeyRound,
  Layers,
  Link2,
  MessageSquare,
  Palette,
  Server,
  Shield,
  Sparkles,
  Webhook,
  Zap,
} from "lucide-react";

const iconMap = {
  React: Layers,
  "Node.js": Server,
  MongoDB: Database,
  Express: Globe,
  JWT: KeyRound,
  "Socket.io": Zap,
  Tailwind: Palette,
  Webhook: Webhook,
  API: Link2,
  IMI: Shield,
  "Claude 3.5 (Anthropic)": Sparkles,
  Playwright: Globe,
  Puppeteer: Bot,
  "Financial APIs": Link2,
};

function TechIcon({ name }) {
  const Cmp = iconMap[name] || Layers;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-ds-full border border-slate-200/90 bg-slate-50/50 px-2.5 py-1 text-[11px] font-medium text-slate-700 backdrop-blur-sm dark:border-slate-600/50 dark:bg-slate-900/50 dark:text-slate-200"
      title={name}
    >
      <Cmp className="h-3.5 w-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
      {name}
    </span>
  );
}

const projects = [
  {
    title: "Advanced financial analysis bot",
    problem:
      "Investment and research teams needed a faster way to synthesize market signals and qualitative context without manually trawling dozens of sources ad hoc.",
    solution:
      "Architected a sophisticated AI agent for real-time financial data extraction and sentiment analysis. Leveraged Anthropic’s Claude for complex reasoning over scraped market data to provide actionable investment insights, with a Node.js control plane and web-scraping pipelines (Playwright / Puppeteer) and integrations to financial APIs.",
    outcomes: [
      "Automated deep-market research, reducing manual data gathering time by 95%.",
      "Optimized research throughput with auditable, repeatable extraction flows.",
      "Enabled sentiment and structure-aware analysis on noisy, high-volume data.",
    ],
    tech: [
      "Claude 3.5 (Anthropic)",
      "Node.js",
      "Playwright",
      "Puppeteer",
      "Financial APIs",
    ],
    links: null,
  },
  {
    title: "IMI system (driver & compliance platform)",
    problem:
      "Regulated logistics workflows were fragmented across spreadsheets, slowing compliance and operational visibility.",
    solution:
      "A full-stack React, Node.js, and MongoDB platform with secure auth, IMI-related integrations, and role-aware dashboards.",
    outcomes: [
      "Optimized performance for data-heavy, production reporting flows.",
      "Automated manual tasks in posting and status tracking (critical posting lanes).",
      "Ensured auditable, secure handling of compliance-sensitive operations.",
    ],
    tech: ["React", "Node.js", "Express", "MongoDB", "JWT", "IMI"],
    links: {
      demo: "https://imi-driver-project.vercel.app/",
      label: "Live context",
    },
  },
  {
    title: "Escrow & payments API layer",
    problem:
      "A transaction-heavy workflow needed reliable escrow hand-offs without manual reconciliation or fragile one-off scripts.",
    solution:
      "A resilient API integration layer with validation, idempotent flows, and clear state for payments-related operations.",
    outcomes: [
      "Ensured secure transactions with clear hand-offs and less manual reconciliation.",
      "Automated manual tasks in payout and status updates.",
      "Optimized performance and reliability for repeated payment operations.",
    ],
    tech: ["Node.js", "API", "Webhook", "React"],
    links: null,
  },
  {
    title: "Real-time chat & coordination",
    problem:
      "Teams required instant coordination instead of email lag and context loss between devices.",
    solution:
      "A Socket.io–powered real-time stack on React and Node with authenticated sessions, channels, and live notifications.",
    outcomes: [
      "Optimized performance for real-time message delivery and presence.",
      "Automated manual follow-ups by centralizing live team coordination.",
      "Secure sessions and access boundaries for distributed teams.",
    ],
    tech: ["React", "Node.js", "Socket.io", "MongoDB", "Tailwind"],
    links: {
      demo: "https://chat-app-9p6u.onrender.com/login",
      label: "App",
    },
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Projects = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      id="projects"
      className="w-full min-w-0 max-w-full overflow-x-hidden border-t border-slate-200/80 bg-slate-50/50 px-4 py-12 dark:border-slate-700/60 dark:bg-slate-950/40 sm:px-gutter-sm sm:py-16 lg:px-gutter-lg lg:py-20"
    >
      <div className="mx-auto max-w-content">
        <h2 className="mb-2 text-center font-display text-2xl font-bold leading-tight text-slate-900 dark:text-slate-50 md:text-3xl lg:text-4xl">
          Impact &amp; case studies
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-slate-600 dark:text-slate-400 sm:mb-10 sm:text-base md:mb-14 lg:text-lg">
          Clear problem–solution narrative with measurable impact: performance, automation, and
          secure, reliable operations.
        </p>

        <ul ref={ref} className="flex flex-col gap-8 sm:gap-10 md:gap-12">
          {projects.map((project, index) => (
            <motion.li
              key={project.title}
              custom={index}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={itemVariants}
              className="overflow-hidden rounded-ds-2xl border border-slate-200/90 bg-slate-50/50 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/50 sm:p-6 md:p-8"
            >
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-2">
                  {project.title.includes("financial") ? (
                    <Bot className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  )}
                  <h3 className="text-left font-display text-xl font-bold capitalize leading-snug text-slate-900 dark:text-slate-50 sm:text-2xl">
                    {project.title}
                  </h3>
                </div>
                {project.links?.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400"
                  >
                    {project.links.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-rose-600/90 dark:text-rose-400/90">
                    Problem
                  </p>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                    {project.problem}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-600/90 dark:text-indigo-400/90">
                    Solution
                  </p>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                    {project.solution}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-500">
                  Outcomes
                </p>
                <ul className="space-y-2">
                  {project.outcomes.map((o) => (
                    <li
                      key={o}
                      className="flex gap-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 sm:text-base"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                      <span className="leading-relaxed text-slate-700 dark:text-slate-300">
                        {o}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 flex min-w-0 flex-wrap gap-2 border-t border-slate-200/80 pt-4 dark:border-slate-700/60">
                {project.tech.map((t) => (
                  <TechIcon key={t} name={t} />
                ))}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Projects;
