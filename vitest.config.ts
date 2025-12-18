import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/checkouts/**"],
    testTimeout: 10000,
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/test-utils.ts"],
      reporter: ["text", "html"],
    },
  },
  resolve: {
    alias: {
      "#src": resolve(__dirname, "./src"),
    },
  },
});
