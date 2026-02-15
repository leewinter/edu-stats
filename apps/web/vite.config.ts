import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const allowedHosts = (env.VITE_ALLOWED_HOSTS || "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@edu-stats/ui": path.resolve(__dirname, "../../packages/ui/dist")
      }
    },
    server: {
      port: 4173,
      host: "0.0.0.0",
      allowedHosts
    }
  };
});
