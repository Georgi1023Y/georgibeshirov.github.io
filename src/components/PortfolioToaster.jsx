import { useEffect, useMemo, useState, memo } from "react";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";

/**
 * Themed toasts for light/dark. Options are memoized so Toaster does not receive a new
 * options object every parent render (that can cause excessive internal updates / rAF churn).
 */
function PortfolioToasterInner() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const toastOptions = useMemo(
    () => ({
      duration: 4500,
      className: "font-sans !text-sm !font-medium",
      style: {
        background: isDark ? "rgb(15 23 42)" : "rgb(255 255 255)",
        color: isDark ? "rgb(241 245 249)" : "rgb(15 23 42)",
        border: `1px solid ${isDark ? "rgb(51 65 85 / 0.9)" : "rgb(226 232 240)"}`,
        boxShadow: isDark
          ? "0 18px 50px -12px rgba(0,0,0,0.45)"
          : "0 18px 50px -12px rgba(15,23,42,0.12)",
        maxWidth: "min(100vw - 2rem, 24rem)",
      },
      success: {
        iconTheme: {
          primary: "#10b981",
          secondary: isDark ? "#0f172a" : "#ffffff",
        },
      },
      error: {
        iconTheme: {
          primary: "#f43f5e",
          secondary: isDark ? "#0f172a" : "#ffffff",
        },
      },
    }),
    [isDark]
  );

  if (!mounted) {
    return null;
  }

  return (
    <Toaster
      position="top-center"
      containerClassName="!z-[100]"
      toastOptions={toastOptions}
    />
  );
}

export const PortfolioToaster = memo(PortfolioToasterInner);
