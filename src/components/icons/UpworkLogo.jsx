import { siUpwork } from "simple-icons";

/**
 * Official Upwork mark (Simple Icons, CC0). Uses currentColor for fills.
 */
export function UpworkLogo({ className }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <title>{siUpwork.title}</title>
      <path fill="currentColor" d={siUpwork.path} />
    </svg>
  );
}
