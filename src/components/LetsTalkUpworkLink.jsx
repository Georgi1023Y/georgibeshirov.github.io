import { UpworkLogo } from "./icons/UpworkLogo";
import { getUpworkProfileUrl } from "../config/site";

const base =
  "inline-flex min-h-[40px] shrink-0 items-center justify-center gap-2 rounded-ds-full bg-[#14a800] px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-[#14a800]/25 ring-2 ring-[#14a800]/20 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#118f00] hover:shadow-lg hover:shadow-[#14a800]/30 active:translate-y-0 sm:min-h-[44px] sm:px-4 sm:text-sm";

/**
 * Primary conversion CTA — opens Upwork profile in a new tab.
 */
export function LetsTalkUpworkLink({ className = "", onNavigate }) {
  const href = getUpworkProfileUrl();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${className}`.trim()}
      aria-label="Open Upwork profile — Let's Talk"
      onClick={() => onNavigate?.()}
    >
      <UpworkLogo className="h-4 w-4 shrink-0 text-white opacity-95 sm:h-[1.05rem] sm:w-[1.05rem]" />
      Let&apos;s Talk
    </a>
  );
}
