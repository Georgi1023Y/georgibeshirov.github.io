import { ThemeProvider } from 'next-themes';
import { useEffect } from "react";
import Hero from "./components/Hero";
import AboutMe from "./components/AboutMe";
// import Contact from "./components/Contact";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Header from "./components/Header";
import DevelopmentProcess from "./components/DevelopmentProcess";

function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('ServiceWorker registration successful');
          })
          .catch(err => {
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <meta name="description" content="Portfolio website of Georgi Beshirov, Full Stack Developer" />
      <meta name="keywords" content="Georgi Beshirov, Full Stack Developer, React, Node.js, Portfolio" />
      <meta name="author" content="Georgi Beshirov" />
      <meta property="og:title" content="Georgi Beshirov - Full Stack Developer" />
      <meta property="og:description" content="Portfolio website of Georgi Beshirov, Full Stack Developer" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Georgi Beshirov - Full Stack Developer" />
      <meta name="twitter:description" content="Portfolio website of Georgi Beshirov, Full Stack Developer" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/icon-192x192.png" />
      <meta name="theme-color" content="#232526" />
      <div>
        <Header />
        <Hero />
        <AboutMe />
        <Experience />
        <Skills />
        <Projects />
        <DevelopmentProcess />
        {/* <Contact /> */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
