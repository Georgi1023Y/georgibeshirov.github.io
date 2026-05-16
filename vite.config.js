import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// Custom domain (georgibeshirov.com) — assets and routes are served from site root.
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    target: "es2022",
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/@react-three/postprocessing")) {
            return "r3f-post";
          }
          if (id.includes("node_modules/postprocessing/")) {
            return "r3f-post";
          }
          if (id.includes("node_modules/three")) return "three-core";
          if (id.includes("node_modules/@react-three/fiber")) return "three-fiber";
          if (id.includes("node_modules/framer-motion")) return "motion";
          if (id.includes("node_modules/@supabase/supabase-js")) return "supabase";
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) return "react-core";
        },
      },
    },
  },
});
