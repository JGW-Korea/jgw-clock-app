import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import path from 'path';
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    svgr(),
    visualizer(),
    {
      name: "replace-preload-with-script",
      transformIndexHtml(html) {
        const preloadRegex = /<link rel="modulepreload" [^>]*href="([^"]*vendor-[^"]*)"[^>]*>/g;
        return html.replace(preloadRegex, (_, href) => `<script type="module" crossorigin src="${href}"></script>`);
      }
    }
  ],
  server: {
    port: Number(process.env.PORT) || 5173,
  },
  resolve: {
    alias: [
      { find: "@app", replacement: path.resolve(__dirname, "src/app") },
      { find: "@pages", replacement: path.resolve(__dirname, "src/pages") },
      { find: "@widgets", replacement: path.resolve(__dirname, "src/widgets") },
      { find: "@features", replacement: path.resolve(__dirname, "src/features") },
      { find: "@entities", replacement: path.resolve(__dirname, "src/entities") },
      { find: "@shared", replacement: path.resolve(__dirname, "src/shared") },
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if(id.includes("react-modal-sheet") || id.includes("motion")) {
            return "vendor-ui";
          }
          if(id.includes("react") || id.includes("scheduler")) {
            return;
          }
          if(id.includes("gsap")) {
            return "vendor-gsap";
          }
          if(id.includes("node_modules") || id.includes(".yarn")) {
            return "vendor-libs";
          }
        }
      }
    },
  }
});
