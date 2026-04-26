/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        ds: "0.5rem",
        "ds-md": "0.75rem",
        "ds-lg": "1rem",
        "ds-xl": "1.25rem",
        "ds-2xl": "1.5rem",
        "ds-full": "9999px",
      },
      spacing: {
        section: "5rem",
        "section-sm": "3.5rem",
        gutter: "1rem",
        "gutter-sm": "1.5rem",
        "gutter-lg": "2rem",
      },
      maxWidth: {
        content: "72rem",
      },
      backgroundImage: {
        "gradient-accent":
          "linear-gradient(135deg, rgb(99 102 241) 0%, rgb(16 185 129) 100%)",
        "gradient-accent-subtle":
          "linear-gradient(180deg, rgb(15 23 42 / 0) 0%, rgb(2 6 23) 100%)",
      },
      boxShadow: {
        "elevated-sm": "0 1px 2px rgb(0 0 0 / 0.25), 0 0 0 1px rgb(148 163 184 / 0.04)",
        elevated:
          "0 4px 24px rgb(0 0 0 / 0.35), 0 0 0 1px rgb(148 163 184 / 0.06)",
      },
    },
  },
  plugins: [],
};
