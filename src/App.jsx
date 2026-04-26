import { ThemeProvider } from "next-themes";
import { lazy, Suspense, useEffect } from "react";
import Hero from "./components/Hero";
import Header from "./components/Header";
import DeferredSection from "./components/DeferredSection";
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
  /** GitHub Pages: after 404.html → index.html, restore /projects and scroll to #projects. */
  useEffect(() => {
    const run = () => {
      const path = window.location.pathname;
      if (path === "/" || path === "/index.html") return;
      const seg = path
        .replace(/^\//, "")
        .split("/")
        .filter(Boolean)[0]
        ?.replace(/\.html$/i, "");
      if (!seg) return;
      if (seg === "index" || seg === "index.html") return;
      const id = seg === "home" ? "top" : seg;
      if (id === "top") {
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }
      const el = document.getElementById(id);
      if (!el) {
        return;
      }
      const yOffset = 72;
      const y = el.getBoundingClientRect().top + window.pageYOffset - yOffset;
      window.scrollTo({ top: y, behavior: "auto" });
    };
    run();
    const t = window.setTimeout(run, 400);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const onLoad = () => {
        void navigator.serviceWorker.register("/sw.js").catch(() => {
          // Registration is optional; avoid console noise in production.
        });
      };
      window.addEventListener('load', onLoad);
      return () => window.removeEventListener('load', onLoad);
    }
    return undefined;
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
            <DeferredSection minHeight={420}>
              <Experience />
            </DeferredSection>
            <DeferredSection minHeight={260}>
              <Education />
            </DeferredSection>
            <DeferredSection minHeight={420}>
              <Skills />
            </DeferredSection>
            <Projects />
            <DeferredSection minHeight={400}>
              <Certifications />
            </DeferredSection>
            <DeferredSection minHeight={500}>
              <DevelopmentProcess />
            </DeferredSection>
            <DeferredSection minHeight={380}>
              <Testimonials />
            </DeferredSection>
            <Contact />
            <DeferredSection minHeight={180}>
              <Footer />
            </DeferredSection>
          </Suspense>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
