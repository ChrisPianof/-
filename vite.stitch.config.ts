/**
 * Vite config для Stitch render-adapter bundle.
 *
 * Цель: один self-contained JS файл с инжектом CSS через JS — раздаётся
 * с GitHub Pages, грузится в sandboxed iframe внутри Stitch app.
 *
 * Запуск: `npm run build:stitch` → dist-stitch/stitch-bundle.js
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
    outDir: "dist-stitch",
    emptyOutDir: true,
    cssCodeSplit: false,
    target: "es2022",
    minify: "esbuild",
    lib: {
      entry: "./stitch.entry.tsx",
      name: "StitchAdapter",
      formats: ["iife"],
      fileName: () => "stitch-bundle.js",
    },
  },
});
