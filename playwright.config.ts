import { defineConfig, devices } from '@playwright/test';

const recordAllArtifacts =
  process.env.RECORD_ALL_ARTIFACTS === 'true';

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
