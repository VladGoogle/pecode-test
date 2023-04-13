import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [[process.env.CI ? 'github' : 'list'],['html'], ["allure-playwright", {
    detail: true,
    outputFolder: process.env.ALLURE_RESULTS_DIR,
    suiteTitle: false,
  }]],
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: {
      mode: "only-on-failure",
      fullPage: true
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

});
