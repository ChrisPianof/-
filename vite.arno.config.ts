/**
 * Vite config для ARNO render-adapter bundle.
 *
 * Цель: один self-contained JS файл с инжектом CSS через JS — раздаётся
 * с GitHub Pages, грузится в sandboxed iframe внутри ARNO app.
 *
 * Запуск: `npm run build:arno` → dist-arno/arno-bundle.js
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  /** lib mode не делает substitution `process.env.NODE_ENV` автоматически.
   *  React и многие deps падают в browser с `process is not defined`. */
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": "{}",
  },
  build: {
    outDir: "dist-arno",
    emptyOutDir: true,
    cssCodeSplit: false,
    target: "es2022",
    minify: "esbuild",
    lib: {
      entry: "./arno.entry.tsx",
      name: "ArnoAdapter",
      formats: ["iife"],
      fileName: () => "arno-bundle.js",
    },
  },
});
