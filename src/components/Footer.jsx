import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { LetsTalkUpworkLink } from "./LetsTalkUpworkLink";

const Footer = () => {
  return (
    <footer className="flex w-full min-w-0 max-w-full flex-col items-center justify-center overflow-x-hidden border-t border-slate-200/80 bg-slate-50/60 py-10 pb-[max(2rem,env(safe-area-inset-bottom,0px))] text-center text-slate-500 dark:border-slate-700/60 dark:bg-slate-900/30 sm:py-12 sm:pb-[max(2.5rem,env(safe-area-inset-bottom,0px))]">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 max-w-lg px-4 text-sm text-slate-600 dark:text-slate-400"
      >
        Ready to build the next big thing? Async-first delivery with daily visibility — connect on Upwork below.
      </motion.p>
      <p className="mx-auto mb-8 flex max-w-2xl flex-wrap items-center justify-center gap-2 px-4 text-center text-xs leading-relaxed text-[#14a800] dark:text-[#14a800]">
        <ShieldCheck className="h-4 w-4 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
        <span>
          For Upwork clients: Please communicate and hire me only through the Upwork platform to comply with their Terms of Service.
        </span>
      </p>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        className="mb-6 flex w-full justify-center gap-2 px-4 sm:mb-8"
      >
        <LetsTalkUpworkLink className="shadow-lg shadow-[#14a800]/20" />
      </motion.div>
      <div className="mb-4 flex gap-4 md:gap-6">
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
