import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node", globals: true, include: ["rules-tests/**/*.test.ts"], testTimeout: 20000, fileParallelism: false },
});
