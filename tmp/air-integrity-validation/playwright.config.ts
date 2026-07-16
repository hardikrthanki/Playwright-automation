import path from 'path';
import { defineConfig, devices } from '@playwright/test';

const fixtureRoot = __dirname;

export default defineConfig({
  testDir: './tests',
  outputDir: path.join(fixtureRoot, 'artifacts'),
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [
    ['json', { outputFile: path.join(fixtureRoot, 'test-results', 'results.json') }],
    ['html', { open: 'never', outputFolder: path.join(fixtureRoot, 'playwright-report') }],
  ],
  use: {
    ...devices['Desktop Chrome'],
    screenshot: 'on',
    trace: 'on',
    video: 'off',
  },
});
