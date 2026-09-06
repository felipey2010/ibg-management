import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
      // Match Next.js's server condition when testing server data-access modules.
      "server-only": new URL("./node_modules/next/dist/compiled/server-only/empty.js", import.meta.url)
        .pathname,
    },
  },
  test: {
    environment: "jsdom",
    pool: "forks",
    setupFiles: ["./src/test/setup.ts"],
  },
});
