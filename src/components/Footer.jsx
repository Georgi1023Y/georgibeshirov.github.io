import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="flex w-full min-w-0 max-w-full flex-col items-center justify-center overflow-x-hidden border-t border-slate-200/80 bg-slate-50/60 py-12 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] text-center text-slate-500 dark:border-slate-700/60 dark:bg-slate-900/30">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 max-w-lg px-4 text-sm text-slate-600 dark:text-slate-400"
      >
        Ready to build the next big thing?{" "}
        <a
          href="#contact"
          className="font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 transition hover:text-indigo-500 dark:text-indigo-400 dark:decoration-indigo-500/50"
        >
          Let&apos;s discuss your project ROI
        </a>
        .
      </motion.p>
      <div className="mb-4 flex gap-6">
        <a
          href="https://github.com/Georgi1023Y"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-slate-400 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.instagram.com/georgiyuliqnov/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl text-slate-400 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>
      </div>
      <div className="text-sm text-slate-500 dark:text-slate-500">
        2026 Georgi Beshirov. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
