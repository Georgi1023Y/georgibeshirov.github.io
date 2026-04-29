import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Award,
  Briefcase,
  Home,
  Layout,
  Mail,
  Moon,
  Quote,
  Sun,
  User,
} from "lucide-react";

const navLinks = [
  { name: "Home", id: "top", Icon: Home },
  { name: "About", id: "about", Icon: User },
  { name: "Experience", id: "experience", Icon: Briefcase },
  { name: "Projects", id: "projects", Icon: Layout },
  { name: "Certifications", id: "certifications", Icon: Award },
  { name: "Testimonials", id: "testimonials", Icon: Quote },
  { name: "Contact", id: "contact", Icon: Mail },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleScrollToSection = (e, id) => {
    e.preventDefault();
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const yOffset = 72;
      const y = el.getBoundingClientRect().top + window.pageYOffset - yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full max-w-full border-b border-slate-200/80 bg-white/80 pt-[env(safe-area-inset-top,0px)] shadow-sm backdrop-blur-xl backdrop-saturate-150 dark:border-slate-700/60 dark:bg-slate-950/75">
      <nav className="mx-auto flex h-16 min-w-0 max-w-content items-center justify-between gap-3 px-gutter sm:px-gutter-sm lg:px-gutter-lg">
        <span className="min-w-0 max-w-[56%] truncate pr-1 font-display text-base font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:max-w-none sm:text-lg">
          Georgi Beshirov
        </span>
        <div className="flex min-w-0 flex-shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={(e) => {
              handleScrollToSection(e, "contact");
              setOpen(false);
            }}
            className="animate-soft-cta-pulse hidden min-h-[40px] items-center justify-center rounded-ds-full bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 ring-2 ring-indigo-500/15 transition hover:bg-indigo-500 sm:inline-flex sm:px-4 sm:text-sm"
            aria-label="Let's talk — scroll to contact"
          >
            Let&apos;s Talk
          </button>
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-ds-full border border-slate-200/90 bg-slate-50/90 text-amber-500 shadow-sm transition duration-300 hover:border-indigo-200 hover:bg-indigo-50/80 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-900/80 dark:text-amber-300 dark:hover:border-slate-500 dark:hover:bg-slate-800"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className="sr-only">Toggle color theme</span>
              <Sun
                className={`h-[1.15rem] w-[1.15rem] transition duration-500 ${
                  isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
                }`}
                strokeWidth={2}
                aria-hidden
              />
              <Moon
                className={`absolute h-[1.1rem] w-[1.1rem] text-indigo-200 transition duration-500 ${
                  isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
                }`}
                strokeWidth={2}
                aria-hidden
              />
            </button>
          )}
          <button
            className="rounded-ds-md p-1 text-slate-700 dark:text-slate-200 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            type="button"
          >
            {open ? (
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
          <div className="hidden items-center gap-1 md:flex lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.Icon;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleScrollToSection(e, link.id)}
                  className="inline-flex items-center gap-1.5 rounded-ds-full px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100/90 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-indigo-400 lg:px-3 lg:text-sm"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  {link.name}
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-200/80 bg-white/95 py-3 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/90 md:hidden">
          <ul className="mx-auto flex max-w-content flex-col gap-0.5 px-4">
            <li>
              <button
                type="button"
                onClick={(e) => {
                  handleScrollToSection(e, "contact");
                  setOpen(false);
                }}
                className="animate-soft-cta-pulse mb-2 w-full min-h-[48px] rounded-ds-full bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md ring-2 ring-indigo-500/20"
              >
                Let&apos;s Talk
              </button>
            </li>
            {navLinks.map((link) => {
              const Icon = link.Icon;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      handleScrollToSection(e, link.id);
                      setOpen(false);
                    }}
                    className="flex min-h-[44px] items-center gap-2 rounded-ds-md px-2 py-2.5 text-base font-medium text-slate-800 active:bg-slate-100 dark:text-slate-100 dark:active:bg-slate-800/80"
                  >
                    <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    {link.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
