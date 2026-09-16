import { defineConfig, devices } from '@playwright/test';

import {
  watchDelayMs
} from './tests/config/watchMode';

const recordAllArtifacts =
  process.env.RECORD_ALL_ARTIFACTS === 'true';

const watchDelay =
  watchDelayMs();

if (watchDelay > 0) {
  console.log(
    `Headed watch mode: slowing each Playwright action by ${watchDelay}ms. Set SLOW_MO=0 for full speed.`
  );
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,

  reporter: [
    ['dot'],
    ['html', {
      open: 'never',
      title: 'OOLTool UAT Automation Report',
    }],
    ['json', {
      outputFile:
        process.env.PLAYWRIGHT_JSON_OUTPUT_NAME ??
        'test-results/results.json',
    }],
  ],

  use: {
    trace: recordAllArtifacts ? 'on' : 'retain-on-failure',
    screenshot: recordAllArtifacts ? 'on' : 'only-on-failure',
    video: recordAllArtifacts ? 'on' : 'retain-on-failure',

    actionTimeout: 30000,
    navigationTimeout: 30000,

    launchOptions: {
      slowMo: watchDelay,
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
