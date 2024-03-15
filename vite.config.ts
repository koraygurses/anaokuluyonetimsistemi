import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      // targets: ["ie >= 11"], // expected compatible browser target range
      renderLegacyChunks: true, // need to generate legacy browser compatible chunks (default true)
      modernPolyfills: false, // no need to generate polyfills block for modern browsers (default false)
    }),
  ],
});
