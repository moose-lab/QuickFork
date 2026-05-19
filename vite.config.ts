import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { loadEnv, type Plugin } from "vite";
import generationsHandler from "./api/generations";
import leadCaptureHandler from "./api/lead-capture";

export function localApiRoutesPlugin(): Plugin {
  return {
    name: "quickfork-local-api-routes",
    configureServer(server) {
      server.middlewares.use("/api/generations", async (req, res, next) => {
        try {
          await generationsHandler(req, res);
        } catch (error) {
          next(error);
        }
      });
      server.middlewares.use("/api/lead-capture", async (req, res, next) => {
        try {
          await leadCaptureHandler(req, res);
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [react(), localApiRoutesPlugin()],
    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
    },
  };
});
