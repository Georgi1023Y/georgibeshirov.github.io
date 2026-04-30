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
      className={`inline-flex max-w-full items-center justify-center gap-2 rounded-ds-full border border-sky-500/35 bg-gradient-to-r from-sky-500/[0.12] to-blue-600/[0.08] px-3 py-1.5 shadow-sm backdrop-blur-md dark:border-sky-400/30 dark:from-sky-400/[0.14] dark:to-blue-500/[0.08] sm:gap-2.5 sm:px-4 sm:py-2 ${className}`.trim()}
      role="status"
      aria-label="EU-based professional with identity verified via government ID"
    >
      <BlueVerifiedIcon className="h-4 w-4 md:h-5 md:w-5" />
      <span className="max-w-[240px] text-center text-xs font-semibold leading-snug tracking-tight text-sky-950 dark:text-sky-100 xs:max-w-none sm:text-sm">
        EU-Based &amp; Identity Verified (Government ID Checked)
      </span>
    </motion.div>
  );
}
