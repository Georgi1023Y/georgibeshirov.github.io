import { motion } from "framer-motion";

/** Twitter / platform-style verified mark — blue circle + white check (high-trust signal). */
function BlueVerifiedIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="11" cy="11" r="11" fill="#1D9BF0" />
      <path
        d="M6.5 11.2 10.2 14.9 15.5 7.1"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Prominent trust badge — EU + identity verified (Upwork-style reassurance).
 */
export function VerifiedIdentityBadge({ className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`inline-flex max-w-full items-center gap-2.5 rounded-ds-full border border-sky-500/35 bg-gradient-to-r from-sky-500/[0.12] to-blue-600/[0.08] px-4 py-2 shadow-sm backdrop-blur-md dark:border-sky-400/30 dark:from-sky-400/[0.14] dark:to-blue-500/[0.08] ${className}`.trim()}
      role="status"
      aria-label="EU-based professional with identity verified via government ID"
    >
      <BlueVerifiedIcon className="h-[1.15rem] w-[1.15rem]" />
      <span className="text-left text-[13px] font-semibold leading-snug tracking-tight text-sky-950 dark:text-sky-100 sm:text-sm">
        EU-Based &amp; Identity Verified (Government ID Checked)
      </span>
    </motion.div>
  );
}
