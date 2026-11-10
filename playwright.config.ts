import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: process.env.QA_E2E_BASE_URL || "http://127.0.0.1:3000/",
    headless: true,
  },
  webServer: process.env.QA_E2E_EXTERNAL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://127.0.0.1:3000",
        reuseExistingServer: !process.env.CI,
      },
  reporter: "list",
});
