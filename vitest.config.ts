import { defineConfig, configDefaults } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  // rules-tests/ needs the Firebase emulator — run with `npm run test:rules`
  test: { environment: "node", globals: true, exclude: [...configDefaults.exclude, "rules-tests/**"] },
  resolve: { alias: { "@": resolve(__dirname, "./src") } },
});
