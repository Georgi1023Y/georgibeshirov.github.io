import { ThemeProvider } from "next-themes";
import { lazy, Suspense, useEffect } from "react";
import Hero from "./components/Hero";
import Header from "./components/Header";
import { PortfolioToaster } from "./components/PortfolioToaster";

const AboutMe = lazy(() => import("./components/AboutMe"));
const Experience = lazy(() => import("./components/Experience"));
const Skills = lazy(() => import("./components/Skills"));
const Projects = lazy(() => import("./components/Projects"));
const DevelopmentProcess = lazy(() => import("./components/DevelopmentProcess"));
const Education = lazy(() => import("./components/Education"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const Certifications = lazy(() => import("./components/Certifications"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));

function App() {
  /** GitHub Pages: after 404.html → index.html, scroll once to the section matching the path (no delayed re-run — avoids fighting user scroll). */
  useEffect(() => {
    const path = window.location.pathname.replace(/\/index\.html$/i, "") || "/";
    if (path === "/" || path === "") return;

    const seg = path
      .replace(/^\//, "")
      .split("/")
      .filter(Boolean)[0]
      ?.replace(/\.html$/i, "");
    if (!seg || seg === "index") return;

    const id = seg === "home" ? "top" : seg;
    const scrollOnce = () => {
      if (id === "top") {
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }
      const el = document.getElementById(id);
      if (!el) return;
      const yOffset = 72;
      const y = el.getBoundingClientRect().top + window.pageYOffset - yOffset;
      window.scrollTo({ top: y, behavior: "auto" });
    };

    requestAnimationFrame(scrollOnce);
  }, []);

  /** Production only — avoids stale cached bundles while iterating locally; sw.js may not exist in dev. */
  useEffect(() => {
    if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return undefined;
    const onLoad = () => {
      void navigator.serviceWorker.register("/sw.js").catch(() => {});
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <PortfolioToaster />
      <div className="relative min-h-dvh w-full min-w-0 max-w-full overflow-x-hidden bg-transparent text-slate-900 dark:text-slate-50">
        <div className="bg-grain" aria-hidden="true" />
        <div className="relative z-10 min-w-0 max-w-full">
          <Header />
          <Hero />
          <Suspense fallback={null}>
            <AboutMe />
            <Experience />
            <Education />
            <Skills />
            <Projects />
            <Certifications />
            <DevelopmentProcess />
            <Testimonials />
            <Contact />
            <Footer />
          </Suspense>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
