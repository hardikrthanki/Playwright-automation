import { Page } from '@playwright/test';

/* =============================================================================
HELPER: networkIdle

PURPOSE
-------
Small wrapper around Playwright's network idle wait for shared readability.
============================================================================= */

export async function networkIdle(
  page: Page
) {
  await page.waitForLoadState(
    'networkidle'
  );
}
