import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    setupFiles: "./src/test/setupTests.ts",
    environment: "happy-dom",
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx,js}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
