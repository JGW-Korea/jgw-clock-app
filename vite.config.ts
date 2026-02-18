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
          if(id.includes("react") || id.includes("scheduler")) {
            return;
          }
          if(id.includes("gsap") || id.includes("motion")) {
            return "vendor-animation";
          }
          if(id.includes("node_modules") || id.includes(".yarn")) {
            return "vendor-libs";
          }
        }
      }
    },
  }
});
