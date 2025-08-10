import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Gate Replit-only plugins to avoid runtime errors in other environments
export default defineConfig(async () => {
  const plugins: any[] = [react()];

  // Only enable the Replit runtime error overlay and cartographer in Replit dev env
  const isReplit = process.env.NODE_ENV !== "production" && !!process.env.REPL_ID;
  if (isReplit) {
    try {
      const runtimeErrorOverlay = (
        await import("@replit/vite-plugin-runtime-error-modal")
      ).default;
      plugins.push(runtimeErrorOverlay());
    } catch {
      // Silently skip if plugin not available
    }

    try {
      const { cartographer } = await import("@replit/vite-plugin-cartographer");
      plugins.push(cartographer());
    } catch {
      // Silently skip if plugin not available
    }
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
