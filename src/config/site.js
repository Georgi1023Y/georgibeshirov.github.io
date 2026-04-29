/**
 * Upwork profile URL for primary CTAs (“Let’s Talk”).
 * Set `VITE_UPWORK_PROFILE_URL` in `.env` (and GitHub Actions secrets for production builds).
 */
const DEFAULT_UPWORK_PROFILE =
  "https://www.upwork.com/freelancers/~01a416a33111fc91fe";

export function getUpworkProfileUrl() {
  const raw = import.meta.env.VITE_UPWORK_PROFILE_URL;
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  if (trimmed) return trimmed;
  return DEFAULT_UPWORK_PROFILE;
}
