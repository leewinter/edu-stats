import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@edu-stats/ui": path.resolve(__dirname, "../../packages/ui/dist")
    }
  },
  server: {
    port: 4173,
    host: "0.0.0.0"
  }
});
