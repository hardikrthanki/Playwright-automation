// tests/helpers/networkIdle.ts

import { Page } from '@playwright/test';

export async function networkIdle(
  page: Page
) {
  await page.waitForLoadState(
    'networkidle'
  );
}